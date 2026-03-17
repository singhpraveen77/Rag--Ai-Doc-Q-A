import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

let vectorStore = null;

export async function createVectorStore(docs) {

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  vectorStore = await Chroma.fromDocuments(
    docs,
    embeddings,
    { collectionName: "documents" }
  );
}

export function getVectorStore() {
  return vectorStore;
}