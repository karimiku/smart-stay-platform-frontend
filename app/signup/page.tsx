"use client";

import { SignupPage } from "@/components/SignupPage";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  return (
    <div className="dark">
      <SignupPage
        onSignup={() => router.push("/dashboard")}
        onSwitchToLogin={() => router.push("/login")}
        onBack={() => router.push("/")}
      />
    </div>
  );
}

