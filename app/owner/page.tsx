"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { KeyPage } from "@/components/KeyPage";
import { useRouter } from "next/navigation";

export default function Owner() {
  const router = useRouter();

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar
        currentPage="key"
        onNavigate={(page) => {
          if (page === "key") router.push("/owner");
          else if (page === "dashboard") router.push("/dashboard");
        }}
        onBackToHome={() => router.push("/")}
      />
      <MobileNav currentPage="key" />
      <KeyPage />
    </div>
  );
}

