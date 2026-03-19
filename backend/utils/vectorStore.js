import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

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

// Embed docs and upsert into Pinecone
export async function createVectorStore(docs) {
  console.log(`Embedding and storing ${docs.length} chunks in Pinecone...`);

  const embeddings = getEmbeddings();
  const index = getPineconeIndex();

  const texts = docs.map(d => d.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  console.log(`Got ${vectors.length} vectors`);

  const records = vectors
    .map((values, i) => {
      // Pinecone only allows flat metadata: string, number, boolean, or string[]
      const rawMeta = docs[i].metadata || {};
      const safeMeta = Object.fromEntries(
        Object.entries(rawMeta).filter(([, v]) =>
          typeof v === "string" || typeof v === "number" || typeof v === "boolean" ||
          (Array.isArray(v) && v.every(x => typeof x === "string"))
        )
      );
      return {
        id: `chunk-${Date.now()}-${i}`,
        values,
        metadata: { text: docs[i].pageContent, ...safeMeta },
      };
    })
    .filter(r => Array.isArray(r.values) && r.values.length > 0);

  console.log(`Records after filter: ${records.length}`);
  if (records.length > 0) {
    console.log(`First record vector length: ${records[0].values.length}`);
  }

  if (records.length === 0) {
    throw new Error("Embedding returned no valid vectors");
  }

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(`Upserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)...`);
    await index.upsert({ records: batch });
  }

  console.log("✅ Vectors stored in Pinecone");
}

// Query Pinecone for similar chunks
export async function queryVectorStore(question, topK = 3) {
  const embeddings = getEmbeddings();
  const index = getPineconeIndex();

  const queryVector = await embeddings.embedQuery(question);
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return results.matches?.map(m => m.metadata?.text || "") || [];
}
