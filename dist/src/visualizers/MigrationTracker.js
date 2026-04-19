"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationTracker = void 0;
class MigrationTracker {
    constructor() {
        this.lastConnectionId = null;
        this.migrations = [];
        this.callbacks = [];
    }
    checkMigration(packet) {
        if (packet.dcid && this.lastConnectionId && packet.dcid !== this.lastConnectionId) {
            const migration = {
                time: packet.timestamp,
                fromCid: this.lastConnectionId,
                toCid: packet.dcid
            };
            this.migrations.push(migration);
            this.callbacks.forEach(cb => cb(migration));
        }
        this.lastConnectionId = packet.dcid || this.lastConnectionId;
    }
    onMigration(callback) {
        this.callbacks.push(callback);
    }
    getMigrations() {
        return this.migrations;
    }
    destroy() {
        this.lastConnectionId = null;
        this.migrations = [];
        this.callbacks = [];
    }
}
exports.MigrationTracker = MigrationTracker;
//# sourceMappingURL=MigrationTracker.js.map