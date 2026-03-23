import { NextRequest, NextResponse } from "next/server";

// NASA API キーキャッシュ用（メモリ内キャッシュ）
const apodCache = new Map<string, unknown>();

// フォールバック画像（NASA Image Library のロイヤリティフリー画像 - 複数用意）
const FALLBACK_IMAGES = [
	"https://images-assets.nasa.gov/image/1628173487371/1628173487371~orig.jpg",
	"https://images-assets.nasa.gov/image/GRC-2023-00044-01-Original/GRC-2023-00044-01-Original~orig.jpg",
	"https://images-assets.nasa.gov/image/iss057e009127/iss057e009127~orig.jpg",
];

const FALLBACK_TITLE = "Cosmic Nebula";
const FALLBACK_EXPLANATION = "The universe is vast and beautiful. Just like this cosmic nebula, your life holds infinite possibilities and wonder. This image represents the eternal beauty of the cosmos that witnessed your birth.";

// 日付ごとにフォールバック画像を決定（ハッシュ関数）
function getFallbackImageForDate(date: string): string {
	const hash = date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const date = searchParams.get("date");

	if (!date) {
		return NextResponse.json(
			{ error: "Missing 'date' parameter. Use format YYYY-MM-DD" },
			{ status: 400 }
		);
	}

	// キャッシュチェック
	if (apodCache.has(date)) {
		return NextResponse.json(apodCache.get(date));
	}

	const NASA_API_KEY = process.env.NASA_API_KEY;

	if (!NASA_API_KEY) {
		// API キーがない場合はフォールバック画像を返す
		const result = {
			title: FALLBACK_TITLE,
			url: getFallbackImageForDate(date),
			explanation: FALLBACK_EXPLANATION,
			hasImage: true,
		};
		apodCache.set(date, result);
		return NextResponse.json(result);
	}

	try {
		const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
		const response = await fetch(url);

		// 1995 年 6 月 16 日以前の日はデータがないため、フォールバック画像を返す
		if (!response.ok) {
			const result = {
				title: FALLBACK_TITLE,
				url: getFallbackImageForDate(date),
				explanation: FALLBACK_EXPLANATION,
				hasImage: true,
			};
			apodCache.set(date, result);
			return NextResponse.json(result);
		}

		const data = await response.json() as {
			title?: string;
			url?: string;
			explanation?: string;
			copyright?: string;
			media_type?: string;
		};

		// copyright フィールドがある場合、または動画の場合はフォールバック画像を使用
		const isVideo = data.media_type === "video";
		const hasValidImage = !!data.url && !isVideo;

		const result = {
			title: data.title || FALLBACK_TITLE,
			url: hasValidImage ? data.url : getFallbackImageForDate(date),
			explanation: data.explanation || FALLBACK_EXPLANATION,
			hasImage: true,
		};

		// キャッシュに保存
		apodCache.set(date, result);

		return NextResponse.json(result);
	} catch (error) {
		// エラー時もフォールバック画像を返す
		const result = {
			title: FALLBACK_TITLE,
			url: getFallbackImageForDate(date),
			explanation: FALLBACK_EXPLANATION,
			hasImage: true,
		};
		apodCache.set(date, result);
		return NextResponse.json(result);
	}
}
