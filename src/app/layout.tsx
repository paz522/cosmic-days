import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cosmic Days | Your Personal Universe",
	description: "Discover the cosmic energy on the day you were born. A personalized spiritual journey through your unique astrology, numerology, and space weather.",
	openGraph: {
		title: "Cosmic Days | Your Personal Universe",
		description: "Discover the cosmic energy on the day you were born. A personalized spiritual journey through your unique astrology, numerology, and space weather.",
		url: "https://cosmic-days.com",
		siteName: "Cosmic Days",
		images: [
			{
				url: "https://cosmic-days.com/og-image.jpg",
				width: 1200,
				height: 630,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Cosmic Days | Your Personal Universe",
		description: "Discover the cosmic energy on the day you were born. A personalized spiritual journey through your unique astrology, numerology, and space weather.",
		images: ["https://cosmic-days.com/og-image.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
