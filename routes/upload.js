import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import { createVectorStore } from "../utils/vectorStore.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(dataBuffer);

    const docs = [
      {
        pageContent: pdfData.text,
        metadata: {}
      }
    ];

    await createVectorStore(docs);

    res.json({ message: "Document processed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing PDF" });
  }
});

export default router;