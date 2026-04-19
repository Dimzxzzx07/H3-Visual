#!/usr/bin/env node

import { Command } from "commander";
import { H3Visual } from "../src/core/H3Visual";
import { JsonExporter } from "../src/exporters/JsonExporter";

const program = new Command();

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
    const viz = new H3Visual({
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
    const viz = new H3Visual({
      mode: "file",
      filePath: options.file
    });
    
    const analysis = await viz.analyze();
    
    if (options.export) {
      JsonExporter.export(analysis, options.export);
      console.log(`Analysis exported to ${options.export}`);
    }
    
    if (options.csv) {
      const { CsvExporter } = await import("../src/exporters/CsvExporter");
      CsvExporter.export(analysis, options.csv);
      console.log(`CSV exported to ${options.csv}`);
    }
  });

program.parse();