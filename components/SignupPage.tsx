"use client";

import { UserPlus, Check, X, Eye, EyeOff } from "lucide-react";
import { useState, useMemo } from "react";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";

interface SignupPageProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function SignupPage({ onSignup, onSwitchToLogin, onBack }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // パスワード要件をチェック
  const passwordRequirements = useMemo((): PasswordRequirement[] => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);

    return [
      { label: "8文字以上", met: hasMinLength },
      { label: "大文字を含む", met: hasUpper },
      { label: "小文字を含む", met: hasLower },
      { label: "数字を含む", met: hasNumber },
      { label: "記号を含む", met: hasSpecial },
    ];
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    // パスワード要件チェック
    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    if (!allRequirementsMet) {
      setError("パスワードの要件を満たしていません");
      return;
    }

    setIsLoading(true);

    try {
      await signup({ email, password, name });
      // Signup成功後、ログインページにリダイレクト
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      {/* Center: Signup Form */}
      <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 md:px-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors mb-6 sm:mb-8 tracking-wide text-sm sm:text-base"
          >
            ← ホームに戻る
          </button>

          {/* Logo */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <h1 className="text-white tracking-[0.2em] uppercase text-lg sm:text-xl md:text-2xl">Smart Stay</h1>
            </div>
            <p className="text-muted-foreground tracking-wide text-sm sm:text-base">スマートヴィラ予約システム</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white uppercase tracking-widest opacity-60">氏名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                placeholder="山田 太郎"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white uppercase tracking-widest opacity-60">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white uppercase tracking-widest opacity-60">パスワード</label>
              <div className="relative">
              <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-transparent border-b border-white/20 py-3 pr-10 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white uppercase tracking-widest opacity-60">パスワード（確認）</label>
              <div className="relative">
              <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-transparent border-b border-white/20 py-3 pr-10 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* パスワード要件表示（確認欄の下にも表示） */}
              {password && (
                <div className="mt-3 space-y-1.5">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        req.met ? "text-green-400" : "text-white/40"
                      }`}
                    >
                      {req.met ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="tracking-wide">{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-2 text-white/60 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 mt-1 bg-transparent border border-white/40" />
                <span className="tracking-wide">
                  利用規約とプライバシーポリシーに同意します
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 mt-8 hover:bg-white/90 transition-colors uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "作成中..." : "アカウント作成"}
            </button>

            <div className="text-center pt-6">
              <p className="text-white/40 tracking-wide">
                すでにアカウントをお持ちですか？{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-white hover:underline"
                >
                  ログイン
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}