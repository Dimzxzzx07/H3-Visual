export interface Metrics {
  rtt: number;
  packetLoss: number;
  throughput: number;
  totalPackets: number;
  activeStreams: number;
  migrations: number;
  frames: Record<string, number>;
  lastPacket?: string;
}

export interface LossEvent {
  time: number;
  gap: number;
}

export interface MigrationEvent {
  time: number;
  fromCid: string;
  toCid: string;
}

export interface FullAnalysis {
  summary: Metrics;
  streams: Array<{
    streamId: string;
    packetCount: number;
    bytes: number;
    duration: number;
  }>;
  lossEvents: LossEvent[];
  migrations: MigrationEvent[];
  frameBreakdown: Record<string, number>;
}