import express from "express";
import Groq from "groq-sdk";
import { queryVectorStore } from "../utils/vectorStore.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { question, sessionId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }
    if (!sessionId) {
      return res.status(400).json({ error: "No document session found. Please upload a document first." });
    }

    const chunks = await queryVectorStore(question, sessionId, 6);
    if (!chunks.length) {
      return res.status(404).json({ error: "No relevant content found in the document." });
    }

    const context = chunks.join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful document assistant. Answer the user's question using the provided context from the uploaded document.
Be specific and extract exact information (names, dates, numbers) when present.
If the answer is clearly not in the context, say "I couldn't find that information in the document."`,
        },
        {
          role: "user",
          content: `Context from document:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.1,
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
