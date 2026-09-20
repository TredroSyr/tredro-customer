import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Saves the PDF to the device. In the native app it is written to the Documents folder (a WebView
 * ignores `<a download>`); on the web it triggers a normal browser download.
 * Returns where the file went so the caller can tell the user.
 */
export async function downloadInvoicePdf(blob: Blob, fileName: string): Promise<"device" | "browser"> {
  if (Capacitor.isNativePlatform()) {
    const base64 = await blobToBase64(blob);
    await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Documents, recursive: true });
    return "device";
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return "browser";
}
