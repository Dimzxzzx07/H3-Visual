import { Packet } from "./Packet";

export interface H3Config {
  mode: string;
  refreshRate?: number;
  theme?: string;
  metrics?: string[];
  port?: number;
  interface?: string;
  keylogFile?: string;
  filePath?: string;
  exportPath?: string;
}

export interface SnifferConfig {
  port: number;
  interface: string;
  decryptor?: any;
  onPacket: (packet: Packet) => void;
}

export interface DashboardConfig {
  refreshRate: number;
  theme: string;
  metrics: string[];
}

export interface QLogEvent {
  name: string;
  time: number;
  data: any;
}