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

const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((allowed) => origin === allowed || origin.endsWith(".vercel.app"))) {
      callback(null, true);
    } else {
      console.log("CORS bloqueado para:", origin);
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log("\n🚀 Server rodando em http://localhost:" + env.PORT);
  console.log("🌍 CORS: " + allowedOrigins.join(", ") + " + *.vercel.app");
  console.log("🌍 Ambiente: " + env.NODE_ENV + "\n");
});

export default app;
