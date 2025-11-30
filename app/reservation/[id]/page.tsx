"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { ReservationDetailPage } from "@/components/ReservationDetailPage";
import { useRouter, useParams } from "next/navigation";
import { properties } from "@/lib/data";
import { useState, useEffect } from "react";
import { isAuthenticated as checkAuth } from "@/lib/auth";
import { getReservations, Reservation } from "@/lib/api";

export default function ReservationDetail() {
  const router = useRouter();
  const params = useParams();
  const reservationId = params.id as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          router.push("/login");
          return;
        }

        // 予約情報を取得
        const data = await getReservations();
        const foundReservation = data.reservations?.find((r) => r.id === reservationId);
        
        if (!foundReservation) {
          // 予約が見つからない場合、ダッシュボードに戻る
          router.push("/dashboard");
          return;
        }
        
        setReservation(foundReservation);
      } catch (err) {
        console.error("Failed to fetch reservation:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reservationId, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-black items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white tracking-wide">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const property = properties.find((p) => p.id === reservation.room_id.toString());

  return (
    <div className="dark min-h-screen bg-background">
      {isAuthenticated && (
        <>
          <Sidebar
            currentPage="reservation-detail"
            onNavigate={(page) => {
              if (page === "key") router.push("/owner");
              else if (page === "dashboard") router.push("/dashboard");
            }}
            onBackToHome={() => router.push("/")}
          />
          <MobileNav currentPage="reservation-detail" />
        </>
      )}
      <ReservationDetailPage
        reservation={reservation}
        property={property}
        onBack={() => router.push("/dashboard")}
      />
    </div>
  );
}

