import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";


// 誕生日から星座を計算
function getZodiacSign(month: number, day: number): string {
	const zodiacSigns = [
		{ name: "Capricorn", start: [1, 1], end: [1, 19] },
		{ name: "Aquarius", start: [1, 20], end: [2, 18] },
		{ name: "Pisces", start: [2, 19], end: [3, 20] },
		{ name: "Aries", start: [3, 21], end: [4, 19] },
		{ name: "Taurus", start: [4, 20], end: [5, 20] },
		{ name: "Gemini", start: [5, 21], end: [6, 21] },
		{ name: "Cancer", start: [6, 22], end: [7, 22] },
		{ name: "Leo", start: [7, 23], end: [8, 22] },
		{ name: "Virgo", start: [8, 23], end: [9, 22] },
		{ name: "Libra", start: [9, 23], end: [10, 23] },
		{ name: "Scorpio", start: [10, 24], end: [11, 21] },
		{ name: "Sagittarius", start: [11, 22], end: [12, 21] },
		{ name: "Capricorn", start: [12, 22], end: [12, 31] },
	];

	for (const sign of zodiacSigns) {
		const [startMonth, startDay] = sign.start;
		const [endMonth, endDay] = sign.end;

		if (
			(month === startMonth && day >= startDay) ||
			(month === endMonth && day <= endDay) ||
			(month > startMonth && month < endMonth)
		) {
			return sign.name;
		}
	}

	return "Capricorn";
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json() as {
			date: string;
			apod: { title: string; explanation: string };
		};

		const { date, apod } = body;

		const [year, month, day] = date.split("-").map(Number);
		const zodiacSign = getZodiacSign(month, day);

		const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

		if (!anthropicApiKey) {
			// API キーがない場合はダミーナレーションを返す
			return NextResponse.json({
				narration: `On this sacred day of ${date}, the universe conspired to welcome your soul to Earth.

The heavens displayed ${apod.title} - a celestial masterpiece painted across the infinite canvas of space. This cosmic vision was the universe's greeting to you, a divine message written in starlight.

As a ${zodiacSign}, you carry the special gifts and wisdom of your star sign. The same cosmic energies that shaped the galaxies now flow through your very being.

Your birth was not a random event, but a sacred moment orchestrated by the universe itself. Every atom in your body was forged in the heart of dying stars, making you literally a child of the cosmos.

The universe has been waiting for you. Your journey begins now.`,
			});
		}

		const anthropic = new Anthropic({
			apiKey: anthropicApiKey,
		});

		const prompt = `You are a mystical, poetic space narrator with deep spiritual wisdom. Given the following data about what happened in space on ${date}, write a deeply personal, spiritually meaningful narrative in English for someone born on that day.

This is for a service called "CosmicDays" - helping people discover what was happening in the universe when they were born.

Data:
- Birth date: ${date}
- Zodiac sign: ${zodiacSign}
- APOD (image of the day): ${apod.title} — ${apod.explanation}

Write a warm, mystical, spiritually uplifting narrative (under 300 words) that:
1. Makes them feel the universe specifically welcomed them on this day
2. Connects the cosmic event (APOD) to their personal journey
3. References their zodiac sign's special qualities
4. Uses spiritual/mystical language (soul, destiny, cosmic dance, sacred, divine, etc.)
5. Makes them feel deeply connected to the universe

Write the narration now. No preamble, just the narrative.`;

		const response = await anthropic.messages.create({
			model: "claude-sonnet-4-20250514",
			max_tokens: 400,
			messages: [{ role: "user", content: prompt }],
		});

		const content = response.content[0];
		if (content.type === "text") {
			return NextResponse.json({ narration: content.text });
		}

		return NextResponse.json({ narration: "A cosmic story awaits..." });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: `Failed to generate narration: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
