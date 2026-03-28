"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

interface SolarSystemInputProps {
	value: string; // YYYY-MM-DD
	onChange: (value: string) => void;
}

const SolarSystemInput: React.FC<SolarSystemInputProps> = ({ value, onChange }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDragging, setIsDragging] = useState<string | null>(null);

	// 現在の日付値をパース
	const { year, month, day } = useMemo(() => {
		if (!value) {
			const now = new Date();
			return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		}
		const [y, m, d] = value.split("-").map(Number);
		return { year: y, month: m, day: d };
	}, [value]);

	const YEAR_MIN = 1900;
	const YEAR_MAX = new Date().getFullYear();

	// 角度を値に変換
	const angleToValue = (angle: number, min: number, max: number) => {
		// atan2 は -PI から PI を返すので 0 から 2PI に変換
		let normalizedAngle = angle + Math.PI / 2;
		if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
		
		const range = max - min + 1;
		const val = Math.floor((normalizedAngle / (2 * Math.PI)) * range) + min;
		return Math.min(Math.max(val, min), max);
	};

	// 値を角度に変換
	const valueToAngle = (val: number, min: number, max: number) => {
		const range = max - min + 1;
		const normalizedProgress = (val - min) / range;
		return normalizedProgress * 2 * Math.PI - Math.PI / 2;
	};

	const handleUpdateDate = (newYear: number, newMonth: number, newDay: number) => {
		const m = String(newMonth).padStart(2, "0");
		const d = String(newDay).padStart(2, "0");
		onChange(`${newYear}-${m}-${d}`);
	};

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		if (!isDragging || !svgRef.current) return;

		const svg = svgRef.current;
		const rect = svg.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

		const angle = Math.atan2(clientY - centerY, clientX - centerX);

		if (isDragging === "year") {
			const v = angleToValue(angle, YEAR_MIN, YEAR_MAX);
			handleUpdateDate(v, month, day);
		} else if (isDragging === "month") {
			const v = angleToValue(angle, 1, 12);
			handleUpdateDate(year, v, day);
		} else if (isDragging === "day") {
			const maxDays = new Date(year, month, 0).getDate();
			const v = angleToValue(angle, 1, maxDays);
			handleUpdateDate(year, month, v);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(null);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchmove", handleMouseMove);
			window.addEventListener("touchend", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove);
			window.removeEventListener("touchend", handleMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchmove", handleMouseMove);
			window.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging, year, month, day]);

// イベント処理のデバッグ用
const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, type: string) => {
		e.preventDefault();
		setIsDragging(type);
	};

	// 各リングの半径
	const YEAR_RADIUS = 75;
	const MONTH_RADIUS = 125;
	const DAY_RADIUS = 175;

	// 各惑星の位置
	const getPos = (radius: number, angle: number) => ({
		x: 220 + radius * Math.cos(angle),
		y: 220 + radius * Math.sin(angle)
	});

	const yearAngle = valueToAngle(year, YEAR_MIN, YEAR_MAX);
	const monthAngle = valueToAngle(month, 1, 12);
	const dayAngle = valueToAngle(day, 1, new Date(year, month, 0).getDate());

	const yearPos = getPos(YEAR_RADIUS, yearAngle);
	const monthPos = getPos(MONTH_RADIUS, monthAngle);
	const dayPos = getPos(DAY_RADIUS, dayAngle);

	return (
		<div className="flex flex-col items-center gap-4 w-full max-w-[440px]">
			<div className="relative w-full aspect-square">
				<svg 
					ref={svgRef}
					viewBox="0 0 440 440" 
					className="w-full h-full select-none"
				>
					{/* 軌道 - クリック可能に */}
					<circle 
						cx="220" cy="220" r={YEAR_RADIUS} 
						fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="15" 
						className="cursor-pointer hover:stroke-[rgba(168, 85, 247, 0.2)] transition-colors"
						onMouseDown={() => setIsDragging("year")}
						onTouchStart={() => setIsDragging("year")}
					/>
					<circle 
						cx="220" cy="220" r={MONTH_RADIUS} 
						fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="15" 
						className="cursor-pointer hover:stroke-[rgba(168, 85, 247, 0.2)] transition-colors"
						onMouseDown={() => setIsDragging("month")}
						onTouchStart={() => setIsDragging("month")}
					/>
					<circle 
						cx="220" cy="220" r={DAY_RADIUS} 
						fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="15" 
						className="cursor-pointer hover:stroke-[rgba(168, 85, 247, 0.2)] transition-colors"
						onMouseDown={() => setIsDragging("day")}
						onTouchStart={() => setIsDragging("day")}
					/>

					{/* 太陽 */}
					<defs>
						<radialGradient id="sunGradient">
							<stop offset="0%" stopColor="#fbbf24" />
							<stop offset="100%" stopColor="#d97706" />
						</radialGradient>
						<filter id="glow">
							<feGaussianBlur stdDeviation="4" result="coloredBlur" />
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<circle cx="220" cy="220" r="28" fill="url(#sunGradient)" filter="url(#glow)" />
					
					{/* 年 (Purple Planet) */}
					<g 
						className="cursor-grab active:cursor-grabbing" 
						onMouseDown={(e) => handleMouseDown(e, "year")}
						onTouchStart={(e) => handleMouseDown(e, "year")}
					>
						{/* 透明なヒットエリア */}
						<circle cx={yearPos.x} cy={yearPos.y} r="25" fill="transparent" />
						<circle cx={yearPos.x} cy={yearPos.y} r="12" fill="#a855f7" filter="url(#glow)" />
						<text x={yearPos.x} y={yearPos.y - 18} textAnchor="middle" fill="#d8b4fe" fontSize="12" fontWeight="bold" className="pointer-events-none drop-shadow-md">
							{year}
						</text>
					</g>

					{/* 月 (Pink Planet) */}
					<g 
						className="cursor-grab active:cursor-grabbing" 
						onMouseDown={(e) => handleMouseDown(e, "month")}
						onTouchStart={(e) => handleMouseDown(e, "month")}
					>
						<circle cx={monthPos.x} cy={monthPos.y} r="25" fill="transparent" />
						<circle cx={monthPos.x} cy={monthPos.y} r="14" fill="#ec4899" filter="url(#glow)" />
						<text x={monthPos.x} y={monthPos.y - 20} textAnchor="middle" fill="#fbcfe8" fontSize="12" fontWeight="bold" className="pointer-events-none drop-shadow-md">
							{month}
						</text>
					</g>

					{/* 日 (Blue Planet) */}
					<g 
						className="cursor-grab active:cursor-grabbing" 
						onMouseDown={(e) => handleMouseDown(e, "day")}
						onTouchStart={(e) => handleMouseDown(e, "day")}
					>
						<circle cx={dayPos.x} cy={dayPos.y} r="25" fill="transparent" />
						<circle cx={dayPos.x} cy={dayPos.y} r="10" fill="#3b82f6" filter="url(#glow)" />
						<text x={dayPos.x} y={dayPos.y - 16} textAnchor="middle" fill="#bfdbfe" fontSize="12" fontWeight="bold" className="pointer-events-none drop-shadow-md">
							{day}
						</text>
					</g>
				</svg>

				{/* 中央の表示 - ブラシ効果的な背景 */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
					<div className="text-white font-bold text-xl drop-shadow-lg">
						{year}
					</div>
					<div className="text-purple-300 text-sm font-medium">
						{month}/{day}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SolarSystemInput;
