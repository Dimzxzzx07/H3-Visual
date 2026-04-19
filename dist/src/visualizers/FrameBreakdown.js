"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameBreakdown = void 0;
class FrameBreakdown {
    constructor() {
        this.frameCounts = new Map();
        this.frameSizes = new Map();
    }
    processPacket(packet) {
        if (packet.frames) {
            for (const frame of packet.frames) {
                const count = this.frameCounts.get(frame.type) || 0;
                this.frameCounts.set(frame.type, count + 1);
                const size = this.frameSizes.get(frame.type) || 0;
                this.frameSizes.set(frame.type, size + (frame.payload.length || 0));
            }
        }
    }
    getBreakdown() {
        const result = {};
        for (const [type, count] of this.frameCounts.entries()) {
            result[type] = {
                count: count,
                totalBytes: this.frameSizes.get(type) || 0
            };
        }
        return result;
    }
    destroy() {
        this.frameCounts.clear();
        this.frameSizes.clear();
    }
}
exports.FrameBreakdown = FrameBreakdown;
//# sourceMappingURL=FrameBreakdown.js.map