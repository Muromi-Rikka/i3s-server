import type { SceneLayer3D } from "@loaders.gl/i3s";
import { v4 as uuid } from "uuid";

/**
 * Create `/SceneServer` response
 *
 * @param name - service name, custom user-friendly name of the service
 * @param layer - I3S layer JSON
 * @returns response JSON for `/SceneServer` route
 */
export function createSceneServer(name: string, layer: SceneLayer3D) {
  return {
    currentVersion: "10.7",
    layers: [layer],
    name,
    serviceItemId: uuid().replaceAll("-", ""),
    serviceName: name,
    serviceVersion: "1.8",
    supportedBindings: ["REST"],
  };
}
