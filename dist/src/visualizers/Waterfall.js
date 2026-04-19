"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waterfall = void 0;
class Waterfall {
    constructor() {
        this.packets = [];
        this.streams = new Map();
    }
    addPacket(packet) {
        this.packets.push(packet);
        if (packet.dcid) {
            if (!this.streams.has(packet.dcid)) {
                this.streams.set(packet.dcid, []);
            }
            this.streams.get(packet.dcid).push({
                time: packet.timestamp,
                size: packet.length,
                type: packet.type
            });
        }
    }
    getWaterfallData() {
        const data = [];
        for (const [streamId, packets] of this.streams.entries()) {
            for (const packet of packets) {
                data.push({
                    streamId: streamId.substring(0, 8),
                    time: packet.time,
                    size: packet.size,
                    type: packet.type
                });
            }
        }
        return data;
    }
    destroy() {
        this.packets = [];
        this.streams.clear();
    }
}
exports.Waterfall = Waterfall;
//# sourceMappingURL=Waterfall.js.map