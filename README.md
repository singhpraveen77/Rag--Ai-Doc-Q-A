# AI Document Q&A System (RAG)(In-Progress)

A backend application that implements **Retrieval-Augmented Generation (RAG)** to answer questions based on uploaded documents.
The system extracts text from PDF files, converts it into embeddings, stores them in a vector database, and retrieves relevant context to generate AI-based responses.

---

## Features

* Upload PDF documents
* Extract and process document text
* Split text into chunks for efficient retrieval
* Generate embeddings using LLM embeddings
* Store embeddings in a vector database
* Perform similarity search for relevant document chunks
* Generate answers using an LLM based on retrieved context

---

## Tech Stack

* **Node.js**
* **Express.js**
* **LangChain**
* **OpenAI API**
* **Chroma Vector Database**
* **Multer** (file upload)
* **pdf-parse** (PDF text extraction)

---

## Project Structure

```
rag-document-qa
│
├── routes
│   ├── upload.js
│   └── ask.js
│
├── utils
│   └── vectorStore.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## How It Works

1. A user uploads a PDF document.
2. The server extracts text from the document.
3. The text is split into smaller chunks.
4. Each chunk is converted into vector embeddings.
5. Embeddings are stored in a vector database.
6. When a user asks a question:

   * The question is converted into an embedding.
   * The system retrieves the most similar document chunks.
   * These chunks are sent to the LLM as context.
7. The LLM generates a response based on the retrieved context.

---

## API Endpoints

### Upload Document

POST `/upload`

Upload a PDF file to process and store embeddings.

Example (form-data):

```
file: document.pdf
```

---

### Ask Question

POST `/ask`

Request body:

```json
{
  "question": "What is this document about?"
}
```

Response:

```json
{
  "answer": "Generated response based on document context."
}
```

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/yourusername/rag-document-qa.git
cd rag-document-qa
```

### 2. Install dependencies

```
npm install
```

### 3. Add environment variables

Create a `.env` file in the root directory:

```
OPENAI_API_KEY=your_api_key_here
```

### 4. Run the server

```
npm run dev
```

Server will start on:

```
http://localhost:3000
```

---

## Future Improvements

* Persistent vector database storage
* Support for multiple documents
* Improved document chunking strategies
* Frontend interface for chat interaction
* Authentication and document management

---

## Author

Praveen Singh

Backend Developer | MERN Stack | AI Applications
