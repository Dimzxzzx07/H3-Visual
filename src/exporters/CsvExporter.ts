import * as fs from "fs";
import { FullAnalysis } from "../types";

export class CsvExporter {
  static export(analysis: FullAnalysis, filePath: string): void {
    const lines: string[] = [];
    
    lines.push("Metric,Value");
    lines.push(`RTT (ms),${analysis.summary.rtt}`);
    lines.push(`Packet Loss (%),${analysis.summary.packetLoss * 100}`);
    lines.push(`Throughput (KB/s),${analysis.summary.throughput}`);
    lines.push(`Total Packets,${analysis.summary.totalPackets}`);
    lines.push(`Active Streams,${analysis.summary.activeStreams}`);
    lines.push(`Migrations,${analysis.summary.migrations}`);
    
    lines.push("");
    lines.push("Stream ID,Packet Count,Bytes,Duration (ms)");
    for (const stream of analysis.streams) {
      lines.push(`${stream.streamId},${stream.packetCount},${stream.bytes},${stream.duration}`);
    }
    
    lines.push("");
    lines.push("Frame Type,Count");
    for (const [type, count] of Object.entries(analysis.frameBreakdown)) {
      lines.push(`${type},${count}`);
    }
    
    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  }
}