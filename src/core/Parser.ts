import * as fs from "fs";
import { QLogEvent, Packet } from "../types";

export class Parser {
  async parseQlog(filePath: string): Promise<Packet[]> {
    const content = fs.readFileSync(filePath, "utf8");
    const qlog = JSON.parse(content);
    const packets: Packet[] = [];
    
    if (qlog.traces && qlog.traces[0]) {
      const trace = qlog.traces[0];
      for (const event of trace.events) {
        if (event.name === "transport:packet_received" || event.name === "transport:packet_sent") {
          const packet: Packet = {
            timestamp: event.time,
            type: event.data.packet_type,
            packetNumber: event.data.packet_number,
            length: event.data.length,
            frames: []
          };
          
          if (event.data.frames) {
            for (const frame of event.data.frames) {
              packet.frames!.push({
                type: frame.frame_type,
                payload: frame
              });
            }
          }
          
          packets.push(packet);
        }
      }
    }
    
    return packets;
  }
}