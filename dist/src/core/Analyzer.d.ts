import { Packet, Metrics, FullAnalysis } from "../types";
export declare class Analyzer {
    private packets;
    private streams;
    private rttSamples;
    private lossEvents;
    private connectionMigrations;
    private frameTypes;
    constructor();
    processPacket(packet: Packet): void;
    private detectLoss;
    private detectMigration;
    getMetrics(): Metrics;
    getFullAnalysis(): FullAnalysis;
}
//# sourceMappingURL=Analyzer.d.ts.map