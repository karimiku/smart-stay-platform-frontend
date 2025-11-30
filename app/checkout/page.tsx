"use client";

import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { CheckoutPayment } from "@/components/CheckoutPayment";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータから予約情報を取得
  const bookingData = {
    room_id: searchParams.get("room_id") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
    guests: parseInt(searchParams.get("guests") || "2"),
    total_price: parseFloat(searchParams.get("total_price") || "0"),
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar
        currentPage="checkout"
        onNavigate={(page) => {
          if (page === "key") router.push("/owner");
          else if (page === "dashboard") router.push("/dashboard");
        }}
        onBackToHome={() => router.push("/")}
      />
      <MobileNav currentPage="checkout" />
      <CheckoutPayment bookingData={bookingData} />
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen overflow-hidden bg-black items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white tracking-wide">読み込み中...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

