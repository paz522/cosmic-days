import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const bodyParser = false;

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
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 }
		);
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!webhookSecret) {
		return NextResponse.json(
			{ error: "STRIPE_WEBHOOK_SECRET is not configured" },
			{ status: 500 }
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: `Webhook signature verification failed: ${errorMessage}` },
			{ status: 400 }
		);
	}

	// checkout.session.completed イベントを処理
	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const date = session.metadata?.date;

		if (!date) {
			return NextResponse.json(
				{ error: "Session missing date metadata" },
				{ status: 400 }
			);
		}

		// 決済完了を記録（KV ストレージまたはデータベースに保存）
		// Cloudflare Workers 環境では KV を使用
		// TODO: 本番環境では KV ストレージに session_id を保存して PDF 生成を許可するフラグを立てる

		console.log(`Payment completed for session ${session.id}, date: ${date}`);
	}

	return NextResponse.json({ received: true });
}
