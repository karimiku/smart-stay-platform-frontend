"use client";

import { Calendar, MapPin, Users, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Property, properties } from "@/lib/data";
import { Reservation } from "@/lib/api";

interface ReservationDetailPageProps {
  reservation: Reservation;
  property?: Property;
  onBack: () => void;
}

export function ReservationDetailPage({ reservation, property, onBack }: ReservationDetailPageProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const calculateNights = () => {
    try {
      const start = new Date(reservation.start_date);
      const end = new Date(reservation.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const nights = calculateNights();

  const getStatusIcon = () => {
    switch (reservation.status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5" />;
      case "PENDING":
        return <Clock className="w-5 h-5" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (reservation.status) {
      case "CONFIRMED":
        return "bg-green-500 text-black";
      case "PENDING":
        return "bg-yellow-500 text-black";
      case "CANCELLED":
        return "bg-red-500 text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = () => {
    switch (reservation.status) {
      case "CONFIRMED":
        return "確認済み";
      case "PENDING":
        return "保留中";
      case "CANCELLED":
        return "キャンセル済み";
      default:
        return reservation.status;
    }
  };

  const villaProperty = property || properties.find((p) => p.id === reservation.room_id.toString());

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 md:px-16 py-4 sm:py-6 md:py-8">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 mb-6"
        >
          <span className="uppercase tracking-widest text-sm">← 戻る</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white uppercase tracking-[0.2em] mb-2 text-xl sm:text-2xl md:text-3xl">
              予約詳細
            </h1>
            <p className="text-muted-foreground tracking-wide text-sm sm:text-base">
              Reservation Details
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 uppercase tracking-widest text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Villa Info */}
        <div className="flex-1 px-4 sm:px-8 md:px-16 py-6 sm:py-8 md:py-12">
          {/* Villa Image */}
          {villaProperty && (
            <div className="mb-8">
              <div className="relative border border-border overflow-hidden">
                <ImageWithFallback
                  src={villaProperty.image}
                  alt={villaProperty.name}
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>
            </div>
          )}

          {/* Villa Details */}
          {villaProperty ? (
            <div className="space-y-6 mb-8">
              <div>
                <h2 className="text-white uppercase tracking-[0.2em] mb-4 text-lg sm:text-xl">
                  {villaProperty.name}
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span className="tracking-wide">{villaProperty.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span className="tracking-wide">最大 {villaProperty.capacity}名</span>
                  </div>
                  {villaProperty.description && (
                    <p className="text-muted-foreground tracking-wide leading-relaxed mt-4">
                      {villaProperty.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-white uppercase tracking-[0.2em] mb-4 text-lg sm:text-xl">
                Room {reservation.room_id}
              </h2>
            </div>
          )}

          {/* Reservation Details */}
          <div className="border-t border-border pt-8">
            <h3 className="text-white uppercase tracking-[0.2em] mb-6 text-lg">予約情報</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
                    チェックイン
                  </p>
                  <p className="text-white tracking-wide">{formatDate(reservation.start_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
                    チェックアウト
                  </p>
                  <p className="text-white tracking-wide">{formatDate(reservation.end_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
                    滞在日数
                  </p>
                  <p className="text-white tracking-wide">{nights} 泊</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-border px-4 sm:px-8 md:px-16 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="sticky top-8">
            <h3 className="text-white uppercase tracking-[0.2em] mb-6 text-lg">予約サマリー</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground tracking-wide text-sm">
                  {formatDateShort(reservation.start_date)} - {formatDateShort(reservation.end_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground tracking-wide text-sm">{nights} 泊</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground tracking-wide">合計金額</span>
                <span className="text-white tracking-wide text-lg">
                  ¥{reservation.total_price?.toLocaleString() || "0"}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-wide">
                  予約ID: {reservation.id}
                </p>
                <p className="text-muted-foreground text-xs tracking-wide">
                  ステータス: {getStatusText()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

