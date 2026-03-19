import { ChromaClient } from "chromadb";

let client = null;

/**
 * Returns a singleton ChromaClient instance.
 * Supports both local Chroma and Chroma Cloud (api.trychroma.com).
 */
export function getClient() {
  if (client) return client;

  const { CHROMA_PATH, CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE } = process.env;

  if (!CHROMA_PATH) throw new Error("CHROMA_PATH env var is required");

  const isCloud = CHROMA_PATH.includes("trychroma.com");

  if (isCloud) {
    if (!CHROMA_API_KEY) throw new Error("CHROMA_API_KEY is required for Chroma Cloud");
    if (!CHROMA_TENANT) throw new Error("CHROMA_TENANT is required for Chroma Cloud");
    if (!CHROMA_DATABASE) throw new Error("CHROMA_DATABASE is required for Chroma Cloud");

    const url = new URL(CHROMA_PATH);
    client = new ChromaClient({
      ssl: url.protocol === "https:",
      host: url.hostname,
      port: url.port ? parseInt(url.port) : (url.protocol === "https:" ? 443 : 80),
      headers: { "X-Chroma-Token": CHROMA_API_KEY },
      tenant: CHROMA_TENANT,
      database: CHROMA_DATABASE,
    });
  } else {
    // Local Chroma instance
    const url = new URL(CHROMA_PATH);
    client = new ChromaClient({
      ssl: false,
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 8000,
      tenant: CHROMA_TENANT || "default_tenant",
      database: CHROMA_DATABASE || "default_database",
    });
  }

  return client;
}

/** Reset the singleton (used in tests) */
export function _resetClient() {
  client = null;
}
