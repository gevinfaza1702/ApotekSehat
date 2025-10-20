import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import stokRoutes from "./routes/stok.js";

// Load .env paling awal
dotenv.config();

import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js";
import pelangganRoutes from "./routes/pelanggan.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stok", stokRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/pelanggan", pelangganRoutes);

// Port dari .env atau default 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? "LOADED" : "MISSING"}`);
});
