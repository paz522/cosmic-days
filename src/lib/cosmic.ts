// 宇宙関連の共有ロジック

export interface ApodData {
	title: string;
	url: string;
	explanation: string;
	hasImage?: boolean;
}

export interface SpaceWeatherData {
	events: Array<{ id: string; time: string; class: string }>;
	summary: string;
	spiritualMessage: string;
}

export interface AsteroidData {
	asteroids: Array<{
		id: string;
		name: string;
		diameterMinKm: number;
		diameterMaxKm: number;
		distanceKm: number;
		velocityKmh: number;
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

export interface CosmicLetter {
	intro: string;
	zodiac: string;
	moon: string;
	lifePath: string;
	spaceWeather: string;
	asteroid: string;
	blessing: string;
}

// 太陽活動に基づいたスピリチュアルメッセージ生成
export function getSolarSpiritualMessage(events: Array<{ class: string }>): { summary: string, spiritualMessage: string } {
	if (events.length === 0) {
		return {
			summary: "The sun was quiet that day. A gentle energy surrounds you.",
			spiritualMessage: "Born on a day of a quiet sun, you carry profound inner peace and harmony. You possess the power to discern the truth in silence, unaffected by the noise around you."
		};
	}

	const hasX = events.some(e => e.class.includes("X"));
	const hasM = events.some(e => e.class.includes("M"));
	const hasC = events.some(e => e.class.includes("C"));

	if (hasX) {
		return {
			summary: "On that day, the sun showed 'ultimate' activity. A massive X-class flare was observed.",
			spiritualMessage: "Born during a cosmic upheaval, you have the soul of an 'Innovator' destined to shatter old paradigms and birth a new era. Your profound passion transforms into an overwhelming thrust that makes the impossible possible."
		};
	}

	if (hasM) {
		return {
			summary: "On that day, the sun pulsed powerfully. A strong M-class flare was recorded.",
			spiritualMessage: "Born alongside the dynamic rhythm of the sun, you are endowed with strong will and determination. Your energy to forge ahead on your chosen path without hesitation will guide you to your destination."
		};
	}

	if (hasC) {
		return {
			summary: "On that day, the sun was bright and active. Multiple C-class flares were observed.",
			spiritualMessage: "Born amidst vibrant energy, you excel in communication and bring vitality to those around you. The light you radiate illuminates the path forward for everyone."
		};
	}

	return {
		summary: "On that day, the sun was gently active, repeating subtle changes.",
		spiritualMessage: "Born under the delicate light of the sun, you possess deep sensitivity to sense subtle shifts. You have the gift of finding the sacred within the ordinary and attuning the hearts of others."
	};
}

// 小惑星に基づいたスピリチュアルメッセージ生成（150 文字以内、重複なし）
export function getAsteroidSpiritualMessage(closest: AsteroidData['closest'], count: number): { summary: string, spiritualMessage: string } {
	if (count === 0) {
		return {
			summary: "On that day, no major asteroids passed near Earth.",
			spiritualMessage: "Born on a day of quiet cosmic voyages, you possess a strong sense of independence and stable spirituality, unwavering against external influences."
		};
	}

	const isHazardous = closest.isHazardous;
	const isLarge = closest.diameterMinKm > 0.5;

	// summary でデータを示すので、spiritualMessage は詩的なメッセージに集中
	let message = `"${closest.name}" watched over your birth. `;

	if (isHazardous) {
		message += "This 'hazardous' celestial body is a testament that you carry extraordinary power and a mission of profound transformation. ";
	} else if (isLarge) {
		message += "Its massive presence symbolizes the magnificent scale of your life's journey. ";
	} else {
		message += "As an emissary from the cosmos, it brought special meaning to your arrival. ";
	}

	message += "The universe is always with you.";

	return {
		summary: `On that day, ${count} asteroids approached Earth. The closest, "${closest.name}", came within approximately ${closest.distanceKm.toLocaleString()} km.`,
		spiritualMessage: message
	};
}

// 日付に基づいた導入・祝福のバリエーション選択
function getDeterministicHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash) + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

// 宇宙からの手紙を生成（preview/page.tsx と PDF で共有）
export function generateCosmicLetter(
	date: string,
	zodiacSign: string,
	zodiacSymbol: string,
	zodiacSoulMission: string,
	moonPhase: string,
	moonEmoji: string,
	moonEnergy: string,
	lifePathNumber: number,
	lifePathMeaning: string,
	lifePathMessage: string,
	spaceWeather: SpaceWeatherData | null,
	asteroids: AsteroidData | null
): CosmicLetter {
	const [year, month, day] = date.split("-").map(Number);
	const hash = getDeterministicHash(date);

	const intros = [
		[
			`Dear Child of Light,`,
			``,
			`As you read these words, the universe is speaking to you.`,
			``,
			`13.8 billion years ago, the universe began as a single spark of light.`,
			`That light split, became stars, formed galaxies, and eventually, became you.`,
			``,
			`On ${month}/${day}/${year},`,
			`the universe spent billions of years preparing`,
			`to send your very being into this world.`,
			``,
			`In a corner of the galaxy, a star twinkled.`,
			`The light of that star traveled across millions of years`,
			`to guide your soul to Earth.`,
			``,
			`You are the universe itself.`,
			`Within you flows the history of 13.8 billion years.`,
			`Your heartbeat connects with the heartbeat of the cosmos.`,
		],
		[
			`To the Infinite Voyager of the Cosmos,`,
			``,
			`Your existence is the 'masterpiece' created by the universe after hundreds of billions of stellar explosions.`,
			``,
			`On that day, ${month}/${day}/${year},`,
			`the stars aligned in a special configuration to bless your new life.`,
			`The moment you stepped onto the earth, the gravity of the entire universe shifted slightly,`,
			`and a new tale of destiny began to be written.`,
			``,
			`You are not just human.`,
			`You are a sacred expression born for the universe to 'experience itself'.`,
			`The radiance within you is made of the same stardust that illuminates distant galaxies.`,
		],
		[
			`To the Silent Witness of the Universe,`,
			``,
			`In the vast expanse of space and time, the birth of your life is nothing short of a miracle.`,
			``,
			`The day of ${month}/${day}/${year} was eternally engraved.`,
			`When you let out your first cry, the universe rejoiced in its own diversity,`,
			`confirming that a new light of consciousness had been kindled.`,
			``,
			`Your soul chose to descend into this specific era, to this specific place.`,
			`Because there are words only you can speak, and a love only you can paint.`,
			`Now, the time has come to break the silence of the cosmos and live your true self.`,
		]
	];

	const selectedIntro = intros[hash % intros.length].join("\n");

	return {
		intro: selectedIntro,
		zodiac: [
			`To you, born under ${zodiacSymbol} ${zodiacSign}`,
			``,
			`${zodiacSoulMission}`,
			``,
			`If you ever feel lonely, please know this.`,
			`Your inner light connects directly with the creative energy of the universe.`,
			`You are never alone.`,
			``,
			`The path you walk is uniquely yours.`,
			`There is no need to compare yourself, no need to become someone else.`,
			`You are already here as a perfect being.`,
			``,
			`With the soul of ${zodiacSign},`,
			`you were born to fulfill a special role in this lifetime.`,
			`A role that only you can fulfill.`,
			`The universe needs you.`,
		].join("\n"),
		moon: [
			`To you, born under a ${moonEmoji} ${moonPhase}`,
			``,
			`${moonEnergy}`,
			``,
			`For billions of years, the moon has watched over the Earth.`,
			`Waxing and waning, guiding the tides,`,
			`and marking the rhythm of life.`,
			``,
			`On the night you were born, the moon was watching you.`,
			`And it watches over you still.`,
			``,
			`Just as the moon cycles through phases of light and shadow,`,
			`your life too will have its ebbs and flows.`,
			`Both are essential for your growth.`,
			`Every experience makes you who you are.`,
		].join("\n"),
		lifePath: [
			`To you, born with Life Path Number ${lifePathNumber}`,
			``,
			`${lifePathMeaning}`,
			``,
			`${lifePathMessage}`,
			``,
			`Numerology is an ancient wisdom.`,
			`This number derived from your birthdate`,
			`points to the path your soul has chosen.`,
			``,
			`This path is the most natural course for you.`,
			`When you encounter resistance, your ego is in the way.`,
			`Surrender to the flow, and listen to your inner voice.`,
			`You will inevitably reach your destination.`,
		].join("\n"),
		spaceWeather: spaceWeather
			? [
				`☀️ Solar Energy`,
				``,
				`${spaceWeather.summary}`,
				``,
				`${spaceWeather.spiritualMessage}`,
				``,
				`The sun mirrors your life itself.`,
				`Sometimes quiet, sometimes burning fiercely,`,
				`constantly sending its energy to your being.`,
				``,
				`Whenever you feel weary,`,
				`remember the light of the sun.`,
				`From 150 million kilometers away,`,
				`the sun will never cease`,
				`to shine upon you.`,
				``,
				`Your life continues to shine just as brightly.`,
			].join("\n")
			: [
				`☀️ Solar Energy`,
				``,
				`Solar activity data for that day could not be retrieved.`,
				``,
				`However, the sun always shines upon you.`,
				``,
				`Even without data, the sun is there.`,
				`Like the love of those dear to you,`,
				`so close and constant that it often goes unnoticed.`,
				``,
				`The sun is waiting for you today, as always.`,
			].join("\n"),
		asteroid: asteroids && asteroids.count > 0
			? [
				`☄️ Your Guardian Celestial Body`,
				``,
				`${asteroids.summary}`,
				``,
				`${asteroids.spiritualMessage}`,
			].join("\n")
			: [
				`☄️ Your Guardian Celestial Body`,
				``,
				`On that day, no asteroids approached Earth.`,
				``,
				`This cosmic stillness suggests that your life is enveloped`,
				`in peaceful and stable energy.`,
				``,
				`A soul that chose gentle growth`,
				`rather than turbulent change.`,
				``,
				`Quietly, yet certainly,`,
				`you bring peace to those around you.`,
				``,
				`That is a truly profound gift.`,
			].join("\n"),
		blessing: (function() {
			const blessings = [
				[
					`Finally, a blessing from the universe:`,
					``,
					`"You are perfect exactly as you are.`,
					` There is no need to change, nothing to prove.`,
					``,
					` Your mere existence.`,
					` That alone makes the universe complete.`,
					``,
					` You are loved.`,
					` Not conditionally, but unconditionally.`,
					` Your successes, your failures, all of you is loved.`,
					``,
					` You are not alone.`,
					` In unseen places, the stars support you.`,
					` Every being in the cosmos is on your side.`,
					``,
					` We celebrate this day from the depths of our hearts.`,
					` Thank you for being born.`,
					` Your presence makes the world beautiful."`,
					``,
					`━━━━━━━━━━━━━━━━━━━━━`,
					``,
					`May this message reach the very depths of your heart.`,
					`The universe is always with you.`,
				],
				[
					`The universe's words of 'Celebration' entrusted to you:`,
					``,
					`"Your life is the stage where the cosmos dances.`,
					` Step forward with joy, and feel the light.`,
					``,
					` You are the memory of the universe itself.`,
					` Every emotion you experience becomes the treasure of the galaxy.`,
					``,
					` Do not fear. You can always return to the Source.`,
					` Follow the guidance of your soul and express your truth.`,
					``,
					` The universe blesses your adventure with infinite love.`,
					` That you are here now is the greatest gift."`,
					``,
					`━━━━━━━━━━━━━━━━━━━━━`,
					``,
					`May your soul continue to resonate with the harmony of the universe.`,
					`We wholeheartedly support your journey filled with light.`,
				]
			];
			return blessings[hash % blessings.length].join("\n");
		})(),
	};
}

// 誕生した日の深いスピリチュアルメッセージ
export function generateDeepMessage(zodiacSign: string): Array<{ title: string; content: string }> {
	return [
		{
			title: "🌟 A Gift from the Universe",
			content: "Your birth is the moment the entire universe was waiting for. Billions of stars have shined for billions of years just so your existence could manifest in this world."
		},
		{
			title: "✨ Soul Contract",
			content: "Before you were born, you chose on a soul level the experiences you would have in this life. The universe constantly supports that courageous decision."
		},
		{
			title: "🌌 Cosmic Guidance",
			content: `As a ${zodiacSign}, you have been granted a special gift from the universe. By recognizing and utilizing this gift, your soul will shine even brighter.`
		},
		{
			title: "💫 Infinite Potential",
			content: "The cosmos itself resides within you. By believing in yourself, your infinite potential will become reality."
		},
	];
}

// 誕生日から星座を計算
export function getZodiacSign(month: number, day: number): { name: string; symbol: string } {
	const zodiacSigns = [
		{ name: "Capricorn", symbol: "♑", start: [1, 1], end: [1, 19] },
		{ name: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18] },
		{ name: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20] },
		{ name: "Aries", symbol: "♈", start: [3, 21], end: [4, 19] },
		{ name: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20] },
		{ name: "Gemini", symbol: "♊", start: [5, 21], end: [6, 21] },
		{ name: "Cancer", symbol: "♋", start: [6, 22], end: [7, 22] },
		{ name: "Leo", symbol: "♌", start: [7, 23], end: [8, 22] },
		{ name: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22] },
		{ name: "Libra", symbol: "♎", start: [9, 23], end: [10, 23] },
		{ name: "Scorpio", symbol: "♏", start: [10, 24], end: [11, 21] },
		{ name: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21] },
		{ name: "Capricorn", symbol: "♑", start: [12, 22], end: [12, 31] },
	];

	for (const sign of zodiacSigns) {
		const [startMonth, startDay] = sign.start;
		const [endMonth, endDay] = sign.end;

		if (
			(month === startMonth && day >= startDay) ||
			(month === endMonth && day <= endDay) ||
			(month > startMonth && month < endMonth)
		) {
			return { name: sign.name, symbol: sign.symbol };
		}
	}

	return { name: "Capricorn", symbol: "♑" };
}

// 誕生日からスピリチュアルなメッセージを生成
export function generateSpiritualMessage(date: string, zodiacSign: string, apodTitle: string): string {
	const [year, month, day] = date.split("-").map(Number);

	const messages = [
		`On ${month}/${day}/${year}, the stars of ${zodiacSign} shined brightly just for you.`,
		`On this day, the universe aligned in a special configuration to bless the moment your soul descended to Earth.`,
		`${apodTitle} - This cosmic imagery reflects your inner light.`,
		`Guided by the stars, you were born into this world carrying your unique mission.`,
		`The energy of the cosmos poured into you, marking the beginning of a life filled with infinite possibilities.`,
	];

	return messages.join("\n\n");
}
