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
		name: "山羊座",
		englishName: "Capricorn",
		symbol: "♑",
		element: "Earth",
		rulingPlanet: "Saturn",
		dateRange: "12/22 - 1/19",
		description: "宇宙の建築家。大地のエネルギーを受け継ぎ、現実世界に夢を具現化する使命を持っています。",
		luckyColor: "#2C5F2D",
		spiritualMessage: "あなたの魂は、物質世界で精神性を体現するために生まれました。",
		soulMission: "あなたには「建築家」としての使命があります。一歩一歩、着実に夢を現実にする力。それがあなたの魂が選んだ道です。",
		strengths: ["忍耐力", "責任感", "野心", "実用性"],
		weaknesses: ["頑固さ", "悲観的", "冷たく見える"],
		compatibility: "牡牛座・乙女座・蠍座・魚座",
	},
	{
		name: "水瓶座",
		englishName: "Aquarius",
		symbol: "♒",
		element: "Air",
		rulingPlanet: "Uranus",
		dateRange: "1/20 - 2/18",
		description: "宇宙の革新者。天のエネルギーを受け継ぎ、人類に新しいビジョンをもたらす使命を持っています。",
		luckyColor: "#4A90E2",
		spiritualMessage: "あなたの魂は、古い枠組みを壊し、新しい時代を切り開くために生まれました。",
		soulMission: "あなたには「革新者」としての使命があります。既存の概念を壊し、新しい未来を創造する力。それがあなたの魂が選んだ道です。",
		strengths: ["独創性", "人道主義", "独立心"],
		weaknesses: ["感情的距離", "予測不能", "頑固"],
		compatibility: "双子座・天秤座・射手座・牡羊座",
	},
	{
		name: "魚座",
		englishName: "Pisces",
		symbol: "♓",
		element: "Water",
		rulingPlanet: "Neptune",
		dateRange: "2/19 - 3/20",
		description: "宇宙の夢見人。水のエネルギーを受け継ぎ、目に見えない世界と繋がる使命を持っています。",
		luckyColor: "#97D8D8",
		spiritualMessage: "あなたの魂は、霊的な真実を感受性で感じ取るために生まれました。",
		soulMission: "あなたには「癒し手」としての使命があります。深い共感力で他者を癒す力。それがあなたの魂が選んだ道です。",
		strengths: ["共感力", "直感", "芸術性", "優しさ"],
		weaknesses: ["逃避的", "被害者意識", "境界線のなさ"],
		compatibility: "蟹座・蠍座・牡牛座・山羊座",
	},
	{
		name: "牡羊座",
		englishName: "Aries",
		symbol: "♈",
		element: "Fire",
		rulingPlanet: "Mars",
		dateRange: "3/21 - 4/19",
		description: "宇宙の戦士。火のエネルギーを受け継ぎ、新しい始まりを切り開く使命を持っています。",
		luckyColor: "#E74C3C",
		spiritualMessage: "あなたの魂は、勇気を持って先駆者となるために生まれました。",
		soulMission: "あなたには「先駆者」としての使命があります。誰も歩んだことのない道を、恐れることなく進む勇気。それがあなたの魂が選んだ道です。",
		strengths: ["勇気", "情熱", "リーダーシップ", "正直"],
		weaknesses: ["短気", "自己中心的", "攻撃的"],
		compatibility: "獅子座・射手座・双子座・天秤座",
	},
	{
		name: "牡牛座",
		englishName: "Taurus",
		symbol: "♉",
		element: "Earth",
		rulingPlanet: "Venus",
		dateRange: "4/20 - 5/20",
		description: "宇宙の守護者。大地のエネルギーを受け継ぎ、美と豊かさを育む使命を持っています。",
		luckyColor: "#27AE60",
		spiritualMessage: "あなたの魂は、地球上の美しさと豊かさを体験するために生まれました。",
		soulMission: "あなたには「守護者」としての使命があります。美と豊かさを育み、守り続ける力。それがあなたの魂が選んだ道です。",
		strengths: ["信頼性", "忍耐", "実用性", "献身"],
		weaknesses: ["頑固", "所有欲", "変化を嫌う"],
		compatibility: "乙女座・山羊座・蟹座・魚座",
	},
	{
		name: "双子座",
		englishName: "Gemini",
		symbol: "♊",
		element: "Air",
		rulingPlanet: "Mercury",
		dateRange: "5/21 - 6/20",
		description: "宇宙の使者。風のエネルギーを受け継ぎ、知識と情報を伝える使命を持っています。",
		luckyColor: "#F39C12",
		spiritualMessage: "あなたの魂は、言葉と知恵で世界を繋ぐために生まれました。",
		soulMission: "あなたには「使者」としての使命があります。言葉と知恵で人々を繋ぐ力。それがあなたの魂が選んだ道です。",
		strengths: ["適応力", "知性", "好奇心", "コミュニケーション"],
		weaknesses: ["神経質", "優柔不断", "表面的"],
		compatibility: "天秤座・水瓶座・牡羊座・獅子座",
	},
	{
		name: "蟹座",
		englishName: "Cancer",
		symbol: "♋",
		element: "Water",
		rulingPlanet: "Moon",
		dateRange: "6/21 - 7/22",
		description: "宇宙の養育者。水のエネルギーを受け継ぎ、愛と安心を育む使命を持っています。",
		luckyColor: "#9B59B6",
		spiritualMessage: "あなたの魂は、無条件の愛と nurturing を世界に与えるために生まれました。",
		soulMission: "あなたには「養育者」としての使命があります。無条件の愛で他者を守り、育む力。それがあなたの魂が選んだ道です。",
		strengths: ["直感", "感受性", "愛情", "保護的"],
		weaknesses: ["気まぐれ", "執着", "被害者意識"],
		compatibility: "蠍座・魚座・牡牛座・乙女座",
	},
	{
		name: "獅子座",
		englishName: "Leo",
		symbol: "♌",
		element: "Fire",
		rulingPlanet: "Sun",
		dateRange: "7/23 - 8/22",
		description: "宇宙の王。太陽のエネルギーを受け継ぎ、光と創造性を放つ使命を持っています。",
		luckyColor: "#F1C40F",
		spiritualMessage: "あなたの魂は、内なる光を輝かせ、他者を照らすために生まれました。",
		soulMission: "あなたには「王」としての使命があります。内なる光を放ち、他者を照らし導く力。それがあなたの魂が選んだ道です。",
		strengths: ["創造性", "情熱", "寛大さ", "暖かさ"],
		weaknesses: ["傲慢", "頑固", "自己中心的"],
		compatibility: "牡羊座・射手座・双子座・天秤座",
	},
	{
		name: "乙女座",
		englishName: "Virgo",
		symbol: "♍",
		element: "Earth",
		rulingPlanet: "Mercury",
		dateRange: "8/23 - 9/22",
		description: "宇宙の癒し手。大地のエネルギーを受け継ぎ、純粋さと奉仕で世界を清める使命を持っています。",
		luckyColor: "#8E44AD",
		spiritualMessage: "あなたの魂は、細部への注意と奉仕で世界を癒すために生まれました。",
		soulMission: "あなたには「癒し手」としての使命があります。細部への注意と奉仕で、世界を清める力。それがあなたの魂が選んだ道です。",
		strengths: ["分析力", "注意力", "勤勉", "実用性"],
		weaknesses: ["完璧主義", "批判的", "心配性"],
		compatibility: "牡牛座・山羊座・蟹座・蠍座",
	},
	{
		name: "天秤座",
		englishName: "Libra",
		symbol: "♎",
		element: "Air",
		rulingPlanet: "Venus",
		dateRange: "9/23 - 10/22",
		description: "宇宙の調停者。風のエネルギーを受け継ぎ、調和と美を創造する使命を持っています。",
		luckyColor: "#3498DB",
		spiritualMessage: "あなたの魂は、バランスと美しさで世界を調和させるために生まれました。",
		soulMission: "あなたには「調停者」としての使命があります。バランスと美しさで、世界を調和させる力。それがあなたの魂が選んだ道です。",
		strengths: ["外交的", "公平", "魅力的", "協調性"],
		weaknesses: ["優柔不断", "対立を避ける", "自己憐憫"],
		compatibility: "双子座・水瓶座・獅子座・射手座",
	},
	{
		name: "蠍座",
		englishName: "Scorpio",
		symbol: "♏",
		element: "Water",
		rulingPlanet: "Pluto",
		dateRange: "10/23 - 11/21",
		description: "宇宙の変容者。水のエネルギーを受け継ぎ、死と再生を司る使命を持っています。",
		luckyColor: "#C0392B",
		spiritualMessage: "あなたの魂は、深い変容と再生を通じて真実を明らかにするために生まれました。",
		soulMission: "あなたには「変容者」としての使命があります。深い変容と再生を通じて、真実を明らかにする力。それがあなたの魂が選んだ道です。",
		strengths: ["情熱", "決断力", "直感", "神秘性"],
		weaknesses: ["嫉妬", "秘密主義", "執着"],
		compatibility: "魚座・蟹座・山羊座・乙女座",
	},
	{
		name: "射手座",
		englishName: "Sagittarius",
		symbol: "♐",
		element: "Fire",
		rulingPlanet: "Jupiter",
		dateRange: "11/22 - 12/21",
		description: "宇宙の探求者。火のエネルギーを受け継ぎ、真理と知恵を求める使命を持っています。",
		luckyColor: "#E67E22",
		spiritualMessage: "あなたの魂は、冒険と哲学を通じて宇宙の真理を見つけるために生まれました。",
		soulMission: "あなたには「探求者」としての使命があります。冒険と哲学を通じて、宇宙の真理を見つける力。それがあなたの魂が選んだ道です。",
		strengths: ["楽観的", "冒険心", "正直", "知恵"],
		weaknesses: ["無鉄砲", "無神経", "約束を破る"],
		compatibility: "牡羊座・獅子座・双子座・天秤座",
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
			name: "新月",
			emoji: "🌑",
			min: 0,
			max: 1,
			meaning: "新しい始まりの瞬間。あなたの人生の章がここに始まりました。内なる声に耳を傾け、新しい意図を設定する時です。",
			energy: "新月に生まれたあなたは、無限の可能性を秘めています。何者にもなれる自由を持っています。"
		},
		{
			name: "三日月",
			emoji: "🌒",
			min: 2,
			max: 5,
			meaning: "成長と発展の時期。あなたの夢はゆっくりと形になり始めています。希望を持ち、行動を起こす時です。",
			energy: "三日月に生まれたあなたは、成長する力を持っています。小さな一歩が、やがて大きな実りになります。"
		},
		{
			name: "上弦の月",
			emoji: "🌓",
			min: 6,
			max: 8,
			meaning: "決断と行動の時期。障害を乗り越え、目標に向かって進む力を持っています。勇気を持って前進してください。",
			energy: "上弦の月に生まれたあなたは、行動する勇気を持っています。障害を乗り越える力が、あなたの内側にあります。"
		},
		{
			name: "満月に近い",
			emoji: "🌔",
			min: 9,
			max: 13,
			meaning: "完成への準備。あなたの努力が実を結ぼうとしています。感謝の心で受け取る準備をしましょう。",
			energy: "満月に近い月に生まれたあなたは、実現する力を持っています。あなたの願いは、すでに宇宙に届いています。"
		},
		{
			name: "満月",
			emoji: "🌕",
			min: 14,
			max: 16,
			meaning: "完全なる光の瞬間。あなたの魂は最も輝いています。直感力と霊的感覚が最高潮に達しています。",
			energy: "満月に生まれたあなたは、完全なる光を放っています。あなたの存在そのものが、周囲を照らします。"
		},
		{
			name: "満月を過ぎた",
			emoji: "🌖",
			min: 17,
			max: 21,
			meaning: "手放しと解放の時期。不要なものを手放し、内省する時です。感謝と共に解放しましょう。",
			energy: "満月を過ぎた月に生まれたあなたは、手放す知恵を持っています。不要なものを解放し、新しい空間を作りましょう。"
		},
		{
			name: "下弦の月",
			emoji: "🌗",
			min: 22,
			max: 24,
			meaning: "内省と浄化の時期。自分自身と向き合い、魂の声を聞く時です。静寂の中で答えを見つけましょう。",
			energy: "下弦の月に生まれたあなたは、内なる声に耳を傾ける力を持っています。静寂の中に、答えがあります。"
		},
		{
			name: "欠けゆく月",
			emoji: "🌘",
			min: 25,
			max: 29,
			meaning: "休息と再生の準備。次のサイクルに向けてエネルギーを蓄える時です。自分自身を大切にしましょう。",
			energy: "欠けゆく月に生まれたあなたは、休息の重要性を知っています。自分自身を慈しむことが、次の成長につながります。"
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
			meaning: "The Leader - 独立したリーダー",
			description: "あなたは自然なリーダーとして生まれました。独自の道を切り開く勇気と、他者を導く力を持っています。",
			lifeMessage: "あなたの人生のテーマは「自立」です。自分の道を信じて進むことで、他者を導く光となります。"
		},
		2: {
			meaning: "The Peacemaker - 調停者",
			description: "あなたは調和とバランスをもたらすために生まれました。共感力で世界を繋ぎます。",
			lifeMessage: "あなたの人生のテーマは「調和」です。あなたの優しさが、周囲の対立を癒します。"
		},
		3: {
			meaning: "The Creative - 創造的な表現者",
			description: "あなたは喜びと創造性を世界に伝えるために生まれました。表現を通じて他者を鼓舞します。",
			lifeMessage: "あなたの人生のテーマは「表現」です。あなたの創造性が、世界に喜びを届けます。"
		},
		4: {
			meaning: "The Builder - 堅実な建築家",
			description: "あなたは安定と基盤を築くために生まれました。勤勉さと実用性で夢を現実にします。",
			lifeMessage: "あなたの人生のテーマは「基盤」です。一歩一歩、着実に夢を現実にする力を持っています。"
		},
		5: {
			meaning: "The Freedom Seeker - 自由の探求者",
			description: "あなたは変化と冒険のために生まれました。自由を愛し、多様な経験を通じて成長します。",
			lifeMessage: "あなたの人生のテーマは「自由」です。変化を恐れず、冒険を続けることで真の自由を手に入れます。"
		},
		6: {
			meaning: "The Nurturer - 養育者",
			description: "あなたは愛と奉仕のために生まれました。家族とコミュニティを守り、癒す使命を持っています。",
			lifeMessage: "あなたの人生のテーマは「愛」です。あなたの無条件の愛が、多くの人を癒します。"
		},
		7: {
			meaning: "The Seeker - 真理の探求者",
			description: "あなたは霊的な真実を求めるために生まれました。内省と分析を通じて深い知恵を得ます。",
			lifeMessage: "あなたの人生のテーマは「真実」です。内なる声に耳を傾けることで、深い知恵が得られます。"
		},
		8: {
			meaning: "The Achiever - 達成者",
			description: "あなたは物質と精神のバランスを取るために生まれました。成功と豊かさを現実のものにします。",
			lifeMessage: "あなたの人生のテーマは「達成」です。物質と精神のバランスを取りながら、大きな成功を収めます。"
		},
		9: {
			meaning: "The Humanitarian - 人道主義者",
			description: "あなたは世界に貢献するために生まれました。無私の愛と奉仕で人類に貢献します。",
			lifeMessage: "あなたの人生のテーマは「奉仕」です。あなたの無私の愛が、世界をより良くします。"
		},
		11: {
			meaning: "Master Number 11 - 霊的メッセンジャー",
			description: "あなたは高い霊性を持って生まれました。直感とインスピレーションで他者を照らします。",
			lifeMessage: "あなたの人生のテーマは「霊的覚醒」です。あなたの直感が、他者に光をもたらします。"
		},
		22: {
			meaning: "Master Number 22 - マスタービルダー",
			description: "あなたは大きな夢を現実にする力を持って生まれました。霊的なビジョンを物質世界に具現化します。",
			lifeMessage: "あなたの人生のテーマは「具現化」です。あなたのビジョンが、現実世界に大きな変化をもたらします。"
		},
		33: {
			meaning: "Master Number 33 - マスターティーチャー",
			description: "あなたは無条件の愛を教えるために生まれました。奉仕と癒しを通じて世界を変えます。",
			lifeMessage: "あなたの人生のテーマは「無条件の愛」です。あなたの存在そのものが、世界を癒します。"
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
		`✨ 宇宙からのメッセージ ✨

亲爱的旅人，${ageInYears}年前の今日、宇宙はあなたという存在をこの世界に送り出しました。

あなたの星座 ${zodiac.symbol} ${zodiac.englishName} は、${zodiac.element} のエレメントを持ち、${zodiac.rulingPlanet} の影響下にあります。これは偶然ではありません。あなたの魂はこの人生で ${zodiac.description.split('。')[0]} ことを事前に選びました。

${moonPhase.phase} ${moonPhase.emoji} の月に生まれたあなたは、${moonPhase.spiritualMeaning}

数秘術のライフパスナンバー ${lifePath.number} — ${lifePath.meaning}

宇宙はあなたを見ています。あなたの歩む道を祝福しています。
あなたは一人ではありません。星々があなたを導いています。`,
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

	return `🌟 あなたの守護天体 🌟

${asteroidName} が、あなたの誕生日に地球から ${distance.toLocaleString()} km (${distanceAu} AU) まで接近していました。

この小惑星は、${zodiac.englishName} であるあなたの人生のガイドとして機能します。${asteroidName} は今も太陽を周回し、あなたの旅を見守り続けています。

宇宙はあなたを忘れない。星々はあなたの名前を知っている。`;
}

// 地球周回メッセージ
export function getEarthOrbitMessage(date: string): string {
	const d = new Date(date);
	const today = new Date();
	const ageInDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
	const earthOrbits = Math.floor(ageInDays / 365.25);
	const distanceTraveledKm = earthOrbits * 940000000;
	const lightYears = (distanceTraveledKm / 9460730472580.8).toFixed(6);

	return `🌍 あなたの宇宙の旅 🌍

あなたは地球と共に ${earthOrbits} 回、太陽を周回しました。

移動距離：${distanceTraveledKm.toLocaleString()} km
光年に換算：${lightYears} 光年

これは単なる数字ではありません。あなたの魂が宇宙を旅した証です。
各周回で、あなたは成長し、学び、進化しました。

次の周回が、あなたにとって最も輝かしい年となりますように。`;
}
