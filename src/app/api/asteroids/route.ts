import { NextRequest, NextResponse } from "next/server";
import { getAsteroidSpiritualMessage } from "../../../lib/cosmic";

// キャッシュ用（メモリ内キャッシュ）
const asteroidsCache = new Map<string, unknown>();

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
	if (asteroidsCache.has(date)) {
		return NextResponse.json(asteroidsCache.get(date));
	}

	const NASA_API_KEY = process.env.NASA_API_KEY;

	if (!NASA_API_KEY) {
		// API キーがない場合は空のデータを返す
		const result = {
			asteroids: [],
			count: 0,
			summary: "その日、地球に接近する小惑星はありませんでした。",
			spiritualMessage: "小惑星のない静かな日に生まれたあなたは、平和で安定したエネルギーを携えています。",
		};
		asteroidsCache.set(date, result);
		return NextResponse.json(result);
	}

	try {
		// NeoWs API から小惑星データを取得
		const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${NASA_API_KEY}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`NASA NeoWs API returned status ${response.status}`);
		}

		const data = await response.json() as {
			near_earth_objects: {
				[date: string]: Array<{
					id: string;
					name: string;
					diameter: {
						kilometers: {
							estimated_diameter_min_kilometers: number;
							estimated_diameter_max_kilometers: number;
						};
					};
					close_approach_data: Array<{
						miss_distance: {
							kilometers: string;
						};
						relative_velocity: {
							kilometers_per_hour: string;
						};
					}>;
					is_potentially_hazardous_asteroid: boolean;
				}>;
			};
		};

		// 指定日の小惑星データを取得（キーが存在しない場合もある）
		const asteroids = data.near_earth_objects[date] || [];

		// 距離でソート（最も近い順）
		const sortedAsteroids = asteroids.sort((a, b) => {
			const distA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers || "0");
			const distB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers || "0");
			return distA - distB;
		});

		let result;
		if (sortedAsteroids.length === 0) {
			result = {
				asteroids: [],
				count: 0,
				summary: "その日、地球に接近する小惑星はありませんでした。",
				spiritualMessage: "小惑星のない静かな日に生まれたあなたは、平和で安定したエネルギーを携えています。",
			};
		} else {
			const closest = sortedAsteroids[0];
			const closestDistance = parseFloat(closest.close_approach_data[0]?.miss_distance.kilometers || "0");
			const closestVelocity = parseFloat(closest.close_approach_data[0]?.relative_velocity.kilometers_per_hour || "0");
			// diameter.kilometers.estimated_diameter_min_kilometers としてアクセス
			const minDiameter = closest.diameter?.kilometers?.estimated_diameter_min_kilometers || 0;
			const maxDiameter = closest.diameter?.kilometers?.estimated_diameter_max_kilometers || 0;
			const isHazardous = closest.is_potentially_hazardous_asteroid;

			// 距離を AU に変換
			const distanceAu = (closestDistance / 149597870.7).toFixed(6);

			const resultClosest = {
				name: closest.name,
				distanceKm: closestDistance,
				distanceAu: parseFloat(distanceAu),
				velocityKmh: closestVelocity,
				diameterMinKm: minDiameter,
				diameterMaxKm: maxDiameter,
				isHazardous,
			};
			const asteroidLogic = getAsteroidSpiritualMessage(resultClosest, sortedAsteroids.length);

			result = {
				asteroids: sortedAsteroids.map(asteroid => ({
					id: asteroid.id,
					name: asteroid.name,
					diameterMinKm: asteroid.diameter?.kilometers?.estimated_diameter_min_kilometers || 0,
					diameterMaxKm: asteroid.diameter?.kilometers?.estimated_diameter_max_kilometers || 0,
					distanceKm: parseFloat(asteroid.close_approach_data[0]?.miss_distance.kilometers || "0"),
					velocityKmh: parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour || "0"),
					isHazardous: asteroid.is_potentially_hazardous_asteroid,
				})),
				count: sortedAsteroids.length,
				closest: resultClosest,
				summary: asteroidLogic.summary,
				spiritualMessage: asteroidLogic.spiritualMessage,
			};
		}

		// キャッシュに保存
		asteroidsCache.set(date, result);

		return NextResponse.json(result);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		console.error("Asteroids API error:", errorMessage);
		// エラー時も空データを返す（ページが壊れないように）
		const result = {
			asteroids: [],
			count: 0,
			summary: "小惑星データの取得中にエラーが発生しました。",
			spiritualMessage: "宇宙は常にあなたと共にあります。",
		};
		asteroidsCache.set(date, result);
		return NextResponse.json(result);
	}
}
