import { H3Visual } from "../src/core/H3Visual";
import { MigrationTracker } from "../src/visualizers/MigrationTracker";
import { FrameBreakdown } from "../src/visualizers/FrameBreakdown";

const viz = new H3Visual({
  mode: "live",
  refreshRate: 300,
  theme: "dark",
  port: 443,
  interface: "wlan0",
  keylogFile: "./sslkeylog.txt"
});

const migrationTracker = new MigrationTracker();
migrationTracker.onMigration((migration) => {
  console.log(`Connection migrated from ${migration.fromCid.substring(0, 8)} to ${migration.toCid.substring(0, 8)}`);
});

const frameBreakdown = new FrameBreakdown();

viz.on("packet", (packet) => {
  migrationTracker.checkMigration(packet);
  frameBreakdown.processPacket(packet);
  
  if (packet.frames) {
    for (const frame of packet.frames) {
      if (frame.type === "0x10" || frame.type === "0x11") {
        console.log(`Flow control frame: ${frame.type}`);
      }
    }
  }
});

viz.start();

setInterval(() => {
  const breakdown = frameBreakdown.getBreakdown();
  console.log("Frame breakdown:", breakdown);
}, 5000);