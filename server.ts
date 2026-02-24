import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { corsMiddleware } from "./config/cors";
import { loadEnv } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import v1Router from "./routes/v1";
import { legacyRouter } from "./routes/legacy";

const env = loadEnv();
const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(morgan("dev"));

// API versions
app.use("/v1", v1Router);
// Legacy compatibility for existing frontend (root paths)
app.use("/", legacyRouter);

// Legacy compatibility for existing frontend (supabase function paths)
app.use("/make-server-628f7fac", legacyRouter);

// Legacy compatibility for existing frontend (supabase function paths)
app.use("/make-server-628f7fac", legacyRouter);

// Health root
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

export default app;
