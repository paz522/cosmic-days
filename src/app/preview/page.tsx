"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getZodiacSign, getMoonPhase, getLifePathNumber } from "../../lib/zodiac";
import { generateCosmicLetter, type ApodData, type SpaceWeatherData, type AsteroidData, type CosmicLetter } from "../../lib/cosmic";

function PreviewContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const date = searchParams.get("date") || "";

	const [apod, setApod] = useState<ApodData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [zodiacSign, setZodiacSign] = useState<string>("");
	const [zodiacSymbol, setZodiacSymbol] = useState<string>("");
	const [zodiacSoulMission, setZodiacSoulMission] = useState<string>("");
	const [moonPhase, setMoonPhase] = useState<{ phase: string; emoji: string; spiritualMeaning: string; energyMessage: string } | null>(null);
	const [lifePathNumber, setLifePathNumber] = useState<{ number: number; meaning: string; lifeMessage: string } | null>(null);
	const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherData | null>(null);
	const [asteroids, setAsteroids] = useState<AsteroidData | null>(null);
	const [cosmicLetter, setCosmicLetter] = useState<CosmicLetter | null>(null);

	useEffect(() => {
		if (!date) {
			setError("日付が指定されていません");
			setLoading(false);
			return;
		}

		// 星座を計算
		const [year, month, day] = date.split("-").map(Number);
		const sign = getZodiacSign(month, day);
		setZodiacSign(sign.name);
		setZodiacSymbol(sign.symbol);
		setZodiacSoulMission(sign.soulMission);

		// 月齢を計算
		const moon = getMoonPhase(date);
		setMoonPhase({ phase: moon.phase, emoji: moon.emoji, spiritualMeaning: moon.spiritualMeaning, energyMessage: moon.energyMessage });

		// 数秘術を計算
		const lifePath = getLifePathNumber(date);
		setLifePathNumber({ number: lifePath.number, meaning: lifePath.description, lifeMessage: lifePath.lifeMessage });

		const fetchData = async () => {
			try {
				const apodRes = await fetch(`/api/apod?date=${date}`);
				const spaceWeatherRes = await fetch(`/api/space-weather?date=${date}`);
				const asteroidsRes = await fetch(`/api/asteroids?date=${date}`);

				if (!apodRes.ok) throw new Error("宇宙データの取得に失敗しました");

				const apodData = await apodRes.json() as ApodData;
				setApod(apodData);

				// 太陽フレアデータを取得
				let spaceWeatherData: SpaceWeatherData | null = null;
				if (spaceWeatherRes.ok) {
					spaceWeatherData = await spaceWeatherRes.json() as SpaceWeatherData;
					setSpaceWeather(spaceWeatherData);
				}

				// 小惑星データを取得
				let asteroidsData: AsteroidData | null = null;
				if (asteroidsRes.ok) {
					asteroidsData = await asteroidsRes.json() as AsteroidData;
					setAsteroids(asteroidsData);
				}

				// 宇宙からの手紙を生成
				const letter = generateCosmicLetter(
					date,
					sign.name,
					sign.symbol,
					sign.soulMission,
					moon.phase,
					moon.emoji,
					moon.energyMessage,
					lifePath.number,
					lifePath.description,
					lifePath.lifeMessage,
					spaceWeatherData,
					asteroidsData
				);
				setCosmicLetter(letter);
			} catch (err) {
				setError(err instanceof Error ? err.message : "不明なエラー");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [date]);

	const [fetchProgress, setFetchProgress] = useState(0);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (loading && !isGeneratingPdf) {
			interval = setInterval(() => {
				setFetchProgress((prev) => {
					if (prev >= 95) return prev;
					const increment = Math.random() * 8;
					return Math.min(prev + increment, 95);
				});
			}, 250);
		} else if (!loading) {
			setFetchProgress(100);
		}
		return () => clearInterval(interval);
	}, [loading, isGeneratingPdf]);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isGeneratingPdf && loading) {
			interval = setInterval(() => {
				setDownloadProgress((prev) => {
					if (prev >= 95) return prev;
					const increment = Math.random() * 5;
					return Math.min(prev + increment, 95);
				});
			}, 300);
		} else if (!loading) {
			setDownloadProgress(100);
		}
		return () => clearInterval(interval);
	}, [isGeneratingPdf, loading]);

	const handleGetFullReport = async () => {
		try {
			setLoading(true);
			setError(null);

			// Stripe チェックアウトセッションを作成
			const response = await fetch("/api/create-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ date }),
			});

			if (!response.ok) {
				const errorData = await response.json() as { error?: string };
				throw new Error(errorData.error || "チェックアウトセッションの作成に失敗しました");
			}

			const { url } = await response.json() as { url: string };
			window.location.href = url;
		} catch (err) {
			setError(err instanceof Error ? err.message : "チェックアウトの準備に失敗しました");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] starry-background flex flex-col items-center px-4 py-8 relative overflow-hidden">
			{/* 背景の星 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "0.2s" }}></div>
				<div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: "1.5s" }}></div>
				<div className="absolute bottom-20 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: "2.3s" }}></div>
				<div className="absolute bottom-10 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: "0.8s" }}></div>
				<div className="absolute top-1/4 left-1/3 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: "1.9s" }}></div>
				<div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-200 rounded-full animate-twinkle" style={{ animationDelay: "2.7s" }}></div>
			</div>

			<main className="flex flex-col items-center gap-6 max-w-2xl w-full relative z-10">
				{/* Header */}
				<div className="text-center animate-float">
					<div className="mb-2">
						<span className="text-4xl animate-pulse-soul">✦</span>
					</div>
					<h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-1 animate-cosmic">
						CosmicDays
					</h1>
					<p className="text-purple-400 text-xs">
						{date && `${date} — あなたの魂が降り立った日`}
					</p>
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center min-h-[60vh] w-full relative">
						{/* Loading Shooting Stars */}
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							<div className="shooting-star" style={{ top: "10%", right: "10%", animationDelay: "0s", animationDuration: "2.5s" }}></div>
							<div className="shooting-star" style={{ top: "30%", right: "20%", animationDelay: "1.2s", animationDuration: "3s" }}></div>
							<div className="shooting-star" style={{ top: "50%", right: "5%", animationDelay: "0.5s", animationDuration: "2.8s" }}></div>
							<div className="shooting-star" style={{ top: "70%", right: "25%", animationDelay: "2.1s", animationDuration: "3.2s" }}></div>
							<div className="shooting-star" style={{ top: "15%", right: "40%", animationDelay: "1.7s", animationDuration: "2.6s" }}></div>
						</div>
						
						<div className="flex flex-col items-center gap-6 z-10 w-full max-w-sm">
							<div className="relative">
								<div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
								<div className="absolute inset-0 flex items-center justify-center">
									{isGeneratingPdf ? (
										<span className="text-sm font-bold text-purple-400">{Math.round(downloadProgress)}%</span>
									) : (
										<span className="text-sm font-bold text-blue-400">{Math.round(fetchProgress)}%</span>
									)}
								</div>
							</div>
							<div className="text-center w-full">
								<p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse mb-3">
									{isGeneratingPdf ? "レポートを生成しています..." : "星々のデータを読み込んでいます..."}
								</p>
								
								<div className="w-full bg-purple-900/20 rounded-full h-2 mb-4 overflow-hidden border border-purple-500/30">
									<div 
										className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300 ease-out"
										style={{ width: `${isGeneratingPdf ? downloadProgress : fetchProgress}%` }}
									></div>
								</div>
								
								<p className="text-gray-400 text-sm">
									{isGeneratingPdf 
										? "あなたのための神聖なるドキュメントを作成中です" 
										: "宇宙の記憶を辿り、あなたの運命を紐解いています"}
								</p>
							</div>
						</div>
					</div>
				)}

				{error && (
					<div className="bg-red-900/30 border border-red-500 rounded-xl p-6 w-full">
						<p className="text-red-400 text-center">{error}</p>
					</div>
				)}

				{apod && !loading && cosmicLetter && (
					<>
						{/* イントロダクション */}
						<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
							<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
								{cosmicLetter.intro}
							</div>
						</div>

						{/* 星座の魂の使命 */}
						<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
							<div className="flex items-center gap-2 mb-3">
								<span className="text-2xl">{zodiacSymbol}</span>
								<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
									{zodiacSign} - 魂の使命
								</h2>
							</div>
							<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
								{cosmicLetter.zodiac}
							</div>
						</div>

						{/* 月齢のエネルギー */}
						{moonPhase && (
							<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
								<div className="flex items-center gap-2 mb-3">
									<span className="text-2xl">{moonPhase.emoji}</span>
									<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										{moonPhase.phase} - エネルギー
									</h2>
								</div>
								<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
									{cosmicLetter.moon}
								</div>
							</div>
						)}

						{/* 数秘術のライフパス */}
						{lifePathNumber && (
							<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
								<div className="flex items-center gap-2 mb-3">
									<span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										{lifePathNumber.number}
									</span>
									<h2 className="text-lg font-bold text-white">
										ライフパスナンバー
									</h2>
								</div>
								<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
									{cosmicLetter.lifePath}
								</div>
							</div>
						)}

						{/* 太陽のエネルギー */}
						{spaceWeather && (
							<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
								<div className="flex items-center gap-2 mb-3">
									<span className="text-2xl">☀️</span>
									<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										太陽のエネルギー
									</h2>
								</div>
								<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
									{cosmicLetter.spaceWeather}
								</div>
							</div>
						)}

						{/* 守護天体 */}
						{asteroids && asteroids.count > 0 && (
							<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
								<div className="flex items-center gap-2 mb-3">
									<span className="text-2xl">☄️</span>
									<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										あなたの守護天体
									</h2>
								</div>
								<div className="text-gray-200 leading-loose whitespace-pre-line text-sm md:text-base">
									{cosmicLetter.asteroid}
								</div>
							</div>
						)}

						{/* 宇宙からの祝福 */}
						<div className="w-full bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
							<div className="text-gray-100 leading-loose whitespace-pre-line text-sm md:text-base italic">
								{cosmicLetter.blessing}
							</div>
						</div>

						{/* NASA 画像 (APOD) - 最後に表示 */}
						{apod.hasImage && (
							<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
								<div className="flex items-center gap-2 mb-4">
									<span className="text-2xl">🔭</span>
									<h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										{apod.title}
									</h2>
								</div>
								<div className="mb-4 rounded-xl overflow-hidden border border-purple-500/30 bg-black flex items-center justify-center min-h-[200px]">
									<img
										src={apod.url}
										alt={apod.title}
										className="w-full h-auto object-contain"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											// 画像ロード失敗時のフォールバック
											target.src = "https://images-assets.nasa.gov/image/1628173487371/1628173487371~orig.jpg";
										}}
									/>
								</div>
								<p className="text-gray-300 text-sm leading-relaxed">
									{apod.explanation}
								</p>
							</div>
						)}

						{/* 星座・月齢・数秘術アイコン */}
						<div className="grid grid-cols-3 gap-3 w-full">
							{/* 星座 */}
							<div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
								<p className="text-purple-400 text-xs mb-1">星座</p>
								<p className="text-3xl mb-1">{zodiacSymbol}</p>
								<p className="text-white text-sm font-medium">{zodiacSign}</p>
							</div>

							{/* 月齢 */}
							{moonPhase && (
								<div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
									<p className="text-purple-400 text-xs mb-1">月齢</p>
									<p className="text-3xl mb-1">{moonPhase.emoji}</p>
									<p className="text-white text-sm font-medium">{moonPhase.phase}</p>
								</div>
							)}

							{/* 数秘術 */}
							{lifePathNumber && (
								<div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 text-center">
									<p className="text-purple-400 text-xs mb-1">数秘術</p>
									<p className="text-3xl mb-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
										{lifePathNumber.number}
									</p>
									<p className="text-white text-xs">ライフパス</p>
								</div>
							)}
						</div>

						{/* CTA Section */}
						<div className="w-full flex flex-col gap-4 mt-4">
							<div className="text-center">
								<p className="text-purple-200 text-sm font-medium animate-pulse">
									ページを閉じると消えてしまうこの感動を、手元に残しませんか？
								</p>
							</div>

							<button
								type="button"
								onClick={handleGetFullReport}
								disabled={loading}
								className="w-full py-5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 border border-purple-400/30 hover:scale-[1.02] active:scale-95 group"
							>
								<span className="flex items-center justify-center gap-2">
									{loading ? "🌟 宇宙の扉を準備中..." : (
										<>
											📥 PDFレポートを $1 でダウンロード
											<span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full group-hover:bg-white/30 transition-colors">Premium</span>
										</>
									)}
								</span>
							</button>
							<p className="text-gray-500 text-[10px] text-center">
								AI ナレーション付き宇宙レポート • $1 決済 (Stripe)
							</p>
						</div>
					</>
				)}

				{/* Back link */}
				<a href="/" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">
					← 他の日付を選ぶ
				</a>
			</main>
		</div>
	);
}

export default function PreviewPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
				<div className="text-white text-xl animate-pulse">Loading...</div>
			</div>
		}>
			<PreviewContent />
		</Suspense>
	);
}
