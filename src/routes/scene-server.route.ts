import type { Elysia } from "elysia";
import destr from "destr";
import { t } from "elysia";
import { getArchiveById, getSceneList, saveScene } from "../controllers/slpk-controller";
import { createSceneServer } from "../utils/create-scene-server";

/**
 * Text decoder for converting ArrayBuffer to string
 */
const textDecoder = new TextDecoder();

/**
 * Registers scene server routes to an Elysia application instance
 *
 * @param app - Elysia application instance to register routes with
 */
export function SceneServerRoutes(app: Elysia) {
  /**
   * Get list of available SLPK scene archives
   *
   * GET /scene-list
   *
   * @returns {string[]} Array of scene archive IDs
   */
  app.get("/scene-list", () => {
    return getSceneList();
  });
  /**
   * Get root scene server metadata for a specific archive
   *
   * GET /:id/SceneServer/
   *
   * @param {string} params.id - SLPK archive ID
   */
  app.get("/:id/SceneServer/", async ({ params: { id }, status }) => {
    const file = await getArchiveById(id, "/");
    if (file) {
      const layer: any = destr(textDecoder.decode(file));
      return createSceneServer(layer.name, layer);
    }
    return status(404, "File Not Found");
  });
  /**
   * Get specific scene resource from an archive
   *
   * GET /:id/SceneServer/*
   *
   * @param {object} params - Route parameters
   * @param {string} params.id - SLPK archive ID
   * @param {string} path - Request path containing resource location
   * @returns {object|Buffer|404} Scene resource (JSON or binary) or 404 error
   */
  app.get("/:id/SceneServer/*", async ({ params: { id }, path, status }) => {
    const _path = path.split("SceneServer/layers/0", 2)[1].replace(/\/+$/, "");
    const file = await getArchiveById(id, _path);
    if (file) {
      try {
        return JSON.parse(textDecoder.decode(file));
      }
      catch {
        return Buffer.from(file);
      }
    }
    return status(404, "File Not Found");
  });

  /**
   * Upload endpoint for scene files
   *
   * POST /upload
   *
   * @param {File} body.file - The scene file to upload
   * @returns {string} Success message indicating upload completion
   * @description Handles file uploads by saving the provided scene file
   *              to the configured scene directory using saveScene function
   */
  app.post("/upload", async ({ body: { file } }) => {
    await saveScene(file);
    return "upload success";
  }, {
    body: t.Object({
      file: t.File(),
    }),
  });
}
