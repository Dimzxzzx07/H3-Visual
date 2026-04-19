import { Analyzer } from "../src/core/Analyzer";
import { Packet } from "../src/types";

describe("Analyzer", () => {
  it("should process packet and calculate metrics", () => {
    const analyzer = new Analyzer();
    const packet: Packet = {
      timestamp: Date.now(),
      length: 100,
      dcid: "test123"
    };
    
    analyzer.processPacket(packet);
    const metrics = analyzer.getMetrics();
    
    expect(metrics.totalPackets).toBe(1);
    expect(metrics.activeStreams).toBe(1);
  });
});