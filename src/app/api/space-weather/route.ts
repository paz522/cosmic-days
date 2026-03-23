import { NextRequest, NextResponse } from "next/server";
import { getSolarSpiritualMessage } from "../../../lib/cosmic";

// キャッシュ用（メモリ内キャッシュ）
const spaceWeatherCache = new Map<string, unknown>();

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
	if (spaceWeatherCache.has(date)) {
		return NextResponse.json(spaceWeatherCache.get(date));
	}

	const NASA_API_KEY = process.env.NASA_API_KEY;

	if (!NASA_API_KEY) {
		// API キーがない場合は空のデータを返す
		const result = {
			events: [],
			summary: "その日の太陽は静かでした。穏やかなエネルギーがあなたを包んでいます。",
			spiritualMessage: "太陽が静かな日に生まれたあなたは、内なる平和と調和を携えています。",
		};
		spaceWeatherCache.set(date, result);
		return NextResponse.json(result);
	}

	try {
		// DONKI API から太陽フレアデータを取得
		const url = `https://api.nasa.gov/DONKI/FLR?startDate=${date}&endDate=${date}&api_key=${NASA_API_KEY}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`NASA DONKI API returned status ${response.status}`);
		}

		const data = await response.json() as Array<{
			flareID: string;
			beginTime: string;
			peakTime: string;
			endTime: string;
			golsp?: string;
			link?: string;
			source?: string;
			eventType?: string;
			instruments?: string[];
			notes?: string;
		}>;

		let result;
		if (data.length === 0) {
			result = {
				events: [],
				summary: "その日の太陽は静かでした。穏やかなエネルギーがあなたを包んでいます。",
				spiritualMessage: "太陽が静かな日に生まれたあなたは、内なる平和と調和を携えています。",
			};
		} else {
			// フレアのクラスを解析
			const classes = data.map(event => ({
				class: event.golsp || "不明"
			}));

			const solarLogic = getSolarSpiritualMessage(classes);

			result = {
				events: data.map(event => ({
					id: event.flareID,
					time: event.peakTime,
					class: event.golsp || "不明",
				})),
				summary: solarLogic.summary,
				spiritualMessage: solarLogic.spiritualMessage,
			};
		}

		// キャッシュに保存
		spaceWeatherCache.set(date, result);

		return NextResponse.json(result);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: `Failed to fetch space weather: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
