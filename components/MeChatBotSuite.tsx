import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Sparkles,
  User,
  Users,
  Shield,
  ShieldCheck,
  Zap,
  Clock,
  MessageSquare,
  Send,
  Gift,
  Flame,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Radio,
  Search,
  Play,
  Pause,
  X,
  Award,
  Volume2,
  Smile,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Crown,
  Activity,
  Maximize2,
  Minimize2,
  Sliders
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  verified: boolean;
  interests: string[];
  bio?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isIcebreaker?: boolean;
  isGift?: boolean;
  giftType?: string;
}

interface LoveSuite {
  id: string;
  user1: UserProfile;
  user2: UserProfile;
  matchMakerUsed: string;
  compatibilityScore: number;
  matchedAt: string;
  status: "ACTIVE_ISOLATED_SUITE" | "ENDED" | "ADMIN_MODERATED";
  ruleComplianceScore: number;
  warningsCount: number;
  giftsCount: number;
  messages: Message[];
}

interface AIMatchmaker {
  id: string;
  name: string;
  version: string;
  desc: string;
  accuracy: string;
}

interface MeChatBotSuiteProps {
  onClose?: () => void;
}

export const MeChatBotSuite: React.FC<MeChatBotSuiteProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"matchmaker" | "love_suite" | "ai_engines" | "admin_monitor">("matchmaker");

  // Bot Status Data
  const [onlineCount, setOnlineCount] = useState<number>(14280);
  const [activeSuitesCount, setActiveSuitesCount] = useState<number>(845);
  const [matchmakers, setMatchmakers] = useState<AIMatchmaker[]>([
    { id: "cupid", name: "Aura Cupid AI", version: "v4.2", desc: "Deep personality matrix & romantic intent alignment", accuracy: "98.7%" },
    { id: "quantum", name: "Quantum Compatibility Engine", version: "v3.1", desc: "Quantum-inspired feature vector similarity for instant synergy", accuracy: "99.2%" },
    { id: "vibe", name: "Vibe & Voice Resonance AI", version: "v2.0", desc: "Audio pitch, cadence & emotional tone harmony calculator", accuracy: "96.4%" },
    { id: "zodiac", name: "Zodiac & Cosmic Synergy AI", version: "v1.8", desc: "Celestial astrology & birth-chart compatibility index", accuracy: "94.1%" },
    { id: "hobbies", name: "Hobbies & Passion Graph AI", version: "v3.0", desc: "Shared interest, lifestyle & core values mapping", accuracy: "97.8%" },
    { id: "romance", name: "Romance Core AI", version: "v4.0", desc: "Emotional intelligence, love language & attachment style analysis", accuracy: "98.9%" },
    { id: "vetting", name: "Safety & Vetting Sentinel AI", version: "v5.0", desc: "Real-time identity verification & anti-scam shield", accuracy: "99.9%" },
    { id: "icebreaker", name: "Conversational Icebreaker AI", version: "v2.5", desc: "Generates personalized 20s dynamic icebreakers based on mutual sparks", accuracy: "97.5%" }
  ]);

  // Queue & Matchmaking States
  const [selectedEngine, setSelectedEngine] = useState<string>("cupid");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(20);
  const [pairingProgress, setPairingProgress] = useState<number>(0);
  const [matchedSuite, setMatchedSuite] = useState<LoveSuite | null>(null);

  // Love Suites state
  const [loveSuites, setLoveSuites] = useState<LoveSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>("suite-101");
  const [chatInputText, setChatInputText] = useState<string>("");
  const [isAudioRecording, setIsAudioRecording] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);

  // Virtual Gifts
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);

  // Admin Monitoring
  const [adminNotice, setAdminNotice] = useState<string | null>(null);
  const [searchFilterAdmin, setSearchFilterAdmin] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch suites from server on mount
  useEffect(() => {
    fetchSuites();
  }, []);

  const fetchSuites = async () => {
    try {
      const res = await fetch("/api/mechat/suites");
      const data = await res.json();
      if (data.success && data.suites) {
        setLoveSuites(data.suites);
        if (data.suites.length > 0 && !selectedSuiteId) {
          setSelectedSuiteId(data.suites[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch love suites", err);
    }
  };

  // Scroll chat to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loveSuites, selectedSuiteId]);

  // 20-Second Fast Pairing Queue Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (isSearching) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            setIsSearching(false);
            // Trigger Instant Match
            triggerInstantMatch();
            return 20;
          }
          const elapsed = 20 - (prev - 1);
          setPairingProgress(Math.floor((elapsed / 20) * 100));
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdownSeconds(20);
      setPairingProgress(0);
    }
    return () => clearInterval(timer);
  }, [isSearching]);

  // Audio recording simulation timer
  useEffect(() => {
    let interval: any = null;
    if (isAudioRecording) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isAudioRecording]);

  const triggerInstantMatch = () => {
    const newSuite: LoveSuite = {
      id: `suite-${Date.now().toString().slice(-4)}`,
      user1: {
        id: "u-current",
        name: "You (Verified)",
        age: 24,
        location: "Cambodia / Global",
        avatar: "💖",
        verified: true,
        interests: ["Crypto", "AI", "Travel"]
      },
      user2: {
        id: `u-${Math.floor(Math.random() * 900 + 100)}`,
        name: "Evelyn Morgan",
        age: 23,
        location: "London, UK",
        avatar: "👩🏻",
        verified: true,
        interests: ["Music", "AI", "Cinema"]
      },
      matchMakerUsed: matchmakers.find((m) => m.id === selectedEngine)?.name || "Aura Cupid AI",
      compatibilityScore: Number((Math.random() * 4 + 95.8).toFixed(1)),
      matchedAt: "Just now",
      status: "ACTIVE_ISOLATED_SUITE",
      ruleComplianceScore: 100,
      warningsCount: 0,
      giftsCount: 0,
      messages: [
        {
          id: `m-init-1`,
          senderId: "SYSTEM",
          senderName: "✨ AI CUPID MATCHMAKER",
          text: `🎉 MATCH MERGED! You have been connected with Evelyn Morgan in an Isolated Love Suite!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isIcebreaker: true
        },
        {
          id: `m-init-2`,
          senderId: "u-match",
          senderName: "Evelyn Morgan",
          text: "Hi there! I love that we matched in 20 seconds 💕 What are you up to today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setLoveSuites((prev) => [newSuite, ...prev]);
    setSelectedSuiteId(newSuite.id);
    setMatchedSuite(newSuite);
    setActiveTab("love_suite");
  };

  const handleSendMessage = async () => {
    if (!chatInputText.trim() || !selectedSuiteId) return;
    const textToSend = chatInputText;
    setChatInputText("");

    try {
      const res = await fetch("/api/mechat/suite/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          senderId: "user-current",
          senderName: "You",
          text: textToSend
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSuites();
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSendGift = async (giftType: string) => {
    if (!selectedSuiteId) return;
    setShowGiftModal(false);
    try {
      const res = await fetch("/api/mechat/suite/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          giftType,
          senderName: "You"
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSuites();
      }
    } catch (err) {
      console.error("Error sending gift", err);
    }
  };

  const handleSendVoiceNote = () => {
    if (!isAudioRecording) {
      setIsAudioRecording(true);
    } else {
      setIsAudioRecording(false);
      // Dispatch simulated voice note message
      if (!selectedSuiteId) return;
      const voiceText = `🎙️ Secret Audio Message (${audioSeconds}s)`;
      fetch("/api/mechat/suite/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suiteId: selectedSuiteId,
          senderId: "user-current",
          senderName: "You",
          text: voiceText
        })
      }).then(() => fetchSuites());
    }
  };

  const handleAdminAction = async (action: string, suiteId: string) => {
    try {
      const res = await fetch("/api/mechat/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, suiteId })
      });
      const data = await res.json();
      if (data.success) {
        setAdminNotice(`Admin Action executed: ${action} on suite ${suiteId}`);
        setTimeout(() => setAdminNotice(null), 4000);
        fetchSuites();
      }
    } catch (err) {
      console.error("Error executing admin action", err);
    }
  };

  const activeSuite = loveSuites.find((s) => s.id === selectedSuiteId) || loveSuites[0];

  return (
    <div className="w-full bg-[#0d0914] text-stone-100 rounded-3xl border border-purple-900/50 overflow-hidden shadow-2xl font-sans">
      {/* HEADER BANNER WITH BOT LINK & STATS */}
      <div className="bg-gradient-to-r from-purple-950 via-[#180d2b] to-fuchsia-950 p-6 border-b border-purple-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 flex items-center justify-center text-2xl shadow-xl border border-pink-400/40 transform hover:rotate-6 transition-transform">
              💖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-wide">
                  @MeChatBot Matchmaking & Isolated Love Suite
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-700">
                  OFFICIAL ECOSYSTEM INTEGRATION
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE PAIRING
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>Direct Bot Access:</span>
                <a
                  href="https://t.me/MeChatBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 font-bold underline flex items-center gap-1 font-mono"
                >
                  <span>https://t.me/MeChatBot</span>
                  <ExternalLink size={12} />
                </a>
                <span>• 8 AI Matchmakers • 20s Fast Pairing</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3.5 py-2 bg-black/50 border border-purple-800/80 rounded-xl text-xs flex items-center gap-2">
              <Users size={14} className="text-pink-400" />
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">ONLINE SEARCHING</span>
                <span className="font-bold font-mono text-white">{onlineCount.toLocaleString()} Users</span>
              </div>
            </div>

            <div className="px-3.5 py-2 bg-black/50 border border-purple-800/80 rounded-xl text-xs flex items-center gap-2">
              <Heart size={14} className="text-fuchsia-400" />
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">ACTIVE LOVE SUITES</span>
                <span className="font-bold font-mono text-white">{activeSuitesCount.toLocaleString()} Suites</span>
              </div>
            </div>

            <a
              href="https://t.me/MeChatBot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Send size={14} />
              <span>Launch @MeChatBot</span>
            </a>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold border border-stone-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 px-6 pt-3 bg-[#0a0710] border-b border-purple-900/40 overflow-x-auto [scrollbar-width:none]">
        <button
          onClick={() => setActiveTab("matchmaker")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "matchmaker"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Sparkles size={15} />
          <span>20s Fast Pairing Queue</span>
          {isSearching && (
            <span className="px-2 py-0.5 bg-pink-950 text-pink-300 text-[10px] rounded-full font-mono font-bold animate-pulse">
              SEARCHING ({countdownSeconds}s)
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("love_suite")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "love_suite"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Heart size={15} />
          <span>Isolated Love Suite (Chat)</span>
          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 text-[10px] rounded-full font-mono border border-purple-700">
            PRIVATE 1-ON-1
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ai_engines")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "ai_engines"
              ? "bg-[#130b22] text-pink-400 border-pink-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <Zap size={15} />
          <span>8 AI Matchmaker Engines</span>
        </button>

        <button
          onClick={() => setActiveTab("admin_monitor")}
          className={`px-5 py-3 rounded-t-2xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "admin_monitor"
              ? "bg-[#130b22] text-emerald-400 border-emerald-500 font-black"
              : "text-stone-400 hover:text-stone-200 border-transparent"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Admin Real-Time Chat Monitor</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] rounded-full font-mono border border-emerald-700 font-bold">
            MODERATOR MODE
          </span>
        </button>
      </div>

      {/* TAB 1: 20s AUTO MATCHMAKER & FAST PAIRING QUEUE */}
      {activeTab === "matchmaker" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Main Pairing Stage Banner */}
          <div className="p-8 bg-gradient-to-b from-[#180c2f] via-[#120822] to-[#0d0718] rounded-3xl border border-purple-800/80 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.15)_0,transparent_70%)] pointer-events-none"></div>

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-950/80 border border-pink-700 text-pink-300 rounded-full text-xs font-mono font-bold">
                <Sparkles size={14} />
                <span>20-SECOND QUANTUM MATCHMAKING ENGINE</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Connect Real People in 20 Seconds into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">Isolated Love Suite</span>
              </h1>

              <p className="text-sm text-stone-300 leading-relaxed">
                Choose one of our 8 specialized AI Matchmaker Engines to scan real user profiles, calculate vector affinity, and merge two compatible people into an isolated private room.
              </p>

              {/* Engine Selector Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left pt-2">
                {matchmakers.map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => setSelectedEngine(engine.id)}
                    className={`p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                      selectedEngine === engine.id
                        ? "bg-pink-950/90 border-pink-500 shadow-xl text-white ring-2 ring-pink-500/50"
                        : "bg-black/50 border-purple-900/60 text-stone-300 hover:border-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-pink-300">{engine.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-pink-900/60 text-pink-200 px-1.5 py-0.5 rounded">
                        {engine.accuracy}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-2">{engine.desc}</p>
                  </button>
                ))}
              </div>

              {/* Start Search Action Button or Countdown Radar */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-4">
                {!isSearching ? (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="px-8 py-4 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-base rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer ring-4 ring-pink-500/30"
                  >
                    <Heart size={20} className="animate-bounce" />
                    <span>START 20s AUTO MATCHMAKING</span>
                    <Zap size={18} className="text-amber-300" />
                  </button>
                ) : (
                  <div className="w-full max-w-md p-6 bg-black/80 rounded-3xl border border-pink-500/80 space-y-4 animate-pulse">
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-pink-500/30 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-fuchsia-500/60 animate-spin"></div>
                      <div className="text-2xl font-mono font-black text-white">{countdownSeconds}s</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono font-bold text-pink-300">
                        <span>SCANNING GLOBAL USER VECTORS...</span>
                        <span>{pairingProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-900 rounded-full h-3 overflow-hidden border border-purple-900">
                        <div
                          className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 h-full transition-all duration-300"
                          style={{ width: `${pairingProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={triggerInstantMatch}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        ⚡ Fast-Forward Match Now
                      </button>
                      <button
                        onClick={() => setIsSearching(false)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Active Love Suite Previews */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Heart size={16} className="text-pink-400" />
                <span>Live Active Isolated Love Suites</span>
              </h3>
              <span className="text-xs text-stone-400 font-mono">Real-time Encrypted P2P Channels</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loveSuites.map((suite) => (
                <div
                  key={suite.id}
                  onClick={() => {
                    setSelectedSuiteId(suite.id);
                    setActiveTab("love_suite");
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                    selectedSuiteId === suite.id
                      ? "bg-purple-950/70 border-pink-500 shadow-xl"
                      : "bg-[#110a1f] border-purple-900/60 hover:border-purple-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-700">
                      {suite.matchMakerUsed}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles size={12} />
                      {suite.compatibilityScore}% Synergy
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-2 bg-black/40 rounded-2xl border border-purple-900/40">
                    <div className="text-center">
                      <div className="text-2xl">{suite.user1.avatar}</div>
                      <span className="text-xs font-bold text-white block mt-1">{suite.user1.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-stone-400 block font-mono">{suite.user1.location}</span>
                    </div>

                    <div className="text-pink-500 font-bold text-xl animate-pulse">❤️</div>

                    <div className="text-center">
                      <div className="text-2xl">{suite.user2.avatar}</div>
                      <span className="text-xs font-bold text-white block mt-1">{suite.user2.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-stone-400 block font-mono">{suite.user2.location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-stone-400 pt-1">
                    <span>{suite.messages.length} Messages exchanged</span>
                    <span className="text-pink-400 font-bold hover:underline">Join Private Chat →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISOLATED LOVE SUITE (1-ON-1 PRIVATE CHAT ROOM) */}
      {activeTab === "love_suite" && activeSuite && (
        <div className="p-6 space-y-4 animate-fade-in">
          {/* Room Header Controls */}
          <div className="p-4 bg-[#140c24] rounded-2xl border border-purple-800/80 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 items-center">
                <div className="w-10 h-10 rounded-2xl bg-pink-950 border-2 border-pink-500 flex items-center justify-center text-xl shadow-md">
                  {activeSuite.user1.avatar}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-950 border-2 border-fuchsia-500 flex items-center justify-center text-xl shadow-md">
                  {activeSuite.user2.avatar}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>
                    {activeSuite.user1.name} & {activeSuite.user2.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-pink-950 text-pink-300 border border-pink-700">
                    ISOLATED ROOM
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400 flex items-center gap-2 font-mono">
                  <span>Matched via {activeSuite.matchMakerUsed}</span>
                  <span>•</span>
                  <span className="text-pink-400 font-bold">{activeSuite.compatibilityScore}% Compatibility</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowGiftModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Gift size={14} />
                <span>Send Virtual Gift</span>
              </button>

              <button
                onClick={() => triggerInstantMatch()}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-all border border-stone-700 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Next Match ⏭️</span>
              </button>

              <button
                onClick={() => setActiveTab("admin_monitor")}
                className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-700 cursor-pointer flex items-center gap-1.5"
              >
                <Shield size={13} />
                <span>Admin View</span>
              </button>
            </div>
          </div>

          {/* Private Chat Interface */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Left Sidebar: Partner Info */}
            <div className="md:col-span-1 p-5 bg-[#120a20] rounded-3xl border border-purple-900/60 space-y-4">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center text-4xl shadow-xl border-2 border-pink-400/40">
                  {activeSuite.user2.avatar}
                </div>
                <h4 className="text-base font-black text-white flex items-center justify-center gap-1">
                  <span>{activeSuite.user2.name}</span>
                  {activeSuite.user2.verified && <CheckCircle2 size={14} className="text-pink-400" />}
                </h4>
                <span className="text-xs text-stone-400 font-mono">
                  {activeSuite.user2.age} yrs • {activeSuite.user2.location}
                </span>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-purple-900/40 space-y-2">
                <span className="text-[10px] font-mono font-bold text-stone-400 block">MUTUAL INTERESTS</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSuite.user2.interests.map((int, i) => (
                    <span key={i} className="px-2 py-0.5 bg-pink-950/80 text-pink-300 rounded-lg text-[10px] font-bold border border-pink-800/60">
                      #{int}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-purple-900/40 space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-stone-400 block">ROOM PRIVACY SHIELD</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px]">
                  <Lock size={12} />
                  <span>256-Bit Isolated Protocol</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSendGift("🌹 Virtual Rose")}
                  className="flex-1 py-2 bg-pink-950 hover:bg-pink-900 text-pink-300 rounded-xl text-xs font-bold border border-pink-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Heart size={13} />
                  <span>Like 💕</span>
                </button>
                <button
                  onClick={() => triggerInstantMatch()}
                  className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 rounded-xl text-xs font-bold border border-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Skip ⏭️</span>
                </button>
              </div>
            </div>

            {/* Right Chat Area */}
            <div className="md:col-span-3 flex flex-col h-[560px] bg-[#0f091b] rounded-3xl border border-purple-900/60 overflow-hidden shadow-xl">
              {/* Messages Area */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                {activeSuite.messages.map((msg) => {
                  const isMe = msg.senderId === "user-current" || msg.senderName === "You";
                  const isSystem = msg.senderId === "SYSTEM" || msg.senderId === "ADMIN_SYSTEM";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="p-3 bg-purple-950/60 border border-purple-800/80 rounded-2xl text-center text-xs text-purple-200 font-mono space-y-1">
                        <span className="font-bold text-pink-300 block">{msg.senderName}</span>
                        <p>{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-1 px-1 font-mono">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-sm text-xs leading-relaxed shadow-md ${
                          isMe
                            ? "bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-tr-none"
                            : msg.isGift
                            ? "bg-amber-950/80 border border-amber-500/80 text-amber-200 rounded-tl-none font-bold"
                            : "bg-stone-900/90 border border-stone-800 text-stone-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-[#140b25] border-t border-purple-900/60 space-y-2">
                {isAudioRecording && (
                  <div className="p-2 bg-pink-950/80 border border-pink-700 rounded-xl text-xs text-pink-300 font-mono flex items-center justify-between animate-pulse">
                    <span className="flex items-center gap-2">
                      <Volume2 size={14} />
                      <span>Recording Secret Audio Message ({audioSeconds}s)...</span>
                    </span>
                    <button
                      onClick={handleSendVoiceNote}
                      className="px-2.5 py-1 bg-pink-600 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Send Voice Note
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendVoiceNote}
                    className={`p-3 rounded-2xl border text-stone-300 transition-all cursor-pointer ${
                      isAudioRecording ? "bg-red-600 text-white border-red-500 animate-bounce" : "bg-stone-900 border-purple-900 hover:border-purple-700"
                    }`}
                    title="Record Voice Note"
                  >
                    <Volume2 size={16} />
                  </button>

                  <button
                    onClick={() => setShowGiftModal(true)}
                    className="p-3 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded-2xl border border-amber-700 transition-all cursor-pointer"
                    title="Send Gift"
                  >
                    <Gift size={16} />
                  </button>

                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type private message in Love Suite..."
                    className="flex-1 px-4 py-3 bg-black/60 border border-purple-900/80 rounded-2xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-pink-500 font-sans"
                  />

                  <button
                    onClick={handleSendMessage}
                    className="px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 8 INTELLIGENT AI MATCHMAKER ENGINES */}
      {activeTab === "ai_engines" && (
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="p-6 bg-gradient-to-r from-purple-950 via-[#190d30] to-fuchsia-950 rounded-3xl border border-purple-800/80 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Zap size={18} className="text-pink-400" />
                <span>8 Specialized AI Matchmaker Neural Engines</span>
              </h3>
              <p className="text-xs text-purple-300/80 mt-1">
                Engineered for @MeChatBot to perform multi-dimensional profile vectors matching, real-time audio resonance, and romance intent pairing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchmakers.map((engine, idx) => (
              <div
                key={engine.id}
                className="p-5 bg-[#120a20] rounded-3xl border border-purple-900/70 space-y-3 hover:border-pink-500/60 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-pink-950 text-pink-300 border border-pink-800 font-mono font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {engine.accuracy} ACCURACY
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{engine.name}</h4>
                  <span className="text-[10px] font-mono text-purple-300 block">{engine.version}</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{engine.desc}</p>

                <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>Latency: 12ms</span>
                  <button
                    onClick={() => {
                      setSelectedEngine(engine.id);
                      setActiveTab("matchmaker");
                    }}
                    className="text-pink-400 hover:underline font-bold cursor-pointer"
                  >
                    Select Engine →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN REAL-TIME CHAT MONITOR & RULE COMPLIANCE DASHBOARD */}
      {activeTab === "admin_monitor" && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Admin Header Notification */}
          {adminNotice && (
            <div className="p-3.5 bg-emerald-950/90 border border-emerald-700 rounded-2xl text-xs text-emerald-200 font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{adminNotice}</span>
              </span>
              <button onClick={() => setAdminNotice(null)} className="text-stone-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 rounded-3xl border border-emerald-800/80 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-emerald-300 border border-emerald-600 flex items-center justify-center font-bold text-xl shadow-lg">
                🛡️
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Admin Live Moderation & Safety Sentinel</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    REAL-TIME MONITOR
                  </span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Monitor active Isolated Love Suites in real-time, inspect message streams, enforce rule compliance, and maintain a safe environment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 bg-black/60 rounded-xl border border-emerald-800 text-xs font-mono">
                <span className="text-stone-400 block text-[10px]">RULE COMPLIANCE RATE</span>
                <span className="font-bold text-emerald-400 text-sm">99.8% Compliant</span>
              </div>
            </div>
          </div>

          {/* Active Suites Moderation Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Eye size={16} className="text-emerald-400" />
                <span>Active Monitored Love Suites</span>
              </h4>

              <input
                type="text"
                value={searchFilterAdmin}
                onChange={(e) => setSearchFilterAdmin(e.target.value)}
                placeholder="Search user or suite ID..."
                className="px-3.5 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loveSuites
                .filter((s) => s.user1.name.toLowerCase().includes(searchFilterAdmin.toLowerCase()) || s.user2.name.toLowerCase().includes(searchFilterAdmin.toLowerCase()) || s.id.includes(searchFilterAdmin))
                .map((suite) => (
                  <div key={suite.id} className="p-5 bg-[#0e1412] rounded-3xl border border-emerald-900/60 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 rounded-lg text-[10px] font-mono font-bold border border-emerald-800">
                          {suite.id}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {suite.user1.name} ❤️ {suite.user2.name}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          suite.ruleComplianceScore >= 90
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                            : "bg-amber-950 text-amber-300 border border-amber-700"
                        }`}
                      >
                        {suite.ruleComplianceScore}% Compliant
                      </span>
                    </div>

                    {/* Chat Snippet Stream */}
                    <div className="p-3 bg-black/60 rounded-2xl border border-stone-800 max-h-36 overflow-y-auto space-y-2 text-xs font-mono">
                      {suite.messages.slice(-3).map((m) => (
                        <div key={m.id} className="flex items-start gap-1.5 text-stone-300 text-[11px]">
                          <span className="font-bold text-emerald-400 shrink-0">{m.senderName}:</span>
                          <span className="text-stone-300">{m.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Admin Moderation Actions */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <button
                        onClick={() => handleAdminAction("INJECT_ICEBREAKER", suite.id)}
                        className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-200 rounded-xl text-xs font-bold border border-purple-700 cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        <span>Inject Icebreaker</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("WARN", suite.id)}
                        className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded-xl text-xs font-bold border border-amber-700 cursor-pointer flex items-center gap-1"
                      >
                        <AlertTriangle size={12} />
                        <span>Warn Room</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("MARK_COMPLIANT", suite.id)}
                        className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-700 cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Mark Verified</span>
                      </button>

                      <button
                        onClick={() => handleAdminAction("FORCE_END", suite.id)}
                        className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold border border-red-800 cursor-pointer flex items-center gap-1"
                      >
                        <X size={12} />
                        <span>End Suite</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIRTUAL GIFT SELECTION MODAL */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#160c29] border border-purple-800 rounded-3xl p-6 space-y-5 text-stone-100 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Gift size={18} className="text-amber-400" />
                <span>Send Virtual Gift to Love Suite Partner</span>
              </h3>
              <button onClick={() => setShowGiftModal(false)} className="text-stone-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "🌹 Virtual Rose", price: "10 USDT" },
                { name: "🍾 Champagne Celebration", price: "25 USDT" },
                { name: "💍 Diamond Sparkle Ring", price: "50 USDT" },
                { name: "💖 Love Heart Wave", price: "5 USDT" }
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendGift(g.name)}
                  className="p-4 bg-black/50 hover:bg-purple-950/80 rounded-2xl border border-purple-800/80 hover:border-pink-500 text-left transition-all cursor-pointer space-y-1"
                >
                  <span className="font-bold text-xs text-pink-300 block">{g.name}</span>
                  <span className="text-[10px] font-mono text-amber-400 block">{g.price}</span>
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowGiftModal(false)}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
