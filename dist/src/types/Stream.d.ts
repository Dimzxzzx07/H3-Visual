import { Packet } from "./Packet";
export interface Stream {
    packets: Packet[];
    bytes: number;
    startTime: number;
    lastSeen: number;
}
//# sourceMappingURL=Stream.d.ts.map