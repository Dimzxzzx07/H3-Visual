"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvExporter = void 0;
const fs = __importStar(require("fs"));
class CsvExporter {
    static export(analysis, filePath) {
        const lines = [];
        lines.push("Metric,Value");
        lines.push(`RTT (ms),${analysis.summary.rtt}`);
        lines.push(`Packet Loss (%),${analysis.summary.packetLoss * 100}`);
        lines.push(`Throughput (KB/s),${analysis.summary.throughput}`);
        lines.push(`Total Packets,${analysis.summary.totalPackets}`);
        lines.push(`Active Streams,${analysis.summary.activeStreams}`);
        lines.push(`Migrations,${analysis.summary.migrations}`);
        lines.push("");
        lines.push("Stream ID,Packet Count,Bytes,Duration (ms)");
        for (const stream of analysis.streams) {
            lines.push(`${stream.streamId},${stream.packetCount},${stream.bytes},${stream.duration}`);
        }
        lines.push("");
        lines.push("Frame Type,Count");
        for (const [type, count] of Object.entries(analysis.frameBreakdown)) {
            lines.push(`${type},${count}`);
        }
        fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    }
}
exports.CsvExporter = CsvExporter;
//# sourceMappingURL=CsvExporter.js.map