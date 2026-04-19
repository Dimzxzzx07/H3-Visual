import { H3Visual } from "../src/core/H3Visual";

const viz = new H3Visual({
  mode: "live",
  refreshRate: 500,
  theme: "monokai",
  metrics: ["rtt", "throughput", "packet-loss"],
  port: 443,
  interface: "eth0"
});

viz.on("packet", (data) => {
  console.log(`Stream ID: ${data.dcid} | Size: ${data.length} bytes`);
});

viz.start();

process.on("SIGINT", () => {
  viz.stop();
  process.exit(0);
});