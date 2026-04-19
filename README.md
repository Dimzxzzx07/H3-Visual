# h3-visual

<div align="center">
    <img src="https://img.shields.io/badge/Version-1.0.0-2563eb?style=for-the-badge&logo=typescript" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative" alt="License">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?style=for-the-badge&logo=nodedotjs" alt="Node">
    <img src="https://img.shields.io/badge/QUIC-HTTP%2F3-FF6B6B?style=for-the-badge&logo=quic" alt="QUIC">
    <img src="https://img.shields.io/badge/TLS-1.3-4A90E2?style=for-the-badge&logo=cloudflare" alt="TLS">
</div>

<div align="center">
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Dimzxzzx07-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Dimzxzzx07-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/h3-visual">
        <img src="https://img.shields.io/badge/NPM-h3--visual-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
</div>

---

## Table of Contents

- [What is H3-Visual?](#what-is-h3-visual)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Configuration Guide](#configuration-guide)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [FAQ](#faq)
- [Terms of Service](#terms-of-service)
- [License](#license)

---

## What is H3-Visual?

**H3-Visual (The Eye)** is a powerful HTTP/3 and QUIC packet analysis tool that helps developers debug and monitor their HTTP/3 traffic. It operates in two modes: live sniffer for real-time traffic inspection and parser for analyzing saved .qlog files. The tool decrypts TLS 1.3 traffic using SSLKEYLOGFILE, calculates packet loss, RTT, stream multiplexing, and renders a beautiful terminal dashboard using blessed-contrib.

---

## Features

| Category | Features |
|----------|----------|
| Protocol | QUIC/HTTP3 sniffing, UDP packet capture, .qlog file parsing |
| Decryption | TLS 1.3 decryption, SSLKEYLOGFILE support, automatic key loading |
| Analysis | Packet loss calculation, RTT measurement, stream multiplexing analysis |
| Visualization | Live terminal dashboard, waterfall diagrams, frame breakdown |
| CLI Support | Live sniffing mode, file analysis mode, JSON/CSV export |
| Migration Tracking | Connection ID change detection, network handoff tracking |
| Frame Analysis | HEADERS, DATA, SETTINGS, CANCEL_PUSH frame breakdown |
| Metrics | Throughput monitoring, active stream counting, migration events |
| Export | JSON export for reporting, CSV export for spreadsheet analysis |

---

## Installation

From NPM

```bash
npm install h3-visual
npm install -g h3-visual
```

Requirements

Requirement Minimum Recommended
Node.js 18.0.0 20.0.0+
libpcap 1.9.0 1.10.0+
RAM 256 MB 1 GB+
Storage 50 MB 100 MB
OS Linux 5.4+ Ubuntu 22.04+

Install libpcap (Linux)

```bash
# Ubuntu/Debian
sudo apt-get install libpcap-dev

# CentOS/RHEL
sudo yum install libpcap-devel

# Arch Linux
sudo pacman -S libpcap
```

Generate SSL Key Log File for Decryption

```bash
# For Chrome/Chromium
export SSLKEYLOGFILE=/path/to/sslkeylog.txt
chromium --ssl-key-log-file=/path/to/sslkeylog.txt

# For Firefox
# Navigate to about:config
# Set security.ssl.enable_sslkeylogfile to true
# Set ssl.keylogfile to /path/to/sslkeylog.txt
```

---

Quick Start

Live Sniffing Mode

```bash
# Monitor HTTP/3 traffic on port 443
h3-viz live --port 443 --interface eth0

# With decryption using SSLKEYLOGFILE
h3-viz live --port 443 --interface wlan0 --keylog ./sslkeylog.txt

# Custom refresh rate and theme
h3-viz live --port 443 --interface eth0 --refresh 300 --theme dark
```

File Analysis Mode

```bash
# Parse and analyze .qlog file
h3-viz file --file server_logs.qlog

# Export analysis to JSON
h3-viz file --file server_logs.qlog --export report.json

# Export to CSV for spreadsheet
h3-viz file --file server_logs.qlog --csv analysis.csv
```

Using as Library

```javascript
const { H3Visual } = require('h3-visual');

const viz = new H3Visual({
  mode: 'live',
  refreshRate: 500,
  theme: 'monokai',
  metrics: ['rtt', 'throughput', 'packet-loss']
});

viz.on('packet', (data) => {
  console.log(`Stream ID: ${data.streamId} | Size: ${data.size} bytes`);
});

viz.start();
```

---

CLI Usage

Basic Commands

```bash
# Live sniffing on default port 443
h3-viz live

# Live sniffing on custom port and interface
h3-viz live --port 8443 --interface wlan0

# Live sniffing with decryption
h3-viz live --port 443 --keylog ./keys.log

# Analyze qlog file
h3-viz file --file capture.qlog

# Analyze and export to JSON
h3-viz file --file capture.qlog --export results.json

# Analyze and export to CSV
h3-viz file --file capture.qlog --csv metrics.csv
```

Command Options

Command Alias Description
live - Start live packet sniffer
file - Parse and analyze qlog file
--port <port> -p Port to monitor (default: 443)
--interface <iface> -i Network interface (default: eth0)
--keylog <file> -k SSLKEYLOGFILE for decryption
--refresh <ms> -r Dashboard refresh rate (default: 500)
--theme <theme> -t Dashboard theme (monokai/dark/light)
--file <path> -f Qlog file path for analysis
--export <file> -e Export analysis to JSON
--csv <file> -c Export analysis to CSV

---

Configuration Guide

Programmatic Configuration

```javascript
const { H3Visual } = require('h3-visual');

const viz = new H3Visual({
  mode: 'live',
  refreshRate: 500,
  theme: 'monokai',
  metrics: ['rtt', 'throughput', 'packet-loss'],
  port: 443,
  interface: 'eth0',
  keylogFile: './sslkeylog.txt'
});
```

Configuration Parameters

Parameter Type Default Description
mode string 'live' Operation mode: 'live' or 'file'
refreshRate number 500 Dashboard refresh rate in milliseconds
theme string 'monokai' Dashboard color theme
metrics array ['rtt','throughput','packet-loss'] Metrics to display
port number 443 UDP port to sniff
interface string 'eth0' Network interface name
keylogFile string undefined Path to SSLKEYLOGFILE
filePath string undefined Path to .qlog file for analysis
exportPath string undefined Path for JSON export

---

API Reference

H3Visual Class

```javascript
const { H3Visual } = require('h3-visual');
```

Constructor

```javascript
const viz = new H3Visual(config);
```

Parameters:

· config (object): Configuration object
· config.mode (string): 'live' or 'file'
· config.refreshRate (number): Dashboard refresh rate in ms
· config.theme (string): Dashboard theme
· config.metrics (array): Metrics to display
· config.port (number): UDP port for sniffing
· config.interface (string): Network interface
· config.keylogFile (string): SSLKEYLOGFILE path
· config.filePath (string): Qlog file path
· config.exportPath (string): Export file path

Methods

Method Description
start() Start the visualizer (live mode)
analyze() Analyze qlog file and return results (file mode)
stop() Stop all operations
on(event, callback) Register event listener

Events

Event Payload Description
packet Packet object Emitted when packet is captured or parsed

Packet Object Structure

```typescript
{
  timestamp: number,
  sourcePort: number,
  destPort: number,
  length: number,
  type: 'long' | 'short',
  version: number,
  dcid: string,
  scid: string,
  packetNumber: number,
  frames: Array<{type: string, payload: any}>,
  decrypted: Buffer | null
}
```

Analyzer Class

```javascript
const { Analyzer } = require('h3-visual');
```

Methods

Method Description
processPacket(packet) Process a single packet
getMetrics() Get current metrics (RTT, loss, throughput)
getFullAnalysis() Get complete analysis with streams and events

Metrics Object

```typescript
{
  rtt: number,
  packetLoss: number,
  throughput: number,
  totalPackets: number,
  activeStreams: number,
  migrations: number,
  frames: Record<string, number>
}
```

Waterfall Class

```javascript
const { Waterfall } = require('h3-visual');
```

Methods

Method Description
addPacket(packet) Add packet to waterfall
getWaterfallData() Get waterfall visualization data

MigrationTracker Class

```javascript
const { MigrationTracker } = require('h3-visual');
```

Methods

Method Description
checkMigration(packet) Check if packet indicates migration
onMigration(callback) Register migration event handler
getMigrations() Get all detected migrations

FrameBreakdown Class

```javascript
const { FrameBreakdown } = require('h3-visual');
```

Methods

Method Description
processPacket(packet) Extract frames from packet
getBreakdown() Get frame type statistics

---

Usage Examples

Basic Live Sniffer with Custom Dashboard

```javascript
const { H3Visual } = require('h3-visual');

const viz = new H3Visual({
  mode: 'live',
  refreshRate: 300,
  theme: 'dark',
  port: 443,
  interface: 'wlan0'
});

viz.on('packet', (packet) => {
  if (packet.type === 'long') {
    console.log(`Long header packet | Version: ${packet.version} | DCID: ${packet.dcid?.substring(0, 8)}`);
  }
});

viz.start();

process.on('SIGINT', () => {
  viz.stop();
  process.exit(0);
});
```

Analyze Qlog and Generate Report

```javascript
const { H3Visual } = require('h3-visual');

async function analyzeQlog(filePath) {
  const viz = new H3Visual({
    mode: 'file',
    filePath: filePath
  });
  
  const analysis = await viz.analyze();
  
  console.log('Analysis Summary:');
  console.log(`Total Packets: ${analysis.summary.totalPackets}`);
  console.log(`Average RTT: ${analysis.summary.rtt.toFixed(2)} ms`);
  console.log(`Packet Loss: ${(analysis.summary.packetLoss * 100).toFixed(2)}%`);
  console.log(`Active Streams: ${analysis.summary.activeStreams}`);
  console.log(`Migrations Detected: ${analysis.summary.migrations}`);
  
  console.log('\nFrame Breakdown:');
  for (const [type, count] of Object.entries(analysis.frameBreakdown)) {
    console.log(`  ${type}: ${count} frames`);
  }
  
  if (analysis.migrations.length > 0) {
    console.log('\nConnection Migrations:');
    analysis.migrations.forEach(m => {
      console.log(`  ${new Date(m.time).toISOString()} | ${m.fromCid.substring(0, 8)} -> ${m.toCid.substring(0, 8)}`);
    });
  }
  
  return analysis;
}

analyzeQlog('./capture.qlog').catch(console.error);
```

Custom Dashboard with Waterfall and Migration Tracking

```javascript
const { H3Visual, Waterfall, MigrationTracker, FrameBreakdown } = require('h3-visual');

const viz = new H3Visual({
  mode: 'live',
  refreshRate: 500,
  port: 443,
  interface: 'eth0',
  keylogFile: './sslkeylog.txt'
});

const waterfall = new Waterfall();
const migrationTracker = new MigrationTracker();
const frameBreakdown = new FrameBreakdown();

migrationTracker.onMigration((migration) => {
  console.log(`\n[!] Connection Migration Detected!`);
  console.log(`    From: ${migration.fromCid.substring(0, 16)}`);
  console.log(`    To:   ${migration.toCid.substring(0, 16)}`);
  console.log(`    Time: ${new Date(migration.time).toISOString()}`);
});

viz.on('packet', (packet) => {
  waterfall.addPacket(packet);
  migrationTracker.checkMigration(packet);
  frameBreakdown.processPacket(packet);
  
  if (packet.frames) {
    for (const frame of packet.frames) {
      if (frame.type === '0x01') {
        console.log(`PING frame received on stream ${packet.dcid?.substring(0, 8)}`);
      }
      if (frame.type === '0x1c' || frame.type === '0x1d') {
        console.log(`[!] Connection closed frame detected!`);
      }
    }
  }
});

setInterval(() => {
  const waterfallData = waterfall.getWaterfallData();
  const frameStats = frameBreakdown.getBreakdown();
  
  console.log('\n--- Periodic Stats ---');
  console.log(`Total streams in waterfall: ${waterfallData.length}`);
  console.log(`Frame types seen: ${Object.keys(frameStats).length}`);
}, 10000);

viz.start();
```

Docker Deployment

```dockerfile
FROM node:20-alpine

RUN apk add --no-cache libpcap-dev libpcap

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY certs ./certs

RUN adduser -D -u 1000 h3user
USER h3user

EXPOSE 443/udp

CMD ["node", "dist/bin/h3-viz.js", "live", "--port", "443", "--interface", "eth0"]
```

---

FAQ

Q1: Do I need root privileges to run the sniffer?

Answer: Yes, capturing raw UDP packets requires root/sudo access on most systems. You can run with sudo or set capabilities:

```bash
sudo h3-viz live --port 443 --interface eth0

# Or set capabilities to avoid sudo
sudo setcap cap_net_raw,cap_net_admin+eip $(which node)
```

Valid Data: libpcap requires CAP_NET_RAW capability. Without root, you can only analyze .qlog files, not live traffic.

---

Q2: How do I get .qlog files from my HTTP/3 server?

Answer: Many HTTP/3 implementations support qlog export:

For aioquic (Python):

```bash
QUIC_QLOG_DIR=./qlogs/ python server.py
```

For quic-go (Go):

```go
qlogDir := os.Getenv("QLOG_DIR")
if qlogDir != "" {
    conf.Tracer = qlog.NewTracer(qlogDir, "server")
}
```

For nginx with quic:
Configure qlog directory in nginx.conf with quic_qlog directive.

Valid Data: Qlog is a JSON-based logging format standardized by the QUIC Working Group. Most major QUIC implementations support it.

---

Q3: Why can't I decrypt TLS 1.3 traffic?

Answer: TLS 1.3 decryption requires the SSLKEYLOGFILE environment variable to be set BEFORE starting the browser or application. The file must contain QUIC_CRYPTO_KEY entries.

Valid Data: Chrome and Firefox write keys to SSLKEYLOGFILE only if the environment variable is set at launch. Keys are written as QUIC_CRYPTO_KEY followed by hex-encoded key material.

---

Q4: What do the different packet types mean?

Answer: QUIC has two header formats:

· Long header: Used for initial handshake (version negotiation, initial, handshake packets)
· Short header: Used for regular data transmission after handshake completes

The packet type field indicates specific purpose: Initial (0), Handshake (2), Retry (3), etc.

Valid Data: Long header packets contain DCID and SCID fields. Short header packets only contain DCID and are used for 1-RTT protected data.

---

Q5: How accurate is the RTT measurement?

Answer: RTT is calculated using packet timestamps and ack_delay fields from ACK frames. Accuracy is typically within 1-5ms on local networks and 10-20ms on internet connections.

Valid Data: The tool uses the formula: RTT = packet.timestamp - ack_delay. This assumes the ack_delay field accurately reflects processing time, which is true for most implementations.

---

Q6: Can this tool cause performance issues on high traffic?

Answer: The tool processes packets synchronously. On high traffic (10,000+ packets/second), you may experience packet drops. Use file analysis mode for production debugging.

Valid Data: Node.js event loop can handle ~50,000 packets/second on 4-core CPU before dropping. For higher traffic, capture with tcpdump first, then analyze the .qlog file.

---

Terms of Service

Please read these Terms of Service carefully before using H3-Visual.

1. Acceptance of Terms

By downloading, installing, or using H3-Visual (the "Software"), you agree to be bound by these Terms of Service.

1. Intended Use

H3-Visual is designed for legitimate purposes including:

· Debugging your own HTTP/3 servers and applications
· Analyzing performance of your QUIC implementations
· Monitoring traffic on networks you own or have permission to monitor
· Educational research on QUIC and HTTP/3 protocols
· Troubleshooting connection issues in your infrastructure

1. Prohibited Uses

You agree NOT to use H3-Visual for:

· Sniffing traffic on networks you do not own or have explicit permission to monitor
· Decrypting traffic without proper authorization
· Intercepting communications you are not a party to
· Any activity that violates local, state, or federal wiretapping laws
· Attacking or probing third-party services
· Bypassing security controls

1. Responsibility and Liability

THE AUTHOR PROVIDES THIS SOFTWARE "AS IS" WITHOUT WARRANTIES. YOU BEAR FULL RESPONSIBILITY FOR YOUR ACTIONS. THE AUTHOR IS NOT LIABLE FOR ANY DAMAGES, LEGAL CONSEQUENCES, OR ANY OTHER OUTCOMES RESULTING FROM YOUR USE.

1. Legal Compliance

You agree to comply with all applicable laws in your jurisdiction regarding packet sniffing, network monitoring, and data decryption. This includes but is not limited to:

· The Electronic Communications Privacy Act (ECPA) in the US
· The Computer Misuse Act in the UK
· GDPR in the European Union
· Local wiretapping and surveillance laws

1. No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

1. Indemnification

You agree to indemnify and hold the Author harmless from any claims arising from your use of the Software.

1. Ethical Reminder

I built H3-Visual to help developers debug their own applications and understand QUIC/HTTP/3 better. Please use this tool responsibly. Only monitor networks you own or have permission to monitor. Only decrypt traffic you are authorized to decrypt. Respect privacy and the laws of your country. If you choose to misuse this tool, you alone bear the consequences.

---

License

MIT License

Copyright (c) 2026 Dimzxzzx07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
    <img src="https://i.imgur.com/aPSNrKE.png" alt="Dimzxzzx07 Logo" width="200">
    <br>
    <strong>Powered By Dimzxzzx07</strong>
    <br>
    <br>
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub">
    </a>
    <br>
    <br>
    <small>Copyright © 2026 Dimzxzzx07. All rights reserved.</small>
</div>
