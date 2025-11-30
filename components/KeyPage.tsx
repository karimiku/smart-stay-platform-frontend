"use client";

import { Key, Lock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getKeys, getReservations, Key as KeyType, Reservation } from "@/lib/api";

export function KeyPage() {
  const [keys, setKeys] = useState<KeyType[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [keysData, reservationsData] = await Promise.all([
          getKeys(),
          getReservations(),
        ]);
        // デフォルト値を設定してnull/undefinedを防ぐ
        setKeys(keysData?.keys || []);
        setReservations(reservationsData?.reservations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得に失敗しました");
        // エラー時も空配列を設定
        setKeys([]);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 予約開始日に基づいてアクティブな鍵をフィルタリング
  const now = new Date();
  const activeKeys = (keys || []).filter((key) => {
    // キーのプロパティが存在することを確認
    if (!key || !key.valid_from || !key.valid_until) {
      return false;
    }
    try {
      const validFrom = new Date(key.valid_from);
      const validUntil = new Date(key.valid_until);
      return now >= validFrom && now <= validUntil;
    } catch {
      return false;
    }
  });

  // 鍵に対応する予約情報を取得
  const getReservationForKey = (reservationId: string) => {
    if (!reservations || !Array.isArray(reservations) || !reservationId) {
      return undefined;
    }
    return reservations.find((r) => r && r.id === reservationId);
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // 泊数を計算
  const calculateNights = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      return 0;
    }
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pl-20 flex items-center justify-center">
        <p className="text-white">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pl-20 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (activeKeys.length === 0) {
    return (
      <div className="min-h-screen pl-20">
        <div className="border-b border-border px-16 py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-white uppercase tracking-[0.3em] mb-2">Digital Key</h1>
              <p className="text-muted-foreground tracking-wide">スマートヴィラへのアクセス管理</p>
            </div>
          </div>
        </div>
        <div className="px-16 py-12">
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground tracking-wide">
              現在アクティブな鍵はありません
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              予約開始日になると鍵が表示されます
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-20">
      {/* Header */}
      <div className="border-b border-border px-16 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white uppercase tracking-[0.3em] mb-2">Digital Key</h1>
            <p className="text-muted-foreground tracking-wide">スマートヴィラへのアクセス管理</p>
          </div>
        </div>
      </div>

      {/* Digital Key Section */}
      <div className="px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {activeKeys.map((key) => {
            const reservation = getReservationForKey(key.reservation_id);
            const nights = reservation
              ? calculateNights(reservation.start_date, reservation.end_date)
              : 0;

            return (
              <div key={key.reservation_id} className="space-y-6">
                {/* Main Digital Key Card */}
                <div className="bg-card border border-white/20 p-8 hover:border-white/40 transition-all group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white flex items-center justify-center">
                      <Key className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <p className="text-muted-foreground tracking-wide uppercase mb-1">Digital Key</p>
                      <h3 className="text-white uppercase tracking-[0.2em]">
                        Room {reservation?.room_id || "N/A"}
                      </h3>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-white text-2xl font-mono tracking-widest mb-2">
                      {key.key_code}
                    </p>
                    <p className="text-muted-foreground text-sm">キーコード</p>
                  </div>
                  <button className="w-full py-4 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group-hover:gap-4">
                    <Lock className="w-5 h-5" />
                    <span>Unlock</span>
                  </button>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="tracking-wide">Status</span>
                      <span className="text-green-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground mt-2">
                      <span className="tracking-wide">Device ID</span>
                      <span className="text-white text-sm">{key.device_id}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Check-in */}
                {reservation && (
                  <div className="bg-card border border-white/20 p-8 hover:border-white/40 transition-all">
                    <h3 className="text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Reservation Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-muted-foreground tracking-wide">Check-in</span>
                        <span className="text-white uppercase tracking-widest">
                          {formatDate(reservation.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-muted-foreground tracking-wide">Check-out</span>
                        <span className="text-white uppercase tracking-widest">
                          {formatDate(reservation.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-muted-foreground tracking-wide">Duration</span>
                        <span className="text-white tracking-wide">{nights} Nights</span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-muted-foreground tracking-wide">Status</span>
                        <span className="text-white tracking-wide uppercase">{reservation.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground tracking-wide">Total Price</span>
                        <span className="text-white tracking-wide">
                          ¥{reservation.total_price ? reservation.total_price.toLocaleString() : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
