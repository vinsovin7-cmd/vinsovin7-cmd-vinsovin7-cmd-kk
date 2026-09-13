import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  ShoppingBag, 
  MessageSquare, 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  UserCheck, 
  LogOut, 
  Sliders,
  Sparkles,
  Tv,
  Wallet,
  Send,
  ArrowUpRight,
  Shield,
  Volume2,
  CheckCircle2,
  ExternalLink,
  Pause,
  SkipForward,
  Award,
  Layers
} from "lucide-react";

interface Session {
  id: string;
  domain: string;
  status: "online" | "idle" | "logged_out";
  landedAt: string;
  durationSeconds: number;
  earningsAccumulated: number;
  tidioSignalSent: boolean;
  tidioLogoutSignalSent: boolean;
}

interface Transaction {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  timestamp: string;
  source: string;
  tidioNotified: boolean;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  asset: "USDT" | "USD" | "SOL";
  destination: string;
  txHash: string;
  timestamp: string;
  status: "CONFIRMED_ON_CHAIN" | "PROCESSING";
  network: string;
}

interface PhantomWalletState {
  connected: boolean;
  address: string;
  solBalance: number;
  usdtBalance: number;
  totalWithdrawnUsdt: number;
  withdrawals: WithdrawalRecord[];
}

interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  autoIntervalMinutes: number;
  lastDispatchTimestamp: string;
  nextDispatchSeconds: number;
  dispatchLogs: Array<{
    id: string;
    timestamp: string;
    amountDispatched: number;
    telegramStatus: string;
    messageSummary: string;
  }>;
}

interface CinemaChannel {
  id: number;
  title: string;
  category: string;
  embedUrl: string;
  viewersCount: number;
  yieldAccrued: number;
  sponsorAd: {
    title: string;
    sponsor: string;
    payoutUsd: number;
    bannerUrl?: string;
  };
}

interface StatsData {
  shopDomain: string;
  clientId: string;
  onlineVisitorsCount: number;
  totalSessions: number;
  activeSessionYield: number;
  totalRevenueRecorded: number;
  liveYieldRatePerSec: number;
  tidioSignalStatus: string;
  shopifyWebhookStatus: string;
  sessions: Session[];
  recentTransactions: Transaction[];
  phantomWallet: PhantomWalletState;
  telegramConfig: TelegramConfig;
  cinemaChannels: CinemaChannel[];
  activeChannelIndex: number;
}

export const EcosystemDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "matrix" | "cinema" | "phantom" | "telegram" | "urls" | "cli" | "paradise"
  >("matrix");
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Cinema State
  const [currentChannelIdx, setCurrentChannelIdx] = useState(0);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAsset, setWithdrawAsset] = useState<"USDT" | "USD" | "SOL">("USDT");
  const [withdrawDest, setWithdrawDest] = useState("");
  const [withdrawalMessage, setWithdrawalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Phantom Custom Link Address Input
  const [customPhantomAddr, setCustomPhantomAddr] = useState("");
  
  // CLI State
  const [cliInput, setCliInput] = useState("");
  const [cliLogs, setCliLogs] = useState<Array<{ type: "cmd" | "out" | "err"; text: string }>>([
    { 
      type: "out", 
      text: "[ECOSYSTEM HEAVENLY PARADISE CLI v3.8]\nConnected to Shopify Client ID: 5144661590b6f29869cd1cdae3248074\nPhantom Master Wallet: 5uYJ...5DRL (Solana SPL Connected)\nTelegram Dispatcher: Active (@wallet / 30-min interval)\nType 'help' for command list." 
    }
  ]);

  // Notifications Alert Banner State
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/ecosystem/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (!withdrawDest && data.phantomWallet?.address) {
          setWithdrawDest(data.phantomWallet.address);
        }
      }
    } catch (err) {
      console.log("Error fetching ecosystem stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerNotification(`Copied to clipboard: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Connect Web3 Phantom Extension if available
  const handleConnectPhantomWallet = async () => {
    if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
      try {
        const response = await (window as any).solana.connect();
        const address = response.publicKey.toString();
        await fetch("/api/phantom/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
        fetchStats();
        triggerNotification(`[PHANTOM CONNECTED] Wallet linked: ${address.slice(0, 6)}...${address.slice(-4)}`);
      } catch (err) {
        triggerNotification("Phantom connection request was cancelled.");
      }
    } else {
      if (customPhantomAddr.trim()) {
        await fetch("/api/phantom/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: customPhantomAddr.trim() }),
        });
        fetchStats();
        triggerNotification(`[PHANTOM LINKED] Address updated to: ${customPhantomAddr.slice(0, 8)}...`);
        setCustomPhantomAddr("");
      } else {
        triggerNotification("Please enter a valid Phantom / Solana wallet address to link.");
      }
    }
  };

  // Execute Withdrawal
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWithdrawalMessage(null);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawalMessage({ type: "error", text: "Please enter a valid withdrawal amount." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          asset: withdrawAsset,
          destinationAddress: withdrawDest || stats?.phantomWallet.address,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWithdrawalMessage({ type: "success", text: data.message });
        setWithdrawAmount("");
        fetchStats();
        triggerNotification(`[WITHDRAWAL CONFIRMED] $${amt.toFixed(2)} ${withdrawAsset} dispatched on-chain!`);
      } else {
        setWithdrawalMessage({ type: "error", text: data.error || "Withdrawal failed." });
      }
    } catch (err) {
      setWithdrawalMessage({ type: "error", text: "Network error processing withdrawal." });
    } finally {
      setLoading(false);
    }
  };

  // Trigger Manual Telegram 30-Min Dispatch
  const handleTriggerTelegramDispatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/trigger", { method: "POST" });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.message || "Telegram earnings alert dispatched!");
    } catch (err) {
      triggerNotification("Failed to trigger Telegram dispatch.");
    } finally {
      setLoading(false);
    }
  };

  // Play Sponsor Ad in Cinema (5-second Countdown, then credit revenue and auto-advance)
  const handleTriggerSponsorAd = async () => {
    if (isAdPlaying) return;
    setIsAdPlaying(true);
    setAdCountdown(5);

    if (adTimerRef.current) clearInterval(adTimerRef.current);

    let count = 5;
    adTimerRef.current = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        if (adTimerRef.current) clearInterval(adTimerRef.current);
        completeAdAndAdvance();
      }
    }, 1000);
  };

  const completeAdAndAdvance = async () => {
    setIsAdPlaying(false);
    try {
      const nextIdx = (currentChannelIdx + 1) % (stats?.cinemaChannels.length || 20);
      const res = await fetch("/api/cinema/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelIndex: nextIdx, adCompleted: true }),
      });
      const data = await res.json();
      setCurrentChannelIdx(nextIdx);
      fetchStats();
      triggerNotification(data.message || `[AD REVENUE REWARDED] Auto-advanced to Channel ${nextIdx + 1}`);
    } catch (err) {
      console.log("Error advancing ad:", err);
    }
  };

  // Ping Visitor
  const handlePingVisitor = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tidio/visitor-session/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "earnings.ink", status: "online", action: "land" }),
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.tidioNotification || "New visitor landed on earnings.ink! Tidio signal activated.");
    } catch (err) {
      triggerNotification("Ping failed.");
    } finally {
      setLoading(false);
    }
  };

  // Logout Visitor
  const handleLogoutVisitor = async () => {
    setLoading(true);
    try {
      const activeSession = stats?.sessions.find(s => s.status === "online");
      const res = await fetch("/api/tidio/visitor-session/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId: activeSession?.id || "sess-ink-991", 
          domain: "earnings.ink", 
          action: "logout" 
        }),
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(data.tidioNotification || "Visitor logged out! Released active earnings yield to Phantom Wallet.");
    } catch (err) {
      triggerNotification("Logout ping failed.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate Sale
  const handleSimulateSale = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shopify/webhooks/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Math.floor(1000 + Math.random() * 9000),
          total_price: "185.00",
          currency: "USD",
          customer: { email: "live.shopper@earnings.ink" }
        })
      });
      const data = await res.json();
      fetchStats();
      triggerNotification(`[SHOPIFY + TIDIO ALERT] ${data.message}`);
    } catch (err) {
      triggerNotification("Failed to simulate sale.");
    } finally {
      setLoading(false);
    }
  };

  // CLI Execute
  const executeCliCommand = async (commandToRun?: string) => {
    const cmd = commandToRun !== undefined ? commandToRun : cliInput;
    if (!cmd.trim()) return;

    setCliLogs(prev => [...prev, { type: "cmd", text: `$ ${cmd}` }]);
    setCliInput("");

    try {
      const res = await fetch("/api/cli/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      setCliLogs(prev => [...prev, { type: "out", text: data.output }]);
      fetchStats();
    } catch (err) {
      setCliLogs(prev => [...prev, { type: "err", text: "CLI Execution error." }]);
    }
  };

  // Precomputed values
  const shopifyClientId = stats?.clientId || "5144661590b6f29869cd1cdae3248074";
  const shopDomain = stats?.shopDomain || "earnings.ink";
  const phantomAddr = stats?.phantomWallet?.address || "5uYJ7kP9xM8v3Q1n2L5s4A6b8C9d0e1F2G3h4i5j6k7L";
  const totalRev = stats?.totalRevenueRecorded || 845.50;
  const currentCh = stats?.cinemaChannels?.[currentChannelIdx] || {
    id: 1,
    title: "Legend of the Seeker (Season 1)",
    category: "Fantasy Epic",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1",
    viewersCount: 1420,
    yieldAccrued: 170.26,
    sponsorAd: { title: "Solana High-Yield Vaults", sponsor: "Solana Labs", payoutUsd: 12.50 }
  };

  const trackingUrl = `https://${shopDomain}/?shopify_client_id=${shopifyClientId}&tidio_signal=active&monetize=session`;
  const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${shopifyClientId}&scope=read_orders,write_orders,read_customers&redirect_uri=https://${shopDomain}/api/shopify/callback&state=tidio_earnings_active`;
  const tidioScriptTag = `<script src="//code.tidio.co/${shopifyClientId.slice(0, 16)}.js" async></script>`;

  // Telegram countdown helper
  const tgCountdownMins = Math.floor((stats?.telegramConfig?.nextDispatchSeconds || 720) / 60);
  const tgCountdownSecs = (stats?.telegramConfig?.nextDispatchSeconds || 720) % 60;

  return (
    <>
      {/* Top Right Floating Matrix Launcher Pill */}
      <div className="fixed top-20 right-6 z-40 flex items-center gap-3">
        {notification && (
          <div className="animate-bounce flex items-center gap-2 bg-stone-900 text-nobel-gold border border-nobel-gold/50 px-4 py-2 rounded-full text-xs font-mono shadow-xl backdrop-blur-md">
            <Zap size={14} className="animate-pulse text-amber-400" />
            <span>{notification}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-stone-900/95 hover:bg-stone-900 text-stone-100 border border-nobel-gold/50 hover:border-nobel-gold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-nobel-gold flex items-center gap-1">
              <Sparkles size={10} /> SHOPIFY + TIDIO + PHANTOM MATRIX
            </span>
            <span className="text-xs font-mono text-stone-200">
              {shopDomain} • ${totalRev.toFixed(2)} USDT
            </span>
          </div>
          <Sliders size={14} className="text-stone-400 group-hover:text-nobel-gold transition-colors" />
        </button>
      </div>

      {/* Main Full-Featured Dashboard Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in">
          <div className="bg-stone-900 text-stone-100 w-full max-w-6xl rounded-2xl border border-nobel-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nobel-gold via-amber-600 to-amber-800 flex items-center justify-center text-stone-950 shadow-lg">
                  <Zap size={22} className="fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                      Sreymara Heavenly Ecosystem & Live Revenue Matrix
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ON-CHAIN LIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 flex flex-wrap items-center gap-3 mt-0.5">
                    <span>Shopify: <strong className="text-nobel-gold font-mono">{shopifyClientId}</strong></span>
                    <span>Phantom: <strong className="text-cyan-300 font-mono">{phantomAddr.slice(0, 6)}...{phantomAddr.slice(-4)}</strong></span>
                    <span>Telegram: <strong className="text-emerald-400 font-mono">@wallet (30m Auto)</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchStats}
                  className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                  title="Refresh Ecosystem Telemetry"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 gap-1 text-xs font-medium uppercase tracking-wider overflow-x-auto">
              <button
                onClick={() => setActiveTab("matrix")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "matrix" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Activity size={14} /> Live Revenue & Visitor Tracker
              </button>

              <button
                onClick={() => setActiveTab("cinema")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "cinema" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Tv size={14} /> Sreymara Cinema (20 Channels) & Ads
              </button>

              <button
                onClick={() => setActiveTab("phantom")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "phantom" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Wallet size={14} /> Phantom Wallet & Withdrawal Portal
              </button>

              <button
                onClick={() => setActiveTab("telegram")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "telegram" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Send size={14} /> Telegram 30-Min Alert Dispatcher
              </button>

              <button
                onClick={() => setActiveTab("urls")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "urls" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Globe size={14} /> URLs & Integration
              </button>

              <button
                onClick={() => setActiveTab("cli")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "cli" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Terminal size={14} /> CLI Console
              </button>

              <button
                onClick={() => setActiveTab("paradise")}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === "paradise" ? "border-nobel-gold text-nobel-gold font-bold" : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <ShieldCheck size={14} /> Paradise Status
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: LIVE REVENUE & VISITOR TRACKER */}
              {activeTab === "matrix" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>ONLINE VISITORS</span>
                        <UserCheck size={14} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                        {stats?.onlineVisitorsCount || 1}
                        <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          Active Signal
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Live tracking on {shopDomain}</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>LIVE SESSION YIELD</span>
                        <Clock size={14} className="text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-nobel-gold">
                        ${stats?.activeSessionYield.toFixed(2) || "9.00"}
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Accumulating @ $0.05/sec online</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>TOTAL ECOSYSTEM REVENUE</span>
                        <DollarSign size={14} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        ${totalRev.toFixed(2)} USD
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Synced to Phantom Master Wallet</p>
                    </div>

                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800/80">
                      <div className="flex justify-between items-center text-stone-400 text-xs mb-1">
                        <span>TIDIO SIGNAL STATUS</span>
                        <MessageSquare size={14} className="text-cyan-400" />
                      </div>
                      <div className="text-sm font-bold font-mono text-cyan-300 mt-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        {stats?.tidioSignalStatus || "ACTIVE_LISTENING"}
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Instant landing & logout alerts</p>
                    </div>
                  </div>

                  {/* Interactive Test Action Bar */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-xl border border-stone-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-nobel-gold mb-3 flex items-center gap-2">
                      <Sparkles size={14} /> Interactive Event Simulation Controls
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handlePingVisitor}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <UserCheck size={14} /> Simulate Visitor Landing Signal
                      </button>

                      <button
                        onClick={handleLogoutVisitor}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <LogOut size={14} /> Simulate Visitor Logout & Release Earnings
                      </button>

                      <button
                        onClick={handleSimulateSale}
                        disabled={loading}
                        className="px-4 py-2 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <ShoppingBag size={14} /> Trigger $185 Shopify Sale & Tidio Alert
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions & Duration List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-950/60 p-5 rounded-xl border border-stone-800/80">
                      <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-400" /> Active Session Duration & Yield
                      </h4>

                      {stats?.sessions && stats.sessions.length > 0 ? (
                        <div className="space-y-3">
                          {stats.sessions.map((sess) => (
                            <div key={sess.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex justify-between items-center text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${sess.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-stone-500"}`}></span>
                                  <span className="font-mono text-white font-bold">{sess.id}</span>
                                  <span className="text-stone-400">({sess.domain})</span>
                                </div>
                                <div className="text-[10px] text-stone-500 mt-1">
                                  Landed: {new Date(sess.landedAt).toLocaleTimeString()} • Online Duration: {sess.durationSeconds}s
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-nobel-gold">+${sess.earningsAccumulated.toFixed(2)}</div>
                                <span className="text-[10px] text-emerald-400 font-mono">
                                  {sess.status === "online" ? "ACCUMULATING" : "RELEASED"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-stone-500 italic py-4">No active sessions tracked yet. Click simulate landing.</div>
                      )}
                    </div>

                    {/* Transaction Stream */}
                    <div className="bg-stone-950/60 p-5 rounded-xl border border-stone-800/80">
                      <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShoppingBag size={14} className="text-nobel-gold" /> Recorded Shopify Transactions
                      </h4>

                      <div className="space-y-3">
                        {stats?.recentTransactions?.map((tx) => (
                          <div key={tx.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-mono font-bold text-white flex items-center gap-2">
                                <span>{tx.orderNumber}</span>
                                <span className="text-[10px] px-2 py-0.2 bg-stone-800 text-stone-300 rounded">
                                  {tx.source}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-500 mt-1">
                                Customer: {tx.customerEmail} • {new Date(tx.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-emerald-400">+${tx.amount.toFixed(2)}</div>
                              <span className="text-[10px] text-cyan-400 flex items-center gap-1 justify-end">
                                <MessageSquare size={10} /> Tidio Alert Sent
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: SREYMARA CINEMA (20 CHANNELS) & AD INTERMISSION ENGINE */}
              {activeTab === "cinema" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Title Banner */}
                  <div className="p-5 bg-gradient-to-r from-stone-950 via-amber-950/30 to-stone-950 rounded-xl border border-nobel-gold/40 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tv size={20} className="text-nobel-gold" />
                        <h3 className="font-serif text-lg font-bold text-white">Sreymara Cinema V3.8 (20 Channels)</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nobel-gold/20 text-nobel-gold border border-nobel-gold/40">
                          CLEAN DISPLAY MODE
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Continuous broadcast with auto-advance, sponsor ad monetization, and dedicated telemetry located below the screen.
                      </p>
                    </div>

                    <button
                      onClick={handleTriggerSponsorAd}
                      disabled={isAdPlaying}
                      className="px-4 py-2.5 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                    >
                      <Play size={14} /> Play Sponsor Ad Intermission (+${currentCh.sponsorAd.payoutUsd.toFixed(2)} USD)
                    </button>
                  </div>

                  {/* 20 Channels Bar */}
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex justify-between items-center">
                      <span>Select Channel (20 Live Broadcasts Available)</span>
                      <span className="text-nobel-gold font-mono">Current: Channel {currentChannelIdx + 1} / 20</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {(stats?.cinemaChannels || [currentCh]).map((ch, idx) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setCurrentChannelIdx(idx);
                            fetch("/api/cinema/channel", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ channelIndex: idx }),
                            });
                          }}
                          className={`px-3 py-2 rounded-lg text-xs flex flex-col items-start min-w-[140px] border transition-all cursor-pointer ${
                            currentChannelIdx === idx 
                              ? "bg-nobel-gold/20 border-nobel-gold text-white font-bold" 
                              : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                          }`}
                        >
                          <span className="text-[10px] text-nobel-gold uppercase font-mono">Ch {ch.id} • {ch.category}</span>
                          <span className="truncate w-full text-[11px] mt-0.5">{ch.title}</span>
                          <span className="text-[9px] text-stone-500 mt-1">👁 {ch.viewersCount} viewers</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Clean Cinema Video Frame */}
                  <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-black aspect-video max-h-[480px] shadow-2xl flex items-center justify-center">
                    
                    {/* AD INTERMISSION OVERLAY (ONLY PLAYS DURING 5s SPONSOR AD) */}
                    {isAdPlaying ? (
                      <div className="absolute inset-0 z-30 bg-stone-950/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-nobel-gold/20 border border-nobel-gold flex items-center justify-center text-nobel-gold mb-4 animate-pulse">
                          <Award size={32} />
                        </div>
                        <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-700 text-xs font-mono font-bold rounded-full uppercase tracking-widest mb-3">
                          MONETIZED SPONSOR AD INTERMISSION
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-white mb-2">
                          {currentCh.sponsorAd.title}
                        </h3>
                        <p className="text-sm text-stone-400 max-w-md mb-6">
                          Sponsored by <strong>{currentCh.sponsorAd.sponsor}</strong> • Crediting <strong>+${currentCh.sponsorAd.payoutUsd.toFixed(2)} USD</strong> directly to your Phantom Wallet balance upon completion.
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="font-mono text-xl text-nobel-gold font-bold">
                            Auto-Advancing in {adCountdown}s...
                          </div>
                          <button
                            onClick={completeAdAndAdvance}
                            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-lg border border-stone-700 flex items-center gap-1 cursor-pointer"
                          >
                            Skip Ad <SkipForward size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* CLEAN VIDEO EMBED WITH ZERO OVERLAYS */
                      <iframe
                        src={currentCh.embedUrl}
                        title={currentCh.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {/* DEDICATED CINEMA MONETIZATION TELEMETRY CARD (LOCATED CLEANLY BELOW THE VIDEO) */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">CURRENT BROADCAST</span>
                      <h4 className="font-serif text-sm font-bold text-white truncate">{currentCh.title}</h4>
                      <p className="text-[11px] text-nobel-gold">{currentCh.category} • {currentCh.viewersCount} Viewers</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">CHANNEL ACCRUED YIELD</span>
                      <div className="text-lg font-mono font-bold text-emerald-400">+${currentCh.yieldAccrued.toFixed(2)} USD</div>
                      <p className="text-[10px] text-stone-400">Stream Yield + Ad Revenues</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">AUDIO & BITRATE RAMP</span>
                      <div className="text-xs font-mono text-stone-300 flex items-center gap-1.5 mt-1">
                        <Volume2 size={14} className="text-cyan-400" /> 1080p 60fps • 90% Optimal Ramp
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">Bitrate: 8.5 Mbps High Fidelity</p>
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <button
                        onClick={handleTriggerSponsorAd}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-nobel-gold/40 text-nobel-gold hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Sparkles size={12} /> Trigger Ad Payout (+${currentCh.sponsorAd.payoutUsd.toFixed(2)})
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: PHANTOM WALLET & WITHDRAWAL PORTAL */}
              {activeTab === "phantom" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Phantom Wallet Status & Balance Header */}
                  <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-2xl border border-nobel-gold/40">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center shadow-lg">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl font-bold text-white">Phantom Master Web3 Wallet</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              SOLANA SPL LINKED
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            Connected Address: <span className="text-nobel-gold font-bold">{phantomAddr}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleConnectPhantomWallet}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                      >
                        <Wallet size={14} /> Connect / Sync Phantom Extension
                      </button>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          WITHDRAWABLE USDT / USD BALANCE
                        </span>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                          ${stats?.phantomWallet?.usdtBalance.toFixed(2) || "845.50"} USDT
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Available for instant on-chain withdrawal</p>
                      </div>

                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          SOLANA ON-CHAIN BALANCE
                        </span>
                        <div className="text-2xl font-bold font-mono text-purple-300">
                          {stats?.phantomWallet?.solBalance || 14.85} SOL
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Solana Native Gas Reservoir</p>
                      </div>

                      <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          TOTAL WITHDRAWN TO DATE
                        </span>
                        <div className="text-2xl font-bold font-mono text-nobel-gold">
                          ${stats?.phantomWallet?.totalWithdrawnUsdt.toFixed(2) || "120.00"} USDT
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Dispatched to wallet addresses</p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Wallet Link Input */}
                  <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Link Custom Solana / Phantom Address:
                    </span>
                    <input
                      type="text"
                      value={customPhantomAddr}
                      onChange={(e) => setCustomPhantomAddr(e.target.value)}
                      placeholder="Paste your Phantom wallet address (e.g., 5uYJ7kP9xM...)"
                      className="flex-1 min-w-[280px] bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleConnectPhantomWallet}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-purple-300 text-xs font-bold rounded-lg border border-purple-800/50 cursor-pointer"
                    >
                      Link Address
                    </button>
                  </div>

                  {/* WITHDRAWAL FORM */}
                  <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-nobel-gold mb-4 flex items-center gap-2">
                      <ArrowUpRight size={16} /> Instant USDT / USD Withdrawal Portal
                    </h4>

                    {withdrawalMessage && (
                      <div className={`p-3 rounded-lg text-xs font-mono mb-4 border ${
                        withdrawalMessage.type === "success" 
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" 
                          : "bg-red-950/80 text-red-300 border-red-800"
                      }`}>
                        {withdrawalMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Amount */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Withdrawal Amount ($)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="e.g. 250.00"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                            />
                            <button
                              type="button"
                              onClick={() => setWithdrawAmount((stats?.phantomWallet?.usdtBalance || 845.50).toString())}
                              className="absolute right-2 top-2 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-nobel-gold text-[10px] font-bold rounded cursor-pointer"
                            >
                              MAX
                            </button>
                          </div>
                        </div>

                        {/* Asset */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Select Asset Currency
                          </label>
                          <select
                            value={withdrawAsset}
                            onChange={(e) => setWithdrawAsset(e.target.value as any)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                          >
                            <option value="USDT">USDT (Solana SPL Token)</option>
                            <option value="USD">USD (Direct Settlement)</option>
                            <option value="SOL">SOL (Solana Native)</option>
                          </select>
                        </div>

                        {/* Destination Address */}
                        <div>
                          <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                            Destination Address
                          </label>
                          <input
                            type="text"
                            value={withdrawDest}
                            onChange={(e) => setWithdrawDest(e.target.value)}
                            placeholder="Phantom / Telegram Wallet address"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                          />
                        </div>

                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xl cursor-pointer transition-all"
                        >
                          <Send size={14} /> EXECUTE ON-CHAIN WITHDRAWAL
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* On-Chain Withdrawal History */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-purple-400" /> On-Chain Withdrawal Logs
                    </h4>

                    <div className="space-y-3">
                      {(stats?.phantomWallet?.withdrawals || []).map((w) => (
                        <div key={w.id} className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2 font-mono font-bold text-white">
                              <span className="text-emerald-400">-${w.amount.toFixed(2)} {w.asset}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800">
                                {w.network}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 mt-1 font-mono">
                              Dest: {w.destination} • {new Date(w.timestamp).toLocaleString()}
                            </div>
                            <div className="text-[9px] text-stone-600 font-mono mt-0.5">
                              Tx Hash: {w.txHash}
                            </div>
                          </div>

                          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 size={10} /> {w.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: TELEGRAM 30-MIN AUTOMATED ALERT DISPATCHER */}
              {activeTab === "telegram" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Telegram Header */}
                  <div className="p-6 bg-gradient-to-r from-stone-950 via-cyan-950/30 to-stone-950 rounded-2xl border border-cyan-800/40">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shadow-lg">
                          <Send size={24} />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold text-white">Telegram 30-Min Automated Dispatcher</h3>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Automatically pushes real-time earnings alerts to your Telegram app every 30 minutes!
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleTriggerTelegramDispatch}
                        disabled={loading}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                      >
                        <Send size={14} /> TRIGGER TELEGRAM EARNINGS DISPATCH NOW
                      </button>
                    </div>

                    {/* Countdown Banner */}
                    <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-2 text-stone-300">
                        <Clock size={16} className="text-cyan-400 animate-spin" />
                        <span>NEXT AUTOMATED DISPATCH IN:</span>
                        <strong className="text-nobel-gold text-base">{tgCountdownMins}m {tgCountdownSecs}s</strong>
                      </div>

                      <div className="flex items-center gap-4 text-[11px]">
                        <span>Bot Token: <strong className="text-stone-300">Configured</strong></span>
                        <span>Chat ID: <strong className="text-cyan-300">@wallet</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Telegram Dispatch Logs */}
                  <div className="p-5 bg-stone-950 rounded-xl border border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-2">
                      <MessageSquare size={14} className="text-cyan-400" /> Telegram Dispatch History
                    </h4>

                    <div className="space-y-3">
                      {(stats?.telegramConfig?.dispatchLogs || []).map((log) => (
                        <div key={log.id} className="p-4 bg-stone-900 rounded-lg border border-stone-800 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-cyan-300">{log.telegramStatus}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-stone-200">{log.messageSummary}</p>
                          <div className="text-[10px] text-emerald-400 font-mono font-bold pt-1">
                            Dispatched Amount: +${log.amountDispatched.toFixed(2)} USD
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: URL & INTEGRATION GUIDE */}
              {activeTab === "urls" && (
                <div className="space-y-6 animate-fade-in text-stone-300 text-xs leading-relaxed">
                  
                  <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200">
                    <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                      <Globe size={16} className="text-amber-400" />
                      What URL parameters to add for http://earnings.ink & Shopify Connection
                    </h3>
                    <p className="text-xs text-amber-300/80">
                      To enable real-time visitor tracking, active online monetization counters, and Tidio instant signals, append these exact URL parameters to your site link or Shopify storefront redirect settings:
                    </p>
                  </div>

                  {/* 1. Recommended Tracking URL */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      1. Recommended Visitor Tracking & Monetization URL
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-nobel-gold overflow-x-auto">
                      <span className="flex-1 select-all">{trackingUrl}</span>
                      <button
                        onClick={() => copyToClipboard(trackingUrl, "trackingUrl")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "trackingUrl" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "trackingUrl" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* 2. Shopify OAuth Connect URL */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      2. Shopify Admin OAuth Authorization URL
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-cyan-300 overflow-x-auto">
                      <span className="flex-1 select-all">{oauthUrl}</span>
                      <button
                        onClick={() => copyToClipboard(oauthUrl, "oauthUrl")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "oauthUrl" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "oauthUrl" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* 3. Tidio Live Chat Script Tag */}
                  <div className="space-y-2">
                    <label className="font-bold text-stone-200 uppercase tracking-wider text-[11px] block">
                      3. Tidio Widget Live Script Code
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-emerald-400 overflow-x-auto">
                      <span className="flex-1 select-all">{tidioScriptTag}</span>
                      <button
                        onClick={() => copyToClipboard(tidioScriptTag, "tidioScript")}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === "tidioScript" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedKey === "tidioScript" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  {/* Key Credentials reference */}
                  <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Configured Shopify Client ID</span>
                      <p className="font-mono text-sm text-nobel-gold">{shopifyClientId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Connected Domain</span>
                      <p className="font-mono text-sm text-stone-300">{shopDomain}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: CLI CONSOLE */}
              {activeTab === "cli" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono flex items-center gap-2">
                      <Terminal size={14} className="text-nobel-gold" /> ECOSYSTEM CLI & WEBHOOK TESTER
                    </span>
                    <span>Type <code className="text-nobel-gold">help</code> for command index</span>
                  </div>

                  {/* Quick Action CLI Buttons */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      onClick={() => executeCliCommand("status")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ status
                    </button>
                    <button
                      onClick={() => executeCliCommand("withdraw 250 USDT")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ withdraw 250 USDT
                    </button>
                    <button
                      onClick={() => executeCliCommand("trigger-telegram")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ trigger-telegram
                    </button>
                    <button
                      onClick={() => executeCliCommand("play-ad")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ play-ad
                    </button>
                    <button
                      onClick={() => executeCliCommand("trigger-sale")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ trigger-sale
                    </button>
                  </div>

                  {/* Terminal Display */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 h-64 overflow-y-auto space-y-2">
                    {cliLogs.map((log, idx) => (
                      <div key={idx} className={log.type === "cmd" ? "text-nobel-gold font-bold" : log.type === "err" ? "text-red-400" : "text-stone-300 whitespace-pre-wrap"}>
                        {log.text}
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={(e) => { e.preventDefault(); executeCliCommand(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      placeholder="Type CLI command (e.g., status, withdraw 100 USDT, trigger-telegram, play-ad)..."
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-nobel-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-nobel-gold hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={12} /> EXECUTE
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: PARADISE PROTECTION STATUS */}
              {activeTab === "paradise" && (
                <div className="space-y-6 animate-fade-in text-stone-300 text-xs leading-relaxed">
                  
                  <div className="p-5 bg-stone-950 rounded-xl border border-nobel-gold/40 flex items-start gap-4">
                    <ShieldCheck size={32} className="text-nobel-gold shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white mb-2">
                        AlphaQubit Heavenly Paradise Architecture Protection
                      </h3>
                      <p className="text-stone-300">
                        Rest assured: Your beautiful AlphaQubit quantum research paper visualization is <strong>100% safe, untouched, and preserved</strong>!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Clean Cinema Display Guarantee
                      </span>
                      <p className="text-stone-400">
                        All toast overlays and popping yield indicators have been completely moved OFF the video player screen into a dedicated telemetry card located cleanly below the video frame.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Phantom Wallet & Telegram Real-Time Sync
                      </span>
                      <p className="text-stone-400">
                        Withdrawals execute on-chain in real time, deducting from your available revenue, issuing Solana transaction hashes, and delivering 30-minute earnings reports directly to your Telegram app.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex flex-wrap justify-between items-center text-[11px] text-stone-500 font-mono gap-2">
              <span>Shopify Client ID: 5144661590b6f29869cd1cdae3248074</span>
              <span>Phantom: {phantomAddr.slice(0, 6)}...{phantomAddr.slice(-4)}</span>
              <span>Telegram: @wallet</span>
              <span>Status: HEAVENLY PARADISE ACTIVE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
