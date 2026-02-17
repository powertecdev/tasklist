import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import commentRoutes from "./routes/commentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log("\n🚀 Server rodando em http://localhost:" + env.PORT);
  console.log("📊 Health check: http://localhost:" + env.PORT + "/api/health");
  console.log("🌍 Ambiente: " + env.NODE_ENV + "\n");
});

export default app;
