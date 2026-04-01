import { NextRequest, NextResponse } from "next/server";
import { generateCosmicLetter, type SpaceWeatherData, type AsteroidData } from "../../../lib/cosmic";
import { getZodiacSign, getMoonPhase, getLifePathNumber } from "../../../lib/zodiac";
import Stripe from "stripe";

interface ApodData {
	title: string;
	url: string;
	explanation: string;
	hasImage: boolean;
	base64Image?: string; // Client side image rendering requires base64 to avoid CORS taint
}

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

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const sessionId = searchParams.get("session_id");
	const dateParam = searchParams.get("date");

	let date: string | null = dateParam;

	if (!date && sessionId) {
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
		const withTimeout = <T>(promise: Promise<T>, ms: number, msg: string): Promise<T> => {
			return Promise.race([
				promise,
				new Promise<T>((_, reject) => setTimeout(() => reject(new Error(msg)), ms))
			]);
		};

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

		// fetch APOD image and convert to base64 to avoid HTML Canvas CORS issues
		if (apod.hasImage && apod.url) {
			try {
				const imageRes = await withTimeout(fetch(apod.url), 8000, "NASA image fetch timeout");
				if (imageRes.ok) {
					const arrayBuffer = await imageRes.arrayBuffer();
					const contentType = imageRes.headers.get("content-type") || "image/jpeg";
					const base64 = Buffer.from(arrayBuffer).toString("base64");
					apod.base64Image = `data:${contentType};base64,${base64}`;
				}
			} catch (e) {
				console.error("Failed to fetch APOD image as Base64:", e);
				// Proceed without Base64, fallback to URL (might cause CORS error in Canvas but better than crashing)
			}
		}

		const [year, month, day] = date.split("-").map(Number);
		const zodiacDetail = getZodiacSign(month, day);
		const moonPhase = getMoonPhase(date);
		const lifePathNumber = getLifePathNumber(date);

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

		return NextResponse.json({
			date,
			apod,
			cosmicLetter,
			zodiacSign: zodiacDetail.name,
			zodiacSymbol: zodiacDetail.symbol,
			moonPhase: { phase: moonPhase.phase, emoji: moonPhase.emoji },
			lifePathNumber: lifePathNumber.number
		});

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: `Failed to generate report data: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
