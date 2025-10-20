import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 

// Load .env paling awal
dotenv.config();

import authRoutes from "../backend/routes/auth.js";
import historyRoutes from "../backend/routes/history.js";
import pelangganRoutes from "../backend/routes/pelanggan.js";
import stokRoutes from "../backend/routes/stok.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stok", stokRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/pelanggan", pelangganRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Export the Express API
export default app;