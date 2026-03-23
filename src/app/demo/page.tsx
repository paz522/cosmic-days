"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

interface FortuneData {
	luckyColor: string;
	luckyMoon: string;
	message: string;
	earthOrbits: number;
	distanceTraveled: string;
	zodiac: {
		name: string;
		englishName: string;
		symbol: string;
		description: string;
		element: string;
		rulingPlanet: string;
	};
	moonPhase: {
		phase: string;
		illumination: number;
		emoji: string;
	};
}

function DemoContent() {
	const searchParams = useSearchParams();
	const initialDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
	const today = new Date().toISOString().split("T")[0];

	const [date, setDate] = useState(initialDate);
	const [loading, setLoading] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [narration, setNarration] = useState<string | null>(null);
	const [fortune, setFortune] = useState<FortuneData | null>(null);
	const [data, setData] = useState<{
		apod: unknown;
		asteroids: unknown;
		spaceWeather: unknown;
		history: unknown;
	} | null>(null);

	const handleGenerate = async () => {
		setLoading(true);
		setError(null);
		setPdfUrl(null);
		setNarration(null);
		setFortune(null);
		setData(null);

		try {
			// 各 API からデータを取得
			const [apodRes, asteroidsRes, spaceWeatherRes, historyRes] = await Promise.all([
				fetch(`/api/apod?date=${date}`),
				fetch(`/api/asteroids?date=${date}`),
				fetch(`/api/space-weather?date=${date}`),
				fetch(`/api/history?month=${date.split("-")[1]}&day=${date.split("-")[2]}`),
			]);

			const apod = await apodRes.json();
			const asteroids = await asteroidsRes.json() as Array<{ name: string; miss_distance_km: number }>;
			const spaceWeather = await spaceWeatherRes.json();
			const history = await historyRes.json();

			setData({ apod, asteroids, spaceWeather, history });

			// ナレーション生成（Claude API）
			const narrationRes = await fetch("/api/generate-narration", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ date, apod, asteroids, spaceWeather, history }),
			});

			if (!narrationRes.ok) {
				throw new Error("Failed to generate narration");
			}

			const narrationData = (await narrationRes.json()) as { narration?: string };
			setNarration(narrationData.narration || "");

			// 占いデータ取得
			const dateObj = new Date(date);
			const month = dateObj.getMonth() + 1;
			const day = dateObj.getDate();
			
			// 簡易占いデータ生成（クライアント側で）
			const zodiacSigns = [
				{ name: "Capricorn", symbol: "♑", element: "Earth", planet: "Saturn" },
				{ name: "Aquarius", symbol: "♒", element: "Air", planet: "Uranus" },
				{ name: "Pisces", symbol: "♓", element: "Water", planet: "Neptune" },
				{ name: "Aries", symbol: "♈", element: "Fire", planet: "Mars" },
				{ name: "Taurus", symbol: "♉", element: "Earth", planet: "Venus" },
				{ name: "Gemini", symbol: "♊", element: "Air", planet: "Mercury" },
				{ name: "Cancer", symbol: "♋", element: "Water", planet: "Moon" },
				{ name: "Leo", symbol: "♌", element: "Fire", planet: "Sun" },
				{ name: "Virgo", symbol: "♍", element: "Earth", planet: "Mercury" },
				{ name: "Libra", symbol: "♎", element: "Air", planet: "Venus" },
				{ name: "Scorpio", symbol: "♏", element: "Water", planet: "Pluto" },
				{ name: "Sagittarius", symbol: "♐", element: "Fire", planet: "Jupiter" },
			];
			
			// 簡易星座計算
			let zodiacIndex = Math.floor(((month - 1) * 30 + day) / 30) % 12;
			const zodiac = zodiacSigns[zodiacIndex];
			
			const today = new Date();
			const ageInDays = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
			const earthOrbits = Math.floor(ageInDays / 365.25);
			const distanceTraveledKm = earthOrbits * 940000000;
			
			const colors = ["ディープパープル", "コスミックブルー", "スターダストゴールド", "ネビュラピンク", "ギャラクシーグリーン"];
			const phases = ["新月 🌑", "上弦の月 🌓", "満月 🌕", "下弦の月 🌗"];
			
			const fortuneData: FortuneData = {
				luckyColor: colors[Math.floor(Math.random() * colors.length)],
				luckyMoon: phases[Math.floor(Math.random() * phases.length)],
				message: `あなたの誕生日の宇宙は、${zodiac.name}のエネルギーを強く受けています。守護星は${asteroids.length > 0 ? (asteroids as Array<{ name: string }>)[0].name : "遠くを旅する小惑星"}です。`,
				earthOrbits,
				distanceTraveled: `${distanceTraveledKm.toLocaleString()} km`,
				zodiac: {
					name: zodiac.name,
					englishName: zodiac.name,
					symbol: zodiac.symbol,
					description: `${zodiac.element}星座。支配星：${zodiac.planet}`,
					element: zodiac.element,
					rulingPlanet: zodiac.planet,
				},
				moonPhase: {
					phase: phases[0].split(" ")[0],
					illumination: Math.floor(Math.random() * 100),
					emoji: "🌙",
				},
			};
			setFortune(fortuneData);

			// PDF 生成
			const pdfRes = await fetch(`/api/generate-pdf?session_id=demo&date=${date}`);

			if (!pdfRes.ok) {
				const errData = (await pdfRes.json()) as { error?: string };
				throw new Error(errData.error || "Failed to generate PDF");
			}

			const blob = await pdfRes.blob();
			const url = window.URL.createObjectURL(blob);
			setPdfUrl(url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center px-4 py-12">
			<main className="flex flex-col items-center gap-8 max-w-3xl w-full">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-white mb-2">✦ CosmicDays - Demo</h1>
					<p className="text-gray-300">Full Report Preview</p>
				</div>

				<div className="w-full max-w-md">
					<label className="text-gray-300 text-sm mb-2 block">
						Select Date
					</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						min="1900-01-01"
						max={today}
						className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e] border border-gray-600 text-white focus:outline-none focus:border-purple-500"
					/>
				</div>

				<button
					onClick={handleGenerate}
					disabled={loading}
					className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
				>
					{loading ? "Generating..." : "Generate Full Report"}
				</button>

				{error && (
					<div className="bg-red-900/30 border border-red-500 rounded-xl p-6 w-full">
						<p className="text-red-400">{error}</p>
					</div>
				)}

				{data && (
					<div className="w-full space-y-4">
						<div className="bg-[#1a1a2e] border border-gray-700 rounded-xl p-6">
							<h2 className="text-xl font-bold text-white mb-4">📸 APOD</h2>
							<p className="text-white font-semibold">{(data.apod as { title: string }).title}</p>
							<p className="text-gray-300 text-sm mt-2">{(data.apod as { explanation: string }).explanation}</p>
						</div>

						<div className="bg-[#1a1a2e] border border-gray-700 rounded-xl p-6">
							<h2 className="text-xl font-bold text-white mb-4">🛡️ Asteroids</h2>
							<p className="text-gray-300">{(data.asteroids as Array<unknown>).length} asteroids detected</p>
							{(data.asteroids as Array<{ name: string; miss_distance_km: number }>).length > 0 && (
								<p className="text-gray-300 text-sm mt-2">
									Closest: {(data.asteroids as Array<{ name: string }>)[0].name}
								</p>
							)}
						</div>

						<div className="bg-[#1a1a2e] border border-gray-700 rounded-xl p-6">
							<h2 className="text-xl font-bold text-white mb-4">☀️ Space Weather</h2>
							<p className="text-gray-300">{(data.spaceWeather as { summary: string }).summary}</p>
						</div>

						<div className="bg-[#1a1a2e] border border-gray-700 rounded-xl p-6">
							<h2 className="text-xl font-bold text-white mb-4">📜 Space History</h2>
							{(data.history as Array<{ year: number; text: string }>).map((h, i) => (
								<p key={i} className="text-gray-300 text-sm">
									<span className="text-purple-400 font-semibold">{h.year}:</span> {h.text}
								</p>
							))}
						</div>
					</div>
				)}

				{narration && (
					<div className="bg-[#1a1a2e] border border-gray-700 rounded-xl p-6 w-full">
						<h2 className="text-xl font-bold text-white mb-4">📖 AI Narration</h2>
						<p className="text-gray-300 whitespace-pre-wrap italic">{narration}</p>
					</div>
				)}

				{fortune && (
					<div className="w-full space-y-4">
						<div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
							<h2 className="text-xl font-bold text-white mb-4">🔮 Cosmic Fortune</h2>
							<div className="space-y-3">
								<p className="text-white">
									<span className="text-purple-400 font-semibold">{fortune.zodiac.symbol} {fortune.zodiac.englishName}</span>
									<span className="text-gray-300 text-sm ml-2">({fortune.zodiac.element} · {fortune.zodiac.rulingPlanet})</span>
								</p>
								<p className="text-gray-300 text-sm">{fortune.zodiac.description}</p>
								<div className="grid grid-cols-2 gap-4 mt-4">
									<div>
										<p className="text-gray-400 text-sm">🎨 Lucky Color</p>
										<p className="text-white font-semibold">{fortune.luckyColor}</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm">🌙 Lucky Moon</p>
										<p className="text-white font-semibold">{fortune.luckyMoon}</p>
									</div>
								</div>
								<div className="mt-4 pt-4 border-t border-purple-500/30">
									<p className="text-gray-300 text-sm">{fortune.message}</p>
								</div>
								<div className="mt-4 pt-4 border-t border-purple-500/30">
									<p className="text-gray-400 text-sm">🌍 Earth Orbits Completed</p>
									<p className="text-white font-semibold">{fortune.earthOrbits} times ({fortune.distanceTraveled})</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{pdfUrl && (
					<div className="w-full">
						<a
							href={pdfUrl}
							download={`cosmic-day-${date}.pdf`}
							className="block w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg text-center hover:bg-green-700"
						>
							⬇️ Download PDF
						</a>
						<iframe
							src={pdfUrl}
							className="w-full h-[600px] mt-4 rounded-lg border border-gray-700"
							title="PDF Preview"
						/>
					</div>
				)}
			</main>
		</div>
	);
}

export default function DemoPage() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">Loading...</div>}>
			<DemoContent />
		</Suspense>
	);
}
