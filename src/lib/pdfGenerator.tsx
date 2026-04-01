import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";
import { createRoot } from "react-dom/client";
import PdfTemplate, { ReportData } from "../components/PdfTemplate";

export async function generateClientPdf(data: ReportData, onProgress?: (progress: number) => void): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			// 1. Create a hidden container securely
			const container = document.createElement("div");
			container.style.position = "absolute";
			container.style.left = "-9999px";
			container.style.top = "0";
			document.body.appendChild(container);

			// 2. Render the React component into it
			const root = createRoot(container);
			
			// Render asynchronously and wait for DOM updates
			root.render(<PdfTemplate data={data} />);
			
			// Wait for React to mount and images to decode (using a generous timeout since it's hidden)
			await new Promise((res) => setTimeout(res, 1500));

			// 3. Find all pages
			const pages = container.querySelectorAll('.pdf-page');
			if (pages.length === 0) {
				root.unmount();
				document.body.removeChild(container);
				throw new Error("Failed to render PDF template pages");
			}

			// 4. Initialize jsPDF
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			});

			const totalPages = pages.length;

			// 5. Loop and capture each page
			for (let i = 0; i < totalPages; i++) {
				const pageEl = pages[i] as HTMLElement;
				
				// Optional progress callback (0 to 100)
				if (onProgress) {
					onProgress(Math.floor((i / totalPages) * 100));
				}

				const canvas = await html2canvas(pageEl, {
					scale: 2, // Double resolution for clearer text
					useCORS: true,
					allowTaint: true,
					backgroundColor: "#050510",
					logging: false,
					windowWidth: 794,
					windowHeight: 1123,
				});
				
				const imgData = canvas.toDataURL('image/jpeg', 0.95);
				
				if (i > 0) {
					pdf.addPage();
				}
				
				// A4 size: 210 x 297 mm
				pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
			}

			if (onProgress) {
				onProgress(100);
			}

			// 6. Cleanup
			root.unmount();
			document.body.removeChild(container);

			// 7. Output blob URL
			const blob = pdf.output("blob");
			const url = URL.createObjectURL(blob);
			resolve(url);
		} catch (error) {
			reject(error);
		}
	});
}
