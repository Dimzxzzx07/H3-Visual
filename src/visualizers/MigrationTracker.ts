import { Packet, MigrationEvent } from "../types";

export class MigrationTracker {
  private lastConnectionId: string | null;
  private migrations: MigrationEvent[];
  private callbacks: Array<(migration: MigrationEvent) => void>;

  constructor() {
    this.lastConnectionId = null;
    this.migrations = [];
    this.callbacks = [];
  }

  checkMigration(packet: Packet): void {
    if (packet.dcid && this.lastConnectionId && packet.dcid !== this.lastConnectionId) {
      const migration: MigrationEvent = {
        time: packet.timestamp,
        fromCid: this.lastConnectionId,
        toCid: packet.dcid
      };
      this.migrations.push(migration);
      this.callbacks.forEach(cb => cb(migration));
    }
    this.lastConnectionId = packet.dcid || this.lastConnectionId;
  }

  onMigration(callback: (migration: MigrationEvent) => void): void {
    this.callbacks.push(callback);
  }

  getMigrations(): MigrationEvent[] {
    return this.migrations;
  }

  destroy(): void {
    this.lastConnectionId = null;
    this.migrations = [];
    this.callbacks = [];
  }
}