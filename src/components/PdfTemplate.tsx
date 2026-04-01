import React, { forwardRef } from 'react';

export interface ReportData {
	date: string;
	apod: {
		title: string;
		url: string;
		explanation: string;
		hasImage: boolean;
		base64Image?: string;
	};
	cosmicLetter: {
		intro: string;
		zodiac: string;
		moon: string;
		lifePath: string;
		spaceWeather: string;
		asteroid: string;
		blessing: string;
	};
	zodiacSign: string;
	zodiacSymbol: string;
	moonPhase: { phase: string; emoji: string };
	lifePathNumber: number;
}

const PAGE_WIDTH = 794; // A4 width at 96 DPI
const PAGE_HEIGHT = 1123; // A4 height at 96 DPI

const PdfTemplate = forwardRef<HTMLDivElement, { data: ReportData }>(({ data }, ref) => {
	const nl2br = (text: string) => {
		return text.split("\n").map((line, i) => (
			<React.Fragment key={i}>
				{line}
				<br />
			</React.Fragment>
		));
	};

	// CSS-in-JS style object to ensure strict layout for html2canvas
	const styles = {
		page: {
			width: `${PAGE_WIDTH}px`,
			height: `${PAGE_HEIGHT}px`,
			position: 'relative' as const,
			padding: '95px', // ~25mm
			backgroundColor: '#050510',
			color: '#e2e8f0',
			fontFamily: '"Noto Sans JP", sans-serif',
			fontSize: '14px',
			lineHeight: 1.7,
			overflow: 'hidden' as const,
			breakAfter: 'always' as const,
			pageBreakAfter: 'always' as const,
		},
		background: {
			position: 'absolute' as const,
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: 'linear-gradient(135deg, #050510 0%, #1a0a2e 50%, #050510 100%)',
			zIndex: 0,
		},
		borderFrame: {
			position: 'absolute' as const,
			top: '38px', // ~10mm
			left: '38px',
			right: '38px',
			bottom: '38px',
			border: '1px solid rgba(168, 85, 247, 0.3)',
			zIndex: 1,
		},
		borderInner: {
			position: 'absolute' as const,
			top: '8px', // 2mm from frame
			left: '8px',
			right: '8px',
			bottom: '8px',
			border: '2px solid #d97706',
			opacity: 0.5,
			zIndex: 2,
		},
		cornerStar: {
			position: 'absolute' as const,
			fontSize: '18px',
			color: '#fbbf24',
			zIndex: 10,
		},
		content: {
			position: 'relative' as const,
			zIndex: 5,
			display: 'flex',
			flexDirection: 'column' as const,
			height: '100%',
		},
		coverContent: {
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center' as const,
		},
		h1: {
			fontFamily: '"Noto Serif JP", serif',
			fontSize: '42px',
			fontWeight: 700,
			textAlign: 'center' as const,
			marginBottom: '20px',
			color: '#fbbf24',
		},
		h2: {
			fontFamily: '"Noto Serif JP", serif',
			fontSize: '24px',
			fontWeight: 700,
			color: '#fcd34d',
			margin: '20px 0 15px 0',
			display: 'flex',
			alignItems: 'center',
			gap: '12px',
		},
		card: {
			background: 'rgba(26, 26, 46, 0.7)',
			border: '1px solid rgba(168, 85, 247, 0.2)',
			borderRadius: '16px',
			padding: '24px',
			margin: '20px 0',
			boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
			width: '100%',
			fontSize: '16px',
			lineHeight: 1.8,
		},
		sectionTitle: {
			color: '#fbbf24',
			fontWeight: 700,
			fontSize: '16px',
			marginBottom: '12px',
			display: 'block',
			textTransform: 'uppercase' as const,
			letterSpacing: '1.5px',
		},
		blessingBox: {
			background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(131, 24, 67, 0.3))',
			border: '1px solid rgba(251, 191, 36, 0.4)',
			padding: '30px',
			borderRadius: '20px',
			fontStyle: 'italic',
			fontSize: '20px',
			lineHeight: 2.2,
			textAlign: 'center' as const,
		},
		footer: {
			marginTop: 'auto',
			textAlign: 'center' as const,
			width: '100%',
			color: '#94a3b8',
			fontSize: '12px',
			borderTop: '1px solid rgba(255, 255, 255, 0.1)',
			paddingTop: '15px',
		}
	};

	const PageBorder = () => (
		<>
			<div style={styles.background}></div>
			<div style={styles.borderFrame}>
				<div style={styles.borderInner}></div>
			</div>
			<div style={{ ...styles.cornerStar, top: '26px', left: '26px' }}>✦</div>
			<div style={{ ...styles.cornerStar, top: '26px', right: '26px' }}>✦</div>
			<div style={{ ...styles.cornerStar, bottom: '26px', left: '26px' }}>✦</div>
			<div style={{ ...styles.cornerStar, bottom: '26px', right: '26px' }}>✦</div>
		</>
	);

	const apodImageSrc = data.apod.base64Image || data.apod.url;

	return (
		<div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#000' }}>
			{/* Page 1: Cover */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={{ ...styles.content, ...styles.coverContent }}>
					<div style={{ fontSize: '80px', marginBottom: '24px', color: '#fbbf24' }}>✦</div>
					<h1 style={styles.h1}>CosmicDays Report</h1>
					<p style={{ fontSize: '20px', color: '#d8b4fe', marginBottom: '40px', letterSpacing: '2px' }}>
						{data.date.replace(/-/g, '.')} — The eternal moment you descended
					</p>
					{data.apod.hasImage && (
						<div style={{ width: '100%', maxWidth: '400px', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '12px', marginBottom: '20px' }}>
							<img src={apodImageSrc} alt={data.apod.title} style={{ width: '100%', borderRadius: '8px', display: 'block' }} crossOrigin="anonymous" />
							<p style={{ fontSize: '11px', marginTop: '10px', color: '#a855f7' }}>{data.apod.title}</p>
						</div>
					)}
					<p style={{ maxWidth: '380px', marginTop: '12px', color: '#94a3b8', lineHeight: 1.5, fontSize: '13px' }}>
						This report deciphers the cosmic alignment on the day you were born,<br />
						and compiles it as a message to your soul.
					</p>
				</div>
			</div>

			{/* Page 2: Introduction */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>📖 Cosmic Guidance</h2>
					<div style={styles.card}>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.intro)}</div>
					</div>
					<div style={styles.footer}>
						<p>CosmicDays — You are the Universe experiencing itself</p>
					</div>
				</div>
			</div>

			{/* Page 3: Zodiac */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>{data.zodiacSymbol} {data.zodiacSign} - Soul Mission</h2>
					<div style={styles.card}>
						<span style={styles.sectionTitle}>Zodiac Message</span>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.zodiac)}</div>
					</div>
				</div>
			</div>

			{/* Page 4: Moon Phase */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>{data.moonPhase.emoji} {data.moonPhase.phase} - Moon Energy</h2>
					<div style={styles.card}>
						<span style={styles.sectionTitle}>Moon Phase Energy</span>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.moon)}</div>
					</div>
				</div>
			</div>

			{/* Page 5: Life Path */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>🔢 Life Path Number {data.lifePathNumber}</h2>
					<div style={styles.card}>
						<span style={styles.sectionTitle}>Numerology Path</span>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.lifePath)}</div>
					</div>
				</div>
			</div>

			{/* Page 6: Space Weather */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>☀️ Solar Energy</h2>
					<div style={styles.card}>
						<span style={styles.sectionTitle}>Solar Activity</span>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.spaceWeather)}</div>
					</div>
				</div>
			</div>

			{/* Page 7: Asteroid */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>☄️ Your Guardian Star</h2>
					<div style={styles.card}>
						<span style={styles.sectionTitle}>Celestial Guardians</span>
						<div style={{ fontSize: '16px', lineHeight: 1.8 }}>{nl2br(data.cosmicLetter.asteroid)}</div>
					</div>
				</div>
			</div>

			{/* Page 8: Blessing */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={{ ...styles.content, justifyContent: 'center' }}>
					<div style={styles.blessingBox}>
						<div>{nl2br(data.cosmicLetter.blessing)}</div>
					</div>
					<div style={styles.footer}>
						<p>May the love of the universe always be with you.</p>
					</div>
				</div>
			</div>

			{/* Page 9: APOD Detail */}
			<div className="pdf-page" style={styles.page}>
				<PageBorder />
				<div style={styles.content}>
					<h2 style={styles.h2}>🔭 {data.apod.title}</h2>
					<div style={styles.card}>
						<p style={{ fontSize: '13px', color: '#cbd5e1' }}>{nl2br(data.apod.explanation)}</p>
					</div>
					<div style={styles.footer}>
						<p>Generated by CosmicDays on {new Date().toLocaleDateString('en-US')}</p>
					</div>
				</div>
			</div>
		</div>
	);
});

PdfTemplate.displayName = 'PdfTemplate';

export default PdfTemplate;
