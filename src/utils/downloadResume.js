/* ============================================================
   downloadResume.js — Generate and download a high-quality PDF
   resume using html2pdf.js (html2canvas + jsPDF)
   ============================================================ */
import html2pdf from 'html2pdf.js'

/**
 * Renders the resume DOM element to a proper PDF and triggers
 * a browser download with the filename "Om_Karande_Resume.pdf".
 *
 * @param {HTMLElement} element - The root resume container DOM node
 * @returns {Promise<void>}
 */
export default function downloadResume(element) {
    if (!element) {
        console.error('[downloadResume] No element provided')
        return Promise.reject(new Error('No resume element to render'))
    }

    // Fine-tuned options for a crisp, professional PDF
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5], // top, right, bottom, left (in inches)
        filename: 'Om_Karande_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2.5,          // high-DPI capture
            useCORS: true,
            letterRendering: true,
            logging: false,
        },
        jsPDF: {
            unit: 'in',
            format: 'letter',          // US Letter (8.5×11")
            orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }

    return html2pdf().set(opt).from(element).save()
}
