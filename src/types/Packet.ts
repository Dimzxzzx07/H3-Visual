import { Frame } from "./Frame";

export interface Packet {
  timestamp: number;
  sourcePort?: number;
  destPort?: number;
  length: number;
  raw?: Buffer;
  type?: string;
  version?: number;
  dcid?: string;
  scid?: string;
  packetNumber?: number;
  frames?: Frame[];
  decrypted?: Buffer | null;
}