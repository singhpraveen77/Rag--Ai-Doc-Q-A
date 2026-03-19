import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { randomUUID } from "crypto";

const INDEX_NAME = process.env.PINECONE_INDEX || "documents";

const getEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

const getPineconeIndex = () => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  return pc.Index(INDEX_NAME);
};

// Embed docs and upsert into Pinecone, returns sessionId
export async function createVectorStore(docs) {
  const sessionId = randomUUID();
  console.log(`Session: ${sessionId} — embedding ${docs.length} chunks...`);

  const embeddings = getEmbeddings();
  const index = getPineconeIndex();

  const texts = docs.map(d => d.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  const records = vectors
    .map((values, i) => {
      const rawMeta = docs[i].metadata || {};
      const safeMeta = Object.fromEntries(
        Object.entries(rawMeta).filter(([, v]) =>
          typeof v === "string" || typeof v === "number" || typeof v === "boolean" ||
          (Array.isArray(v) && v.every(x => typeof x === "string"))
        )
      );
      return {
        id: `chunk-${sessionId}-${i}`,
        values,
        metadata: { text: docs[i].pageContent, sessionId, ...safeMeta },
      };
    })
    .filter(r => Array.isArray(r.values) && r.values.length > 0);

  if (records.length === 0) {
    throw new Error("Embedding returned no valid vectors");
  }

  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await index.upsert({ records: batch });
  }

  console.log(`✅ Stored ${records.length} vectors for session ${sessionId}`);
  return sessionId;
}

// Query Pinecone filtered by sessionId
export async function queryVectorStore(question, sessionId, topK = 6) {
  const embeddings = getEmbeddings();
  const index = getPineconeIndex();

  const queryVector = await embeddings.embedQuery(question);
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    filter: { sessionId: { $eq: sessionId } },
  });

  return results.matches?.map(m => m.metadata?.text || "") || [];
}
