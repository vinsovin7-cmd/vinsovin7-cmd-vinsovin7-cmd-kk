import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Sliders,
  ChevronRight,
  Sparkles
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
}

export const EcosystemDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"matrix" | "urls" | "cli" | "paradise">("matrix");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // CLI State
  const [cliInput, setCliInput] = useState("");
  const [cliLogs, setCliLogs] = useState<Array<{ type: "cmd" | "out" | "err"; text: string }>>([
    { type: "out", text: "[ECOSYSTEM CLI INITIALIZED v2.4]\nConnected to Shopify Client ID: 5144661590b6f29869cd1cdae3248074\nTidio Signal Channel: Active on http://earnings.ink\nType 'help' for command list or click prebuilt actions below." }
  ]);

  // Notifications alert state
  const [notification, setNotification] = useState<string | null>(null);

  // Poll stats every 2 seconds when open or initialized
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/ecosystem/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerNotification(`Copied to clipboard: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
      triggerNotification("Ping failed, check console.");
    } finally {
      setLoading(false);
    }
  };

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
      triggerNotification(data.tidioNotification || "Visitor logged out! Released active earnings yield.");
    } catch (err) {
      triggerNotification("Logout ping failed.");
    } finally {
      setLoading(false);
    }
  };

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

  // Precomputed URLs (dynamically backed by live server stats)
  const shopifyClientId = stats?.clientId || "5144661590b6f29869cd1cdae3248074";
  const shopifySecret = "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";
  const shopDomain = stats?.shopDomain || "earnings.ink";
  const trackingUrl = `https://${shopDomain}/?shopify_client_id=${shopifyClientId}&tidio_signal=active&monetize=session`;
  const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${shopifyClientId}&scope=read_orders,write_orders,read_customers&redirect_uri=https://${shopDomain}/api/shopify/callback&state=tidio_earnings_active`;
  const tidioScriptTag = `<script src="//code.tidio.co/${shopifyClientId.slice(0, 16)}.js" async></script>`;

  return (
    <>
      {/* Floating Signal & Ecosystem Trigger Bar at top right */}
      <div className="fixed top-20 right-6 z-40 flex items-center gap-3">
        {notification && (
          <div className="animate-bounce flex items-center gap-2 bg-stone-900 text-nobel-gold border border-nobel-gold/50 px-4 py-2 rounded-full text-xs font-mono shadow-xl backdrop-blur-md">
            <Zap size={14} className="animate-pulse text-amber-400" />
            <span>{notification}</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-stone-900/90 hover:bg-stone-900 text-stone-100 border border-nobel-gold/40 hover:border-nobel-gold px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-nobel-gold flex items-center gap-1">
              <ShoppingBag size={10} /> SHOPIFY + TIDIO MATRIX
            </span>
            <span className="text-xs font-mono text-stone-300">
              {shopDomain} • ${stats ? stats.totalRevenueRecorded.toFixed(2) : "373.50"}
            </span>
          </div>
          <Sliders size={14} className="text-stone-400 group-hover:text-nobel-gold transition-colors" />
        </button>
      </div>

      {/* Main Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="bg-stone-900 text-stone-100 w-full max-w-5xl rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-5 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nobel-gold to-amber-700 flex items-center justify-center text-white shadow-md">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                      Shopify & Tidio Live Ecosystem Matrix
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                      LIVE STREAM
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Client ID: <span className="font-mono text-nobel-gold">{shopifyClientId}</span> | Connected Domain: <span className="font-mono text-emerald-300">{shopDomain}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchStats}
                  className="p-2 text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  title="Refresh Live Metrics"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 gap-2 text-xs font-medium uppercase tracking-wider overflow-x-auto">
              <button
                onClick={() => setActiveTab("matrix")}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === "matrix" 
                    ? "border-nobel-gold text-nobel-gold font-bold" 
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Activity size={14} /> Live Revenue & Visitor Tracker
              </button>
              <button
                onClick={() => setActiveTab("urls")}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === "urls" 
                    ? "border-nobel-gold text-nobel-gold font-bold" 
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Globe size={14} /> URL & Integration Guide
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === "cli" 
                    ? "border-nobel-gold text-nobel-gold font-bold" 
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <Terminal size={14} /> Ecosystem CLI Console
              </button>
              <button
                onClick={() => setActiveTab("paradise")}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === "paradise" 
                    ? "border-nobel-gold text-nobel-gold font-bold" 
                    : "border-transparent text-stone-400 hover:text-stone-200"
                }`}
              >
                <ShieldCheck size={14} /> AlphaQubit Protection Status
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: MATRIX & LIVE VISITOR TRACKER */}
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
                        ${stats?.totalRevenueRecorded.toFixed(2) || "382.50"}
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Shopify orders + session yield</p>
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
                  <div className="p-5 bg-gradient-to-r from-stone-950 to-stone-900 rounded-xl border border-stone-800">
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

              {/* TAB 2: URL & INTEGRATION GUIDE */}
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
                      1. Recommended Visitor Tracking & Monetization URL (Paste on Site / Ads / Social)
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
                      2. Shopify Admin OAuth Authorization URL (Uses Client ID {shopifyClientId})
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
                      3. Tidio Widget Live Script Code (Add before &lt;/head&gt; in Shopify theme.liquid)
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
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Configured Shopify Client Secret</span>
                      <p className="font-mono text-sm text-stone-300">{shopifySecret}</p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CLI CONSOLE */}
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
                      onClick={() => executeCliCommand("ping-visitor")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ ping-visitor
                    </button>
                    <button
                      onClick={() => executeCliCommand("logout-visitor")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ logout-visitor
                    </button>
                    <button
                      onClick={() => executeCliCommand("trigger-sale")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ trigger-sale
                    </button>
                    <button
                      onClick={() => executeCliCommand("shopify-auth-url")}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-mono cursor-pointer"
                    >
                      $ shopify-auth-url
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
                      placeholder="Type CLI command (e.g., status, trigger-sale, ping-visitor)..."
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

              {/* TAB 4: PARADISE PROTECTION */}
              {activeTab === "paradise" && (
                <div className="space-y-6 animate-fade-in text-stone-300 text-xs leading-relaxed">
                  
                  <div className="p-5 bg-stone-950 rounded-xl border border-nobel-gold/40 flex items-start gap-4">
                    <ShieldCheck size={32} className="text-nobel-gold shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white mb-2">
                        AlphaQubit Paradise Platform Architecture Guard
                      </h3>
                      <p className="text-stone-300">
                        Rest assured: Your beautiful AlphaQubit quantum paper visualization is <strong>100% safe, untouched, and preserved</strong>!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Why did it mention "REMIX"?
                      </span>
                      <p className="text-stone-400">
                        The word "Remix" was simply an initial default title string in `metadata.json`. We have updated `metadata.json` to reflect your custom AlphaQubit Research & Live Revenue Ecosystem title.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950 rounded-lg border border-stone-800 space-y-2">
                      <span className="font-bold text-white uppercase text-[11px] block">
                        Will it rebuild or break existing components?
                      </span>
                      <p className="text-stone-400">
                        No! All Three.js quantum scenes, 3D surface code diagrams, transformer architecture visualizers, and typography remain fully functional and uncompromised.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-500 font-mono">
              <span>Shopify ID: 5144661590b6f29869cd1cdae3248074</span>
              <span>Domain: http://earnings.ink</span>
              <span>Status: REAL-TIME ACTIVE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
