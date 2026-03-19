import { createVectorStore } from "../utils/vectorStore.js";

export class EmbeddingError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "EmbeddingError";
    this.cause = cause;
  }
}

/**
 * Generate embeddings for documents and store them locally via HNSWLib.
 * @param {import("@langchain/core/documents").Document[]} docs
 * @throws {EmbeddingError}
 */
export async function embedAndStore(docs) {
  try {
    await createVectorStore(docs);
  } catch (err) {
    throw new EmbeddingError(`Embedding storage failed: ${err.message}`, err);
  }
}
