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
exports.Decryptor = void 0;
const crypto = __importStar(require("crypto"));
class Decryptor {
    constructor(keylogFile) {
        this.keys = new Map();
        this.loadKeys(keylogFile);
    }
    loadKeys(keylogFile) {
        const fs = require("fs");
        const content = fs.readFileSync(keylogFile, "utf8");
        const lines = content.split("\n");
        for (const line of lines) {
            if (line.startsWith("QUIC_")) {
                const parts = line.split(" ");
                if (parts.length >= 2) {
                    const keyType = parts[0];
                    const keyHex = parts[1];
                    this.keys.set(keyType, Buffer.from(keyHex, "hex"));
                }
            }
        }
    }
    decrypt(payload) {
        if (payload.length < 24)
            return null;
        const dcidLen = payload[5];
        const scidLen = payload[6 + dcidLen];
        const packetNumberOffset = 7 + dcidLen + scidLen;
        const packetNumberLen = (payload[packetNumberOffset] & 0x03) + 1;
        const protectedPayload = payload.slice(packetNumberOffset + 1 + packetNumberLen);
        const key = this.keys.get("QUIC_CRYPTO_KEY");
        if (!key)
            return null;
        try {
            const decipher = crypto.createDecipheriv("aes-128-gcm", key, Buffer.alloc(12));
            const decrypted = Buffer.concat([
                decipher.update(protectedPayload),
                decipher.final()
            ]);
            return decrypted;
        }
        catch (e) {
            return null;
        }
    }
}
exports.Decryptor = Decryptor;
//# sourceMappingURL=Decryptor.js.map