"use client";

import { Home, Key, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onBackToHome: () => void;
}

export function Sidebar({ currentPage, onNavigate, onBackToHome }: SidebarProps) {
  const router = useRouter();
  const navItems = [
    { id: "dashboard", icon: Home, label: "ホーム" },
    { id: "key", icon: Key, label: "キー" },
  ];

  const handleLogoClick = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // エラーが発生してもホームページにリダイレクト
      router.push("/");
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-card border-r border-border flex-col items-center py-8 z-50 hidden md:flex">
      {/* Logo */}
      <button
        onClick={handleLogoClick}
        className="w-12 h-12 bg-white flex items-center justify-center mb-12 hover:bg-white/90 transition-colors cursor-pointer"
        title="ホームに戻る"
      >
        <div className="w-6 h-6 bg-black" />
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-2 transition-colors ${
                isActive ? "text-white" : "text-muted-foreground hover:text-white"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-2 text-muted-foreground hover:text-white transition-colors mt-auto mb-8"
        title="ログアウト"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-wider">ログアウト</span>
      </button>
    </div>
  );
}