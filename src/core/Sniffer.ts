import { Packet, SnifferConfig } from "../types";

export class Sniffer {
  private port: number;
  private interfaceName: string;
  private decryptor?: any;
  private onPacketCallback: (packet: Packet) => void;
  private capInstance: any;
  private running: boolean;

  constructor(config: SnifferConfig) {
    this.port = config.port;
    this.interfaceName = config.interface;
    this.decryptor = config.decryptor;
    this.onPacketCallback = config.onPacket;
    this.capInstance = null;
    this.running = false;
  }

  start(): void {
    const cap = require("cap").Cap;
    const decoders = require("cap").decoders;
    const PROTOCOL = decoders.PROTOCOL;
    
    this.capInstance = new cap();
    const device = this.capInstance.findDevice(this.interfaceName);
    const filter = `udp and port ${this.port}`;
    const bufSize = 10 * 1024 * 1024;
    const buffer = Buffer.alloc(bufSize);
    
    this.capInstance.open(device, filter, bufSize, buffer);
    if (this.capInstance.setMinBytes) {
      this.capInstance.setMinBytes(0);
    }
    
    this.running = true;
    this.capInstance.on("packet", (nbytes: number) => {
      const rawPacket = buffer.slice(0, nbytes);
      const ethernet = decoders.Ethernet(rawPacket);
      if (ethernet.info.type === PROTOCOL.ETHERNET.IPV4) {
        const ip = decoders.IPV4(ethernet.info.bytes);
        if (ip.info.protocol === PROTOCOL.IP.UDP) {
          const udp = decoders.UDP(ip.info.data);
          if (udp.info.dport === this.port || udp.info.sport === this.port) {
            this.processQuicPacket(udp.info.data, udp.info);
          }
        }
      }
    });
  }

  private processQuicPacket(payload: Buffer, udpInfo: any): void {
    const packet: Packet = {
      timestamp: Date.now(),
      sourcePort: udpInfo.sport,
      destPort: udpInfo.dport,
      length: payload.length,
      raw: payload
    };
    
    if (payload.length > 0) {
      const firstByte = payload[0];
      const headerForm = (firstByte & 0x80) >> 7;
      
      packet.type = headerForm === 1 ? "long" : "short";
      
      if (headerForm === 1) {
        packet.version = payload.readUInt32BE(1);
        const dcidLen = payload[5];
        packet.dcid = payload.slice(6, 6 + dcidLen).toString("hex");
        const scidLen = payload[6 + dcidLen];
        packet.scid = payload.slice(7 + dcidLen, 7 + dcidLen + scidLen).toString("hex");
      } else {
        packet.dcid = payload.slice(1, 21).toString("hex");
      }
      
      if (this.decryptor) {
        try {
          packet.decrypted = this.decryptor.decrypt(payload);
        } catch (e) {
          packet.decrypted = undefined;
        }
      }
    }
    
    this.onPacketCallback(packet);
  }

  stop(): void {
    if (this.capInstance) {
      this.capInstance.close();
      this.running = false;
    }
  }
}