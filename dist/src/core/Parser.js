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
exports.Parser = void 0;
const fs = __importStar(require("fs"));
class Parser {
    async parseQlog(filePath) {
        const content = fs.readFileSync(filePath, "utf8");
        const qlog = JSON.parse(content);
        const packets = [];
        if (qlog.traces && qlog.traces[0]) {
            const trace = qlog.traces[0];
            for (const event of trace.events) {
                if (event.name === "transport:packet_received" || event.name === "transport:packet_sent") {
                    const packet = {
                        timestamp: event.time,
                        type: event.data.packet_type,
                        packetNumber: event.data.packet_number,
                        length: event.data.length,
                        frames: []
                    };
                    if (event.data.frames) {
                        for (const frame of event.data.frames) {
                            packet.frames.push({
                                type: frame.frame_type,
                                payload: frame
                            });
                        }
                    }
                    packets.push(packet);
                }
            }
        }
        return packets;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map