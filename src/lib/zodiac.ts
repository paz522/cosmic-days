// 星座・スピリチュアル計算ユーティリティ

export interface ZodiacSign {
	name: string;
	englishName: string;
	symbol: string;
	element: string;
	rulingPlanet: string;
	dateRange: string;
	description: string;
	luckyColor: string;
	spiritualMessage: string;
	soulMission: string;
	strengths: string[];
	weaknesses: string[];
	compatibility: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
	{
		name: "Capricorn",
		englishName: "Capricorn",
		symbol: "♑",
		element: "Earth",
		rulingPlanet: "Saturn",
		dateRange: "12/22 - 1/19",
		description: "Cosmic Architect. Inheriting the energy of the earth, you have a mission to manifest dreams in the physical world.",
		luckyColor: "#2C5F2D",
		spiritualMessage: "Your soul was born to embody spirituality in the material world.",
		soulMission: "You have a mission as an 'Architect'. The power to steadily turn dreams into reality, step by step.",
		strengths: ["Patience", "Responsibility", "Ambition", "Practicality"],
		weaknesses: ["Stubbornness", "Pessimism", "Can appear cold"],
		compatibility: "Taurus, Virgo, Scorpio, Pisces",
	},
	{
		name: "Aquarius",
		englishName: "Aquarius",
		symbol: "♒",
		element: "Air",
		rulingPlanet: "Uranus",
		dateRange: "1/20 - 2/18",
		description: "Cosmic Innovator. Inheriting celestial energy, you bring new visions to humanity.",
		luckyColor: "#4A90E2",
		spiritualMessage: "Your soul was born to break old frameworks and pioneer a new era.",
		soulMission: "You have a mission as an 'Innovator'. The power to break existing concepts and create a new future.",
		strengths: ["Originality", "Humanitarianism", "Independence"],
		weaknesses: ["Emotional distance", "Unpredictability", "Stubbornness"],
		compatibility: "Gemini, Libra, Sagittarius, Aries",
	},
	{
		name: "Pisces",
		englishName: "Pisces",
		symbol: "♓",
		element: "Water",
		rulingPlanet: "Neptune",
		dateRange: "2/19 - 3/20",
		description: "Cosmic Dreamer. Inheriting the energy of water, you connect with the unseen world.",
		luckyColor: "#97D8D8",
		spiritualMessage: "Your soul was born to perceive spiritual truths through sensitivity.",
		soulMission: "You have a mission as a 'Healer'. The power to heal others with deep empathy.",
		strengths: ["Empathy", "Intuition", "Artistry", "Gentleness"],
		weaknesses: ["Escapism", "Victim mentality", "Lack of boundaries"],
		compatibility: "Cancer, Scorpio, Taurus, Capricorn",
	},
	{
		name: "Aries",
		englishName: "Aries",
		symbol: "♈",
		element: "Fire",
		rulingPlanet: "Mars",
		dateRange: "3/21 - 4/19",
		description: "Cosmic Warrior. Inheriting the energy of fire, you pioneer new beginnings.",
		luckyColor: "#E74C3C",
		spiritualMessage: "Your soul was born to courageously be a pioneer.",
		soulMission: "You have a mission as a 'Pioneer'. The courage to tread an untrodden path fearlessly.",
		strengths: ["Courage", "Passion", "Leadership", "Honesty"],
		weaknesses: ["Impatience", "Egocentricity", "Aggressiveness"],
		compatibility: "Leo, Sagittarius, Gemini, Libra",
	},
	{
		name: "Taurus",
		englishName: "Taurus",
		symbol: "♉",
		element: "Earth",
		rulingPlanet: "Venus",
		dateRange: "4/20 - 5/20",
		description: "Cosmic Guardian. Inheriting earth energy, you nurture beauty and abundance.",
		luckyColor: "#27AE60",
		spiritualMessage: "Your soul was born to experience the beauty and abundance of the earth.",
		soulMission: "You have a mission as a 'Guardian'. The power to nurture and protect beauty and abundance.",
		strengths: ["Reliability", "Patience", "Practicality", "Devotion"],
		weaknesses: ["Stubbornness", "Possessiveness", "Dislike of change"],
		compatibility: "Virgo, Capricorn, Cancer, Pisces",
	},
	{
		name: "Gemini",
		englishName: "Gemini",
		symbol: "♊",
		element: "Air",
		rulingPlanet: "Mercury",
		dateRange: "5/21 - 6/20",
		description: "Cosmic Messenger. Inheriting air energy, you transmit knowledge and information.",
		luckyColor: "#F39C12",
		spiritualMessage: "Your soul was born to connect the world through words and wisdom.",
		soulMission: "You have a mission as a 'Messenger'. The power to connect people with words and wisdom.",
		strengths: ["Adaptability", "Intelligence", "Curiosity", "Communication"],
		weaknesses: ["Nervousness", "Indecisiveness", "Superficiality"],
		compatibility: "Libra, Aquarius, Aries, Leo",
	},
	{
		name: "Cancer",
		englishName: "Cancer",
		symbol: "♋",
		element: "Water",
		rulingPlanet: "Moon",
		dateRange: "6/21 - 7/22",
		description: "Cosmic Nurturer. Inheriting water energy, you foster love and security.",
		luckyColor: "#9B59B6",
		spiritualMessage: "Your soul was born to bring unconditional love and nurturing to the world.",
		soulMission: "You have a mission as a 'Nurturer'. The power to protect and nurture others with unconditional love.",
		strengths: ["Intuition", "Sensitivity", "Affection", "Protectiveness"],
		weaknesses: ["Moodiness", "Clinginess", "Victim mentality"],
		compatibility: "Scorpio, Pisces, Taurus, Virgo",
	},
	{
		name: "Leo",
		englishName: "Leo",
		symbol: "♌",
		element: "Fire",
		rulingPlanet: "Sun",
		dateRange: "7/23 - 8/22",
		description: "Cosmic Royalty. Inheriting solar energy, you radiate light and creativity.",
		luckyColor: "#F1C40F",
		spiritualMessage: "Your soul was born to shine your inner light and illuminate others.",
		soulMission: "You have a mission as 'Royalty'. The power to radiate inner light and guide others.",
		strengths: ["Creativity", "Passion", "Generosity", "Warmth"],
		weaknesses: ["Arrogance", "Stubbornness", "Egocentricity"],
		compatibility: "Aries, Sagittarius, Gemini, Libra",
	},
	{
		name: "Virgo",
		englishName: "Virgo",
		symbol: "♍",
		element: "Earth",
		rulingPlanet: "Mercury",
		dateRange: "8/23 - 9/22",
		description: "Cosmic Healer. Inheriting earth energy, you purify the world through service.",
		luckyColor: "#8E44AD",
		spiritualMessage: "Your soul was born to heal the world through attention to detail and service.",
		soulMission: "You have a mission as a 'Healer'. The power to purify the world through detail and service.",
		strengths: ["Analytical skills", "Attentiveness", "Diligence", "Practicality"],
		weaknesses: ["Perfectionism", "Critical nature", "Anxiety"],
		compatibility: "Taurus, Capricorn, Cancer, Scorpio",
	},
	{
		name: "Libra",
		englishName: "Libra",
		symbol: "♎",
		element: "Air",
		rulingPlanet: "Venus",
		dateRange: "9/23 - 10/22",
		description: "Cosmic Mediator. Inheriting air energy, you create harmony and beauty.",
		luckyColor: "#3498DB",
		spiritualMessage: "Your soul was born to harmonize the world with balance and beauty.",
		soulMission: "You have a mission as a 'Mediator'. The power to harmonize the world through balance and beauty.",
		strengths: ["Diplomacy", "Fairness", "Charm", "Cooperativeness"],
		weaknesses: ["Indecisiveness", "Conflict avoidance", "Self-pity"],
		compatibility: "Gemini, Aquarius, Leo, Sagittarius",
	},
	{
		name: "Scorpio",
		englishName: "Scorpio",
		symbol: "♏",
		element: "Water",
		rulingPlanet: "Pluto",
		dateRange: "10/23 - 11/21",
		description: "Cosmic Transformer. Inheriting water energy, you govern death and rebirth.",
		luckyColor: "#C0392B",
		spiritualMessage: "Your soul was born to reveal truths through deep transformation.",
		soulMission: "You have a mission as a 'Transformer'. The power to reveal truths through deep transformation and rebirth.",
		strengths: ["Passion", "Decisiveness", "Intuition", "Mysticism"],
		weaknesses: ["Jealousy", "Secrecy", "Obsessiveness"],
		compatibility: "Pisces, Cancer, Capricorn, Virgo",
	},
	{
		name: "Sagittarius",
		englishName: "Sagittarius",
		symbol: "♐",
		element: "Fire",
		rulingPlanet: "Jupiter",
		dateRange: "11/22 - 12/21",
		description: "Cosmic Seeker. Inheriting fire energy, you seek truth and wisdom.",
		luckyColor: "#E67E22",
		spiritualMessage: "Your soul was born to find cosmic truth through adventure and philosophy.",
		soulMission: "You have a mission as a 'Seeker'. The power to find cosmic truth through adventure and philosophy.",
		strengths: ["Optimism", "Adventurousness", "Honesty", "Wisdom"],
		weaknesses: ["Recklessness", "Insensitivity", "Breaking promises"],
		compatibility: "Aries, Leo, Gemini, Libra",
	},
];

export function getZodiacSign(month: number, day: number): ZodiacSign {
	const boundaries: Array<{ month: number; day: number; index: number }> = [
		{ month: 1, day: 20, index: 1 },
		{ month: 2, day: 19, index: 2 },
		{ month: 3, day: 21, index: 3 },
		{ month: 4, day: 20, index: 4 },
		{ month: 5, day: 21, index: 5 },
		{ month: 6, day: 21, index: 6 },
		{ month: 7, day: 23, index: 7 },
		{ month: 8, day: 23, index: 8 },
		{ month: 9, day: 23, index: 9 },
		{ month: 10, day: 23, index: 10 },
		{ month: 11, day: 22, index: 11 },
		{ month: 12, day: 22, index: 0 },
	];

	for (const boundary of boundaries) {
		if (month === boundary.month && day >= boundary.day) {
			return ZODIAC_SIGNS[boundary.index];
		}
	}

	if (month === 1) return ZODIAC_SIGNS[0];
	if (month === 2) return ZODIAC_SIGNS[2];
	if (month === 3) return ZODIAC_SIGNS[3];
	if (month === 4) return ZODIAC_SIGNS[4];
	if (month === 5) return ZODIAC_SIGNS[5];
	if (month === 6) return ZODIAC_SIGNS[6];
	if (month === 7) return ZODIAC_SIGNS[7];
	if (month === 8) return ZODIAC_SIGNS[8];
	if (month === 9) return ZODIAC_SIGNS[9];
	if (month === 10) return ZODIAC_SIGNS[10];
	if (month === 11) return ZODIAC_SIGNS[11];
	if (month === 12) return ZODIAC_SIGNS[0];

	return ZODIAC_SIGNS[0];
}

// 月齢計算
export function getMoonPhase(date: string): {
	phase: string;
	illumination: number;
	emoji: string;
	spiritualMeaning: string;
	energyMessage: string;
} {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();

	const c = Math.floor((year + Math.floor(month / 13)) / 100);
	const y = year - 1900 + Math.floor(month / 13) - 19 * c;
	const m = month % 13 + 1;
	const d2 = day;

	let age = (Math.floor(29.5 * ((y * 12 + m - 3 + Math.floor(y / 4)) % 30) / 29.5) + d2) % 30;
	age = Math.floor(age);

	const phases = [
		{
			name: "New Moon",
			emoji: "🌑",
			min: 0,
			max: 1,
			meaning: "A moment of new beginnings. You were meant to start new chapters with a clean slate.",
			energy: "Born under a New Moon, you have infinite potential and the freedom to become anything."
		},
		{
			name: "Waxing Crescent",
			emoji: "🌒",
			min: 2,
			max: 5,
			meaning: "A time of growth. Dreams slowly taking form. Hope and action are your keys.",
			energy: "Born under a Waxing Crescent, you possess the power to grow and nurture seeds of potential."
		},
		{
			name: "First Quarter",
			emoji: "🌓",
			min: 6,
			max: 8,
			meaning: "A time of decision and action. A period of overcoming obstacles and moving towards your goals.",
			energy: "Born under a First Quarter moon, you possess the courage to act and overcome obstacles."
		},
		{
			name: "Waxing Gibbous",
			emoji: "🌔",
			min: 9,
			max: 13,
			meaning: "Preparation for completion. Your efforts are about to bear fruit.",
			energy: "Born under a Waxing Gibbous, you possess the power of realization. Your wishes are being heard."
		},
		{
			name: "Full Moon",
			emoji: "🌕",
			min: 14,
			max: 16,
			meaning: "A moment of perfect light. Your soul shines brightest with peak intuition.",
			energy: "Born under a Full Moon, you radiate perfect light. Your existence illuminates those around you."
		},
		{
			name: "Waning Gibbous",
			emoji: "🌖",
			min: 17,
			max: 21,
			meaning: "A time of letting go and release. Give thanks and free what no longer serves.",
			energy: "Born under a Waning Gibbous, you possess the wisdom of release, creating space for the new."
		},
		{
			name: "Last Quarter",
			emoji: "🌗",
			min: 22,
			max: 24,
			meaning: "A time of introspection and purification. Listen to your soul's voice in silence.",
			energy: "Born under a Last Quarter moon, you know how to hear the inner voice. The answers lie within."
		},
		{
			name: "Waning Crescent",
			emoji: "🌘",
			min: 25,
			max: 29,
			meaning: "Preparation for rest and regeneration. Preserve your energy for the next cycle.",
			energy: "Born under a Waning Crescent, you know the importance of rest. Self-care fuels your growth."
		},
	];

	const phase = phases.find(p => age >= p.min && age <= p.max) || phases[0];
	const illumination = Math.round((1 - Math.cos((age / 15) * Math.PI)) / 2 * 100);

	return {
		phase: phase.name,
		illumination,
		emoji: phase.emoji,
		spiritualMeaning: phase.meaning,
		energyMessage: phase.energy,
	};
}

// 数秘術計算
export function getLifePathNumber(date: string): {
	number: number;
	meaning: string;
	description: string;
	lifeMessage: string;
} {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();

	let sum = year + month + day;
	while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
		sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
	}

	const meanings: Record<number, { meaning: string; description: string; lifeMessage: string }> = {
		1: {
			meaning: "The Leader",
			description: "You were born as a natural leader. You have the courage to pave your own path and guide others.",
			lifeMessage: "Your life theme is 'Independence'. By believing in your path, you become a guiding light for others."
		},
		2: {
			meaning: "The Peacemaker",
			description: "You were born to bring harmony and balance. You connect the world through empathy.",
			lifeMessage: "Your life theme is 'Harmony'. Your kindness heals the conflicts around you."
		},
		3: {
			meaning: "The Creative",
			description: "You were born to spread joy and creativity to the world. You inspire others through expression.",
			lifeMessage: "Your life theme is 'Expression'. Your creativity brings joy to the world."
		},
		4: {
			meaning: "The Builder",
			description: "You were born to build stability and foundations. You make dreams a reality with diligence and practicality.",
			lifeMessage: "Your life theme is 'Foundation'. You steadily turn dreams into reality, step by step."
		},
		5: {
			meaning: "The Freedom Seeker",
			description: "You were born for change and adventure. You love freedom and grow through diverse experiences.",
			lifeMessage: "Your life theme is 'Freedom'. By not fearing change, you attain true freedom."
		},
		6: {
			meaning: "The Nurturer",
			description: "You were born for love and service. You have a mission to protect and heal your family and community.",
			lifeMessage: "Your life theme is 'Love'. Your unconditional love heals many."
		},
		7: {
			meaning: "The Seeker",
			description: "You were born to seek spiritual truth. You gain deep wisdom through introspection and analysis.",
			lifeMessage: "Your life theme is 'Truth'. Listening to your inner voice provides profound wisdom."
		},
		8: {
			meaning: "The Achiever",
			description: "You were born to balance the material and the spiritual. You make success and abundance a reality.",
			lifeMessage: "Your life theme is 'Achievement'. You achieve great success by balancing the physical and spiritual."
		},
		9: {
			meaning: "The Humanitarian",
			description: "You were born to contribute to the world. You serve humanity with selfless love.",
			lifeMessage: "Your life theme is 'Service'. Your selfless love makes the world a better place."
		},
		11: {
			meaning: "Master Number 11 - The Spiritual Messenger",
			description: "You are born with high spirituality. You illuminate others with intuition and inspiration.",
			lifeMessage: "Your life theme is 'Spiritual Awakening'. Your intuition brings light to others."
		},
		22: {
			meaning: "Master Number 22 - The Master Builder",
			description: "You possess the power to make grand dreams a reality. You manifest spiritual visions in the physical world.",
			lifeMessage: "Your life theme is 'Manifestation'. Your vision brings significant change to the real world."
		},
		33: {
			meaning: "Master Number 33 - The Master Teacher",
			description: "You were born to teach unconditional love. You change the world through service and healing.",
			lifeMessage: "Your life theme is 'Unconditional Love'. Your very existence heals the world."
		},
	};

	return {
		number: sum,
		...meanings[sum] || meanings[9],
		lifeMessage: meanings[sum]?.lifeMessage || meanings[9].lifeMessage,
	};
}

// 宇宙からのメッセージ生成
export function getCosmicMessage(
	date: string,
	zodiac: ZodiacSign,
	moonPhase: { phase: string; spiritualMeaning: string; emoji: string },
	lifePath: { number: number; meaning: string }
): string {
	const d = new Date(date);
	const today = new Date();
	const ageInYears = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

	const messages = [
		`✨ Message from the Universe ✨

Dear traveler, ${ageInYears} years ago today, the universe sent your being into this world.

Your sign ${zodiac.symbol} ${zodiac.englishName} has the element of ${zodiac.element} and is ruled by ${zodiac.rulingPlanet}. This is no coincidence. Your soul chose to experience this life in this way.

Born under a ${moonPhase.phase} ${moonPhase.emoji}, ${moonPhase.spiritualMeaning}

Your Life Path Number is ${lifePath.number} — ${lifePath.meaning}

The universe is watching you. It blesses the path you walk.
You are not alone. The stars are guiding you.`,
	];

	return messages[0];
}

// 守護星メッセージ
export function getGuardianStarMessage(
	asteroidName: string,
	distance: number,
	zodiac: ZodiacSign
): string {
	const distanceAu = (distance / 149597870.7).toFixed(6);

	return `🌟 Your Guardian Celestial Body 🌟

${asteroidName} approached Earth at a distance of ${distance.toLocaleString()} km (${distanceAu} AU) on your birthday.

This asteroid serves as a guide for your life as a ${zodiac.englishName}. ${asteroidName} continues to orbit the sun today, watching over your journey.

The universe never forgets you. The stars know your name.`;
}

// 地球周回メッセージ
export function getEarthOrbitMessage(date: string): string {
	const d = new Date(date);
	const today = new Date();
	const ageInDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
	const earthOrbits = Math.floor(ageInDays / 365.25);
	const distanceTraveledKm = earthOrbits * 940000000;
	const lightYears = (distanceTraveledKm / 9460730472580.8).toFixed(6);

	return `🌍 Your Cosmic Journey 🌍

You have orbited the sun ${earthOrbits} times along with the Earth.

Distance Traveled: ${distanceTraveledKm.toLocaleString()} km
In Light Years: ${lightYears} light years

These are not merely numbers. They are proof of your soul's journey through the cosmos.
With each orbit, you have grown, learned, and evolved.

May your next orbit be your brightest year yet.`;
}
