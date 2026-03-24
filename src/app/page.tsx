"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import SolarSystemInput from "@/components/SolarSystemInput";

export default function Home() {
	const router = useRouter();
	const [date, setDate] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (date) {
			router.push(`/preview?date=${date}`);
		}
	};

	const [year, month, day] = date ? date.split("-").map(Number) : [null, null, null];

	const today = new Date().toISOString().split("T")[0];

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] starry-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
			{/* 背景の星 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "0.3s" }}></div>
				<div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: "1.7s" }}></div>
				<div className="absolute bottom-20 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: "2.4s" }}></div>
				<div className="absolute bottom-10 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: "0.9s" }}></div>
				<div className="absolute top-1/3 left-1/2 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "3.1s" }}></div>
				<div className="absolute top-1/4 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: "1.2s" }}></div>
				<div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-cyan-200 rounded-full animate-twinkle" style={{ animationDelay: "2.8s" }}></div>
				<div className="absolute top-2/3 right-1/5 w-1 h-1 bg-orange-200 rounded-full animate-twinkle" style={{ animationDelay: "0.6s" }}></div>
			</div>

			<main className="flex flex-col items-center gap-8 max-w-2xl w-full relative z-10">
				<div className="text-center animate-float">
					<div className="flex flex-col items-center gap-4 mb-6">
						<div className="px-4 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm">
							CosmicDays
						</div>
						<h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-cosmic">
							CosmicDays
						</h1>
					</div>
					<p className="text-xl text-gray-300 leading-relaxed">
						The day your soul was guided by the stars
					</p>
					<p className="text-lg text-purple-300 mt-3">
						~ Receive a message from the universe ~
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full animate-aura rounded-2xl p-8 bg-[#1a1a2e]/50 backdrop-blur-sm border border-purple-500/30 shadow-2xl max-w-2xl">
					<div className="text-center mb-2">
						<label className="text-purple-100 text-lg font-bold tracking-wider uppercase">
							Cosmic Birth Date
						</label>
						<p className="text-purple-400/80 text-sm mt-1 px-4">
							Guide the planets to the moment your soul descended to Earth
						</p>
					</div>

					<SolarSystemInput value={date} onChange={setDate} />

					<div className="w-full flex flex-col gap-4">
						<div className="flex flex-col sm:flex-row gap-4 w-full">
							<div className="flex-1 text-center bg-purple-900/20 backdrop-blur-md px-4 py-4 rounded-2xl border border-purple-500/30 shadow-inner flex flex-col justify-center min-h-[80px]">
								<span className="text-purple-400/60 text-[10px] block mb-1 font-bold tracking-widest">SELECTED COSMIC DATE</span>
								<span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
									{year ? `${year}-${month}-${day}` : "Please select a date"}
								</span>
							</div>
							
							<button
								type="submit"
								disabled={!date}
								className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:bg-gray-800/50 disabled:text-gray-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95 border border-white/10 min-h-[80px] flex items-center justify-center"
							>
								✨ Open the Cosmic Door ✨
							</button>
						</div>

						<div className="flex justify-between items-center px-2">
							<div className="text-[10px] text-purple-400/40 flex gap-4 font-medium tracking-tighter">
								<span>🖱️ DRAG PLANETS</span>
								<span>🕒 TIME TRAVEL</span>
							</div>
							<p className="text-gray-500 text-[9px] text-right">
								*Cosmic data available from 1900 to present
							</p>
						</div>
					</div>
				</form>

				<p className="text-gray-500 text-sm text-center max-w-xs">
					The alignment of the stars speaks of your destiny
					<br />
					Let the cosmos reveal your destiny
				</p>

				<Link href="/tokushoho" className="text-gray-600 hover:text-purple-400 transition-colors text-xs">
					特定商取引法に基づく表記
				</Link>
			</main>
		</div>
	);
}
