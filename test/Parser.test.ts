import { Parser } from "../src/core/Parser";

describe("Parser", () => {
  it("should create parser instance", () => {
    const parser = new Parser();
    expect(parser).toBeDefined();
  });
});