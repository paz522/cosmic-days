const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

export interface NasaApodResponse {
	date: string;
	explanation: string;
	media_type: "image" | "video";
	service_version: string;
	title: string;
	url: string;
	hdurl?: string;
	copyright?: string;
	thumbnail_url?: string;
}

export interface NasaApiError {
	error: {
		message: string;
	};
}

/**
 * NASA の APOD (Astronomy Picture of the Day) を取得
 * @param date - 取得する日付 (YYYY-MM-DD 形式)
 * @returns APOD データ
 */
export async function fetchApod(date?: string): Promise<NasaApodResponse> {
	const params = new URLSearchParams({
		api_key: NASA_API_KEY,
	});

	if (date) {
		params.append("date", date);
	}

	const response = await fetch(`${NASA_APOD_URL}?${params.toString()}`);

	if (!response.ok) {
		const error: NasaApiError = await response.json();
		throw new Error(error.error?.message || "Failed to fetch from NASA API");
	}

	return response.json() as Promise<NasaApodResponse>;
}

/**
 * 日付範囲で APOD を取得
 * @param startDate - 開始日 (YYYY-MM-DD 形式)
 * @param endDate - 終了日 (YYYY-MM-DD 形式)
 * @returns APOD データの配列
 */
export async function fetchApodRange(
	startDate: string,
	endDate: string,
): Promise<NasaApodResponse[]> {
	const params = new URLSearchParams({
		api_key: NASA_API_KEY,
		start_date: startDate,
		end_date: endDate,
	});

	const response = await fetch(`${NASA_APOD_URL}?${params.toString()}`);

	if (!response.ok) {
		const error: NasaApiError = await response.json();
		throw new Error(error.error?.message || "Failed to fetch from NASA API");
	}

	return response.json() as Promise<NasaApodResponse[]>;
}
