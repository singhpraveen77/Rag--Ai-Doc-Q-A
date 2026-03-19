import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock chromadb before importing the module under test
vi.mock("chromadb", () => ({
  ChromaClient: vi.fn(function () {
    this.mocked = true;
  }),
}));

import { getClient, _resetClient } from "../../utils/chromaClient.js";

describe("chromaClient singleton", () => {
  beforeEach(() => {
    _resetClient();
    // Set valid env vars by default
    process.env.CHROMA_API_KEY = "test-api-key";
    process.env.CHROMA_TENANT = "test-tenant";
    process.env.CHROMA_DATABASE = "test-database";
  });

  it("returns the same instance on repeated calls", () => {
    const first = getClient();
    const second = getClient();
    expect(first).toBe(second);
  });

  it("throws when CHROMA_API_KEY is missing", () => {
    delete process.env.CHROMA_API_KEY;
    expect(() => getClient()).toThrow(/CHROMA_API_KEY/);
  });

  it("throws when CHROMA_TENANT is missing", () => {
    delete process.env.CHROMA_TENANT;
    expect(() => getClient()).toThrow(/CHROMA_TENANT/);
  });

  it("throws when CHROMA_DATABASE is missing", () => {
    delete process.env.CHROMA_DATABASE;
    expect(() => getClient()).toThrow(/CHROMA_DATABASE/);
  });
});
