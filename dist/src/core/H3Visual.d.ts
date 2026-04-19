import { EventEmitter } from "events";
import { H3Config, FullAnalysis } from "../types";
export declare class H3Visual extends EventEmitter {
    private mode;
    private refreshRate;
    private theme;
    private metrics;
    private port;
    private interfaceName;
    private keylogFile?;
    private filePath?;
    private exportPath?;
    private analyzer;
    private sniffer?;
    private dashboard?;
    private waterfall?;
    private migrationTracker?;
    private frameBreakdown?;
    constructor(config: H3Config);
    start(): Promise<void>;
    analyze(): Promise<FullAnalysis>;
    stop(): void;
}
//# sourceMappingURL=H3Visual.d.ts.map