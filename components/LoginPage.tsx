"use client";

import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { login } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
  onBack: () => void;
}

export function LoginPage({
  onLogin,
  onSwitchToSignup,
  onBack,
}: LoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // ページマウント時に認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          // ローディング表示のため少し待機
          await new Promise(resolve => setTimeout(resolve, 1000));
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 既に認証済みかチェック
      const authenticated = await isAuthenticated();
      if (authenticated) {
        setIsCheckingAuth(true);
        // ローディング表示のため少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/dashboard");
        return;
      }

      await login({ email, password });
      // Token is automatically stored in httpOnly cookie by the server
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  };

  // 認証中ローディング画面
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
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      {/* Center: Login Form */}
      <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 md:px-20">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors mb-8 tracking-wide"
          >
            ← ホームに戻る
          </button>

          {/* Logo */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <h1 className="text-white tracking-[0.2em] uppercase text-lg sm:text-xl md:text-2xl">
                Smart Stay
              </h1>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white uppercase tracking-widest opacity-60">
                メールアドレス
              </label>
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
              <label className="text-white uppercase tracking-widest opacity-60">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-transparent border border-white/40"
                />
                <span className="tracking-wide">ログイン状態を保持</span>
              </label>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors tracking-wide"
              >
                パスワードを忘れた
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading || isCheckingAuth}
              className="w-full bg-white text-black py-4 mt-8 hover:bg-white/90 transition-colors uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>

            <div className="text-center pt-6">
              <p className="text-white/40 tracking-wide">
                Smart Stayは初めてですか？{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-white hover:underline"
                >
                  アカウントを作成
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
