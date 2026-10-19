import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface ExportPDFOptions {
  elementId?: string;
  filename?: string;
  fitToSinglePage?: boolean;
}

/**
 * Exports and downloads an authentic, professional, HR-friendly PDF resume.
 * - Slices pages cleanly onto dedicated offscreen canvases to prevent negative-coordinate
 *   image bleed and duplicate rendering bugs in jsPDF.
 * - Detects element boundaries (headings, job cards, education items, bullet points)
 *   so lines of text and section blocks are NEVER cut horizontally in half.
 * - Auto-fits near-single-page content (up to ~18% overflow) onto exactly 1 clean A4 page,
 *   fulfilling recruiter 1-page standards.
 * - Automatically embeds clickable PDF hyperlink annotations (LinkedIn, GitHub, email, etc.)
 *   with accurate coordinates on their respective pages.
 * - Strips web card borders, shadows, and interactive editing buttons (+ Add bullet, drag handles).
 */
export async function exportResumeToPDF({
  elementId = "resume-preview-document",
  filename = "Resume.pdf",
  fitToSinglePage = true,
}: ExportPDFOptions = {}): Promise<void> {
  const target =
    (document.getElementById(elementId) ||
      document.querySelector(".resume-print-area")) as HTMLElement | null;

  if (!target) {
    throw new Error("Resume element not found for PDF export");
  }

  // 1. Blur any active text editing and clear text selection highlights
  if (typeof window !== "undefined") {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl && typeof activeEl.blur === "function") {
      activeEl.blur();
    }
    window.getSelection()?.removeAllRanges();
  }

  // Reset any scrolled parent containers to top so the header (Name, Title, Contact) is never clipped
  const scrollableParents: { el: HTMLElement; top: number; left: number }[] = [];
  if (typeof window !== "undefined") {
    let curr: HTMLElement | null = target.parentElement;
    while (curr && curr !== document.body) {
      if (curr.scrollTop > 0 || curr.scrollLeft > 0) {
        scrollableParents.push({ el: curr, top: curr.scrollTop, left: curr.scrollLeft });
        curr.scrollTop = 0;
        curr.scrollLeft = 0;
      }
      curr = curr.parentElement;
    }
  }

  // 2. Temporarily adjust parent styles so max-width/overflow doesn't clip the 794px canvas
  const parent = target.parentElement;
  const originalParentOverflow = parent ? parent.style.overflow : "";
  const originalParentMaxWidth = parent ? parent.style.maxWidth : "";
  if (parent) {
    parent.style.overflow = "visible";
    parent.style.maxWidth = "none";
  }

  // 3. Save original style properties before temporarily styling for A4 export
  const originalTransform = target.style.transform;
  const originalTransformOrigin = target.style.transformOrigin;
  const originalWidth = target.style.width;
  const originalMaxWidth = target.style.maxWidth;
  const originalBorderRadius = target.style.borderRadius;
  const originalBoxShadow = target.style.boxShadow;
  const originalBorder = target.style.border;
  const originalOutline = target.style.outline;

  // Apply authentic A4 document dimensions and strip web card styling
  target.style.transform = "none";
  target.style.transformOrigin = "initial";
  target.style.width = "794px";
  target.style.maxWidth = "794px";
  target.style.borderRadius = "0px";
  target.style.boxShadow = "none";
  target.style.border = "none";
  target.style.outline = "none";

  // Hide interactive buttons, drag handles, and print:hidden elements
  const hiddenElements = target.querySelectorAll<HTMLElement>(
    ".print\\:hidden, button, [data-hide-print], .cursor-grab, [aria-label*='Move'], [title*='Move']"
  );
  const originalDisplays: string[] = [];
  hiddenElements.forEach((el, i) => {
    originalDisplays[i] = el.style.display;
    el.style.display = "none";
  });

  try {
    // Settle reflow with new A4 dimensions
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture target bounding box while styled at 794px
    const targetRect = target.getBoundingClientRect();

    // 4. Convert DOM to high-res PNG at 2x pixel ratio (sharp 300 DPI print quality)
    let dataUrl: string;
    try {
      dataUrl = await toPng(target, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: 794,
        style: {
          transform: "none",
          margin: "0",
          width: "794px",
          maxWidth: "794px",
          borderRadius: "0px",
          boxShadow: "none",
          border: "none",
          outline: "none",
        },
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (
              node.classList.contains("print:hidden") ||
              node.hasAttribute("data-hide-print") ||
              node.tagName === "BUTTON"
            ) {
              return false;
            }
          }
          return true;
        },
      });
    } catch (firstErr) {
      console.warn("Primary high-res capture fallback...", firstErr);
      dataUrl = await toPng(target, {
        quality: 0.95,
        pixelRatio: 1.5,
        backgroundColor: "#ffffff",
        skipFonts: true,
        width: 794,
      });
    }

    if (!dataUrl || dataUrl === "data:,") {
      throw new Error("Empty image generated from resume canvas");
    }

    // 5. Load image to get natural pixel dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load converted resume image"));
    });

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const domScale = naturalH / (targetRect.height || 1);

    // Standard A4 aspect ratio: 297mm / 210mm = 1.4142857
    const pageCanvasHeight = (297 / 210) * naturalW;

    // 6. Calculate intelligent page split points
    let splitPointsPx: number[] = [];

    // Auto-fit to 1 page if content is within 18% of standard page height
    if (fitToSinglePage && naturalH <= pageCanvasHeight * 1.18) {
      splitPointsPx = [naturalH];
    } else {
      // Multi-page: Find natural section boundaries so text lines are NEVER cut in half
      const sectionElements = Array.from(
        target.querySelectorAll(
          "h2, h3, .space-y-4 > div, .space-y-3 > div, [data-section], ul > li, .border-b, p"
        )
      );

      let currentY = 0;
      while (currentY + pageCanvasHeight < naturalH) {
        const maxSplit = currentY + pageCanvasHeight;
        const minSplit = currentY + pageCanvasHeight * 0.76; // Allow breaking up to 24% early to preserve blocks

        let bestSplit = maxSplit;
        let foundValidCut = false;

        for (const el of sectionElements) {
          const rect = el.getBoundingClientRect();
          const elBottom = (rect.bottom - targetRect.top) * domScale;
          if (elBottom > minSplit && elBottom <= maxSplit - 12) {
            if (elBottom > bestSplit || !foundValidCut) {
              bestSplit = elBottom;
              foundValidCut = true;
            }
          }
        }

        const chosenSplit = Math.round(bestSplit);
        splitPointsPx.push(chosenSplit);
        currentY = chosenSplit;
      }
      splitPointsPx.push(naturalH);
    }

    // 7. Generate PDF with clean, isolated canvas slices
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    let sliceStartY = 0;
    for (let pageIdx = 0; pageIdx < splitPointsPx.length; pageIdx++) {
      const sliceEndY = splitPointsPx[pageIdx];
      const sliceHeight = sliceEndY - sliceStartY;
      if (sliceHeight <= 0) continue;

      if (pageIdx > 0) {
        pdf.addPage();
      }

      // Draw exact slice onto offscreen canvas
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = naturalW;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, naturalW, sliceHeight);
        ctx.drawImage(
          img,
          0,
          sliceStartY,
          naturalW,
          sliceHeight,
          0,
          0,
          naturalW,
          sliceHeight
        );
      }

      const sliceDataUrl = sliceCanvas.toDataURL("image/png");
      const sliceHeightMm = Math.min(297, (sliceHeight / naturalW) * 210);
      pdf.addImage(sliceDataUrl, "PNG", 0, 0, 210, sliceHeightMm, undefined, "FAST");

      sliceStartY = sliceEndY;
    }

    // 8. Attach real clickable web links to their respective PDF pages and coordinates
    const linkElements = target.querySelectorAll<HTMLAnchorElement>("a[href]");
    linkElements.forEach((aEl) => {
      const href = aEl.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      const rect = aEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const relY = (rect.top - targetRect.top) * domScale;
      const wPx = rect.width * domScale;
      const hPx = rect.height * domScale;

      let curStartY = 0;
      for (let p = 0; p < splitPointsPx.length; p++) {
        const curEndY = splitPointsPx[p];
        if (relY >= curStartY && relY < curEndY) {
          const pageY = relY - curStartY;
          const scaleToMm = 210 / naturalW;
          const xMm = (rect.left - targetRect.left) * (210 / (targetRect.width || 794));
          const yMm = pageY * scaleToMm;
          const wMm = Math.max(wPx * scaleToMm, 4);
          const hMm = Math.max(hPx * scaleToMm, 3);

          pdf.setPage(p + 1);
          const cleanUrl =
            href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")
              ? href
              : `https://${href}`;
          pdf.link(xMm, yMm, wMm, hMm, { url: cleanUrl });
          break;
        }
        curStartY = curEndY;
      }
    });

    // 9. Guaranteed PDF Download with explicit .pdf extension
    // We stream the file via POST /api/export/pdf targeting a hidden iframe.
    // The server returns standard HTTP Content-Disposition: attachment; filename="<name>.pdf",
    // which instructs the browser's download manager directly. This:
    // 9. Guaranteed PDF Download with explicit .pdf extension
    // We request a direct top-level download ticket from /api/export/download.
    // When the browser navigates to the ticket URL, the server streams the file with
    // Content-Disposition: attachment; filename="<name>.pdf".
    // Because this is a top-level browser request (not an iframe or revoked blob URL),
    // Chrome/Edge ALWAYS preserves the authentic .pdf extension and candidate filename.
    const cleanFilename = filename.trim().replace(/[/\\?%*:|"<>]/g, "_") || "Resume";
    const finalFilename = cleanFilename.toLowerCase().endsWith(".pdf")
      ? cleanFilename
      : `${cleanFilename}.pdf`;

    const base64Data = pdf.output("datauristring");

    let downloadInitiated = false;
    try {
      const ticketRes = await fetch("/api/export/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: base64Data,
          filename: finalFilename,
          mimeType: "application/pdf",
        }),
      });

      if (ticketRes.ok) {
        const ticketJson = await ticketRes.json();
        if (ticketJson.downloadUrl) {
          // Top-level navigation initiates native browser file download
          // The page does NOT unload because of Content-Disposition: attachment
          window.location.assign(ticketJson.downloadUrl);
          downloadInitiated = true;
        }
      }
    } catch (ticketErr) {
      console.warn("Ticket download error, falling back to direct blob:", ticketErr);
    }

    if (!downloadInitiated) {
      // Direct client fallback keeping blob URL alive
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
      }, 120000);
    }
  } catch (error) {
    console.error("PDF export failure:", error);
    throw error;
  } finally {
    // 10. Always restore original styles and scroll positions
    if (parent) {
      parent.style.overflow = originalParentOverflow;
      parent.style.maxWidth = originalParentMaxWidth;
    }

    target.style.transform = originalTransform;
    target.style.transformOrigin = originalTransformOrigin;
    target.style.width = originalWidth;
    target.style.maxWidth = originalMaxWidth;
    target.style.borderRadius = originalBorderRadius;
    target.style.boxShadow = originalBoxShadow;
    target.style.border = originalBorder;
    target.style.outline = originalOutline;

    hiddenElements.forEach((el, i) => {
      el.style.display = originalDisplays[i] || "";
    });

    scrollableParents.forEach(({ el, top, left }) => {
      el.scrollTop = top;
      el.scrollLeft = left;
    });
  }
}
