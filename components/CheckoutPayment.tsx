"use client";

import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReservation } from "@/lib/api";

interface CheckoutPaymentProps {
  bookingData: {
    room_id: string;
    start_date: string;
    end_date: string;
    guests: number;
    total_price: number;
  };
}

export function CheckoutPayment({ bookingData }: CheckoutPaymentProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // 予約APIを呼び出す（決済は仮実装のため、予約のみ作成）
      await createReservation({
        room_id: parseInt(bookingData.room_id),
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
      });

      // 予約完了後、ダッシュボードにリダイレクト
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "予約に失敗しました");
      setIsProcessing(false);
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 料金計算
  const nights = Math.ceil(
    (new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const basePrice = bookingData.total_price / 1.12; // サービス料12%を除く
  const serviceFee = basePrice * 0.12;
  const tax = basePrice * 0.1; // 仮の税率10%
  const total = basePrice + serviceFee + tax;

  return (
    <div className="min-h-screen md:pl-20 flex flex-col lg:flex-row pb-16 md:pb-0">
      {/* Left: Payment Form */}
      <div className="flex-1 px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-white uppercase tracking-[0.3em] mb-2 text-xl sm:text-2xl md:text-3xl">セキュア決済</h1>
            <p className="text-muted-foreground tracking-wide flex items-center gap-2">
              <Lock className="w-4 h-4" />
              お支払い情報は暗号化され、安全に保護されています
            </p>
            {/* 決済仮実装の警告 */}
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-semibold mb-1">決済機能は仮実装です</p>
                  <p className="text-yellow-300/80 text-sm">
                    このデモでは実際の決済処理は行われません。決済ボタンを押すと予約が完了します。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="border border-border p-4 sm:p-6 md:p-8">
              <h2 className="text-white uppercase tracking-[0.2em] mb-6">連絡先情報</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">
                      姓
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="山田"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">
                      名
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="太郎"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white uppercase tracking-widest opacity-60">メールアドレス</label>
                  <input
                    type="email"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white uppercase tracking-widest opacity-60">電話番号</label>
                  <input
                    type="tel"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border border-border p-4 sm:p-6 md:p-8">
              <h2 className="text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                支払い詳細
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white uppercase tracking-widest opacity-60">
                    カード番号
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">
                      有効期限
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="MM / YY"
                      maxLength={7}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">セキュリティコード</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white uppercase tracking-widest opacity-60">
                    カード名義人
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    placeholder="YAMADA TARO"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="border border-border p-4 sm:p-6 md:p-8">
              <h2 className="text-white uppercase tracking-[0.2em] mb-6">請求先住所</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white uppercase tracking-widest opacity-60">
                    住所
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    placeholder="東京都渋谷区..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">市区町村</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="渋谷区"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white uppercase tracking-widest opacity-60">
                      郵便番号
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                      placeholder="150-0001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-white text-black py-5 hover:bg-white/90 transition-colors uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "処理中..." : "予約を完了する（決済は仮実装）"}
            </button>

            {/* Terms */}
            <p className="text-muted-foreground tracking-wide text-center text-sm">
              この購入を完了することで、{" "}
              <a href="#" className="text-white hover:underline">
                利用規約
              </a>{" "}
              および{" "}
              <a href="#" className="text-white hover:underline">
                プライバシーポリシー
              </a>
              に同意したものとみなされます。
            </p>
          </form>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full lg:w-[440px] border-t lg:border-t-0 lg:border-l border-border p-6 sm:p-8 md:p-12 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="space-y-8">
          <h2 className="text-white uppercase tracking-[0.2em]">注文概要</h2>

          {/* Property Image */}
          <div className="border border-border overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjB2aWxsYXxlbnwxfHx8fDE3NjQwNDE1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Villa Serenity"
              className="w-full aspect-video object-cover"
            />
            <div className="p-4 border-t border-border">
              <h3 className="text-white uppercase tracking-wider mb-1">Villa Serenity</h3>
              <p className="text-muted-foreground tracking-wide">Bali, Indonesia</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex justify-between text-white">
              <span className="tracking-wide">チェックイン</span>
              <span className="tracking-wide">{formatDate(bookingData.start_date)}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="tracking-wide">チェックアウト</span>
              <span className="tracking-wide">{formatDate(bookingData.end_date)}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="tracking-wide">ゲスト</span>
              <span className="tracking-wide">{bookingData.guests}名</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="tracking-wide">泊数</span>
              <span className="tracking-wide">{nights}泊</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex justify-between text-white">
              <span className="tracking-wide">¥{Math.round(basePrice / nights).toLocaleString()} × {nights}泊</span>
              <span className="tracking-wide">¥{Math.round(basePrice).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="tracking-wide">サービス料 (12%)</span>
              <span className="tracking-wide">¥{Math.round(serviceFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="tracking-wide">税金 (10%)</span>
              <span className="tracking-wide">¥{Math.round(tax).toLocaleString()}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-white uppercase tracking-[0.2em]">合計 (JPY)</span>
            <span className="text-white uppercase tracking-wider">¥{Math.round(total).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
