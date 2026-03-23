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
			summary: "その日の太陽は静かでした。穏やかなエネルギーがあなたを包んでいます。",
			spiritualMessage: "太陽が静かな日に生まれたあなたは、内なる平和と調和を携えています。周囲の喧騒に惑わされることなく、静かに真実を見極める力を持っています。"
		};
	}

	const hasX = events.some(e => e.class.includes("X"));
	const hasM = events.some(e => e.class.includes("M"));
	const hasC = events.some(e => e.class.includes("C"));

	if (hasX) {
		return {
			summary: "その日、太陽は「究極」の活発さを見せていました。Xクラスの巨大フレアが観測されています。",
			spiritualMessage: "宇宙の激動期に生まれたあなたは、古い枠組みを破壊し、新しい時代を創造する「変革者」の魂を持っています。あなたの情熱は、不可能を可能にする圧倒的な推進力となります。"
		};
	}

	if (hasM) {
		return {
			summary: "その日、太陽は力強く脈動していました。Mクラスの強力なフレアが記録されています。",
			spiritualMessage: "太陽のダイナミックなリズムと共に生まれたあなたは、強い意志と決断力を備えています。自らの信じる道へ向かって、迷わず突き進むエネルギーがあなたを目的地へと導くでしょう。"
		};
	}

	if (hasC) {
		return {
			summary: "その日、太陽は明るく活発に活動していました。Cクラスのフレアが複数観測されています。",
			spiritualMessage: "活気あるエネルギーの中で生まれたあなたは、コミュニケーション能力に優れ、周囲に活力を与える存在です。あなたの放つ光は、人々の歩みを前向きに照らし出すでしょう。"
		};
	}

	return {
		summary: "その日、太陽は微細な変化を繰り返しながら、緩やかに活動していました。",
		spiritualMessage: "繊細な太陽の光の下で生まれたあなたは、物事の微妙な変化を感じ取れる高い感受性を持っています。日常の中に神聖さを見出し、心を調律する才能があります。"
	};
}

// 小惑星に基づいたスピリチュアルメッセージ生成
export function getAsteroidSpiritualMessage(closest: AsteroidData['closest'], count: number): { summary: string, spiritualMessage: string } {
	if (count === 0) {
		return {
			summary: "その日、地球の近傍を通過する主要な小惑星はありませんでした。",
			spiritualMessage: "星々の航路が静かな日に生まれたあなたは、外部の影響に左右されない、強固な自立心と安定した精神性を持っています。"
		};
	}

	const isVeryClose = closest.distanceKm < 1000000; // 100万km以内
	const isVeryFast = closest.velocityKmh > 60000; // 時速6万km以上
	const isLarge = closest.diameterMinKm > 0.5; // 直径500m以上（最小推定）

	let message = `「${closest.name}」という守護天体が、あなたの誕生を見守っていました。`;
	
	if (isVeryClose) {
		message += "この天体がこれほど近くまで駆けつけたのは、あなたの魂が宇宙から特別な「近さ」で守られている証です。直感的な導きを信じてください。";
	} else if (isLarge) {
		message += "その巨大な存在感は、あなたの人生が持つ壮大なスケールと、ゆるぎない使命を象徴しています。あなたは時間をかけて大輪の花を咲かせる魂です。";
	} else if (isVeryFast) {
		message += "その驚異的な速度は、あなたの思考の鋭さと、人生における急速な進展を意味しています。あなたは変化を好機に変え、光のような速さで成長する力を持っています。";
	} else {
		message += "この天体は宇宙の深淵からの使者として、あなたの誕生に独自の「調和」というエッセンスを添えています。あなたは自分だけのリズムで歩む強さを持っています。";
	}

	return {
		summary: `その日、${count}個の小惑星が地球に接近していました。最も近づいた「${closest.name}」は、地球から約${closest.distanceKm.toLocaleString()}kmまで接近していました。`,
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
			`親愛なる光の子供よ`,
			``,
			`あなたがこの文章を読んでいる今、宇宙はあなたに語りかけようとしています。`,
			``,
			`138 億年前、宇宙はたった一つの光から始まりました。`,
			`その光が分裂し、星になり、銀河になり、そしてあなたになりました。`,
			``,
			`${year}年${month}月${day}日。`,
			`この日、宇宙はあなたという存在をこの世界に送り出すために、`,
			`何十億年もの時を準備しました。`,
			``,
			`銀河の片隅で、一つの星が瞬きました。`,
			`その星の光は、何百万年もの時を超えて、`,
			`あなたの魂を地球へと導きました。`,
			``,
			`あなたは、宇宙そのものなのです。`,
			`あなたの内側には、138 億年の歴史が流れています。`,
			`あなたの鼓動は、宇宙の鼓動とつながっています。`,
		],
		[
			`無限なる宇宙の旅人へ`,
			``,
			`あなたの存在は、宇宙が数千億回の星の爆発を経て作り出した「最高傑作」です。`,
			``,
			`あの日、${year}年${month}月${day}日。`,
			`星々はあなたという新しい命を祝福するために、特別な配置につきました。`,
			`あなたが地球の土を踏んだその瞬間、宇宙全体の重力がわずかに変化し、`,
			`新しい運命の物語が書き始められたのです。`,
			``,
			`あなたはただの人間ではありません。`,
			`あなたは、宇宙が「自分自身を体験するため」に生み出した、神聖な表現の一つです。`,
			`あなたの内にある輝きは、遠い銀河を照らす星と同じ素材でできています。`,
		],
		[
			`静かなる宇宙の目撃者よ`,
			``,
			`広大な時空の中で、あなたという命が誕生したのは、奇跡の一言では言い表せません。`,
			``,
			`${year}年${month}月${day}日。その刻は永遠に刻まれました。`,
			`あなたが産声を上げたとき、宇宙は自らの多様性を喜び、`,
			`新しい意識の光が灯ったことを確認しました。`,
			``,
			`あなたの魂は、この特定の時代、この特定の場所を選んで降り立ちました。`,
			`それは、あなたにしか語れない言葉、あなたにしか描けない愛があるからです。`,
			`今、宇宙の沈黙を破り、あなたの真実を生きる準備が整っています。`,
		]
	];

	const selectedIntro = intros[hash % intros.length].join("\n");

	return {
		intro: selectedIntro,
		zodiac: [
			`${zodiacSymbol} ${zodiacSign}として生まれたあなたへ`,
			``,
			`${zodiacSoulMission}`,
			``,
			`もし今、あなたが孤独を感じているなら、知ってください。`,
			`あなたの内なる光は、宇宙の創造エネルギーとつながっています。`,
			`決して一人ではありません。`,
			``,
			`あなたが歩む道は、あなただけの道です。`,
			`誰かと比べる必要も、誰かになる必要もありません。`,
			`あなたは、すでに完璧な存在として、ここにいます。`,
			``,
			`${zodiacSign}の魂を持つあなたは、`,
			`この人生で特別な役割を果たすために生まれてきました。`,
			`その役割は、あなただけが果たせるものです。`,
			`宇宙は、あなたを必要としています。`,
		].join("\n"),
		moon: [
			`${moonEmoji} ${moonPhase}の月に生まれたあなたへ`,
			``,
			`${moonEnergy}`,
			``,
			`月は何十億年もの間、地球を見守り続けてきました。`,
			`満ち欠けを繰り返し、潮の満ち引きを導き、`,
			`生命のリズムを刻んできました。`,
			``,
			`あなたが生まれた夜、月はあなたを見ていました。`,
			`そして今も、あなたを見守り続けています。`,
			``,
			`月が満ち欠けを繰り返すように、`,
			`あなたの人生にも、光と影のサイクルがあります。`,
			`どちらの瞬間も、あなたの成長に必要なものです。`,
			`すべての経験が、あなたをあなたにしています。`,
		].join("\n"),
		lifePath: [
			`ライフパスナンバー ${lifePathNumber}として生まれたあなたへ`,
			``,
			`${lifePathMeaning}`,
			``,
			`${lifePathMessage}`,
			``,
			`数秘術は、古代から伝わる叡智です。`,
			`あなたの生年月日から導き出されるこの数字は、`,
			`あなたの魂が選んだ道を示しています。`,
			``,
			`この道は、あなたにとって最も自然な道です。`,
			`抵抗感があるときは、 ego が邪魔をしています。`,
			`流れに身を任せて、内なる声に従ってください。`,
			`必ず、あなたの目的地にたどり着きます。`,
		].join("\n"),
		spaceWeather: spaceWeather
			? [
				`☀️ 太陽のエネルギー`,
				``,
				`${spaceWeather.summary}`,
				``,
				`${spaceWeather.spiritualMessage}`,
				``,
				`太陽は、あなたの人生そのものを映し出しています。`,
				`時には静かに、時には激しく燃え盛り、`,
				`あなたという存在にエネルギーを送り続けています。`,
				``,
				`あなたが疲れを感じたときは、`,
				`太陽の光を思い出してください。`,
				`1 億 5000 万 km 離れた場所から、`,
				`太陽はあなたを照らし続けることを、`,
				`決してやめません。`,
				``,
				`あなたの命も、同じように輝き続けています。`,
			].join("\n")
			: [
				`☀️ 太陽のエネルギー`,
				``,
				`その日の太陽活動データは取得できませんでした。`,
				``,
				`しかし、太陽は常にあなたを照らし続けています。`,
				``,
				`データがなくても、太陽はそこにあります。`,
				`あなたの愛する人の心のように、`,
				`当たり前すぎて、気づかないだけで。`,
				``,
				`太陽は、今日もあなたを待っています。`,
			].join("\n"),
		asteroid: asteroids && asteroids.count > 0
			? [
				`☄️ あなたの守護天体`,
				``,
				`${asteroids.summary}`,
				``,
				`${asteroids.spiritualMessage}`,
				``,
				`最も接近した「${asteroids.closest.name}」は、`,
				`直径${asteroids.closest.diameterMinKm.toFixed(0)}〜${asteroids.closest.diameterMaxKm.toFixed(0)}km、`,
				`時速${asteroids.closest.velocityKmh.toLocaleString()}km で宇宙を旅しています。`,
				``,
				`この小惑星は、あなたの誕生日に`,
				`地球から${asteroids.closest.distanceKm.toLocaleString()}km まで接近していました。`,
				``,
				`想像してみてください。`,
				`あなたがこの世に産声を上げたその瞬間、`,
				`宇宙の彼方から、一つの天体が`,
				`あなたを見守るように近づいてきたのです。`,
				``,
				`この小惑星は今も太陽を周回し、`,
				`あなたの人生を見守り続けています。`,
				``,
				`あなたが一人でいると感じたとき、`,
				`宇宙には、あなたのことを覚えている天体があります。`,
				`何十億年もの時を超えて、`,
				`あなたの存在を知っている存在が。`,
			].join("\n")
			: [
				`☄️ あなたの守護天体`,
				``,
				`その日、地球に接近する小惑星はありませんでした。`,
				``,
				`これは、あなたの人生が平穏で安定した`,
				`エネルギーに包まれていることを示しています。`,
				``,
				`激しい変化ではなく、`,
				`穏やかな成長を選んだ魂。`,
				``,
				`目立つことなく、しかし確かに、`,
				`あなたは周囲に平和をもたらしています。`,
				``,
				`それは、とても尊いことです。`,
			].join("\n"),
		blessing: (function() {
			const blessings = [
				[
					`最後に、宇宙からあなたへ贈る言葉：`,
					``,
					`「あなたは、あるがままで完璧です。`,
					`  変わる必要も、何かを証明する必要もありません。`,
					``,
					`  あなたが存在していること。`,
					`  それだけで、宇宙は complete なのです。`,
					``,
					`  あなたは愛されています。`,
					`  条件付きではなく、無条件に。`,
					`  あなたの成功も、失敗も、すべてが愛されています。`,
					``,
					`  あなたは一人ではありません。`,
					`  見えないところで、星々があなたを支えています。`,
					`  宇宙のすべての存在が、あなたの味方です。`,
					``,
					`  今日という日を、心から祝福します。`,
					`  あなたが生まれてきてくれて、ありがとう。`,
					`  あなたの存在が、世界を美しくしています。」`,
					``,
					`━━━━━━━━━━━━━━━━━━━━━`,
					``,
					`このメッセージが、あなたの心の奥深くに届きますように。`,
					`宇宙は、いつもあなたと共にあります。`,
				],
				[
					`宇宙があなたに託した「祝祭」の言葉：`,
					``,
					`「あなたの人生は、宇宙が踊るためのステージです。`,
					`  喜びをもって一歩を踏み出し、光を感じてください。`,
					``,
					`  あなたは宇宙の記憶そのものです。`,
					`  あなたが経験するすべての感情が、銀河の財産となります。`,
					``,
					`  恐れることはありません。あなたは常にソース（源）に戻ることができます。`,
					`  あなたの魂の導きに従い、自らの真実を表現してください。`,
					``,
					`  宇宙はあなたの冒険を、無限の愛と共に祝福しています。`,
					`  あなたが今ここにいること、それが最大の贈り物です。」`,
					``,
					`━━━━━━━━━━━━━━━━━━━━━`,
					``,
					`あなたの魂が、宇宙のハーモニーと共鳴し続けますように。`,
					`光に満ちた旅路を、心から応援しています。`,
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
			title: "🌟 宇宙からの贈り物",
			content: "あなたの誕生は、宇宙全体が待ち望んでいた瞬間です。何億もの星々が、あなたという存在がこの世に現れるために、何十億年も光り続けてきました。"
		},
		{
			title: "✨ 魂の契約",
			content: "あなたは生まれる前に、この人生で経験することを魂レベルで選びました。その勇気ある決断を、宇宙は常にサポートし続けています。"
		},
		{
			title: "🌌 星の導き",
			content: `${zodiacSign}のあなたは、宇宙から特別なギフトを与えられています。そのギフトに気づき、活かすことで、あなたの魂は輝きを増していきます。`
		},
		{
			title: "💫 無限の可能性",
			content: "あなたの内側には、宇宙そのものが宿っています。自分自身を信じることで、無限の可能性が現実のものとなっていきます。"
		},
	];
}

// 誕生日から星座を計算
export function getZodiacSign(month: number, day: number): { name: string; symbol: string } {
	const zodiacSigns = [
		{ name: "山羊座", symbol: "♑", start: [1, 1], end: [1, 19] },
		{ name: "水瓶座", symbol: "♒", start: [1, 20], end: [2, 18] },
		{ name: "魚座", symbol: "♓", start: [2, 19], end: [3, 20] },
		{ name: "牡羊座", symbol: "♈", start: [3, 21], end: [4, 19] },
		{ name: "牡牛座", symbol: "♉", start: [4, 20], end: [5, 20] },
		{ name: "双子座", symbol: "♊", start: [5, 21], end: [6, 21] },
		{ name: "蟹座", symbol: "♋", start: [6, 22], end: [7, 22] },
		{ name: "獅子座", symbol: "♌", start: [7, 23], end: [8, 22] },
		{ name: "乙女座", symbol: "♍", start: [8, 23], end: [9, 22] },
		{ name: "天秤座", symbol: "♎", start: [9, 23], end: [10, 23] },
		{ name: "蠍座", symbol: "♏", start: [10, 24], end: [11, 21] },
		{ name: "射手座", symbol: "♐", start: [11, 22], end: [12, 21] },
		{ name: "山羊座", symbol: "♑", start: [12, 22], end: [12, 31] },
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

	return { name: "山羊座", symbol: "♑" };
}

// 誕生日からスピリチュアルなメッセージを生成
export function generateSpiritualMessage(date: string, zodiacSign: string, apodTitle: string): string {
	const [year, month, day] = date.split("-").map(Number);
	
	const messages = [
		`${year}年${month}月${day}日、${zodiacSign}の星々があなたのために輝いていました。`,
		`この日、宇宙は特別な配置となり、あなたの魂が地球に降り立つ瞬間を祝福しました。`,
		`${apodTitle} - この宇宙の姿は、あなたの内なる光を映し出しています。`,
		`星々の導きにより、あなたはこの世に生まれ、独自の使命を帯びて歩み始めました。`,
		`宇宙のエネルギーがあなたに注がれ、無限の可能性を秘めた人生の幕開けとなりました。`,
	];

	return messages.join("\n\n");
}
