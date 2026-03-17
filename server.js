import "dotenv/config";
import express from "express";

import uploadRoute from "./routes/upload.js";
import askRoute from "./routes/ask.js";

const app = express();

app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/ask", askRoute);
app.use("/", (req,res)=>{
    return res.send("working !!")
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});