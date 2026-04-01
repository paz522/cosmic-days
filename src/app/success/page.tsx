"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { getZodiacSign, generateSpiritualMessage, generateDeepMessage, type ApodData } from "../../lib/cosmic";
import { generateClientPdf } from "../../lib/pdfGenerator";
import type { ReportData } from "../../components/PdfTemplate";

function SuccessContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const date = searchParams.get("date") || "";

	const [loading, setLoading] = useState(true);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [downloadProgress, setDownloadProgress] = useState(0);

	useEffect(() => {
		if (!sessionId && !date) {
			setError("Session ID or date missing");
			setLoading(false);
			return;
		}

		const generatePdf = async () => {
			try {
				// JSONデータを取得
				const url = `/api/report-data?session_id=${sessionId}${date ? `&date=${date}` : ""}`;
				const response = await fetch(url);

				if (!response.ok) {
					const errorData = await response.json() as { error?: string };
					throw new Error(errorData.error || "Failed to gather cosmic data");
				}

				const reportData = await response.json() as ReportData;
				
				// クライアントサイドでPDFを生成し、進捗をプログレスバーに反映
				const pdfUrl = await generateClientPdf(reportData, (progress) => {
					setDownloadProgress(Math.floor(progress));
				});

				setPdfUrl(pdfUrl);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		generatePdf();
	}, [sessionId, date]);

	const handleDownload = () => {
		if (pdfUrl) {
			const link = document.createElement("a");
			link.href = pdfUrl;
			link.download = `cosmic-days-report-${date}.pdf`;
			link.click();
		}
	};


	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] starry-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
			{/* 背景の星 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "0.4s" }}></div>
				<div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: "1.8s" }}></div>
				<div className="absolute bottom-20 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: "2.6s" }}></div>
				<div className="absolute bottom-10 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: "0.7s" }}></div>
				<div className="absolute top-1/3 right-1/5 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: "1.3s" }}></div>
				<div className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-cyan-200 rounded-full animate-twinkle" style={{ animationDelay: "2.9s" }}></div>
			</div>

			<main className="flex flex-col items-center gap-12 max-w-lg w-full relative z-10">
				<div className="text-center animate-float mb-4">
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-cosmic">
						CosmicDays
					</h1>
					<p className="text-purple-300/60 text-xs tracking-[0.3em] uppercase mt-2 font-medium">
						Divine Cosmic Report
					</p>
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center w-full relative">
						{/* Loading Shooting Stars */}
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							<div className="shooting-star" style={{ top: "10%", right: "10%", animationDelay: "0s", animationDuration: "2s" }}></div>
							<div className="shooting-star" style={{ top: "30%", right: "20%", animationDelay: "1.2s", animationDuration: "3s" }}></div>
							<div className="shooting-star" style={{ top: "50%", right: "5%", animationDelay: "2.5s", animationDuration: "2.5s" }}></div>
							<div className="shooting-star" style={{ top: "70%", right: "25%", animationDelay: "0.8s", animationDuration: "4s" }}></div>
							<div className="shooting-star" style={{ top: "20%", right: "40%", animationDelay: "3.5s", animationDuration: "2.2s" }}></div>
						</div>

						<div className="flex flex-col items-center gap-8 z-10 w-full">
							<div className="relative">
								<div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-lg font-bold text-purple-400">{Math.round(downloadProgress)}%</span>
								</div>
							</div>
							<div className="text-center w-full space-y-4">
								<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
									Generating Cosmic Report
								</h2>
								
								<div className="w-full bg-purple-900/20 rounded-full h-3 overflow-hidden border border-purple-500/30 backdrop-blur-sm">
									<div 
										className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full transition-all duration-300 ease-out"
										style={{ width: `${downloadProgress}%` }}
									></div>
								</div>
								
								<p className="text-purple-300/80 text-sm tracking-widest animate-cosmic">
									Deciphering whispers of the stars...
								</p>
							</div>
						</div>
					</div>
				)}

				{error && (
					<div className="bg-red-900/20 border border-red-500/50 backdrop-blur-md rounded-2xl p-8 w-full text-center">
						<p className="text-red-400 font-medium">{error}</p>
						<button 
							onClick={() => window.location.reload()}
							className="mt-4 text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
						>
							Retry
						</button>
					</div>
				)}

				{pdfUrl && !loading && (
					<div className="w-full space-y-8 animate-in fade-in zoom-in duration-700">
						<div className="bg-gradient-to-br from-purple-900/40 via-[#1a1a2e]/60 to-blue-900/40 backdrop-blur-xl border border-purple-500/30 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden group">
							<div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none"></div>
							<div className="relative z-10">
								<div className="text-6xl mb-6 animate-float inline-block">✨</div>
								<h1 className="text-white font-bold text-3xl leading-tight mb-4">
									Your Cosmic Report<br/>is ready
								</h1>
								<p className="text-purple-200/70 text-lg tracking-wide">
									The soul navigation chart has arrived
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-4 px-2">
							<button
								onClick={handleDownload}
								className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-white/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
							>
								<span className="text-2xl group-hover:animate-bounce">⬇️</span>
								Download PDF
							</button>

							<a
								href={`https://x.com/intent/post?text=${encodeURIComponent("I received a message from the universe given at my birth ✨ @CosmicDays 🚀")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full py-5 rounded-2xl bg-[#0a0a0a] text-white font-bold text-lg hover:bg-neutral-900 transition-all border border-white/10 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
							>
								<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
								Share on X
							</a>

							<a
								href="/"
								className="w-full py-4 rounded-2xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition-all border border-white/5 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4 text-sm"
							>
								<span>←</span> Back to top
							</a>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default function SuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
				<div className="text-white text-xl animate-pulse">Loading...</div>
			</div>
		}>
			<SuccessContent />
		</Suspense>
	);
}
