import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "edge";

function getStripeClient(): Stripe {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		throw new Error("STRIPE_SECRET_KEY is not configured");
	}
	return new Stripe(secretKey, {
		apiVersion: "2026-02-25.clover",
	});
}

export async function POST(request: NextRequest) {
	const stripe = getStripeClient();
	try {
		const body = (await request.json()) as { date?: string };
		const { date } = body;

		if (!date) {
			return NextResponse.json(
				{ error: "Missing 'date' parameter" },
				{ status: 400 }
			);
		}

		const priceId = process.env.STRIPE_PRICE_ID;

		if (!priceId) {
			return NextResponse.json(
				{ error: "STRIPE_PRICE_ID is not configured" },
				{ status: 500 }
			);
		}

		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${request.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${request.headers.get("origin")}/preview?date=${date}`,
			metadata: {
				date,
			},
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: `Failed to create checkout session: ${errorMessage}` },
			{ status: 500 }
		);
	}
}
