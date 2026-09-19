import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function exportarFichaJugadorPdf(
    containerElement: HTMLElement,
    nombreJugador: string
): Promise<void> {
    if (!containerElement) return;

    // 1. Asegurar que todas las imágenes del contenedor estén totalmente cargadas
    const images = Array.from(containerElement.querySelectorAll("img"));
    await Promise.all(
        images.map((img) => {
            if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })
    );

    // 2. Renderizar contenedor con html2canvas-pro (soporta lab, oklch y Tailwind CSS v4)
    const canvas = await html2canvas(containerElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#f8fafc",
        onclone: (clonedDoc) => {
            // Reemplazar cualquier función de color lab() u oklch() en las hojas de estilo del clon
            const styleTags = Array.from(clonedDoc.querySelectorAll("style"));
            styleTags.forEach((styleTag) => {
                if (styleTag.textContent) {
                    styleTag.textContent = styleTag.textContent
                        .replace(/lab\([^)]+\)/g, "rgb(226, 232, 240)")
                        .replace(/oklch\([^)]+\)/g, "rgb(226, 232, 240)")
                        .replace(/oklab\([^)]+\)/g, "rgb(226, 232, 240)");
                }
            });
        },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfWidth = 210; // Ancho A4 en mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Crear PDF con jsPDF (alto proporcional)
    const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    // 3. Extraer enlaces interactivos y vincular las zonas cliqueables en el PDF
    const containerRect = containerElement.getBoundingClientRect();
    const links = Array.from(containerElement.querySelectorAll("a[href]"));

    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href !== "#" && !href.startsWith("javascript:")) {
            const rect = link.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const x = ((rect.left - containerRect.left) / containerRect.width) * pdfWidth;
                const y = ((rect.top - containerRect.top) / containerRect.height) * pdfHeight;
                const w = (rect.width / containerRect.width) * pdfWidth;
                const h = (rect.height / containerRect.height) * pdfHeight;

                pdf.link(x, y, w, h, { url: href });
            }
        }
    });

    // 4. Descargar PDF con nombre sanitizado
    const nombreLimpio = nombreJugador
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_");

    pdf.save(`Ficha_${nombreLimpio}.pdf`);
}
