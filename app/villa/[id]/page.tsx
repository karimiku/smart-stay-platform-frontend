"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { VillaDetailPage } from "@/components/VillaDetailPage";
import { useRouter, useParams } from "next/navigation";
import { properties } from "@/lib/data";
import { useState, useEffect } from "react";
import { isAuthenticated as checkAuth } from "@/lib/auth";

export default function VillaDetail() {
  const router = useRouter();
  const params = useParams();
  const villaId = params.id as string;
  const property = properties.find((p) => p.id === villaId);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 認証状態を確認
    const checkAuthentication = async () => {
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
    };
    checkAuthentication();
  }, []);

  if (!property) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">Villa not found</p>
      </div>
    );
  }

  return (
    <div
      className={`dark min-h-screen bg-background ${
        isAuthenticated ? "md:pl-20" : ""
      }`}
    >
      {isAuthenticated && (
        <>
          <Sidebar
            currentPage="villa-detail"
            onNavigate={(page) => {
              if (page === "key") router.push("/owner");
              else if (page === "dashboard") router.push("/dashboard");
            }}
            onBackToHome={() => router.push("/")}
          />
          <MobileNav currentPage="villa-detail" />
        </>
      )}
      <VillaDetailPage
        property={property}
        onBack={() => router.push(isAuthenticated ? "/dashboard" : "/")}
        onProceedToCheckout={(booking) => {
          if (isAuthenticated) {
            // 予約情報をURLパラメータとして渡す
            // property.idは文字列なので、数値に変換（簡易的にparseIntを使用）
            const roomId = parseInt(property.id) || 505; // デフォルト値
            const params = new URLSearchParams({
              room_id: roomId.toString(),
              start_date: booking.selectedDates[0].toISOString().split('T')[0],
              end_date: booking.selectedDates[booking.selectedDates.length - 1].toISOString().split('T')[0],
              guests: booking.guests.toString(),
              total_price: booking.totalPrice.toString(),
            });
            router.push(`/checkout?${params.toString()}`);
          } else {
            router.push("/login");
          }
        }}
      />
    </div>
  );
}
