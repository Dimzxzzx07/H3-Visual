import { Packet } from "../types";
export declare class FrameBreakdown {
    private frameCounts;
    private frameSizes;
    constructor();
    processPacket(packet: Packet): void;
    getBreakdown(): Record<string, {
        count: number;
        totalBytes: number;
    }>;
    destroy(): void;
}
//# sourceMappingURL=FrameBreakdown.d.ts.map