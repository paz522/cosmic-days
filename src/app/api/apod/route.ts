import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// NASA API キーキャッシュ用（メモリ内キャッシュ）
const apodCache = new Map<string, unknown>();

const FALLBACK_TITLE = "Cosmic Nebula";
const FALLBACK_EXPLANATION = "広大な宇宙の美しさと共に、あなたの人生には無限の可能性と驚きが広がっています。この星雲のように、あなたが生まれた瞬間の宇宙は永遠に輝いています。";

// ローカルのプレミアムフォールバック画像
const FALLBACK_IMAGE_PATH = "/images/cosmic-fallback.png";

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

	const host = request.headers.get("host") || "localhost:3000";
	const protocol = request.headers.get("x-forwarded-proto") || "http";
	const origin = `${protocol}://${host}`;
	const absoluteFallbackUrl = `${origin}${FALLBACK_IMAGE_PATH}`;

	const NASA_API_KEY = process.env.NASA_API_KEY;

	if (!NASA_API_KEY) {
		// API キーがない場合はフォールバック画像を返す
		const result = {
			title: FALLBACK_TITLE,
			url: absoluteFallbackUrl,
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
				url: absoluteFallbackUrl,
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
			url: hasValidImage ? data.url : absoluteFallbackUrl,
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
			url: absoluteFallbackUrl,
			explanation: FALLBACK_EXPLANATION,
			hasImage: true,
		};
		apodCache.set(date, result);
		return NextResponse.json(result);
	}
}
