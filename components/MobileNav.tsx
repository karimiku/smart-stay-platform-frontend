"use client";

import { Home, Key, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useState, useEffect } from "react";

interface MobileNavProps {
  currentPage: string;
}

export function MobileNav({ currentPage }: MobileNavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuthenticatedState(auth);
    };
    checkAuth();
  }, []);

  const handleLogoClick = async () => {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
    setIsOpen(false);
  };

  const handleNavigate = (page: string) => {
    if (page === "dashboard") {
      router.push("/dashboard");
    } else if (page === "key") {
      router.push("/owner");
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
    setIsOpen(false);
  };

  if (!isAuthenticatedState) {
    return null;
  }

  return (
    <>
      {/* Mobile Navigation Bar - Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => handleNavigate("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === "dashboard" || currentPage === "villa-detail" ? "text-white" : "text-muted-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">ホーム</span>
          </button>
          <button
            onClick={() => handleNavigate("key")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === "key" ? "text-white" : "text-muted-foreground"
            }`}
          >
            <Key className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">キー</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">ログアウト</span>
          </button>
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}

