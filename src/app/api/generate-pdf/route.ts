import { NextRequest, NextResponse } from "next/server";
import puppeteer from "@cloudflare/puppeteer";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateCosmicLetter, type SpaceWeatherData, type AsteroidData } from "../../../lib/cosmic";
import { getZodiacSign, getMoonPhase, getLifePathNumber } from "../../../lib/zodiac";
import Stripe from "stripe";

// Note: runtime = "edge" is intentionally omitted here.
// @opennextjs/cloudflare compiles all routes for Workers automatically.
// Removing this allows Node.js APIs (node:fs, puppeteer-core) to work in local dev.

interface ApodData {
	title: string;
	url: string;
	explanation: string;
	hasImage: boolean;
}

// Stripe クライアント取得
function getStripeClient(): Stripe {
	const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
	if (!secretKey) {
		throw new Error("STRIPE_SECRET_KEY is not configured");
	}
	return new Stripe(secretKey, {
		apiVersion: "2026-02-25.clover",
		httpClient: Stripe.createFetchHttpClient(),
	});
}

// 日本語フォント付き HTML テンプレート（サイトと同じ内容を反映）
function generateHTML(
	date: string,
	apod: ApodData,
	cosmicLetter: {
		intro: string;
		zodiac: string;
		moon: string;
		lifePath: string;
		spaceWeather: string;
		asteroid: string;
		blessing: string;
	},
	zodiacSign: string,
	zodiacSymbol: string,
	moonPhase: { phase: string; emoji: string },
	lifePathNumber: number
): string {
	// cosmicLetter のテキスト内の改行を <br> に変換
	const nl2br = (text: string) => text.replace(/\n/g, "<br>");

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@700&display=swap" rel="stylesheet">
	<style>
		@page {
			size: A4;
			margin: 0;
		}
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: 'Noto Sans JP', sans-serif;
			background-color: #050510;
			color: #e2e8f0;
			font-size: 14px;
			line-height: 1.7;
		}
		.background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(135deg, #050510 0%, #1a0a2e 50%, #050510 100%);
			z-index: -2;
		}
		.stars {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: 
				radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(1px 1px at 150px 150px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(2px 2px at 250px 200px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(1px 1px at 350px 300px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(1px 1px at 450px 400px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(1px 1px at 550px 500px, #ffffff, rgba(0,0,0,0)),
				radial-gradient(2px 2px at 650px 600px, #ffffff, rgba(0,0,0,0));
			background-repeat: repeat;
			background-size: 800px 800px;
			opacity: 0.3;
			z-index: -1;
		}
		.page {
			position: relative;
			width: 210mm;
			min-height: 297mm;
			padding: 25mm;
			page-break-after: always;
		}
		/* Allow some pages to naturally flow if content is large */
		.page-flow {
			height: auto;
			min-height: 297mm;
		}
		.border-frame {
			position: absolute;
			top: 10mm;
			left: 10mm;
			right: 10mm;
			bottom: 10mm;
			border: 1px solid rgba(168, 85, 247, 0.3);
			pointer-events: none;
			min-height: 277mm;
		}
		.border-inner {
			position: absolute;
			top: 2mm;
			left: 2mm;
			right: 2mm;
			bottom: 2mm;
			border: 2px solid;
			border-image: linear-gradient(to bottom, #d97706, #fcd34d, #d97706) 1;
			opacity: 0.5;
			min-height: 273mm;
		}
		.corner-star {
			position: absolute;
			font-size: 18px;
			color: #fbbf24;
			z-index: 10;
		}
		.top-left { top: 7mm; left: 7mm; }
		.top-right { top: 7mm; right: 7mm; }
		.bottom-left { bottom: 7mm; left: 7mm; }
		.bottom-right { bottom: 7mm; right: 7mm; }

		.content {
			position: relative;
			z-index: 1;
			display: block;
			width: 100%;
		}
		.content.cover {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 100%;
			min-height: 247mm; /* 297mm - 50mm padding */
		}
		.apod-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
		}
		h1 {
			font-family: 'Noto Serif JP', serif;
			font-size: 42px;
			font-weight: 700;
			text-align: center;
			margin-bottom: 20px;
			background: linear-gradient(to right, #fbbf24, #fef3c7, #d97706);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.3));
		}
		h2 {
			font-family: 'Noto Serif JP', serif;
			font-size: 24px;
			font-weight: 700;
			color: #fcd34d;
			margin: 60px 0 15px 0;
			display: flex;
			align-items: center;
			gap: 12px;
			page-break-after: avoid;
			break-after: avoid;
		}
		h2:first-child {
			margin-top: 0;
		}
		h2::after {
			content: '';
			flex: 1;
			height: 1px;
			background: linear-gradient(to right, rgba(252, 211, 77, 0.5), transparent);
		}
		.cover {
			text-align: center;
		}
		.cover-icon {
			font-size: 80px;
			margin-bottom: 24px;
			color: #fbbf24;
			filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.5));
		}
		.cover-date {
			font-size: 20px;
			color: #d8b4fe;
			margin-bottom: 40px;
			letter-spacing: 2px;
		}
		.apod-container {
			width: 100%;
			max-width: 400px;
			padding: 8px;
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid rgba(251, 191, 36, 0.2);
			border-radius: 12px;
			margin-bottom: 20px;
		}
		.apod-image {
			width: 100%;
			border-radius: 8px;
			display: block;
		}
		.card {
			background: rgba(26, 26, 46, 0.7);
			border: 1px solid rgba(168, 85, 247, 0.2);
			border-radius: 16px;
			padding: 24px;
			margin: 20px 0;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			page-break-inside: avoid;
			break-inside: avoid;
			display: inline-block; /* ページまたぎ防止に有効 */
			width: 100%;
			font-size: 16px;
			line-height: 1.8;
		}
		.section-content {
			font-size: 16px;
			line-height: 1.8;
		}
		.section-title {
			color: #fbbf24;
			font-weight: 700;
			font-size: 16px;
			margin-bottom: 12px;
			display: block;
			text-transform: uppercase;
			letter-spacing: 1.5px;
		}
		p {
			margin-bottom: 12px;
			text-align: justify;
		}
		.card p {
			font-size: 16px;
			line-height: 1.8;
		}
		.blessing-box {
			background: linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(131, 24, 67, 0.3));
			border: 1px solid rgba(251, 191, 36, 0.4);
			padding: 30px;
			border-radius: 20px;
			font-style: italic;
			font-size: 20px;
			line-height: 2.2;
			text-align: center;
			page-break-inside: avoid;
			break-inside: avoid;
		}
		.footer {
			margin-top: auto;
			text-align: center;
			width: 100%;
			color: #94a3b8;
			font-size: 12px;
			border-top: 1px solid rgba(255, 255, 255, 0.1);
			padding-top: 15px;
		}
	</style>
</head>
<body>
	<div class="background"></div>
	<div class="stars"></div>

	<!-- Cover Page -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="corner-star top-left">✦</div>
		<div class="corner-star top-right">✦</div>
		<div class="corner-star bottom-left">✦</div>
		<div class="corner-star bottom-right">✦</div>
		
		<div class="content cover">
			<div class="cover-icon">✦</div>
			<h1>CosmicDays Report</h1>
			<p class="cover-date">${date.replace(/-/g, '.')} — The eternal moment you descended</p>
			${apod.hasImage ? `
			<div class="apod-container">
				<img src="${apod.url}" alt="${apod.title}" class="apod-image" />
				<p style="font-size: 11px; margin-top: 10px; color: #a855f7;">${apod.title}</p>
			</div>
			` : ''}
			<p style="max-width: 380px; margin-top: 12px; color: #94a3b8; line-height: 1.5; font-size: 13px;">
				This report deciphers the cosmic alignment on the day you were born,<br>
				and compiles it as a message to your soul.
			</p>
		</div>
	</div>

	<!-- Introduction -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>📖 Cosmic Guidance</h2>
			<div class="card">
				<div class="section-content">${nl2br(cosmicLetter.intro)}</div>
			</div>
			<div class="footer">
				<p>CosmicDays — You are the Universe experiencing itself</p>
			</div>
		</div>
	</div>

	<!-- Zodiac Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>${zodiacSymbol} ${zodiacSign} - Soul Mission</h2>
			<div class="card">
				<span class="section-title">Zodiac Message</span>
				<div class="section-content">${nl2br(cosmicLetter.zodiac)}</div>
			</div>
		</div>
	</div>

	<!-- Moon Phase Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>${moonPhase.emoji} ${moonPhase.phase} - Moon Energy</h2>
			<div class="card">
				<span class="section-title">Moon Phase Energy</span>
				<div class="section-content">${nl2br(cosmicLetter.moon)}</div>
			</div>
		</div>
	</div>

	<!-- Life Path Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>🔢 Life Path Number ${lifePathNumber}</h2>
			<div class="card">
				<span class="section-title">Numerology Path</span>
				<div class="section-content">${nl2br(cosmicLetter.lifePath)}</div>
			</div>
		</div>
	</div>

	<!-- Space Weather Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>☀️ Solar Energy</h2>
			<div class="card">
				<span class="section-title">Solar Activity</span>
				<div class="section-content">${nl2br(cosmicLetter.spaceWeather)}</div>
			</div>
		</div>
	</div>

	<!-- Asteroid Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>☄️ Your Guardian Star</h2>
			<div class="card">
				<span class="section-title">Celestial Guardians</span>
				<div class="section-content">${nl2br(cosmicLetter.asteroid)}</div>
			</div>
		</div>
	</div>

	<!-- Blessing Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content cover">
			<div class="blessing-box">
				<div class="section-content">${nl2br(cosmicLetter.blessing)}</div>
			</div>
			<div class="footer" style="margin-top: auto;">
				<p>May the love of the universe always be with you.</p>
			</div>
		</div>
	</div>

	<!-- APOD Detail Section -->
	<div class="page">
		<div class="border-frame"><div class="border-inner"></div></div>
		<div class="content">
			<h2>🔭 ${apod.title}</h2>
			<div class="card">
				<p style="font-size: 13px; color: #cbd5e1;">${nl2br(apod.explanation)}</p>
			</div>

			<div class="footer" style="margin-top: auto;">
				<p>Generated by CosmicDays on ${new Date().toLocaleDateString('en-US')}</p>
			</div>
		</div>
	</div>
</body>
</html>
	`;
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const sessionId = searchParams.get("session_id");
	const dateParam = searchParams.get("date");

	// date パラメータまたは session_id から date を取得
	let date: string | null = dateParam;

	if (!date && sessionId) {
		// Stripe セッションから date を取得
		if (sessionId !== "demo") {
			try {
				const stripe = getStripeClient();
				const session = await stripe.checkout.sessions.retrieve(sessionId);

				if (session.payment_status !== "paid") {
					return NextResponse.json(
						{ error: "Payment not completed" },
						{ status: 403 }
					);
				}
				date = session.metadata?.date || null;
			} catch (error) {
				return NextResponse.json(
					{ error: "Invalid session ID" },
					{ status: 400 }
				);
			}
		}
	}

	if (!date) {
		return NextResponse.json(
			{ error: "Missing 'date' or valid 'session_id' parameter" },
			{ status: 400 }
		);
	}

	try {
		const isLocalDev = process.env.NODE_ENV === "development";

		const withTimeout = <T>(promise: Promise<T>, ms: number, msg: string): Promise<T> => {
			return Promise.race([
				promise,
				new Promise<T>((_, reject) => setTimeout(() => reject(new Error(msg)), ms))
			]);
		};

		// 全データを並列で取得
		const headers = request.headers;
		const host = headers.get("host") || "localhost:3000";
		const protocol = headers.get("x-forwarded-proto") || "http";
		const origin = `${protocol}://${host}`;

		const [apodRes, spaceWeatherRes, asteroidsRes] = await withTimeout(Promise.all([
			fetch(`${origin}/api/apod?date=${date}`),
			fetch(`${origin}/api/space-weather?date=${date}`),
			fetch(`${origin}/api/asteroids?date=${date}`),
		]), 15000, "Internal API fetch timed out");

		const apod = await apodRes.json() as ApodData;
		
		let spaceWeather: SpaceWeatherData | null = null;
		if (spaceWeatherRes.ok) {
			spaceWeather = await spaceWeatherRes.json() as SpaceWeatherData;
		}

		let asteroids: AsteroidData | null = null;
		if (asteroidsRes.ok) {
			asteroids = await asteroidsRes.json() as AsteroidData;
		}

		// 星座・月齢・数秘術を計算（zodiac.ts の詳細版を使用）
		const [year, month, day] = date.split("-").map(Number);
		const zodiacDetail = getZodiacSign(month, day);
		const moonPhase = getMoonPhase(date);
		const lifePathNumber = getLifePathNumber(date);

		// サイトと同じ generateCosmicLetter を使用してテキスト生成
		const cosmicLetter = generateCosmicLetter(
			date,
			zodiacDetail.name,
			zodiacDetail.symbol,
			zodiacDetail.soulMission,
			moonPhase.phase,
			moonPhase.emoji,
			moonPhase.energyMessage,
			lifePathNumber.number,
			lifePathNumber.description,
			lifePathNumber.lifeMessage,
			spaceWeather,
			asteroids
		);

		// HTML 生成
		const html = generateHTML(
			date,
			apod,
			cosmicLetter,
			zodiacDetail.name,
			zodiacDetail.symbol,
			{ phase: moonPhase.phase, emoji: moonPhase.emoji },
			lifePathNumber.number
		);

		// Puppeteer で PDF 生成
		let browser;
		if (isLocalDev) {
			// ローカル開発環境：puppeteer-core を使用
			const localPuppeteer = await import("puppeteer-core");
			const { existsSync } = await import("node:fs");
			
			// ローカルでの Chrome パス候補 (Windows)
			const CHROME_PATHS_WIN = [
				process.env.CHROME_PATH,
				"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
				"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
				process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
			].filter((p): p is string => !!p);

			let executablePath: string | undefined;
			for (const path of CHROME_PATHS_WIN) {
				if (existsSync(path)) {
					executablePath = path;
					break;
				}
			}
			
			if (!executablePath) {
				throw new Error("Local Chrome executable not found. Please install Chrome or set CHROME_PATH.");
			}

			browser = await localPuppeteer.default.launch({
				headless: true,
				executablePath,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
					"--disable-software-rasterizer",
				],
			});
		} else {
			// Cloudflare 環境：@cloudflare/puppeteer を使用
			const { env } = await getCloudflareContext({ async: true });
			// @ts-ignore - MYBROWSER might not be in types yet
			const MYBROWSER = env.MYBROWSER;
			if (!MYBROWSER) {
				throw new Error("MYBROWSER binding not found. Please check your Cloudflare configuration.");
			}
			browser = await withTimeout(puppeteer.launch(MYBROWSER), 15000, "Puppeteer launch timed out. Please check Cloudflare limits.");
		}

		try {
			const page = await withTimeout(browser.newPage(), 10000, "Browser.newPage timed out");
			await page.setContent(html, { 
				waitUntil: "load",
				timeout: 20000 
			});
			
			// 画像がすべて読み込まれるのを明示的に待つ
			await withTimeout((page as any).evaluate(async () => {
				const images = Array.from(document.querySelectorAll("img"));
				await Promise.all(images.map(img => {
					if (img.complete) return Promise.resolve();
					return new Promise((resolve) => {
						img.addEventListener('load', resolve);
						img.addEventListener('error', resolve); // エラーでも次へ進む
					});
				}));
			}), 10000, "Image loading evaluation timed out");

			// レンダリングの安定化のための短い待機
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// フォントロードを最大5秒待機する（タイムアウト回避のため）
			await Promise.race([
				// @ts-ignore
				page.evaluateHandle('document.fonts.ready'),
				new Promise(resolve => setTimeout(resolve, 5000))
			]);

			const pdfBuffer = await page.pdf({
				format: "A4",
				printBackground: true,
				timeout: 10000,
				margin: {
					top: "20mm",
					bottom: "20mm",
					left: "20mm",
					right: "20mm",
				},
			});

			await browser.close();

			const response = new NextResponse(new Uint8Array(pdfBuffer), {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="cosmic-days-${date}.pdf"`,
				},
			});
			
			return response;
		} catch (error) {
			try {
				await browser.close();
			} catch (closeError) {
				// ブラウザが既に閉じている場合は無視
			}
			throw error;
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		console.error("PDF generation error:", errorMessage);
		return NextResponse.json(
			{ error: `Failed to generate PDF: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
