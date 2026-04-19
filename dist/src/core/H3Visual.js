"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.H3Visual = void 0;
const events_1 = require("events");
const Sniffer_1 = require("./Sniffer");
const Parser_1 = require("./Parser");
const Decryptor_1 = require("./Decryptor");
const Analyzer_1 = require("./Analyzer");
const Dashboard_1 = require("./Dashboard");
const Waterfall_1 = require("../visualizers/Waterfall");
const MigrationTracker_1 = require("../visualizers/MigrationTracker");
const FrameBreakdown_1 = require("../visualizers/FrameBreakdown");
class H3Visual extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.mode = config.mode || "live";
        this.refreshRate = config.refreshRate || 500;
        this.theme = config.theme || "monokai";
        this.metrics = config.metrics || ["rtt", "throughput", "packet-loss"];
        this.port = config.port || 443;
        this.interfaceName = config.interface || "eth0";
        this.keylogFile = config.keylogFile;
        this.filePath = config.filePath;
        this.exportPath = config.exportPath;
        this.analyzer = new Analyzer_1.Analyzer();
    }
    async start() {
        if (this.mode === "live") {
            this.dashboard = new Dashboard_1.Dashboard({
                refreshRate: this.refreshRate,
                theme: this.theme,
                metrics: this.metrics
            });
            this.waterfall = new Waterfall_1.Waterfall();
            this.migrationTracker = new MigrationTracker_1.MigrationTracker();
            this.frameBreakdown = new FrameBreakdown_1.FrameBreakdown();
            const decryptor = this.keylogFile ? new Decryptor_1.Decryptor(this.keylogFile) : undefined;
            this.sniffer = new Sniffer_1.Sniffer({
                port: this.port,
                interface: this.interfaceName,
                decryptor,
                onPacket: (packet) => {
                    this.analyzer.processPacket(packet);
                    this.waterfall?.addPacket(packet);
                    this.migrationTracker?.checkMigration(packet);
                    this.frameBreakdown?.processPacket(packet);
                    this.emit("packet", packet);
                    this.dashboard?.update(this.analyzer.getMetrics());
                }
            });
            this.sniffer.start();
            this.dashboard.render();
        }
    }
    async analyze() {
        if (this.mode === "file" && this.filePath) {
            const parser = new Parser_1.Parser();
            const packets = await parser.parseQlog(this.filePath);
            packets.forEach(packet => this.analyzer.processPacket(packet));
            return this.analyzer.getFullAnalysis();
        }
        throw new Error("No file path provided for analysis mode");
    }
    stop() {
        if (this.sniffer)
            this.sniffer.stop();
        if (this.dashboard)
            this.dashboard.destroy();
        if (this.waterfall)
            this.waterfall.destroy();
        if (this.migrationTracker)
            this.migrationTracker.destroy();
        if (this.frameBreakdown)
            this.frameBreakdown.destroy();
    }
}
exports.H3Visual = H3Visual;
//# sourceMappingURL=H3Visual.js.map