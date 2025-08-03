import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

const connectionOptions = process.env.REDIS_URL || {
    host: "localhost",
    port: 6379,
};

const worker = new Worker(
    "pdf-queue",
    async (job) => {
        try {
            const { path } = job.data;

            console.log(`📄 Processing PDF: ${path}`);

            // 1. Load PDF
            const loader = new PDFLoader(path);
            const docs = await loader.load();

            // 2. Chunk the text
            const splitter = new CharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 50,
            });

            const chunks = await splitter.splitDocuments(docs);
            console.log(`📚 Split into ${chunks.length} chunks`);

            // 3. Setup Qdrant + Hugging Face Embeddings
            const client = new QdrantClient({ url: process.env.QDRANT_URL });

            const embeddings = new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HF_API_KEY,
                model: "sentence-transformers/all-MiniLM-L6-v2", // fast and accurate
            });

            const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
                url: process.env.QDRANT_URL,
                collectionName: "pdf-collection",
            });

            // 4. Store chunks in Qdrant
            await vectorStore.addDocuments(chunks);

            console.log(`✅ Added ${chunks.length} chunks to Qdrant`);
        } catch (err) {
            console.error("❌ Error processing PDF:", err);
        }
    },
    {
        connection: connectionOptions,
    }
);
