import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import recipesRoutes from "./routes/recipes.js";
import friendsRoutes from "./routes/friends.js";
import aiRoutes from "./routes/ai.js";
import uploadsRoutes from "./routes/uploads.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow both web and mobile clients
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);
            if (corsOrigin === origin) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization", "x-session-token"],
    })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadsRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`🚀 Yes Chef API running on http://localhost:${PORT}`);
});
