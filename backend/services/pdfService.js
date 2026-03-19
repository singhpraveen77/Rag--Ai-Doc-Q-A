import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export class PdfExtractionError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "PdfExtractionError";
    this.cause = cause;
  }
}

/**
 * Extract plain text from a PDF file on disk using pdfjs-dist.
 * @param {string} filePath - Absolute or relative path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
export async function extractText(filePath) {
  try {
    console.log(`[PdfService] Reading file buffer: ${filePath}`);
    const dataBuffer = await fs.readFile(filePath);
    
    // In node, we need to pass a Uint8Array to pdf-js
    const data = new Uint8Array(dataBuffer);
    
    console.log("[PdfService] Loading PDF document...");
    const loadingTask = pdfjsLib.getDocument({
      data: data,
      useWorkerFetch: false,
      isEvalSupported: false,
      nativeImageDecoderSupport: 'none'
    });
    
    const pdf = await loadingTask.promise;
    console.log(`[PdfService] PDF loaded. Pages: ${pdf.numPages}`);
    
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
    }
    
    if (!fullText || fullText.trim().length === 0) {
      throw new PdfExtractionError("PDF contains no extractable text");
    }
    
    console.log(`[PdfService] Extraction successful. Chars: ${fullText.length}`);
    return fullText;
  } catch (err) {
    console.error("[PdfService] Error during extraction:", err.message);
    throw new PdfExtractionError("Failed to extract text using pdfjs-dist", err);
  }
}