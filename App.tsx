import React, { useState, useEffect } from 'react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { SurfaceCodeDiagram, TransformerDecoderDiagram, PerformanceMetricDiagram } from './components/Diagrams';
import { EcosystemDashboard } from './components/EcosystemDashboard';
import { MailStudioSuite } from './components/MailStudioSuite';
import { ScoMonetizationSuite } from './components/ScoMonetizationSuite';
import { SolscanSuite } from './components/SolscanSuite';
import { OfficialTelegramSuite, OFFICIAL_TELEGRAM_APK_URL } from './components/OfficialTelegramSuite';
import { ExternalTransactionIntegration } from './components/ExternalTransactionIntegration';
import { SreymaraAppzInstaller } from './components/SreymaraAppzInstaller';
import { AdminControlPalace } from './components/AdminControlPalace';
import { ViralGuestRegisterModal } from './components/ViralGuestRegisterModal';
import { YouTubeCinemaVideoSuite } from './components/YouTubeCinemaVideoSuite';
import { CloudflareDomainManager } from './components/CloudflareDomainManager';
import { GoogleVisitorSignInModal, VisitorRecord } from './components/GoogleVisitorSignInModal';
import { EcosystemVisitorRecordsSuite } from './components/EcosystemVisitorRecordsSuite';
import { DatingArtsMatchmakingSuite } from './components/DatingArtsMatchmakingSuite';
import { ShoppingBag, Mail, Sparkles, BookOpen, Layers, Globe, ShieldCheck, Activity, X, Eye, EyeOff, Maximize2, Minimize2, Coins, GitBranch, Wallet, Zap, Send, ExternalLink, Download, Share2, ChevronDown, ChevronUp, Grid, Smartphone, Crown, Lock, Video, Film, Users, UserCheck, Heart } from 'lucide-react';

const AuthorCard = ({ name, role, delay }: { name: string, role: string, delay: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-stone-900/90 rounded-2xl border border-stone-800/80 shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50" style={{ animationDelay: delay }}>
      <h3 className="font-serif text-2xl text-stone-100 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-70"></div>
      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<"revenue" | "ton_wallet" | "external_api" | "telegram_auth" | "solscan" | "sco_monetization" | "mail_ai" | "sreymara_appz" | "quantum" | "admin_palace" | "cinema_video" | "cloudflare" | "visitor_records" | "datingarts">((): any => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      const href = window.location.href.toLowerCase();
      if (hash.includes("dating") || hash.includes("matchmaking") || hash.includes("datingarts")) return "datingarts";
      if (hash.includes("visitor") || hash.includes("records") || hash.includes("google_signin")) return "visitor_records";
      if (hash.includes("cloudflare") || hash.includes("domain") || hash.includes("earnings")) return "cloudflare";
      if (hash.includes("cinema") || hash.includes("youtube") || hash.includes("video")) return "cinema_video";
      if (hash.includes("love_suite") || href.includes("invite=") || hash.includes("guest")) return "telegram_auth";
      if (hash.includes("admin_palace") || hash.includes("palace") || hash.includes("admin")) return "admin_palace";
      if (hash.includes("sreymara_appz") || hash.includes("appz") || hash.includes("apps")) return "sreymara_appz";
      if (hash.includes("ton_wallet") || hash.includes("wallet")) return "ton_wallet";
      if (hash.includes("external_api") || hash.includes("api")) return "external_api";
      if (hash.includes("telegram_auth") || hash.includes("telegram")) return "telegram_auth";
      if (hash.includes("solscan") || hash.includes("solana")) return "solscan";
      if (hash.includes("sco_monetization") || hash.includes("sco")) return "sco_monetization";
      if (hash.includes("mail_ai") || hash.includes("mail")) return "mail_ai";
      if (hash.includes("revenue") || hash.includes("dashboard")) return "revenue";
      if (hash.includes("quantum")) return "quantum";
      const saved = localStorage.getItem("alphaqubit_active_main_tab");
      if (saved) return saved as any;
    }
    return "revenue";
  });

  const [isGuestLoveSuiteOnly, setIsGuestLoveSuiteOnly] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const href = window.location.href.toLowerCase();
      return href.includes("love_suite") || href.includes("invite=") || href.includes("guest");
    }
    return false;
  });

  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const href = window.location.href.toLowerCase();
      return href.includes("love_suite") || href.includes("invite=") || href.includes("guest");
    }
    return false;
  });
  const [showGoogleSignInModal, setShowGoogleSignInModal] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("alphaqubit_is_tab_hidden") === "true";
    }
    return false;
  });
  const [isNavBannerHidden, setIsNavBannerHidden] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("alphaqubit_nav_banner_hidden") === "true";
    }
    return false;
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem("alphaqubit_active_main_tab", activeMainTab);
    if (window.location.hash !== `#${activeMainTab}`) {
      window.history.replaceState(null, "", `#${activeMainTab}`);
    }
  }, [activeMainTab]);

  useEffect(() => {
    localStorage.setItem("alphaqubit_is_tab_hidden", String(isTabHidden));
  }, [isTabHidden]);

  useEffect(() => {
    localStorage.setItem("alphaqubit_nav_banner_hidden", String(isNavBannerHidden));
  }, [isNavBannerHidden]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "ton_wallet" || hash === "wallet" || hash === "ton") setActiveMainTab("ton_wallet");
      else if (hash === "external_api" || hash === "api" || hash === "external") setActiveMainTab("external_api");
      else if (hash === "telegram_auth" || hash === "telegram" || hash === "tg_auth") setActiveMainTab("telegram_auth");
      else if (hash === "solscan" || hash === "solana") setActiveMainTab("solscan");
      else if (hash === "mail_ai" || hash === "mail" || hash === "ai") setActiveMainTab("mail_ai");
      else if (hash === "revenue" || hash === "dashboard") setActiveMainTab("revenue");
      else if (hash === "quantum") setActiveMainTab("quantum");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleAppFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request failed:", err);
          setIsFullscreen(true);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen API not available:", e);
      setIsFullscreen(!isFullscreen);
    }
  };

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0E] text-stone-100 selection:bg-nobel-gold selection:text-black font-sans relative">
      
      {/* EXECUTIVE TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#090A0E]/95 backdrop-blur-md border-b border-stone-800 py-3.5 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand, Hide Tab Control & Live System Status */}
          <div className="flex items-center gap-3">
            {/* HIDE TAB BUTTON (Positioned exactly as requested in user screenshot to the left of the α emblem) */}
            <button
              id="btn-hide-tab-header"
              type="button"
              onClick={() => setIsTabHidden(!isTabHidden)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-lg border cursor-pointer shrink-0 ${
                isTabHidden
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500 hover:bg-emerald-900 ring-2 ring-emerald-500/40 animate-pulse"
                  : "bg-red-950/90 text-red-200 border-red-700/80 hover:bg-red-900 hover:text-white"
              }`}
              title={isTabHidden ? "Show and restore foreground workspace" : "Hide this interface and view what is at the back"}
            >
              {isTabHidden ? (
                <>
                  <Eye size={15} className="text-emerald-400" />
                  <span>SHOW TAB</span>
                </>
              ) : (
                <>
                  <EyeOff size={15} className="text-red-400" />
                  <span>HIDE TAB</span>
                </>
              )}
            </button>

            <div className="w-9 h-9 bg-nobel-gold rounded-xl flex items-center justify-center text-stone-950 font-serif font-bold text-2xl shadow-lg shrink-0">
              α
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wide text-white flex items-center gap-2">
                AlphaQubit Quantum Ecosystem <span className="text-nobel-gold font-normal">2024</span>
              </h1>
              <p className="text-xs text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Shopify ID: 5144661590b... • Mail.com Proxy Connected</span>
              </p>
            </div>
          </div>

          {/* Main Top Navigation Banner OR Collapsed V Toggle Button */}
          {isNavBannerHidden ? (
            /* COLLAPSED VIEW: Minimal high-visibility "V" toggle button to display the full navigation banner */
            <div className="flex items-center gap-2">
              <button
                id="btn-show-full-nav-banner"
                type="button"
                onClick={() => setIsNavBannerHidden(false)}
                className="px-4 py-2.5 bg-gradient-to-r from-red-950 via-purple-950 to-amber-950 hover:from-red-900 hover:to-amber-900 text-white rounded-xl text-xs font-black flex items-center gap-2.5 transition-all shadow-2xl border-2 border-red-500/80 cursor-pointer animate-pulse"
                title="Click V or button to display full navigation banner (Shopify + Tidio, Telegram @Wallet, External API, etc.)"
              >
                <ChevronDown size={18} className="text-amber-300 font-black animate-bounce" />
                <span className="text-amber-400 font-extrabold text-sm">▼</span>
                <span className="tracking-wide">DISPLAY NAVIGATION BANNER</span>
                <span className="px-2 py-0.5 bg-red-900 text-red-100 rounded text-[10px] font-mono border border-red-500 font-black">V</span>
              </button>
            </div>
          ) : (
            /* EXPANDED VIEW: Full Navigation Banner carrying all 11 quick-access tabs + V Hide Button at the far right ending */
            <div className="flex items-center gap-2 bg-[#12151E] p-1.5 rounded-xl border border-stone-800 flex-wrap relative shadow-2xl">
              <button
                onClick={() => {
                  setActiveMainTab("revenue");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "revenue" && !isTabHidden
                    ? "bg-amber-600 text-white shadow-lg border border-amber-400/50"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <ShoppingBag size={14} className="text-amber-300" />
                <span>Shopify + Tidio</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab("ton_wallet");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "ton_wallet" && !isTabHidden
                    ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-black shadow-lg border border-cyan-400"
                    : "text-stone-400 hover:text-cyan-300"
                }`}
              >
                <Wallet size={14} className="text-cyan-400" />
                <span>Telegram @Wallet</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono border border-emerald-700 font-bold">USDT</span>
              </button>

              {/* Dedicated External Systems Transaction Integration Button */}
              <button
                id="btn-nav-external-api"
                onClick={() => {
                  setActiveMainTab("external_api");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "external_api" && !isTabHidden
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-stone-950 font-black shadow-lg border border-emerald-400"
                    : "text-stone-400 hover:text-emerald-300"
                }`}
                title="External Systems Transaction API Gateway (Authenticated with Key 5dd2...ecb2)"
              >
                <Share2 size={14} className="text-emerald-400" />
                <span>External API</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono border border-emerald-700 font-bold">5dd2</span>
              </button>

              {/* DatingArts Matchmaking Suite Button */}
              <button
                id="btn-nav-datingarts"
                onClick={() => {
                  setActiveMainTab("datingarts");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "datingarts" && !isTabHidden
                    ? "bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white font-black shadow-lg border border-pink-400"
                    : "text-stone-400 hover:text-pink-300"
                }`}
                title="DatingArts Luxury Matchmaking & 100% Human Interaction Chat"
              >
                <Heart size={14} className="text-pink-400 fill-pink-400" />
                <span>DatingArts Matchmaking</span>
                <span className="px-1.5 py-0.5 bg-pink-950 text-pink-300 rounded text-[9px] font-mono border border-pink-700 font-bold">100% REAL</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab("telegram_auth");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "telegram_auth" && !isTabHidden
                    ? "bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 text-white font-black shadow-lg border border-sky-400"
                    : "text-stone-400 hover:text-sky-300"
                }`}
              >
                <Send size={14} className="text-sky-400" />
                <span>Telegram Ecosystem</span>
                <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 rounded text-[9px] font-mono border border-sky-700 font-bold">CLIENT</span>
              </button>

              {/* Dedicated "Launch Telegram Web" Quick-Access Button with Live Status Indicator */}
              <a
                id="btn-launch-telegram-web"
                href="https://web.telegram.org/k/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-sky-950/70 hover:bg-sky-900/90 text-sky-300 hover:text-white border border-sky-700/80 shadow-sm whitespace-nowrap"
                title="Launch Official Telegram Web (Secure Browser Tab)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span>Launch Telegram Web</span>
                <ExternalLink size={12} className="text-sky-400" />
              </a>

              {/* Quick Access: Direct Telegram Android APK Download */}
              <a
                id="btn-nav-download-telegram-apk"
                href={OFFICIAL_TELEGRAM_APK_URL}
                download="Telegram.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-sm border border-amber-400 whitespace-nowrap"
                title="Download Official Telegram Android APK (Direct CDN4 Node)"
              >
                <Download size={13} />
                <span>Telegram APK</span>
                <span className="px-1.5 py-0.2 bg-black/30 text-stone-100 rounded text-[9px] font-mono">72 MB</span>
              </a>

              <button
                onClick={() => {
                  setActiveMainTab("solscan");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "solscan" && !isTabHidden
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-[#00FFA3] text-black font-black shadow-lg border border-[#00FFA3]"
                    : "text-stone-400 hover:text-[#00FFA3]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse"></span>
                <span className="font-mono font-bold tracking-tight">Solscan.io</span>
                <span className="px-1.5 py-0.5 bg-black/80 text-[#00FFA3] rounded text-[9px] font-mono border border-[#00FFA3]/40 font-bold">FAST RELAY</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab("sco_monetization");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "sco_monetization" && !isTabHidden
                    ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-black shadow-lg border border-amber-300"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Coins size={14} className="text-amber-400" />
                <span>SCO Monetization & Blockchain</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab("mail_ai");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "mail_ai" && !isTabHidden
                    ? "bg-purple-900 text-purple-100 shadow-lg border border-purple-600"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Mail size={14} className="text-purple-300" />
                <Sparkles size={11} className="text-amber-400" />
                <span>Mail.com & Multi Sreymara AI</span>
              </button>

              <button
                id="btn-nav-cinema-video"
                onClick={() => {
                  setActiveMainTab("cinema_video");
                  setIsTabHidden(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border shadow-lg ${
                  activeMainTab === "cinema_video" && !isTabHidden
                    ? "bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 text-white border-amber-300 ring-2 ring-amber-400/50"
                    : "bg-gradient-to-r from-red-950/80 to-purple-950/80 text-amber-300 border-red-500/50 hover:text-white"
                }`}
                title="YouTube Monetization & Cinema 4K AI Video Generator (15 Presets)"
              >
                <Film size={15} className="text-amber-400" />
                <span>YouTube & Cinema 4K Video</span>
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded text-[9px] font-extrabold uppercase">15 AI HD</span>
              </button>

              <button
                id="btn-nav-cloudflare"
                onClick={() => {
                  setActiveMainTab("cloudflare");
                  setIsTabHidden(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border shadow-lg ${
                  activeMainTab === "cloudflare" && !isTabHidden
                    ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-stone-950 border-orange-300 ring-2 ring-orange-400/50"
                    : "bg-gradient-to-r from-orange-950/80 to-purple-950/80 text-orange-300 border-orange-500/50 hover:text-white"
                }`}
                title="Cloudflare Domain Integration Manager (earnings.ink)"
              >
                <Globe size={15} className="text-orange-400" />
                <span>Cloudflare earnings.ink</span>
                <span className="px-1.5 py-0.2 bg-orange-500 text-stone-950 rounded text-[9px] font-extrabold uppercase">DNS</span>
              </button>

              <button
                id="btn-nav-admin-palace"
                onClick={() => {
                  setActiveMainTab("admin_palace");
                  setIsTabHidden(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border shadow-lg ${
                  activeMainTab === "admin_palace" && !isTabHidden
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 border-amber-300 ring-2 ring-amber-400/50"
                    : "bg-gradient-to-r from-amber-950/60 to-purple-950/80 text-amber-300 border-amber-500/50 hover:text-white"
                }`}
                title="Ecosystem Control Palace Admin Home"
              >
                <Crown size={15} className="text-amber-400" />
                <span>Admin Control Palace</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded text-[9px] font-extrabold uppercase">HOME</span>
              </button>

              <button
                id="btn-nav-sreymara-appz"
                onClick={() => {
                  setActiveMainTab("sreymara_appz");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "sreymara_appz" && !isTabHidden
                    ? "bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-black shadow-lg border border-amber-300 ring-2 ring-pink-500/40"
                    : "text-purple-300 hover:text-white bg-purple-950/40 border border-purple-800/60"
                }`}
                title="sreymara APPZ Ecosystem App Installer"
              >
                <Smartphone size={14} className="text-amber-300" />
                <span>sreymara APPZ</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded text-[9px] font-extrabold uppercase">INSTALLER</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab("quantum");
                  setIsTabHidden(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainTab === "quantum" && !isTabHidden
                    ? "bg-stone-800 text-stone-100 shadow-lg border border-stone-700"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <BookOpen size={14} className="text-sky-400" />
                <span>AlphaQubit Paper</span>
              </button>

              {/* GOOGLE VISITOR SIGN-IN & RECORDS TAB */}
              <button
                id="btn-nav-visitor-records"
                onClick={() => {
                  setActiveMainTab("visitor_records");
                  setIsTabHidden(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border shadow-lg ${
                  activeMainTab === "visitor_records" && !isTabHidden
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-blue-300 ring-2 ring-blue-400/50"
                    : "bg-gradient-to-r from-blue-950/80 to-indigo-950/80 text-blue-300 border-blue-500/50 hover:text-white"
                }`}
                title="Google Visitor Sign-In & Ecosystem Records Management Registry"
              >
                <Users size={15} className="text-blue-400" />
                <span>Google Visitor Records</span>
                <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded text-[9px] font-extrabold uppercase">SSO</span>
              </button>

              <button
                id="btn-trigger-google-modal"
                onClick={() => setShowGoogleSignInModal(true)}
                className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-900 font-extrabold rounded-lg text-xs shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-stone-300"
                title="Open Google Visitor Sign-In Modal"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Sign-In</span>
              </button>

              {/* Interactive Full Screen Mode Toggle */}
              <button
                id="btn-toggle-fullscreen"
                type="button"
                onClick={toggleAppFullscreen}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isFullscreen
                    ? "bg-purple-900/90 text-purple-200 border-purple-500 shadow-md"
                    : "bg-stone-900/90 text-stone-400 hover:text-white border-stone-800 hover:border-purple-600/50"
                }`}
                title={isFullscreen ? "Exit Full Screen" : "Enter Interactive Full Screen"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 size={14} className="text-purple-300" />
                    <span className="hidden sm:inline">Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={14} className="text-purple-300" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </>
                )}
              </button>

              {/* 🔴 V DROPDOWN HIDE & DISPLAY BUTTON AT THE FAR RIGHT ENDING OF THE BANNER (MATCHING USER SCREENSHOT ARROW EXACTLY) */}
              <button
                id="btn-hide-nav-banner-v"
                type="button"
                onClick={() => setIsNavBannerHidden(true)}
                className="px-3 py-2 bg-gradient-to-r from-red-900 via-rose-950 to-red-950 hover:from-red-800 hover:to-red-900 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-2 border-red-500/80 shadow-2xl hover:scale-105 active:scale-95 shrink-0 ml-1 group"
                title="Hide / Collapse Full Banner till full screen so it does not block the workspace at the back"
              >
                <ChevronUp size={16} className="text-amber-300 font-black group-hover:animate-bounce" />
                <span className="text-amber-400 font-black text-sm leading-none">▼</span>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-100">V</span>
              </button>

            </div>
          )}

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* REVEALED BACKGROUND VIEW WHEN USER CLICKS HIDE TAB */}
        {isTabHidden && (
          <div className="space-y-8 animate-fade-in">
            {/* Ambient Background Notification Bar */}
            <div className="bg-[#0e121d] p-4 rounded-2xl border border-emerald-500/50 shadow-2xl flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-emerald-300 flex items-center gap-2">
                    Background Canvas & AlphaQubit Deep Layer Uncovered
                  </h2>
                  <p className="text-xs text-stone-300">
                    The foreground interface is currently hidden. You can now view and interact with the underlying 3D Quantum Engine and architectural models unobstructed.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTabHidden(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg border border-emerald-400/50 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105"
              >
                <Eye size={16} />
                <span>RESTORE FOREGROUND INTERFACE</span>
              </button>
            </div>

            {/* Full 3D Interactive Quantum Simulation Stage */}
            <div className="relative w-full h-[480px] rounded-3xl border border-stone-800 overflow-hidden bg-radial from-[#131724] to-[#08090E] shadow-2xl flex items-center justify-center">
              <HeroScene />
              <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-700 text-[11px] text-stone-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Active 3D Quantum State • Recurrent Surface Code Decoding Grid</span>
              </div>
              <div className="absolute bottom-6 text-center z-10 max-w-xl px-4 bg-black/60 backdrop-blur-md py-3 rounded-2xl border border-stone-800">
                <p className="text-xs text-stone-300 font-serif italic">
                  "AlphaQubit leverages recurrent transformers to predict syndrome errors with super-classical fidelity."
                </p>
                <p className="text-[10px] text-nobel-gold font-mono mt-1">Nature (2024) Quantum AI Architecture</p>
              </div>
            </div>

            {/* Quick Switch Cards while in Background View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#0D0F17] rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShoppingBag size={16} />
                  <span>Shopify & Tidio Live Engine (Running in Background)</span>
                </div>
                <p className="text-xs text-stone-400">
                  Revenue splits (80/20) and visitor sessions are streaming in real-time. Unhide the tab anytime to manage payouts and transactions.
                </p>
                <button
                  onClick={() => {
                    setActiveMainTab("revenue");
                    setIsTabHidden(false);
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  Open Revenue Engine →
                </button>
              </div>

              <div className="p-5 bg-[#0D0F17] rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Mail size={16} />
                  <span>Mail.com & Multi Sreymara AI (Ready)</span>
                </div>
                <p className="text-xs text-stone-400">
                  Google Gemini 3.6 Flash conversational engine is synchronized. Your chat session is safely preserved.
                </p>
                <button
                  onClick={() => {
                    setActiveMainTab("mail_ai");
                    setIsTabHidden(false);
                  }}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  Open Multi Sreymara AI →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: SHOPIFY + TIDIO + PHANTOM REVENUE ENGINE (Rendered when not hidden) */}
        {!isTabHidden && activeMainTab === "revenue" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0C0E14] p-4 rounded-xl border border-stone-800 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-amber-400 flex items-center gap-2">
                  <Activity size={18} /> Live Interactive Revenue & Event Simulation Control
                </h2>
                <p className="text-xs text-stone-400">
                  Track real-time visitor signals, active session durations, yield accruals, Phantom USDT withdrawals, and 80/20 cinema video shares.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMainTab("sco_monetization")}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg border border-amber-400 flex items-center gap-2 cursor-pointer transition-all shadow"
                >
                  <Coins size={14} /> SCO Worldwide Monetization & Blockchain
                </button>
                <button
                  onClick={() => setActiveMainTab("mail_ai")}
                  className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-lg border border-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <Mail size={14} /> Open Mail.com & Multi Sreymara AI Engine
                </button>
              </div>
            </div>

            {/* Embedded Live Ecosystem Dashboard */}
            <EcosystemDashboard />
          </div>
        )}

        {/* VIEW: TELEGRAM @WALLET & TON JETTON SUITE */}
        {!isTabHidden && activeMainTab === "ton_wallet" && (
          <div className="space-y-6 animate-fade-in">
            <EcosystemDashboard initialTab="ton_wallet" />
          </div>
        )}

        {/* VIEW: YOUTUBE & CINEMA 4K AI VIDEO GENERATION SUITE */}
        {!isTabHidden && activeMainTab === "cinema_video" && (
          <div className="space-y-6 animate-fade-in">
            <YouTubeCinemaVideoSuite />
          </div>
        )}

        {/* VIEW: CLOUDFLARE CUSTOM DOMAIN INTEGRATION MANAGER */}
        {!isTabHidden && activeMainTab === "cloudflare" && (
          <div className="space-y-6 animate-fade-in">
            <CloudflareDomainManager />
          </div>
        )}

        {/* VIEW: ADMIN CONTROL PALACE REAL BACKEND DASHBOARD */}
        {!isTabHidden && activeMainTab === "admin_palace" && (
          <div className="space-y-6 animate-fade-in">
            <AdminControlPalace onClose={() => setActiveMainTab("revenue")} />
          </div>
        )}

        {/* VIEW: EXTERNAL SYSTEMS TRANSACTION INTEGRATION GATEWAY */}
        {!isTabHidden && activeMainTab === "external_api" && (
          <div className="space-y-6 animate-fade-in">
            <ExternalTransactionIntegration />
          </div>
        )}

        {/* VIEW: OFFICIAL TELEGRAM AUTH & CLIENT GATEWAY (OFFICIAL SPEC) */}
        {!isTabHidden && activeMainTab === "telegram_auth" && (
          <div className="space-y-6 animate-fade-in">
            <OfficialTelegramSuite onClose={() => setActiveMainTab("ton_wallet")} />
          </div>
        )}

        {/* VIEW: SOLSCAN.IO PRO EXPLORER & REAL-TIME TRANSACTION PUSHER */}
        {!isTabHidden && activeMainTab === "solscan" && (
          <div className="space-y-6 animate-fade-in">
            <SolscanSuite />
          </div>
        )}

        {/* VIEW: SCO MONETIZATION & REAL BLOCKCHAIN ENGINE */}
        {!isTabHidden && activeMainTab === "sco_monetization" && (
          <div className="space-y-6 animate-fade-in">
            <ScoMonetizationSuite />
          </div>
        )}

        {/* VIEW 2: MAIL.COM & MULTI SREYMARA AI STUDIO (Rendered when not hidden) */}
        {!isTabHidden && activeMainTab === "mail_ai" && (
          <div className="space-y-6 animate-fade-in">
            <MailStudioSuite 
              onClose={() => setActiveMainTab("revenue")} 
              onHideTab={() => setIsTabHidden(true)}
            />
          </div>
        )}

        {/* VIEW: GOOGLE VISITOR SIGN-IN & ECOSYSTEM REGISTRY RECORDS */}
        {!isTabHidden && activeMainTab === "visitor_records" && (
          <div className="space-y-6 animate-fade-in">
            <EcosystemVisitorRecordsSuite />
          </div>
        )}

        {/* VIEW: DATINGARTS LUXURY MATCHMAKING & 100% HUMAN CHAT SUITE */}
        {!isTabHidden && activeMainTab === "datingarts" && (
          <div className="space-y-6 animate-fade-in">
            <DatingArtsMatchmakingSuite />
          </div>
        )}

        {/* VIEW: SREYMARA APPZ ECOSYSTEM INSTALLER & EMBEDDED WORKSPACE */}
        {!isTabHidden && activeMainTab === "sreymara_appz" && (
          <div className="space-y-6 animate-fade-in">
            <SreymaraAppzInstaller
              onLaunchApp={(app) => {
                if (app.type === "internal_suite" && app.internalTabKey) {
                  setActiveMainTab(app.internalTabKey as any);
                }
              }}
              onClose={() => setActiveMainTab("revenue")}
            />
          </div>
        )}

        {/* VIEW 3: ALPHAQUBIT QUANTUM RESEARCH PAPER (Rendered when not hidden) */}
        {!isTabHidden && activeMainTab === "quantum" && (
          <div className="space-y-16 animate-fade-in pt-4">
            
            {/* Paper Navigation Links & Close Button (Screenshot 6 Fix) */}
            <div className="flex justify-between items-center bg-[#0D0F17] p-3 rounded-2xl border border-stone-800 flex-wrap gap-4 shadow-xl">
              <div className="flex items-center gap-3 flex-wrap text-xs font-bold uppercase tracking-wider">
                <a href="#introduction" onClick={scrollToSection('introduction')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Introduction
                </a>
                <a href="#science" onClick={scrollToSection('science')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  The Surface Code
                </a>
                <a href="#impact" onClick={scrollToSection('impact')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Impact
                </a>
                <a href="#authors" onClick={scrollToSection('authors')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Authors
                </a>
              </div>

              <button
                onClick={() => setActiveMainTab("revenue")}
                className="px-4 py-2 bg-red-950/80 hover:bg-red-800 text-red-200 hover:text-white rounded-xl text-xs font-bold border border-red-700/60 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="Close AlphaQubit Research Paper"
              >
                <X size={15} className="text-red-400" />
                <span>CLOSE PAPER</span>
              </button>
            </div>

            {/* Hero Section */}
            <section className="relative pt-8 pb-16 min-h-[60vh] flex items-center justify-center">
              <div className="absolute inset-0 z-0 opacity-40">
                <HeroScene />
              </div>

              <div className="container mx-auto px-6 z-10 text-center relative max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nobel-gold/40 bg-nobel-gold/10 text-nobel-gold text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
                  <span>Nature</span>
                  <span>•</span>
                  <span>Nov 2024</span>
                  <span>•</span>
                  <span>Luxury Quantum Edition</span>
                </div>

                <h1 className="font-serif text-4xl md:text-6xl text-stone-100 font-bold mb-6 leading-tight tracking-tight">
                  AlphaQubit: AI for Quantum Error Correction
                </h1>

                <p className="text-lg md:text-xl text-stone-300 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                  A recurrent, transformer-based neural network that learns to decode the surface code with unprecedented accuracy.
                </p>

                <div className="flex justify-center gap-4">
                  <a href="#science" onClick={scrollToSection('science')} className="px-6 py-3 bg-nobel-gold hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-sm transition-all shadow-lg">
                    Discover AlphaQubit
                  </a>
                </div>
              </div>
            </section>

            {/* Section 1: Introduction */}
            <section id="introduction" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-4xl">
                <h2 className="font-serif text-3xl font-bold text-amber-400 mb-6 text-center">Learning High-Accuracy Error Decoding</h2>
                <p className="text-stone-300 leading-relaxed text-base mb-6">
                  Quantum computers hold immense promise for solving complex problems, but quantum bits (qubits) are inherently fragile and prone to environmental noise. Quantum error correction (QEC) protects quantum information by entangling multiple physical qubits into a single logical qubit using surface codes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
                    <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">Syndrome Decoding Challenge</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Measuring stabilizer operators yields syndrome data. Translating complex syndrome patterns into precise physical error locations in real-time requires powerful AI architectures.
                    </p>
                  </div>
                  <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
                    <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">AlphaQubit Breakthrough</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Trained on quantum processor simulations and experimental Sycamore data, AlphaQubit outperforms standard minimum-weight perfect matching (MWPM) algorithms across all noise regimes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Science */}
            <section id="science" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl space-y-12">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-stone-100 mb-3">The Science Behind AlphaQubit</h2>
                  <p className="text-stone-400 text-sm">Visualizing surface code grid layout and syndrome detection pipeline.</p>
                </div>

                <SurfaceCodeDiagram />
                <TransformerDecoderDiagram />
              </div>
            </section>

            {/* Section 3: Impact */}
            <section id="impact" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl space-y-8">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-stone-100 mb-3">Performance & Benchmark Impact</h2>
                  <p className="text-stone-400 text-sm">Comparing AlphaQubit against classical decoders on Google Sycamore processor chips.</p>
                </div>
                <PerformanceMetricDiagram />
              </div>
            </section>

            {/* Section 4: Authors */}
            <section id="authors" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl">
                <h2 className="font-serif text-3xl font-bold text-amber-400 mb-8 text-center">Research Contributors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  <AuthorCard name="Julian Bausch" role="Google DeepMind" delay="0.1s" />
                  <AuthorCard name="Michael Newman" role="Google Quantum AI" delay="0.3s" />
                  <AuthorCard name="Multi Sreymara AI" role="Executive AI Synthesis Engine" delay="0.5s" />
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-10 border-t border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <div className="text-white font-serif font-bold text-lg">AlphaQubit Quantum Ecosystem</div>
            <p className="text-stone-500">Live Shopify, Tidio, Phantom Web3, Mail.com & Multi Sreymara AI Integration.</p>
          </div>
          <div className="text-stone-600 font-mono text-[11px]">
            Based on research published in Nature (2024). All server endpoints operational.
          </div>
        </div>
      </footer>

      {/* VIRAL GUEST REGISTER MODAL OVERLAY */}
      {showRegisterModal && (
        <ViralGuestRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegistered={() => {
            setShowRegisterModal(false);
            setActiveMainTab("telegram_auth");
          }}
        />
      )}

      {/* GLOBAL GOOGLE VISITOR SIGN-IN MODAL OVERLAY */}
      <GoogleVisitorSignInModal
        isOpen={showGoogleSignInModal}
        onClose={() => setShowGoogleSignInModal(false)}
        onSuccess={(rec) => {
          setShowGoogleSignInModal(false);
          setActiveMainTab("visitor_records");
        }}
      />
    </div>
  );
};

export default App;
