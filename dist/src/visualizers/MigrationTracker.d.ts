import { Packet, MigrationEvent } from "../types";
export declare class MigrationTracker {
    private lastConnectionId;
    private migrations;
    private callbacks;
    constructor();
    checkMigration(packet: Packet): void;
    onMigration(callback: (migration: MigrationEvent) => void): void;
    getMigrations(): MigrationEvent[];
    destroy(): void;
}
//# sourceMappingURL=MigrationTracker.d.ts.map