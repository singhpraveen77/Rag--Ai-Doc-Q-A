import "dotenv/config";
import express from "express";
import cors from "cors";

import uploadRoute from "./routes/upload.js";
import askRoute from "./routes/ask.js";

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/upload", uploadRoute);

app.use("/ask", askRoute);
app.use("/", (req,res)=>{
    return res.send("working !!")
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Allow up to 90s for slow Gemini responses
server.timeout = 90000;