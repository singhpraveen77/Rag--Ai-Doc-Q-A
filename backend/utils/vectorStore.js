import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import path from "path";
import fs from "fs";

const STORE_DIR = path.resolve("./vector-store");
let vectorStore = null;

const getEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

// CREATE — overwrites any existing store
export async function createVectorStore(docs) {
  console.log(`Creating vector store with ${docs.length} docs...`);
  const embeddings = getEmbeddings();
  vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
  await vectorStore.save(STORE_DIR);
  console.log("✅ Vector store saved to disk");
  return vectorStore;
}

// LOAD EXISTING
export async function getVectorStore() {
  if (vectorStore) return vectorStore;

  if (!fs.existsSync(STORE_DIR)) {
    console.warn("No vector store found on disk.");
    return null;
  }

  console.log("Loading vector store from disk...");
  const embeddings = getEmbeddings();
  vectorStore = await HNSWLib.load(STORE_DIR, embeddings);
  console.log("✅ Vector store loaded");
  return vectorStore;
}
