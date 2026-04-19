import { Decryptor } from "../src/core/Decryptor";

describe("Decryptor", () => {
  it("should create decryptor instance", () => {
    expect(() => new Decryptor("test.keylog")).toThrow();
  });
});