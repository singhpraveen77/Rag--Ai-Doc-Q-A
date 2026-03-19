import Groq from "groq-sdk";
import { queryVectorStore } from "../utils/vectorStore.js";

export class RagError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "RagError";
    this.cause = cause;
  }
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAnswer(question) {
  try {
    const chunks = await queryVectorStore(question, 5);
    if (!chunks.length) return "I don't know";

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

    const answer = completion.choices[0]?.message?.content?.trim();
    return answer?.length > 0 ? answer : "I don't know";
  } catch (err) {
    if (err instanceof RagError) throw err;
    throw new RagError(`Failed to generate answer: ${err.message}`, err);
  }
}
