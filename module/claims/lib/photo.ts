import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

export type PhotoSource = "camera" | "gallery";

export class CameraPermissionError extends Error {
  constructor() {
    super("camera-permission-denied");
    this.name = "CameraPermissionError";
  }
}

/** True when the native plugin should be used (web falls back to a file input, which the browser prompts for itself). */
export const isNativeCamera = () => Capacitor.isNativePlatform();

async function ensureCameraPermission() {
  const status = await Camera.checkPermissions();
  if (status.camera === "granted") return true;
  const req = await Camera.requestPermissions({ permissions: ["camera"] });
  return req.camera === "granted";
}

async function webPathToFile(webPath: string): Promise<File> {
  const blob = await (await fetch(webPath)).blob();
  const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  return new File([blob], `claim-${Date.now()}.${ext}`, { type: blob.type || "image/jpeg" });
}

/**
 * Native-only: asks for camera permission (camera source), opens the camera or
 * gallery and resolves to the picked image, or `null` if the user cancelled.
 * Throws {@link CameraPermissionError} when the camera permission is refused.
 */
export async function pickNativePhoto(source: PhotoSource): Promise<File | null> {
  try {
    if (source === "camera") {
      if (!(await ensureCameraPermission())) throw new CameraPermissionError();
      const result = await Camera.takePhoto({ quality: 80, correctOrientation: true });
      return result.webPath ? await webPathToFile(result.webPath) : null;
    }

    const { results } = await Camera.chooseFromGallery({});
    const first = results[0];
    return first?.webPath ? await webPathToFile(first.webPath) : null;
  } catch (err) {
    if (err instanceof CameraPermissionError) throw err;
    const message = err instanceof Error ? err.message.toLowerCase() : "";
    if (message.includes("cancel")) return null; // user backed out of the picker
    if (message.includes("permission") || message.includes("denied")) {
      throw new CameraPermissionError();
    }
    throw err;
  }
}
