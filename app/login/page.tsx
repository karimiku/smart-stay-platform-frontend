"use client";

import { LoginPage } from "@/components/LoginPage";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div className="dark">
      <LoginPage
        onLogin={() => router.push("/dashboard")}
        onSwitchToSignup={() => router.push("/signup")}
        onBack={() => router.push("/")}
      />
    </div>
  );
}

