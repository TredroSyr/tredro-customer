import { jsPDF } from "jspdf";

/**
 * Rasterizes a DOM node (rendered off-screen at a fixed print width) into a multi-page A4 PDF.
 * Arabic text has no reliable font/shaping support in jsPDF's native text API, so the invoice is
 * drawn as normal HTML/CSS on screen and captured as an image instead — what you see is what ships.
 */
export async function renderNodeToPdfBlob(node: HTMLElement): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas-pro");
  const canvas = await html2canvas(node, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const pxPerPdfPt = canvas.width / imgWidth;
  const pageHeightPx = pageHeight * pxPerPdfPt;

  let renderedHeightPx = 0;
  let pageIndex = 0;

  while (renderedHeightPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedHeightPx);

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    const ctx = pageCanvas.getContext("2d")!;
    ctx.drawImage(canvas, 0, renderedHeightPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.82), "JPEG", 0, 0, imgWidth, sliceHeightPx / pxPerPdfPt);

    renderedHeightPx += sliceHeightPx;
    pageIndex += 1;
  }

  return pdf.output("blob");
}
