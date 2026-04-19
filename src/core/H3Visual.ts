import { EventEmitter } from "events";
import { Sniffer } from "./Sniffer";
import { Parser } from "./Parser";
import { Decryptor } from "./Decryptor";
import { Analyzer } from "./Analyzer";
import { Dashboard } from "./Dashboard";
import { Waterfall } from "../visualizers/Waterfall";
import { MigrationTracker } from "../visualizers/MigrationTracker";
import { FrameBreakdown } from "../visualizers/FrameBreakdown";
import { H3Config, Packet, Metrics, FullAnalysis } from "../types";

export class H3Visual extends EventEmitter {
  private mode: string;
  private refreshRate: number;
  private theme: string;
  private metrics: string[];
  private port: number;
  private interfaceName: string;
  private keylogFile?: string;
  private filePath?: string;
  private exportPath?: string;
  private analyzer: Analyzer;
  private sniffer?: Sniffer;
  private dashboard?: Dashboard;
  private waterfall?: Waterfall;
  private migrationTracker?: MigrationTracker;
  private frameBreakdown?: FrameBreakdown;

  constructor(config: H3Config) {
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
    this.analyzer = new Analyzer();
  }

  async start(): Promise<void> {
    if (this.mode === "live") {
      this.dashboard = new Dashboard({
        refreshRate: this.refreshRate,
        theme: this.theme,
        metrics: this.metrics
      });
      
      this.waterfall = new Waterfall();
      this.migrationTracker = new MigrationTracker();
      this.frameBreakdown = new FrameBreakdown();
      
      const decryptor = this.keylogFile ? new Decryptor(this.keylogFile) : undefined;
      
      this.sniffer = new Sniffer({
        port: this.port,
        interface: this.interfaceName,
        decryptor,
        onPacket: (packet: Packet) => {
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

  async analyze(): Promise<FullAnalysis> {
    if (this.mode === "file" && this.filePath) {
      const parser = new Parser();
      const packets = await parser.parseQlog(this.filePath);
      packets.forEach(packet => this.analyzer.processPacket(packet));
      return this.analyzer.getFullAnalysis();
    }
    throw new Error("No file path provided for analysis mode");
  }

  stop(): void {
    if (this.sniffer) this.sniffer.stop();
    if (this.dashboard) this.dashboard.destroy();
    if (this.waterfall) this.waterfall.destroy();
    if (this.migrationTracker) this.migrationTracker.destroy();
    if (this.frameBreakdown) this.frameBreakdown.destroy();
  }
}