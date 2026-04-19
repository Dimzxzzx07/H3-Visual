import { Sniffer } from "../src/core/Sniffer";

describe("Sniffer", () => {
  it("should create sniffer instance", () => {
    const onPacket = jest.fn();
    const sniffer = new Sniffer({
      port: 443,
      interface: "eth0",
      onPacket
    });
    expect(sniffer).toBeDefined();
  });
});