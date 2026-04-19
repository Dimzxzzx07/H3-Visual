"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyzer = void 0;
class Analyzer {
    constructor() {
        this.packets = [];
        this.streams = new Map();
        this.rttSamples = [];
        this.lossEvents = [];
        this.connectionMigrations = [];
        this.frameTypes = new Map();
    }
    processPacket(packet) {
        this.packets.push(packet);
        if (packet.dcid) {
            const streamId = packet.dcid;
            if (!this.streams.has(streamId)) {
                this.streams.set(streamId, {
                    packets: [],
                    bytes: 0,
                    startTime: packet.timestamp,
                    lastSeen: packet.timestamp
                });
            }
            const stream = this.streams.get(streamId);
            stream.packets.push(packet);
            stream.bytes += packet.length;
            stream.lastSeen = packet.timestamp;
        }
        if (packet.frames) {
            for (const frame of packet.frames) {
                const count = this.frameTypes.get(frame.type) || 0;
                this.frameTypes.set(frame.type, count + 1);
            }
        }
    }
    detectLoss() {
        const timestamps = this.packets.map(p => p.timestamp).sort((a, b) => a - b);
        let lossCount = 0;
        for (let i = 1; i < timestamps.length; i++) {
            const gap = timestamps[i] - timestamps[i - 1];
            if (gap > 100) {
                lossCount++;
                this.lossEvents.push({
                    time: timestamps[i],
                    gap: gap
                });
            }
        }
        return this.packets.length > 0 ? lossCount / this.packets.length : 0;
    }
    detectMigration() {
        let lastConnectionId = null;
        const migrations = [];
        for (const packet of this.packets) {
            if (packet.dcid && lastConnectionId && packet.dcid !== lastConnectionId) {
                migrations.push({
                    time: packet.timestamp,
                    fromCid: lastConnectionId,
                    toCid: packet.dcid
                });
            }
            lastConnectionId = packet.dcid || lastConnectionId;
        }
        this.connectionMigrations = migrations;
        return migrations;
    }
    getMetrics() {
        const packetLoss = this.detectLoss();
        const avgRtt = this.rttSamples.length > 0
            ? this.rttSamples.reduce((a, b) => a + b, 0) / this.rttSamples.length
            : 0;
        const totalBytes = this.packets.reduce((sum, p) => sum + p.length, 0);
        const duration = this.packets.length > 0
            ? (this.packets[this.packets.length - 1].timestamp - this.packets[0].timestamp) / 1000
            : 1;
        const throughput = totalBytes / duration / 1024;
        return {
            rtt: avgRtt,
            packetLoss: packetLoss,
            throughput: throughput,
            totalPackets: this.packets.length,
            activeStreams: this.streams.size,
            migrations: this.connectionMigrations.length,
            frames: Object.fromEntries(this.frameTypes)
        };
    }
    getFullAnalysis() {
        this.detectLoss();
        this.detectMigration();
        return {
            summary: this.getMetrics(),
            streams: Array.from(this.streams.entries()).map(([id, data]) => ({
                streamId: id,
                packetCount: data.packets.length,
                bytes: data.bytes,
                duration: data.lastSeen - data.startTime
            })),
            lossEvents: this.lossEvents,
            migrations: this.connectionMigrations,
            frameBreakdown: Object.fromEntries(this.frameTypes)
        };
    }
}
exports.Analyzer = Analyzer;
//# sourceMappingURL=Analyzer.js.map