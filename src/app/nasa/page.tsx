"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ApodData {
	title: string;
	url: string;
	explanation: string;
	hasImage: boolean;
}

interface SpaceWeatherData {
	events: Array<{ id: string; time: string; class: string }>;
	summary: string;
	spiritualMessage: string;
}

interface AsteroidData {
	asteroids: Array<{
		name: string;
		distanceKm: number;
		velocityKmh: number;
		diameterMinKm: number;
		diameterMaxKm: number;
		isHazardous: boolean;
	}>;
	count: number;
	closest: {
		name: string;
		distanceKm: number;
		distanceAu: number;
		velocityKmh: number;
		diameterMinKm: number;
		diameterMaxKm: number;
		isHazardous: boolean;
	};
	summary: string;
	spiritualMessage: string;
}

function NasaDataContent() {
	const searchParams = useSearchParams();
	const initialDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

	const [date, setDate] = useState(initialDate);
	const [apod, setApod] = useState<ApodData | null>(null);
	const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherData | null>(null);
	const [asteroids, setAsteroids] = useState<AsteroidData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (date) {
			fetchData(date);
		}
	}, []);

	const fetchData = async (selectedDate: string) => {
		setLoading(true);
		setError(null);
		setApod(null);
		setSpaceWeather(null);
		setAsteroids(null);

		try {
			const [apodRes, spaceWeatherRes, asteroidsRes] = await Promise.all([
				fetch(`/api/apod?date=${selectedDate}`),
				fetch(`/api/space-weather?date=${selectedDate}`),
				fetch(`/api/asteroids?date=${selectedDate}`),
			]);

			if (!apodRes.ok) {
				const errorData = await apodRes.json() as { error?: string };
				throw new Error(errorData.error || "Failed to fetch APOD");
			}
			const apodData = await apodRes.json() as ApodData;
			setApod(apodData);

			if (spaceWeatherRes.ok) {
				const spaceWeatherData = await spaceWeatherRes.json() as SpaceWeatherData;
				setSpaceWeather(spaceWeatherData);
			}

			if (asteroidsRes.ok) {
				const asteroidsData = await asteroidsRes.json() as AsteroidData;
				setAsteroids(asteroidsData);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (date) {
			fetchData(date);
		}
	};

	const today = new Date().toISOString().split("T")[0];

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] flex flex-col items-center px-4 py-12 relative overflow-hidden">
			{/* 背景の星 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "0.5s" }}></div>
				<div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: "1.4s" }}></div>
				<div className="absolute bottom-20 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: "2.2s" }}></div>
				<div className="absolute bottom-10 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: "0.9s" }}></div>
				<div className="absolute top-1/5 left-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: "1.6s" }}></div>
				<div className="absolute top-2/5 right-1/6 w-1 h-1 bg-cyan-200 rounded-full animate-twinkle" style={{ animationDelay: "2.5s" }}></div>
			</div>

			<main className="flex flex-col items-center gap-8 max-w-4xl w-full relative z-10">
				<div className="text-center animate-float">
					<div className="mb-4">
						<span className="text-6xl animate-pulse-soul">🔭</span>
					</div>
					<h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-cosmic">
						NASA 宇宙データ
					</h1>
					<p className="text-xl text-gray-300 leading-relaxed">
						あなたの誕生日の宇宙を探索
					</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md animate-aura rounded-2xl p-6 bg-[#1a1a2e]/50 backdrop-blur-sm border border-purple-500/30">
					<div className="text-center">
						<label htmlFor="date" className="text-purple-200 text-base font-medium">
							日付を選択
						</label>
						<p className="text-gray-400 text-sm mt-2">
							美しい宇宙画像とデータをご覧いただけます
						</p>
					</div>
					<div className="flex gap-2">
						<input
							type="date"
							id="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							min="1900-01-01"
							max={today}
							className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-purple-500/50 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all text-center"
						/>
						<button
							type="submit"
							disabled={loading || !date}
							className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
						>
							検索
						</button>
					</div>
				</form>

				{loading && (
					<div className="flex items-center justify-center py-12">
						<div className="text-purple-400 text-xl animate-pulse">🌟 宇宙データを取得中...</div>
					</div>
				)}

				{error && (
					<div className="bg-red-900/30 border border-red-500 rounded-xl p-6 w-full">
						<p className="text-red-400 text-center">{error}</p>
					</div>
				)}

				{apod && !loading && (
					<div className="w-full space-y-6">
						{/* APOD 画像 */}
						<div className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 animate-aura">
							<div className="flex items-center gap-2 mb-4">
								<span className="text-2xl">📸</span>
								<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
									{apod.title}
								</h2>
							</div>
							
							{apod.hasImage ? (
								<div className="mb-4 rounded-xl overflow-hidden border border-purple-500/30">
									<img
										src={apod.url}
										alt={apod.title}
										className="w-full h-auto object-contain bg-black"
									/>
								</div>
							) : (
								<div className="mb-4 p-8 bg-[#0a0a1a] rounded-xl border border-purple-500/30 flex items-center justify-center">
									<p className="text-gray-400">📹 動画コンテンツのため画像は表示されません</p>
								</div>
							)}

							<p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
								{apod.explanation}
							</p>
						</div>

						{/* 太陽活動 */}
						{spaceWeather && (
							<div className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 animate-aura">
								<div className="flex items-center gap-2 mb-4">
									<span className="text-2xl">☀️</span>
									<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
										太陽活動
									</h2>
								</div>
								<p className="text-gray-300 leading-relaxed mb-4">
									{spaceWeather.summary}
								</p>
								<p className="text-purple-300 italic">
									{spaceWeather.spiritualMessage}
								</p>
								{spaceWeather.events.length > 0 && (
									<div className="mt-4 space-y-2">
										<h3 className="text-lg font-semibold text-white">観測されたフレアイベント</h3>
										{spaceWeather.events.map((event, i) => (
											<div key={i} className="bg-[#0a0a1a] rounded-lg p-3 border border-purple-500/20">
												<p className="text-white font-medium">クラス {event.class}</p>
												<p className="text-gray-400 text-sm">{event.time}</p>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{/* 小惑星データ */}
						{asteroids && (
							<div className="w-full bg-[#1a1a2e]/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 animate-aura">
								<div className="flex items-center gap-2 mb-4">
									<span className="text-2xl">☄️</span>
									<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
										小惑星データ
									</h2>
								</div>
								<p className="text-gray-300 leading-relaxed mb-4">
									{asteroids.summary}
								</p>
								<p className="text-purple-300 italic">
									{asteroids.spiritualMessage}
								</p>
								{asteroids.count > 0 && (
									<div className="mt-4">
										<h3 className="text-lg font-semibold text-white mb-3">最も接近した小惑星</h3>
										<div className="bg-[#0a0a1a] rounded-xl p-4 border border-purple-500/20 space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-400">名前</span>
												<span className="text-white font-medium">{asteroids.closest.name}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">距離</span>
												<span className="text-white font-medium">{asteroids.closest.distanceKm.toLocaleString()} km ({asteroids.closest.distanceAu} AU)</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">速度</span>
												<span className="text-white font-medium">{asteroids.closest.velocityKmh.toLocaleString()} km/h</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">直径</span>
												<span className="text-white font-medium">{asteroids.closest.diameterMinKm.toFixed(0)} - {asteroids.closest.diameterMaxKm.toFixed(0)} km</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-400">危険度</span>
												<span className={asteroids.closest.isHazardous ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
													{asteroids.closest.isHazardous ? "危険な小惑星" : "安全"}
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}

				<div className="text-center mt-8">
					<a
						href="/"
						className="text-purple-400 hover:text-purple-300 transition-colors"
					>
						← CosmicDays トップページに戻る
					</a>
				</div>
			</main>
		</div>
	);
}

export default function NasaDataPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
				<div className="text-purple-400 text-xl animate-pulse">🌟 読み込み中...</div>
			</div>
		}>
			<NasaDataContent />
		</Suspense>
	);
}
