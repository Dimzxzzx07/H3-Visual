import { Packet } from "../types";

export class FrameBreakdown {
  private frameCounts: Map<string, number>;
  private frameSizes: Map<string, number>;

  constructor() {
    this.frameCounts = new Map();
    this.frameSizes = new Map();
  }

  processPacket(packet: Packet): void {
    if (packet.frames) {
      for (const frame of packet.frames) {
        const count = this.frameCounts.get(frame.type) || 0;
        this.frameCounts.set(frame.type, count + 1);
        
        const size = this.frameSizes.get(frame.type) || 0;
        this.frameSizes.set(frame.type, size + (frame.payload.length || 0));
      }
    }
  }

  getBreakdown(): Record<string, { count: number; totalBytes: number }> {
    const result: Record<string, { count: number; totalBytes: number }> = {};
    
    for (const [type, count] of this.frameCounts.entries()) {
      result[type] = {
        count: count,
        totalBytes: this.frameSizes.get(type) || 0
      };
    }
    
    return result;
  }

  destroy(): void {
    this.frameCounts.clear();
    this.frameSizes.clear();
  }
}