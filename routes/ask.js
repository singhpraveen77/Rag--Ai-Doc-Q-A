import express from "express";
import { getVectorStore } from "../utils/vectorStore.js";
import OpenAI from "openai";

const router = express.Router();
// console.log("API KEY:", process.env.OPENAI_API_KEY);
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const vectorStore = getVectorStore();

    if (!vectorStore) {
      return res.json({ error: "Upload document first" });
    }

    // 1. Retrieve relevant chunks
    const results = await vectorStore.similaritySearch(question, 3);

    const context = results.map(r => r.pageContent).join("\n");

    // 2. Send to LLM
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Answer only from the provided context. If not found, say you don't know."
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ]
    });

    const answer = response.choices[0].message.content;

    res.json({
      answer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;