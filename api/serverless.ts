import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Mount tRPC middleware. The Vercel rewrite in `vercel.json` routes
// all /api/* requests to this function, preserving the original path,
// so mounting at `/api/trpc` ensures compatibility with the client.
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default serverless(app);
