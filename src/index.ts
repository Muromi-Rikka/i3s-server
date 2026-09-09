/**
 * Main entry point of the I3S Server application
 * Handles:
 * - SLPK archive loading
 * - Elysia server initialization
 * - Route registration
 */
import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { loadArchiveRecord } from "./controllers/slpk-controller";
import { SceneServerRoutes } from "./routes/scene-server.route";

/**
 * Initialize application flow:
 * 1. Load SLPK archives
 * 2. Start Elysia server
 * 3. Register scene server routes
 */
await loadArchiveRecord();

/**
 * Elysia application instance
 * Configured with CORS support
 * Includes root endpoint and scene server routes
 */
const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .listen(3000);

// Register scene server routes with the application
SceneServerRoutes(app);

// eslint-disable-next-line no-console
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
