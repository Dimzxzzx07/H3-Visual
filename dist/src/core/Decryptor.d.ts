export declare class Decryptor {
    private keys;
    constructor(keylogFile: string);
    private loadKeys;
    decrypt(payload: Buffer): Buffer | null;
}
//# sourceMappingURL=Decryptor.d.ts.map