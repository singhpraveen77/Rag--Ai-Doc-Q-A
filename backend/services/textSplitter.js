import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * Split raw text into overlapping chunks using RecursiveCharacterTextSplitter.
 * Configuration: chunkSize=1000, chunkOverlap=200
 * @param {string} text - Raw text to split
 * @returns {Promise<import("@langchain/core/documents").Document[]>} Array of LangChain Document objects
 */
export async function split(text) {
  // TODO: implement in Task 4
  throw new Error("Not implemented");
}
