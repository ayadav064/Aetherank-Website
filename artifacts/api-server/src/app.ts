import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { existsSync } from "fs";
import router, { sitemapRouter } from "./routes";
import { logger } from "./lib/logger";
import { runSeed } from "./seed";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sitemap & robots at root (not under /api)
app.use(sitemapRouter);

app.use("/api", router);

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const distDir = path.resolve(process.cwd(), "../aetherank-website/dist/public");
  if (existsSync(distDir)) {
    app.use(express.static(distDir));
    app.use((_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
    logger.info({ distDir }, "Serving static frontend");
  } else {
    logger.warn({ distDir }, "Frontend dist not found — only API routes available");
  }
}

// Run data seed on startup (inserts missing blog posts, syncs CMS settings)
runSeed().catch((err) => logger.error({ err }, "[seed] Startup seed failed"));

export default app;
