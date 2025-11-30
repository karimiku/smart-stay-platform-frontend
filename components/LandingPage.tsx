"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Users, Plane, Clock, Key, Shield, Sparkles, CheckCircle, ArrowRight, Star, Quote, Play, Globe, Award, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { properties } from "@/lib/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface LandingPageProps {
  onOwnerLogin?: () => void;
}

export function LandingPage({ onOwnerLogin }: LandingPageProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Track scroll position for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id || entry.target.getAttribute('data-section-id');
            if (id) {
              setVisibleSections((prev) => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all sections
    const sectionIds = ['villa-collection', 'features', 'how-it-works', 'testimonials', 'stats'];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Also observe refs
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Hero text fade-in animation
  useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  // Video loading state management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkVideoReady = () => {
      // Check if video is already loaded (cached)
      if (video.readyState >= 2) {
        setIsVideoLoaded(true);
      }
    };

    // Check immediately
    checkVideoReady();

    // Also listen for events
    const handleLoadedData = () => setIsVideoLoaded(true);
    const handleCanPlay = () => setIsVideoLoaded(true);
    const handleLoadedMetadata = () => setIsVideoLoaded(true);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Fallback: show video after a timeout
    const timeout = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 2000);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogin = async () => {
    try {
      // 認証状態をチェック
      const authenticated = await isAuthenticated();
      if (authenticated) {
        // 認証済みの場合のみローディング表示
        setIsNavigating(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/dashboard");
      } else {
        // 未認証の場合はローディング表示せずに即座にログインページへ
        router.push("/login");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      // エラー時もローディング表示せずに即座にログインページへ
      router.push("/login");
    }
  };

  // ローディング画面（認証済みの場合のみ表示）
  if (isNavigating) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/80 backdrop-blur-sm border-b border-white/10" : "bg-transparent"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-4 sm:py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-white flex items-center justify-center transition-transform group-hover:scale-110">
              <div className="w-5 h-5 bg-black" />
            </div>
            <span className="text-white tracking-[0.2em] uppercase text-sm sm:text-base">Smart Stay</span>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-[0.3em] inline-block hover:scale-105 text-xs sm:text-sm"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          onLoadedMetadata={() => setIsVideoLoaded(true)}
        >
          <source src="/videos/home.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16">
          <div className={`text-center max-w-4xl transition-all duration-1000 ${
            isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h1 className="text-white uppercase tracking-[0.4em] mb-8" style={{ 
              fontSize: "clamp(2.5rem, 8vw, 5rem)", 
              lineHeight: "1.1",
              fontWeight: 300,
              letterSpacing: "0.1em"
            }}>
              Own the
              <br />
              <span className="font-normal">Extraordinary.</span>
            </h1>
            <p 
              className={`text-white/90 tracking-[0.2em] uppercase mb-12 transition-opacity duration-1000 delay-300 ${
                isHeroVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ 
                fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                letterSpacing: "0.3em"
              }}
            >
              次世代のスマートヴィラ体験
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transition-opacity duration-1000 delay-500 ${
              isHeroVisible ? "opacity-100" : "opacity-0"
            }`}>
              <button
                onClick={handleLogin}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-[0.3em] inline-flex items-center justify-center gap-3 group hover:scale-105 text-sm sm:text-base"
              >
                今すぐ始める
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('villa-collection');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 sm:px-12 py-3 sm:py-4 border-2 border-white text-white hover:bg-white/10 transition-all uppercase tracking-[0.3em] inline-flex items-center justify-center gap-3 hover:scale-105 text-sm sm:text-base"
              >
                コレクションを見る
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* Villa Showcase Section - Horizontal Scroll */}
      <section 
        id="villa-collection"
        ref={(el) => {
          sectionRefs.current['villa-collection'] = el;
          if (el) el.id = 'villa-collection';
        }}
        className="w-full py-32 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 mb-12 sm:mb-16 md:mb-20 relative z-10">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('villa-collection') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
          }`}>
            <h2 className="text-white uppercase tracking-[0.3em] mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-light">Smart Villa Collection</h2>
            <p className="text-muted-foreground tracking-wide text-base sm:text-lg max-w-2xl">
              選ばれた地に佇む、スマートヴィラ。空間と時間が交差する場所。
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto scrollbar-hide relative z-10 snap-x snap-mandatory">
          <div className="flex gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-12" style={{ width: 'max-content' }}>
            {/* Spacer for centering first card on mobile */}
            <div className="flex-shrink-0 w-[calc(50vw-min(225px,42.5vw))] sm:w-0 md:w-0" />
            {properties.map((property, index) => (
            <Link
              key={property.id}
              href={`/villa/${property.id}`}
                className="group relative block overflow-hidden bg-card border border-border hover:border-white/60 transition-all duration-500 cursor-pointer flex-shrink-0 hover:scale-[1.02] snap-start"
                style={{ width: 'min(450px, 85vw)' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <ImageWithFallback
                  src={property.image}
                  alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />
              </div>

              {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Status Badge - Top Right */}
                <div className="flex justify-end">
                  <span
                      className={`px-5 py-2 uppercase tracking-widest border text-sm transition-all duration-300 group-hover:scale-110 ${
                      property.status === "Available"
                          ? "bg-white/20 border-white/40 text-white backdrop-blur-sm"
                        : "bg-black/60 border-white/20 text-white/50"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Villa Info - Bottom */}
                  <div className="space-y-4">
                  <div>
                      <h3 className="text-white uppercase tracking-wider mb-3 text-2xl font-light group-hover:text-white transition-colors">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 mb-4">
                      <MapPin className="w-4 h-4" />
                        <span className="tracking-wide">{property.location}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-4 h-4" />
                        <span className="tracking-wide text-sm">最大 {property.capacity}名</span>
                    </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <span className="tracking-wide text-sm">{property.bedrooms}寝室</span>
                    </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <span className="tracking-wide text-sm">{property.bathrooms}バス</span>
                      </div>
                      <div className="flex items-center gap-2 text-white font-medium">
                        <span className="tracking-wide text-sm">¥{property.pricePerNight.toLocaleString()}/泊</span>
                        </div>
                    </div>

                  {/* Description Preview */}
                    <p className="text-white/70 text-sm tracking-wide leading-relaxed line-clamp-2">
                    {property.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section 
        id="features"
        ref={(el) => {
          sectionRefs.current['features'] = el;
          if (el) el.id = 'features';
        }}
        className="relative py-32 border-t border-border overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1630756503890-051427e7118e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMHZpbGxhJTIwZHVzayUyMG1vZGVybnxlbnwxfHx8fDE3NjQwNDYzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 relative z-10">
          <div className={`mb-12 sm:mb-16 md:mb-20 text-center transition-all duration-1000 delay-200 ${
            visibleSections.has('features') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
          }`}>
            <h2 className="text-white uppercase tracking-[0.3em] mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-light">Why Smart Stay</h2>
            <p className="text-muted-foreground tracking-wide text-base sm:text-lg max-w-2xl mx-auto">
              次世代のテクノロジーと空間が融合する、新たな滞在の形
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {[
              {
                icon: Key,
                title: "スマートキー",
                description: "専用アプリによる鍵管理システム。物理的な鍵に縛られることなく、セキュアで洗練されたアクセスを実現。",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
              },
              {
                icon: Shield,
                title: "セキュリティ",
                description: "24時間365日の包括的な監視システムと最先端のセキュリティ技術により、完全な安心を提供。",
                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"
              },
              {
                icon: Sparkles,
                title: "プレミアム体験",
                description: "選ばれた地に佇む、厳選されたヴィラでのみ味わえる、特別な時間。",
                image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group text-center transition-all duration-1000 ${
                  visibleSections.has('features') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-8 overflow-hidden rounded-sm">
                  <div className="aspect-[4/3] relative">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                </div>
                <h3 className="text-white uppercase tracking-wider mb-4 text-xl font-light">{feature.title}</h3>
                <p className="text-muted-foreground tracking-wide leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works"
        ref={(el) => {
          sectionRefs.current['how-it-works'] = el;
          if (el) el.id = 'how-it-works';
        }}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32 border-t border-border"
      >
        <div className={`mb-12 sm:mb-16 md:mb-20 text-center transition-all duration-1000 ${
          visibleSections.has('how-it-works') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
        }`}>
          <h2 className="text-white uppercase tracking-[0.3em] mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-light">How It Works</h2>
          <p className="text-muted-foreground tracking-wide text-base sm:text-lg max-w-2xl mx-auto">
            3つのステップで、理想の滞在へ。洗練されたプロセスで、特別な時間を実現。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16 md:mb-20">
          {[
            {
              step: "1",
              title: "ヴィラを選択",
              description: "選ばれた地に佇む、厳選されたスマートヴィラから、理想の滞在先を選ぶ。",
              features: ["リアルタイム空室確認", "高解像度写真・詳細情報", "没入型バーチャルツアー"]
            },
            {
              step: "2",
              title: "予約を確定",
              description: "希望の日程と人数を指定し、高度にセキュアな決済システムで予約を完了。",
              features: ["柔軟なキャンセルポリシー", "銀行レベルのセキュリティ", "即時確認通知"]
            },
            {
              step: "3",
              title: "スマートキーで入室",
              description: "専用アプリを通じてスマートキーを受け取り、到着時にシームレスに入室。",
              features: ["直感的なアプリ管理", "24時間専属サポート", "完全にシームレスな体験"]
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`relative transition-all duration-1000 ${
                visibleSections.has('how-it-works') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-white text-black flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-white uppercase tracking-wider mb-4 text-xl font-light">{item.title}</h3>
                  <p className="text-muted-foreground tracking-wide leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <ul className="space-y-3">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                        <CheckCircle className="w-5 h-5 text-white/60 flex-shrink-0" />
                        <span className="tracking-wide">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < 2 && (
                <div className="absolute top-8 left-8 w-px h-full bg-border opacity-30" style={{ height: 'calc(100% + 4rem)' }} />
              )}
            </div>
          ))}
        </div>

        <div className={`text-center transition-all duration-1000 delay-500 ${
          visibleSections.has('how-it-works') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
        }`}>
          <button
            onClick={handleLogin}
            className="px-8 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 bg-white text-black hover:bg-white/90 transition-all uppercase tracking-[0.3em] inline-flex items-center gap-3 sm:gap-4 text-sm sm:text-base md:text-lg hover:scale-105 group"
          >
            今すぐ始める
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={(el) => {
          sectionRefs.current['testimonials'] = el;
          if (el) el.id = 'testimonials';
        }}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32 border-t border-border"
      >
        <div className={`mb-20 text-center transition-all duration-1000 ${
          visibleSections.has('testimonials') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
        }`}>
          <h2 className="text-white uppercase tracking-[0.3em] mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-light">Guest Experiences</h2>
          <p className="text-muted-foreground tracking-wide text-base sm:text-lg max-w-2xl mx-auto">
            世界中のゲストから寄せられた、真実の声
          </p>
              </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              rating: 5,
              quote: "バリ島のヴィラでの滞在は、期待を遥かに超えるものでした。スマートキーシステムの利便性と、プールから望む絶景の調和が、忘れられない体験を生み出しました。",
              name: "田中 太郎",
              location: "Villa Serenity, Bali",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
            },
            {
              rating: 5,
              quote: "モルディブでの滞在は、まさに夢の実現でした。ビーチフロントのヴィラから眺める夕日は、言葉を失うほどの美しさ。サービスも極めて洗練されていました。",
              name: "佐藤 花子",
              location: "Ocean Vista, Maldives",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
            },
            {
              rating: 5,
              quote: "スイスアルプスのヴィラは、自然の雄大さとモダンなデザインが見事に融合した空間。最先端のスマートホーム機能により、快適さと美しさが両立されていました。",
              name: "鈴木 一郎",
              location: "Mountain Escape, Swiss Alps",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`border border-border p-10 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-500 hover:border-white/40 hover:scale-[1.02] group ${
                visibleSections.has('testimonials') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms`, transitionDuration: '1000ms' }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-white/20 mb-6 group-hover:text-white/40 transition-colors" />
              <p className="text-white/90 tracking-wide leading-relaxed mb-8 text-base">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <ImageWithFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-base font-medium">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats"
        ref={(el) => {
          sectionRefs.current['stats'] = el;
          if (el) el.id = 'stats';
        }}
        className="border-t border-border py-24 bg-black/30"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 transition-all duration-1000 ${
            visibleSections.has('stats') ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
          }`}>
            {[
              { icon: Globe, number: "50+", label: "世界各地のヴィラ" },
              { icon: Award, number: "10,000+", label: "満足したゲスト" },
              { icon: Heart, number: "4.9", label: "平均評価" },
              { icon: Key, number: "24/7", label: "サポート対応" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-white/60 mx-auto mb-6" />
                <div className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2 sm:mb-4">{stat.number}</div>
                <div className="text-muted-foreground tracking-wide uppercase text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-black/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <div className="w-4 h-4 bg-black" />
              </div>
              <span className="tracking-wide">© 2025 Smart Stay. All rights reserved.</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center sm:text-left">
              <a href="#" className="tracking-wide hover:text-white transition-colors">利用規約</a>
              <a href="#" className="tracking-wide hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="#" className="tracking-wide hover:text-white transition-colors">お問い合わせ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
