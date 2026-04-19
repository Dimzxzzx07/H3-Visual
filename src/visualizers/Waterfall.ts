import { Packet } from "../types";

export class Waterfall {
  private packets: Packet[];
  private streams: Map<string, any[]>;

  constructor() {
    this.packets = [];
    this.streams = new Map();
  }

  addPacket(packet: Packet): void {
    this.packets.push(packet);
    
    if (packet.dcid) {
      if (!this.streams.has(packet.dcid)) {
        this.streams.set(packet.dcid, []);
      }
      this.streams.get(packet.dcid)!.push({
        time: packet.timestamp,
        size: packet.length,
        type: packet.type
      });
    }
  }

  getWaterfallData(): any {
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

  destroy(): void {
    this.packets = [];
    this.streams.clear();
  }
}