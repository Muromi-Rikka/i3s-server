import type { SLPKArchive } from "@loaders.gl/i3s";
import { parseSLPKArchive } from "@loaders.gl/i3s";
import { FileHandleFile } from "@loaders.gl/loader-utils";
import { readdirSync } from "node:fs";
import { resolve } from "pathe";
import { filename } from "pathe/utils";
import { joinURL } from "ufo";
import "@loaders.gl/polyfills";

/**
 * Path to directory containing SLPK files
 * Uses SCENE_PATH environment variable or defaults to './scene'
 */
const scenePath = Bun.env.SCENE_PATH || "./scene";
/**
 * In-memory record storing loaded SLPK archives
 * Key: Archive name (from filename)
 * Value: Parsed SLPKArchive object
 */
const slpkArchiveRecord: Record<string, SLPKArchive> = {};

/**
 * Retrieves a specific file from a loaded SLPK archive
 *
 * @param id - Archive ID (name) to retrieve from
 * @param url - File path within the archive to retrieve
 * @returns Promise resolving to file content (ArrayBuffer) or null if not found
 */
export async function getArchiveById(id: string, url: string) {
  const trimmedPath = /^\/?(.*)\/?$/.exec(url);
  if (trimmedPath && slpkArchiveRecord[id]) {
    try {
      return await slpkArchiveRecord[id].getFile(trimmedPath[1], "http");
    }
    catch {
      // TODO - log error?
    }
  }
  else {
    const updateFile = readdirSync(scenePath).filter(file => file.endsWith(".slpk")).find(item => item === `${id}.slpk`);
    if (updateFile) {
      const filePath = joinURL(scenePath, updateFile);
      // eslint-disable-next-line no-console
      const archive = await parseSLPKArchive(new FileHandleFile(filePath), message => console.log(message));
      const archiveName = filename(filePath);
      if (archiveName) {
        // eslint-disable-next-line no-console
        console.log(`Archive record update: ${archiveName}`);
        slpkArchiveRecord[archiveName] = archive;
      }
    }
  }
  return null;
}

/**
 * Gets the list of loaded SLPK archive IDs
 *
 * @returns Array of archive IDs (names)
 */
export function getSceneList() {
  return Object.keys(slpkArchiveRecord);
}

/**
 * Loads and parses SLPK archives from a specified directory, storing them in memory
 *
 * @returns Promise resolving when all archives are loaded
 */
export async function loadArchiveRecord(): Promise<void> {
  const fileList = readdirSync(scenePath).filter(file => file.endsWith(".slpk")).map(file => joinURL(scenePath, file));
  for (const file of fileList) {
    // eslint-disable-next-line no-console
    const archive = await parseSLPKArchive(new FileHandleFile(file), message => console.log(message));
    const archiveName = filename(file);
    if (archiveName) {
      // eslint-disable-next-line no-console
      console.log(`Archive record loaded: ${archiveName}`);
      slpkArchiveRecord[archiveName] = archive;
    }
  }
}

/**
 * Saves a scene file to the configured scene directory
 *
 * @param file - The File object containing scene data to save
 * @returns {Promise<void>} Resolves when file is saved or if it already exists
 * @description Checks if the file exists in the scene directory first. If not,
 *              writes the file content to the directory using Bun's file system API
 */
export async function saveScene(file: File) {
  const _file = Bun.file(resolve(scenePath, file.name));
  if (!await _file.exists()) {
    await _file.write(await file.arrayBuffer());
  }
}
