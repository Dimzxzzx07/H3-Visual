"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const blessed_1 = __importDefault(require("blessed"));
const blessed_contrib_1 = __importDefault(require("blessed-contrib"));
class Dashboard {
    constructor(config) {
        this.refreshRate = config.refreshRate;
        this.theme = config.theme;
        this.metrics = config.metrics;
        this.widgets = {};
        this.currentData = {
            rtt: 0,
            throughput: 0,
            packetLoss: 0,
            totalPackets: 0,
            activeStreams: 0,
            migrations: 0,
            frames: {}
        };
        this.interval = null;
    }
    render() {
        this.screen = blessed_1.default.screen({
            smartCSR: true,
            title: "HTTP/3 Packet Visualizer"
        });
        this.grid = new blessed_contrib_1.default.grid({ rows: 12, cols: 12, screen: this.screen });
        this.widgets.rtt = this.grid.set(0, 0, 3, 3, blessed_contrib_1.default.gauge, {
            label: "RTT (ms)",
            percent: 0,
            style: { bar: { bg: "cyan" } }
        });
        this.widgets.throughput = this.grid.set(0, 3, 3, 3, blessed_contrib_1.default.gauge, {
            label: "Throughput (KB/s)",
            percent: 0,
            style: { bar: { bg: "green" } }
        });
        this.widgets.packetLoss = this.grid.set(0, 6, 3, 3, blessed_contrib_1.default.gauge, {
            label: "Packet Loss %",
            percent: 0,
            style: { bar: { bg: "red" } }
        });
        this.widgets.streams = this.grid.set(0, 9, 3, 3, blessed_contrib_1.default.gauge, {
            label: "Active Streams",
            percent: 0,
            style: { bar: { bg: "yellow" } }
        });
        this.widgets.log = this.grid.set(3, 0, 6, 12, blessed_contrib_1.default.log, {
            fg: "green",
            selectedFg: "green",
            label: "Packet Log"
        });
        this.widgets.stats = this.grid.set(9, 0, 3, 12, blessed_contrib_1.default.table, {
            keys: true,
            fg: "white",
            selectedFg: "white",
            selectedBg: "blue",
            label: "Statistics",
            columnSpacing: 3,
            columnWidth: [20, 15]
        });
        this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
        this.screen.render();
    }
    update(metrics) {
        this.currentData = metrics;
        if (this.widgets.rtt) {
            this.widgets.rtt.setPercent(Math.min(metrics.rtt / 10, 100));
            this.widgets.rtt.setLabel(`RTT: ${metrics.rtt.toFixed(2)} ms`);
        }
        if (this.widgets.throughput) {
            this.widgets.throughput.setPercent(Math.min(metrics.throughput / 100, 100));
            this.widgets.throughput.setLabel(`Throughput: ${metrics.throughput.toFixed(2)} KB/s`);
        }
        if (this.widgets.packetLoss) {
            this.widgets.packetLoss.setPercent(Math.min(metrics.packetLoss * 100, 100));
            this.widgets.packetLoss.setLabel(`Packet Loss: ${(metrics.packetLoss * 100).toFixed(2)}%`);
        }
        if (this.widgets.streams) {
            this.widgets.streams.setPercent(Math.min(metrics.activeStreams, 100));
            this.widgets.streams.setLabel(`Active Streams: ${metrics.activeStreams}`);
        }
        if (this.widgets.log && metrics.lastPacket) {
            this.widgets.log.log(`Packet: ${metrics.lastPacket}`);
        }
        if (this.widgets.stats) {
            this.widgets.stats.setData({
                headers: ["Metric", "Value"],
                data: [
                    ["Total Packets", metrics.totalPackets.toString()],
                    ["Active Streams", metrics.activeStreams.toString()],
                    ["Migrations", metrics.migrations.toString()],
                    ["Frame Types", Object.keys(metrics.frames).length.toString()]
                ]
            });
        }
        this.screen.render();
    }
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.screen) {
            this.screen.destroy();
        }
    }
}
exports.Dashboard = Dashboard;
//# sourceMappingURL=Dashboard.js.map