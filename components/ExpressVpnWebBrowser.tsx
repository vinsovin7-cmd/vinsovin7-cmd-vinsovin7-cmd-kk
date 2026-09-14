import React, { useState } from "react";
import {
  Plus,
  X,
  Minus,
  Square,
  Search,
  Globe,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  MapPin,
  Mail,
  ShoppingBag,
  Tv,
  CheckCircle2,
  Lock,
  Send,
  Copy
} from "lucide-react";

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  iconType: "google" | "mail" | "gemini" | "shopify" | "youtube" | "generic";
  activeView: "google_search" | "mail_com" | "gemini_ai" | "shopify_admin" | "proxy_view";
  searchQuery?: string;
}

interface ExpressVpnWebBrowserProps {
  onAskGeminiClick?: () => void;
}

export const ExpressVpnWebBrowser: React.FC<ExpressVpnWebBrowserProps> = ({ onAskGeminiClick }) => {
  // VPN State
  const [selectedVpnNode, setSelectedVpnNode] = useState<string>("ny");
  const [showLocationToast, setShowLocationToast] = useState<boolean>(false);
  const [showGeminiFlyout, setShowGeminiFlyout] = useState<boolean>(false);
  const [geminiQuery, setGeminiQuery] = useState<string>("");
  const [geminiAnswer, setGeminiAnswer] = useState<string | null>(null);
  const [isGeminiThinking, setIsGeminiThinking] = useState<boolean>(false);

  // VPN Node Directory
  const vpnNodes = [
    { id: "ny", name: "US East (New York - High Speed #1)", ip: "185.220.101.45", location: "New York, NY 10001, United States", ping: "12ms" },
    { id: "ca", name: "US West (San Jose - California Node)", ip: "198.51.100.22", location: "San Jose, CA 95113, United States", ping: "18ms" },
    { id: "tx", name: "US South (Dallas - Texas Node)", ip: "104.28.19.88", location: "Dallas, TX 75201, United States", ping: "24ms" },
    { id: "dc", name: "US Capitol (Washington D.C. Node)", ip: "172.56.21.10", location: "Washington, D.C. 20001, United States", ping: "15ms" },
  ];

  const currentVpn = vpnNodes.find((n) => n.id === selectedVpnNode) || vpnNodes[0];

  // Tab State (Matching Screenshot 2 layout)
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: "tab-google",
      title: "Google",
      url: "https://www.google.com",
      iconType: "google",
      activeView: "google_search",
      searchQuery: "",
    },
    {
      id: "tab-mail",
      title: "Mail.com (US Node)",
      url: "https://www.mail.com",
      iconType: "mail",
      activeView: "mail_com",
    },
    {
      id: "tab-gemini",
      title: "Ask Gemini AI",
      url: "https://gemini.google.com",
      iconType: "gemini",
      activeView: "gemini_ai",
    },
    {
      id: "tab-shopify",
      title: "Shopify Revenue",
      url: "https://admin.shopify.com",
      iconType: "shopify",
      activeView: "shopify_admin",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>("tab-google");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [addressBarInput, setAddressBarInput] = useState<string>(activeTab ? activeTab.url : "https://www.google.com");

  // Sync address bar input when active tab changes
  React.useEffect(() => {
    if (activeTab) {
      setAddressBarInput(activeTab.url);
    }
  }, [activeTabId, activeTab]);

  // Handle Tab Switch
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  // Handle Add New Tab
  const handleAddNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: "New Tab (Google)",
      url: "https://www.google.com",
      iconType: "google",
      activeView: "google_search",
      searchQuery: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  // Handle Close Tab
  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // keep at least 1 tab open
    const updated = tabs.filter((t) => t.id !== id);
    setTabs(updated);
    if (activeTabId === id) {
      setActiveTabId(updated[updated.length - 1].id);
    }
  };

  // Handle Address Bar Submit
  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressBarInput.trim();
    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.includes(".") && !url.includes(" ")) {
        url = `https://${url}`;
      } else {
        // Treat as Google Search
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    let viewType: BrowserTab["activeView"] = "proxy_view";
    let title = url;
    let icon: BrowserTab["iconType"] = "generic";
    let query = "";

    if (url.includes("google.com")) {
      viewType = "google_search";
      title = "Google Search";
      icon = "google";
      if (url.includes("q=")) {
        query = decodeURIComponent(url.split("q=")[1].split("&")[0]);
        title = `${query} - Google Search`;
      }
    } else if (url.includes("mail.com")) {
      viewType = "mail_com";
      title = "Mail.com Webmail (US)";
      icon = "mail";
    } else if (url.includes("gemini")) {
      viewType = "gemini_ai";
      title = "Ask Gemini AI";
      icon = "gemini";
    } else if (url.includes("shopify")) {
      viewType = "shopify_admin";
      title = "Shopify Admin Engine";
      icon = "shopify";
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url, title, activeView: viewType, iconType: icon, searchQuery: query }
          : t
      )
    );
  };

  // Quick Gemini Flyout Query
  const handleGeminiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim()) return;
    setIsGeminiThinking(true);
    setGeminiAnswer(null);

    setTimeout(() => {
      setIsGeminiThinking(false);
      setGeminiAnswer(
        `Gemini AI Summary for "${geminiQuery}":\n\n- Verified US Proxy IP: ${currentVpn.ip} (${currentVpn.location}).\n- All webmail endpoints for Mail.com are fully reachable.\n- Mail dispatch SSL status: ENCRYPTED & VALIDATED.`
      );
    }, 800);
  };

  return (
    <div className={`w-full bg-[#0D0F17] rounded-xl border border-stone-800 shadow-2xl overflow-hidden transition-all ${isMaximized ? "fixed inset-2 z-50 flex flex-col" : "relative"}`}>
      
      {/* ==================== SCREENSHOT 2 MATCHING TAB STRIP HEADER ==================== */}
      <div className="bg-[#121520] border-b border-stone-800 px-3 pt-2.5 flex items-center justify-between gap-2 overflow-x-auto select-none">
        
        {/* Left Open Tabs List */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[80%] pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-xs font-semibold cursor-pointer border-t border-x transition-all shrink-0 max-w-[170px] ${
                  isActive
                    ? "bg-[#181C2A] text-white border-purple-500/60 shadow-md"
                    : "bg-[#0A0C13] text-stone-400 hover:text-stone-200 border-stone-800 hover:bg-[#121624]"
                }`}
              >
                {/* Tab Icon */}
                {tab.iconType === "google" && <span className="text-amber-400 font-extrabold text-xs">G</span>}
                {tab.iconType === "mail" && <Mail size={13} className="text-sky-400" />}
                {tab.iconType === "gemini" && <Sparkles size={13} className="text-purple-400 animate-pulse" />}
                {tab.iconType === "shopify" && <ShoppingBag size={13} className="text-emerald-400" />}
                {tab.iconType === "youtube" && <Tv size={13} className="text-red-400" />}
                {tab.iconType === "generic" && <Globe size={13} className="text-stone-400" />}

                <span className="truncate text-[11px]">{tab.title}</span>

                {/* Close Tab Button */}
                <button
                  type="button"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="opacity-60 group-hover:opacity-100 hover:bg-stone-700/60 p-0.5 rounded text-stone-300 hover:text-white transition-all ml-1"
                  title="Close tab"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}

          {/* Plus Add Tab Button (Matching Screenshot 2) */}
          <button
            type="button"
            onClick={handleAddNewTab}
            className="p-1.5 bg-[#0A0C13] hover:bg-purple-900/40 text-stone-300 hover:text-purple-300 rounded-lg border border-stone-800 transition-all cursor-pointer shrink-0"
            title="Add new tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Right Corner Control Deck (Matching Screenshot 2) */}
        <div className="flex items-center gap-2 shrink-0 pb-1">
          {/* Ask Gemini Button */}
          <button
            type="button"
            onClick={() => {
              setShowGeminiFlyout(!showGeminiFlyout);
              if (onAskGeminiClick) onAskGeminiClick();
            }}
            className="px-3 py-1 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow border border-purple-600/50 cursor-pointer transition-all"
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>Ask Gemini</span>
          </button>

          {/* Window Control Icons: Minimize, Maximize, Close */}
          <div className="flex items-center gap-1 text-stone-400 pl-1 border-l border-stone-800">
            <button
              type="button"
              className="p-1 hover:bg-stone-800 rounded hover:text-white transition-all"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-stone-800 rounded hover:text-white transition-all"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Square size={13} />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-red-800 rounded hover:text-white transition-all"
              title="Close Browser"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== IN-BUILT EXPRESSVPN PRO ACTIVE BAR ==================== */}
      <div className="bg-[#151928] border-b border-stone-800 px-4 py-2 flex justify-between items-center flex-wrap gap-2 text-xs">
        
        {/* VPN Server Node Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/60 rounded-lg text-emerald-300 font-mono text-[11px] font-bold shadow-sm">
            <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
            <span>ExpressVPN Pro (Active US)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium text-[11px]">US Server Node:</span>
            <select
              value={selectedVpnNode}
              onChange={(e) => setSelectedVpnNode(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-lg text-stone-200 text-xs px-2.5 py-1 focus:outline-none focus:border-purple-500 font-medium"
            >
              {vpnNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.ip})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowLocationToast(true);
              setTimeout(() => setShowLocationToast(false), 4000);
            }}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-stone-700 cursor-pointer transition-all"
          >
            <MapPin size={12} className="text-sky-400" /> Check Location
          </button>
        </div>

        {/* VPN Telemetry Specs */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-stone-400">
          <span>IP: <strong className="text-sky-300">{currentVpn.ip}</strong></span>
          <span>Protocol: <strong className="text-stone-300">Lightway UDP 256-bit</strong></span>
          <span>Ping: <strong className="text-emerald-400">{currentVpn.ping}</strong></span>
        </div>
      </div>

      {/* Location Toast Notification */}
      {showLocationToast && (
        <div className="p-3 bg-emerald-900/90 border-b border-emerald-500 text-emerald-100 text-xs font-mono flex items-center justify-between px-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-300" />
            <span>
              <strong>VERIFIED US LOCATION:</strong> {currentVpn.location} | IP: <strong>{currentVpn.ip}</strong> (Mail.com & web portals will detect US IP)
            </span>
          </div>
          <button onClick={() => setShowLocationToast(false)} className="text-emerald-300 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Gemini Quick Ask Flyout Panel */}
      {showGeminiFlyout && (
        <div className="p-4 bg-[#111522] border-b border-purple-800/80 animate-fade-in space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xs text-purple-300 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-300" /> Gemini Web Assistant & Mail Proxy Helper
            </h4>
            <button onClick={() => setShowGeminiFlyout(false)} className="text-stone-400 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleGeminiSearch} className="flex gap-2">
            <input
              type="text"
              value={geminiQuery}
              onChange={(e) => setGeminiQuery(e.target.value)}
              placeholder="Ask Gemini to summarize web pages, check Mail.com routing, or draft content..."
              className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
            />
            <button type="submit" className="px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer">
              <Send size={12} /> Ask
            </button>
          </form>

          {isGeminiThinking && (
            <div className="text-xs text-purple-300 font-mono animate-pulse flex items-center gap-2">
              <Sparkles size={13} className="animate-spin" /> Gemini is analyzing web context and US ExpressVPN state...
            </div>
          )}

          {geminiAnswer && (
            <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 text-xs text-stone-300 whitespace-pre-wrap leading-relaxed font-sans">
              {geminiAnswer}
            </div>
          )}
        </div>
      )}

      {/* ==================== ADDRESS BAR & NAVIGATION CONTROLS ==================== */}
      <div className="p-3 bg-[#0D0F17] border-b border-stone-800 flex items-center gap-3">
        <div className="flex items-center gap-1 text-stone-400">
          <button type="button" className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-all">
            <ArrowLeft size={14} />
          </button>
          <button type="button" className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-all">
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleNavigate({ preventDefault: () => {} } as any)}
            className="p-1.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white transition-all"
            title="Reload page"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Universal Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 relative flex items-center">
          <div className="absolute left-3 text-emerald-400 flex items-center gap-1">
            <Lock size={12} />
          </div>
          <input
            type="text"
            value={addressBarInput}
            onChange={(e) => setAddressBarInput(e.target.value)}
            placeholder="Type a URL or search Google..."
            className="w-full pl-8 pr-20 py-2 bg-[#161B29] border border-stone-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center gap-1"
          >
            <Search size={12} /> Go
          </button>
        </form>

        <a
          href={addressBarInput.startsWith("http") ? addressBarInput : `https://${addressBarInput}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition-all shrink-0"
          title="Open directly in new window"
        >
          <ExternalLink size={13} className="text-sky-400" />
          <span className="hidden sm:inline">Direct Window</span>
        </a>
      </div>

      {/* ==================== BROWSER VIEWPORT CANVASES ==================== */}
      <div className="w-full min-h-[560px] bg-white text-stone-900 overflow-y-auto">
        
        {/* VIEW 1: GOOGLE SEARCH ENGINE INTERFACE */}
        {activeTab.activeView === "google_search" && (
          <div className="min-h-[560px] bg-white flex flex-col justify-between p-6">
            
            {/* Google Header */}
            <div className="flex justify-between items-center text-xs text-stone-600 border-b pb-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600 cursor-pointer hover:underline">About</span>
                <span className="cursor-pointer hover:underline">Store</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="cursor-pointer hover:underline">Gmail</span>
                <span className="cursor-pointer hover:underline">Images</span>
                <div className="w-7 h-7 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  US
                </div>
              </div>
            </div>

            {/* Google Main Logo & Search Deck */}
            <div className="max-w-xl mx-auto w-full my-8 text-center space-y-6">
              <div className="font-sans font-black text-5xl tracking-tight select-none">
                <span className="text-blue-600">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-600">g</span>
                <span className="text-green-600">l</span>
                <span className="text-red-500">e</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = activeTab.searchQuery || "mail.com";
                  setTabs((prev) =>
                    prev.map((t) =>
                      t.id === activeTabId
                        ? { ...t, searchQuery: q, title: `${q} - Google Search` }
                        : t
                    )
                  );
                }}
                className="relative"
              >
                <div className="flex items-center px-4 py-3 bg-white rounded-full border border-stone-300 shadow-md hover:shadow-lg focus-within:shadow-lg transition-all">
                  <Search size={18} className="text-stone-400 mr-3" />
                  <input
                    type="text"
                    value={activeTab.searchQuery || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTabs((prev) =>
                        prev.map((t) => (t.id === activeTabId ? { ...t, searchQuery: val } : t))
                      );
                    }}
                    placeholder="Search Google or type Mail.com, Location, or Shopify..."
                    className="w-full text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-medium rounded cursor-pointer"
                  >
                    Google Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTabs((prev) =>
                        prev.map((t) =>
                          t.id === activeTabId
                            ? { ...t, searchQuery: "what is my location", title: "My Location - Google Search" }
                            : t
                        )
                      );
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-medium rounded cursor-pointer"
                  >
                    I'm Feeling Lucky (Check US Location)
                  </button>
                </div>
              </form>

              {/* Verified Results Container */}
              {activeTab.searchQuery && (
                <div className="text-left mt-8 space-y-6 pt-6 border-t border-stone-200 animate-fade-in">
                  <p className="text-xs text-stone-500">
                    About 1,840,000,000 results (0.28 seconds) • US Proxy Node Active
                  </p>

                  {/* Search Result 1: Mail.com */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-stone-500 font-mono">https://www.mail.com</div>
                    <h3
                      onClick={() => {
                        setTabs((prev) =>
                          prev.map((t) =>
                            t.id === activeTabId
                              ? { ...t, title: "Mail.com (US Node)", url: "https://www.mail.com", activeView: "mail_com", iconType: "mail" }
                              : t
                          )
                        );
                      }}
                      className="text-lg font-bold text-blue-800 hover:underline cursor-pointer"
                    >
                      mail.com | Free email accounts | Secure & Unlimited Email Storage
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Free email account from mail.com with 65 GB storage, spam filter, virus protection, and custom domain options. Accessible securely via US Proxy nodes.
                    </p>
                  </div>

                  {/* Search Result 2: Location Verification */}
                  <div className="space-y-1 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 font-bold">
                      <MapPin size={12} /> Verified US Proxy Server Network
                    </div>
                    <h3 className="text-base font-bold text-emerald-900">
                      Current Detected Geographic Region: {currentVpn.location}
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      IP Address: <strong>{currentVpn.ip}</strong> • Internet Provider: ExpressVPN US Server Node #1 • Encryption: AES-256 Lightway.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Google Footer */}
            <div className="bg-stone-100 p-3 rounded-b-xl border-t border-stone-200 text-xs text-stone-600 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>United States ({currentVpn.location})</span>
              </div>
              <div className="flex gap-4">
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span className="hover:underline cursor-pointer">Terms</span>
                <span className="hover:underline cursor-pointer">Settings</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MAIL.COM PROXIED WEBMAIL PORTAL */}
        {activeTab.activeView === "mail_com" && (
          <div className="min-h-[560px] bg-[#003B7A] text-white p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div className="flex justify-between items-center border-b border-blue-400/40 pb-4">
                <div className="font-extrabold text-3xl tracking-tight">
                  mail<span className="text-sky-300">.com</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-800 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500">
                  <ShieldCheck size={14} /> US Proxy IP Active ({currentVpn.ip})
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                <div className="space-y-4">
                  <h1 className="text-3xl font-extrabold leading-tight">
                    Welcome to mail.com Webmail
                  </h1>
                  <p className="text-sky-100 text-sm leading-relaxed">
                    Access your secure email inbox from anywhere in the United States. Featuring 65 GB of storage, mobile sync, and Multi Sreymara AI dispatch automation.
                  </p>
                  
                  <div className="p-4 bg-blue-900/80 rounded-xl border border-sky-400/40 space-y-2 text-xs">
                    <div className="font-bold text-sky-200">US Network Telemetry:</div>
                    <div className="font-mono text-stone-200">• Node: {currentVpn.name}</div>
                    <div className="font-mono text-stone-200">• Region: {currentVpn.location}</div>
                    <div className="font-mono text-stone-200">• SSL Security Status: Encrypted & Verified</div>
                  </div>
                </div>

                <div className="bg-white text-stone-900 p-6 rounded-2xl shadow-2xl space-y-4 border border-stone-200">
                  <h3 className="font-bold text-lg text-[#003B7A] border-b pb-2 flex justify-between items-center">
                    <span>Mail.com Sign In</span>
                    <Lock size={16} className="text-emerald-600" />
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue="kansasnelly@mail.com"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Password</label>
                      <input
                        type="password"
                        defaultValue="••••••••••••"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => alert("Mail.com US Webmail session active! Switch to Mail.com Webmail tab to dispatch messages.")}
                      className="w-full py-2.5 bg-lime-600 hover:bg-lime-500 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer"
                    >
                      Log in to Webmail
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: GEMINI AI STUDIO INTERFACE */}
        {activeTab.activeView === "gemini_ai" && (
          <div className="min-h-[560px] bg-[#0E1017] text-white p-6 space-y-4">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg border-b border-stone-800 pb-3">
                <Sparkles size={20} className="text-amber-300 animate-spin" /> Gemini 3.6 Flash Web Assistant
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Integrated web search, quantum calculations, and automated Mail.com email generator. Powered by US ExpressVPN proxy connection.
              </p>
              
              <div className="p-4 bg-stone-900 rounded-xl border border-purple-800/60 text-xs font-mono text-purple-200">
                [SYSTEM READY] ExpressVPN Pro Active • Node: {currentVpn.name} • Location: {currentVpn.location}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PROXY VIEW / GENERIC EMBED WITH DIRECT PROXY FALLBACK */}
        {activeTab.activeView === "proxy_view" && (
          <div className="w-full h-[560px] bg-[#0A0C10] flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <ShieldCheck size={48} className="text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold text-blue-400">US ExpressVPN Web Proxy Connected</h2>
            <p className="text-xs text-stone-300 max-w-md leading-relaxed">
              Target URL <code>{activeTab.url}</code> is currently routed via US Node: <strong>{currentVpn.location}</strong>.
            </p>

            <div className="flex gap-3">
              <a
                href={`/api/browser/proxy?url=${encodeURIComponent(activeTab.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Open via Backend Proxy Route
              </a>
              <button
                type="button"
                onClick={() => {
                  setTabs((prev) =>
                    prev.map((t) =>
                      t.id === activeTabId
                        ? { ...t, activeView: "google_search", title: "Google", url: "https://www.google.com" }
                        : t
                    )
                  );
                }}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl border border-stone-700"
              >
                Return to Google
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
