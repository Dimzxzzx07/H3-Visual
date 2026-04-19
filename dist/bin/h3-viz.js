#!/usr/bin/env node
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
const commander_1 = require("commander");
const H3Visual_1 = require("../src/core/H3Visual");
const JsonExporter_1 = require("../src/exporters/JsonExporter");
const program = new commander_1.Command();
program
    .name("h3-viz")
    .description("HTTP/3 packet visualizer and analyzer")
    .version("1.0.0");
program
    .command("live")
    .option("-p, --port <port>", "port to monitor", "443")
    .option("-i, --interface <interface>", "network interface", "eth0")
    .option("-k, --keylog <file>", "SSLKEYLOGFILE for decryption")
    .option("-r, --refresh <ms>", "refresh rate in ms", "500")
    .option("-t, --theme <theme>", "dashboard theme", "monokai")
    .action(async (options) => {
    const viz = new H3Visual_1.H3Visual({
        mode: "live",
        port: parseInt(options.port),
        interface: options.interface,
        keylogFile: options.keylog,
        refreshRate: parseInt(options.refresh),
        theme: options.theme
    });
    await viz.start();
});
program
    .command("file")
    .requiredOption("-f, --file <path>", "qlog file path")
    .option("-e, --export <file>", "export analysis to JSON")
    .option("-c, --csv <file>", "export to CSV")
    .action(async (options) => {
    const viz = new H3Visual_1.H3Visual({
        mode: "file",
        filePath: options.file
    });
    const analysis = await viz.analyze();
    if (options.export) {
        JsonExporter_1.JsonExporter.export(analysis, options.export);
        console.log(`Analysis exported to ${options.export}`);
    }
    if (options.csv) {
        const { CsvExporter } = await Promise.resolve().then(() => __importStar(require("../src/exporters/CsvExporter")));
        CsvExporter.export(analysis, options.csv);
        console.log(`CSV exported to ${options.csv}`);
    }
});
program.parse();
//# sourceMappingURL=h3-viz.js.map