import express from "express";
import Groq from "groq-sdk";
import { queryVectorStore } from "../utils/vectorStore.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const chunks = await queryVectorStore(question, 3);
    if (!chunks.length) {
      return res.status(404).json({ error: "No documents uploaded yet" });
    }

    const context = chunks.join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant. Answer ONLY from the provided context. If the answer is not in the context, say 'I don't know'.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const answer = completion.choices[0]?.message?.content || "I don't know";
    return res.json({ answer });

  } catch (err) {
    console.error("ASK ERROR:", err.message);
    return res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

export default router;
