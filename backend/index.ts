import express from "express";
import cors from "cors";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Queue } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// ---- CONFIG: OpenAI via OpenRouter ----
const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // change this to your frontend
        "X-Title": "RAG PDF Chat App",
    },
});

// ---- Embedding Setup ----
const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
});  

// ---- Vector Store ----
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "pdf-collection",
});

// ---- BullMQ (Optional) ----
const queue = new Queue("pdf-queue", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

// ---- File Upload Setup ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") cb(null, true);
        else cb(new Error("Only PDF files allowed"));
    },
});

// ---- Upload Endpoint ----
app.post("/upload", upload.single("pdf"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // queue background processing
    await queue.add("process-pdf", {
        filename: req.file.filename,
        path: req.file.path,
    });

    res.json({ message: "PDF uploaded", file: req.file.filename });
});

// ---- Files Read Endpoint ----
app.get("/files", (req, res) => {
  const files = fs.readdirSync(uploadDir).filter((f) => f.endsWith(".pdf"));

  const result = files.map((filename) => ({
    name: filename,
    uploadedAt: fs.statSync(path.join(uploadDir, filename)).birthtime,
  }));

  res.json(result);
});

// ---- Serve Uploaded PDFs ----
app.get("/pdf/:name", (req, res) => {
    const filePath = path.join(uploadDir, req.params.name);
    res.sendFile(filePath);
});  

// ---- Chat Endpoint ----
app.post("/chat", async (req, res) => {
    const query = req.body.question;
    if (!query) return res.status(400).json({ error: "No question provided" });

    try {
        const results = await vectorStore.similaritySearch(query, 5);
        const context = results.map((doc) => doc.pageContent).join("\n");

        const SYSTEM_PROMPT = `You are a helpful assistant. Use the context below to answer the question. If you're unsure, say "I don't know".`;

        const response = await client.chat.completions.create({
            model: "deepseek/deepseek-r1:free", // or "openai/gpt-3.5-turbo"
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Context:\n${context}\n\nUser: ${query}`,
                },
            ],
        });

        const answer = response.choices?.[0]?.message?.content || "No answer generated.";
        res.json({ message: answer, docs: results });
    } catch (err) {
        console.error("❌ Error in /chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});  

// ---- Start Server ----
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
