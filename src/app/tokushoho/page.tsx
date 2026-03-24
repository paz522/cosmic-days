"use client";

import Link from "next/link";

export default function TokushohoPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] starry-background flex flex-col items-center px-4 py-12 relative overflow-hidden">
			{/* 背景の星 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: "0.3s" }}></div>
				<div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: "1.7s" }}></div>
				<div className="absolute bottom-20 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: "2.4s" }}></div>
			</div>

			<main className="flex flex-col items-center gap-8 max-w-4xl w-full relative z-10">
				<div className="text-center animate-float">
					<div className="mb-2">
						<span className="text-5xl animate-pulse-soul">✦</span>
					</div>
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 animate-cosmic">
						特定商取引法に基づく表記
					</h1>
				</div>

				<div className="w-full bg-[#1a1a2e]/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 animate-aura">
					<div className="space-y-6 text-gray-300">
						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">販売事業者</h2>
							<p>新里商会</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">運営責任者</h2>
							<p>小林孔太郎</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">所在地</h2>
							<p>請求があった場合には速やかに開示いたします</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">電話番号</h2>
							<p>請求があった場合には速やかに開示いたします</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">メールアドレス</h2>
							<p>kobap2501@gmail.com</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">販売価格</h2>
							<p>$1（税込）</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">追加手数料</h2>
							<p>なし</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">決済手段</h2>
							<p>クレジットカード</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">決済期間</h2>
							<p>クレジットカード決済はただちに処理されます</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">配達時期</h2>
							<p>決済完了後、即時ダウンロード可能</p>
						</div>

						<div>
							<h2 className="text-xl font-bold text-purple-400 mb-3">交換・返品ポリシー</h2>
							<p>デジタル商品のため、決済完了後の返金・キャンセルはお受けできません。</p>
							<p>商品に不具合がある場合はメールにてご連絡ください。</p>
						</div>
					</div>
				</div>

				<Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2">
					<span>←</span> ホームに戻る
				</Link>
			</main>
		</div>
	);
}
