"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { DiscoveryDashboard } from "@/components/DiscoveryDashboard";
import { Property } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [selectedVilla, setSelectedVilla] = useState<Property | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          // 未認証の場合はローディング表示せずに即座にログインページへ
          router.push("/login");
          return;
        }
        // 認証済みの場合のみローディング解除
        setIsCheckingAuth(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        // エラー時もローディング表示せずに即座にログインページへ
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleSelectVilla = (property: Property) => {
    router.push(`/villa/${property.id}`);
  };

  // 認証チェック中のローディング画面（認証済みの場合のみ表示）
  // 未認証の場合は即座にリダイレクトされるため、このローディングは表示されない
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-black items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white tracking-wide">認証中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar
        currentPage="dashboard"
        onNavigate={(page) => {
          if (page === "key") router.push("/owner");
          else if (page === "dashboard") router.push("/dashboard");
        }}
        onBackToHome={() => router.push("/")}
      />
      <MobileNav currentPage="dashboard" />
      <DiscoveryDashboard onSelectVilla={handleSelectVilla} />
    </div>
  );
}

