export interface AIMessageInput {
	type: "solar" | "asteroid";
	data: any;
}

export async function generateAISpiritualMessage(input: AIMessageInput): Promise<string | null> {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		console.warn("OPENROUTER_API_KEY not found in environment variables.");
		return null;
	}

	let prompt = "";
	if (input.type === "solar") {
		const flareInfo = input.data.events.length > 0 
			? `On that day, the sun experienced ${input.data.events.map((e: any) => e.class).join(", ")} flares.`
			: "The sun was very quiet that day.";
		
		prompt = `You are a spiritual counselor who interprets cosmic energy.
According to NASA data, the solar activity on the subject's birth date was:
${flareInfo}

Based on this data, write a mystical and heartwarming 1-2 sentence message about the nature of their soul and the blessings they receive.
Strict Rules:
- Do NOT mention anything about Zodiac signs. Focus ONLY on the sun's energy.
- Write in poetic, majestic yet gentle English.
- Keep it under 150 characters.`;
	} else {
		const asteroid = input.data.closest;
		prompt = `You are an astrologer who interprets the guidance of the soul through the movement of celestial bodies.
According to NASA data, on the subject's birthday, an asteroid named "${asteroid.name}" approached within ${asteroid.distanceKm.toLocaleString()} km of Earth.
This asteroid has an estimated diameter of ${asteroid.diameterMinKm.toFixed(2)} km and was traveling at a speed of ${asteroid.velocityKmh.toLocaleString()} km/h.

Based on this specific data, write a 1-2 sentence spiritual message for the person whose birth was watched over by this celestial body.
Strict Rules:
- You MUST include the asteroid's name (${asteroid.name}).
- Creatively interpret the specific numbers (speed, distance) as the 'momentum' of their life or 'closeness of guardianship'.
- Write in English.
- Keep it under 150 characters.`;
	}

	try {
		const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"HTTP-Referer": "https://cosmic-days.com", // プレースホルダー
				"X-Title": "CosmicDays",
			},
			body: JSON.stringify({
				model: "google/gemini-2.0-flash-lite-001", // 高速・低価格モデル
				messages: [
					{ role: "system", content: "You are a mystical and intelligent spokesperson of the universe." },
					{ role: "user", content: prompt }
				],
				max_tokens: 150,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("OpenRouter API error:", errorData);
			return null;
		}

		const result = await response.json() as any;
		return result.choices?.[0]?.message?.content?.trim() || null;
	} catch (error) {
		console.error("Failed to call OpenRouter:", error);
		return null;
	}
}
