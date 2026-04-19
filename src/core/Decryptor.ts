import * as crypto from "crypto";

export class Decryptor {
  private keys: Map<string, Buffer>;

  constructor(keylogFile: string) {
    this.keys = new Map();
    this.loadKeys(keylogFile);
  }

  private loadKeys(keylogFile: string): void {
    const fs = require("fs");
    const content = fs.readFileSync(keylogFile, "utf8");
    const lines = content.split("\n");
    
    for (const line of lines) {
      if (line.startsWith("QUIC_")) {
        const parts = line.split(" ");
        if (parts.length >= 2) {
          const keyType = parts[0];
          const keyHex = parts[1];
          this.keys.set(keyType, Buffer.from(keyHex, "hex"));
        }
      }
    }
  }

  decrypt(payload: Buffer): Buffer | null {
    if (payload.length < 24) return null;
    
    const dcidLen = payload[5];
    const scidLen = payload[6 + dcidLen];
    const packetNumberOffset = 7 + dcidLen + scidLen;
    const packetNumberLen = (payload[packetNumberOffset] & 0x03) + 1;
    
    const protectedPayload = payload.slice(packetNumberOffset + 1 + packetNumberLen);
    const key = this.keys.get("QUIC_CRYPTO_KEY");
    
    if (!key) return null;
    
    try {
      const decipher = crypto.createDecipheriv("aes-128-gcm", key, Buffer.alloc(12));
      const decrypted = Buffer.concat([
        decipher.update(protectedPayload),
        decipher.final()
      ]);
      return decrypted;
    } catch (e) {
      return null;
    }
  }
}