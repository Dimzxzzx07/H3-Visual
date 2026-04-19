import * as fs from "fs";
import { FullAnalysis } from "../types";

export class JsonExporter {
  static export(analysis: FullAnalysis, filePath: string): void {
    const json = JSON.stringify(analysis, null, 2);
    fs.writeFileSync(filePath, json, "utf8");
  }
}