import express from "express";
import multer from "multer";
import { extractText } from "../services/pdfService.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createVectorStore } from "../utils/vectorStore.js";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    console.log("--- Upload Request Received ---");
    if (!req.file) {
      console.warn("No file uploaded in the request.");
      return res.status(400).json({ error: "Please upload a PDF file" });
    }

    console.log(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
    const filePath = req.file.path;
    
    console.log("Extracting text from PDF...");
    const text = await extractText(filePath);
    console.log(`Text extraction complete. Characters: ${text.length}`);

    console.log("Splitting text into documents...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.createDocuments([text]);
    console.log(`Split into ${splitDocs.length} chunks.`);

    console.log("Initializing Vector Store creation...");
    const sessionId = await createVectorStore(splitDocs);
    console.log("Vector Store successfully created.");

    // Clean up uploaded file
    console.log(`Removing temporary file: ${filePath}`);
    fs.unlinkSync(filePath);

    console.log("--- Upload Process Complete ---");
    res.json({ message: "File uploaded and processed successfully", sessionId });
  } catch (err) {
    console.error("!!! Error during upload process !!!");
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    res.status(500).json({ error: `Failed to process PDF: ${err.message}` });
  }
});


export default router;