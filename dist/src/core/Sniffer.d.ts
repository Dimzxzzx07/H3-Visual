import { SnifferConfig } from "../types";
export declare class Sniffer {
    private port;
    private interfaceName;
    private decryptor?;
    private onPacketCallback;
    private capInstance;
    private running;
    constructor(config: SnifferConfig);
    start(): void;
    private processQuicPacket;
    stop(): void;
}
//# sourceMappingURL=Sniffer.d.ts.map