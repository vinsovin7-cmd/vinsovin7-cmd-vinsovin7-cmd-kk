import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bell,
  Grid,
  Copy,
  Check,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  MoreHorizontal,
  SlidersHorizontal,
  Wallet,
  TrendingUp,
  Compass,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  QrCode,
  RefreshCw,
  X,
  Mail,
  LogOut,
  Send,
  Fuel,
  Info,
  DollarSign
} from "lucide-react";

export interface OneKeyToken {
  symbol: string;
  name: string;
  price: number;
  change: string;
  balance: number;
  usdValue: number;
  network: string;
  isGas?: boolean;
  iconUrl?: string;
}

export interface OneKeyTx {
  id: string;
  type: "deposit" | "transfer" | "swap" | "reward_claim";
  token: string;
  amount: number;
  source?: string;
  destination?: string;
  timestamp: string;
  status: "confirmed" | "completed" | "pending";
  txHash: string;
  network: string;
}

interface OneKeyAppProps {
  onClose?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

export const OneKeyApp: React.FC<OneKeyAppProps> = ({
  onClose,
  className = "",
  isEmbedded = false
}) => {
  // Account & Auth State
  const [userEmail, setUserEmail] = useState<string>("kansasnelly@gmail.com");
  const [userName, setUserName] = useState<string>("Kansas Nelly");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>("TYz6zLnmuDx4Fwm7evdGNfJwgRM8YM68hs");
  const [accountName, setAccountName] = useState<string>("Account #1");

  // Balances & Data
  const [tokens, setTokens] = useState<OneKeyToken[]>([
    {
      symbol: "TRX",
      name: "TRON",
      price: 0.339,
      change: "-0.73%",
      balance: 184.35,
      usdValue: 62.49,
      network: "Tron (TRC-20)",
      isGas: true,
      iconUrl: "https://static.tronscan.org/production/logo/trx.png"
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      price: 0.9998,
      change: "-0.02%",
      balance: 4.35,
      usdValue: 4.35,
      network: "Tron (TRC-20)",
      isGas: false,
      iconUrl: "https://static.tronscan.org/production/logo/usdtlogo.png"
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      price: 0.9998,
      change: "-0.01%",
      balance: 0.0,
      usdValue: 0.0,
      network: "Tron (TRC-20)",
      isGas: false,
      iconUrl: "https://static.tronscan.org/production/logo/usdc.png"
    }
  ]);
  const [totalUsdValue, setTotalUsdValue] = useState<number>(4.35);
  const [transactions, setTransactions] = useState<OneKeyTx[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>("Just now");

  // Active Navigation
  const [activeTab, setActiveTab] = useState<"spot" | "history">("spot");
  const [bottomNav, setBottomNav] = useState<"wallet" | "trade" | "perps" | "discover">("wallet");

  // Modals & Popups
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  // Send Form State
  const [sendToken, setSendToken] = useState<string>("USDT");
  const [sendAmount, setSendAmount] = useState<string>("1.00");
  const [sendDestination, setSendDestination] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  // Swap Form State
  const [swapFrom, setSwapFrom] = useState<string>("USDT");
  const [swapTo, setSwapTo] = useState<string>("TRX");
  const [swapAmount, setSwapAmount] = useState<string>("1.00");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapFeedback, setSwapFeedback] = useState<string | null>(null);

  // Auth Form State
  const [inputEmail, setInputEmail] = useState<string>("kansasnelly@gmail.com");
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Manual Sync State (for matching phone app 4.35 USDT)
  const [syncUsdtInput, setSyncUsdtInput] = useState<string>("4.35");

  // UI Toast Copy
  const [copied, setCopied] = useState<boolean>(false);

  // Time display matching screenshot (e.g. 01:23)
  const [currentTime, setCurrentTime] = useState<string>("01:23");

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      setCurrentTime(`${h}:${m}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live state from backend & Tronscan
  const fetchOneKeyState = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/onekey/account");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.tokens)) setTokens(data.tokens);
          if (typeof data.totalUsdValue === "number") setTotalUsdValue(data.totalUsdValue);
          if (Array.isArray(data.transactions)) setTransactions(data.transactions);
          if (data.walletAddress) setWalletAddress(data.walletAddress);
          if (data.userEmail) setUserEmail(data.userEmail);
          if (data.userName) setUserName(data.userName);
          if (data.accountName) setAccountName(data.accountName);
          setIsLoggedIn(data.isLoggedIn ?? true);
          setLastSynced("Just now");
        }
      }
    } catch (err) {
      console.error("[OneKey UI] Failed to fetch account state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOneKeyState();
    // Poll every 10 seconds for real-time reflection of rewards withdrawals and Tronscan updates
    const pollInterval = setInterval(fetchOneKeyState, 10000);
    return () => clearInterval(pollInterval);
  }, [fetchOneKeyState]);

  // Handle Copy Address
  const handleCopyAddress = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Google Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail || !inputEmail.includes("@")) {
      setAuthFeedback("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/onekey/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUserEmail(data.userEmail);
        setUserName(data.userName);
        setIsLoggedIn(true);
        setAuthFeedback("✅ Successfully authenticated with Google!");
        setTimeout(() => setShowAuthModal(false), 1000);
        fetchOneKeyState();
      } else {
        setAuthFeedback("Authentication failed. Please try again.");
      }
    } catch (err: any) {
      setAuthFeedback(`Error: ${err.message}`);
    }
  };

  // Handle Send / Withdraw
  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendFeedback("⚠️ Please enter a valid amount.");
      return;
    }
    if (!sendDestination.trim() || sendDestination.trim().length < 8) {
      setSendFeedback("⚠️ Please enter a valid destination TRC-20 wallet address.");
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    try {
      const res = await fetch("/api/onekey/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sendToken,
          amount,
          destinationAddress: sendDestination.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSendFeedback(`🚀 Sent ${amount} ${sendToken} to ${sendDestination.slice(0, 6)}... Tx: ${data.tx?.txHash.slice(0, 10)}...`);
        fetchOneKeyState();
        setTimeout(() => {
          setShowSendModal(false);
          setSendFeedback(null);
        }, 2500);
      } else {
        setSendFeedback(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setSendFeedback(`❌ Network error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Handle Instant Swap
  const handleSwapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapAmount);
    if (isNaN(amount) || amount <= 0) {
      setSwapFeedback("⚠️ Please enter a valid amount to swap.");
      return;
    }

    setIsSwapping(true);
    setSwapFeedback(null);

    try {
      const res = await fetch("/api/onekey/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromToken: swapFrom,
          toToken: swapTo,
          amount
        })
      });
      const data = await res.json();
      if (data.success) {
        setSwapFeedback(`✅ Swapped ${amount} ${swapFrom} for ${data.receivedAmount} ${swapTo}!`);
        fetchOneKeyState();
        setTimeout(() => {
          setShowSwapModal(false);
          setSwapFeedback(null);
        }, 2000);
      } else {
        setSwapFeedback(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setSwapFeedback(`❌ Network error: ${err.message}`);
    } finally {
      setIsSwapping(false);
    }
  };

  // Handle Manual Set Balance (e.g. matching 4.35)
  const handleSetBalance = async () => {
    const val = parseFloat(syncUsdtInput);
    if (isNaN(val)) return;
    try {
      const res = await fetch("/api/onekey/set-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdtAmount: val })
      });
      if (res.ok) {
        fetchOneKeyState();
        setShowSyncModal(false);
      }
    } catch {}
  };

  // QR Code URL for deposit
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}&color=000000&bgcolor=ffffff`;

  const usdtToken = tokens.find(t => t.symbol === "USDT") || tokens[1];
  const trxToken = tokens.find(t => t.symbol === "TRX") || tokens[0];
  const usdcToken = tokens.find(t => t.symbol === "USDC") || tokens[2];

  // User display balance: if usdtToken is 4.35, show $4.35 or total
  const displayUsd = totalUsdValue > 0 ? totalUsdValue.toFixed(2) : "0.00";

  return (
    <div
      className={`bg-white text-stone-900 rounded-[32px] sm:rounded-[36px] shadow-2xl border-4 border-stone-800/80 overflow-hidden flex flex-col font-sans select-none relative ${
        isEmbedded ? "w-full h-full max-h-[860px]" : "w-[360px] sm:w-[380px] h-[780px]"
      } ${className}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)"
      }}
    >
      {/* ==================================================================== */}
      {/* 1. TOP MOBILE STATUS BAR (Screenshot 6: 01:23, wifi, signal, 13% bat) */}
      {/* ==================================================================== */}
      <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold text-stone-700 shrink-0 bg-white">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tracking-tight text-xs text-stone-900">{currentTime}</span>
          <span className="text-[10px]">🔑</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Synced" />
        </div>
        <div className="flex items-center gap-2">
          {/* 5G icon */}
          <span className="text-[9.5px] font-black tracking-tighter text-stone-800">5G</span>
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 bg-stone-700 rounded-sm" />
            <span className="w-0.5 h-1.5 bg-stone-700 rounded-sm" />
            <span className="w-0.5 h-2 bg-stone-700 rounded-sm" />
            <span className="w-0.5 h-2.5 bg-stone-700 rounded-sm" />
          </div>
          {/* Wifi */}
          <svg className="w-3 h-3 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.67 0 7 1.48 9.44 3.89L12 18.3 2.56 11.39C5 8.98 8.33 7.5 12 7.5z" />
          </svg>
          {/* Battery */}
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 border border-stone-700 rounded-sm p-0.5 flex items-center">
              <div className="w-1.5 h-full bg-stone-800 rounded-2xs" />
            </div>
            <span className="text-[9px] font-bold">13</span>
          </div>
        </div>
      </div>

      {/* Floating Google Account Pill on Top-Right (Screenshot 6 floating icon) */}
      <div className="absolute right-3 top-24 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowAuthModal(true)}
          className="w-10 h-10 rounded-2xl bg-white/95 border border-stone-200 shadow-md flex items-center justify-center text-blue-600 hover:scale-105 transition-transform cursor-pointer"
          title={`Google Authenticated: ${userEmail}`}
        >
          <span className="font-bold text-sm tracking-tighter bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
            G
          </span>
        </button>

        <button
          onClick={() => fetchOneKeyState()}
          className="w-10 h-10 rounded-2xl bg-white/95 border border-stone-200 shadow-md flex items-center justify-center text-stone-700 hover:scale-105 transition-transform cursor-pointer"
          title="Voice / Live Sync"
        >
          <span className="text-sm">🎙️</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 2. SEARCH & HEADER BAR (Screenshot 6: Search anything, Bell, Grid)    */}
      {/* ==================================================================== */}
      <div className="px-4 pt-2 pb-2 bg-white flex items-center gap-2.5 shrink-0">
        <div className="flex-1 bg-stone-100 rounded-2xl px-3.5 py-2 flex items-center gap-2 border border-stone-200/60">
          <Search size={15} className="text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 outline-none"
          />
        </div>

        <button
          onClick={() => setShowSyncModal(true)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer relative transition-colors"
          title="Notifications & Mobile Sync"
        >
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer transition-colors"
          title="App Menu"
        >
          <Grid size={17} />
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-colors"
            title="Close OneKey"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 3. SCROLLABLE WALLET BODY (Screenshot 6 Account, Balance, Tokens)     */}
      {/* ==================================================================== */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 no-scrollbar">
        {/* Account Selector Pill (Screenshot 6: Green patterned block + Koala) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Green pixelated square */}
            <div className="w-6 h-6 rounded-md bg-emerald-600 grid grid-cols-2 p-0.5 gap-0.5">
              <div className="bg-emerald-300 rounded-2xs" />
              <div className="bg-emerald-800 rounded-2xs" />
              <div className="bg-emerald-400 rounded-2xs" />
              <div className="bg-emerald-200 rounded-2xs" />
            </div>

            {/* Koala Avatar */}
            <span className="text-base">🐨</span>

            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowAuthModal(true)}>
              <span className="font-bold text-sm text-stone-900">{accountName}</span>
              <ChevronDown size={14} className="text-stone-500" />
            </div>

            <button
              onClick={handleCopyAddress}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
              title="Copy OneKey TRC-20 Address"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Tron Network Red Badge (Screenshot 6) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded-full border border-red-200 cursor-pointer">
            {/* Tron Red Gem Logo */}
            <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 15 10-15-10-5zm0 3.3L18.4 7 12 16.6 5.6 7 12 5.3z" />
            </svg>
            <ChevronDown size={10} className="text-stone-400" />
          </div>
        </div>

        {/* Big Balance Header (Screenshot 6: $0.00 / $4.35) */}
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-[42px] font-black text-stone-900 tracking-tight">
              ${displayUsd}
            </span>
            {isLoading && <RefreshCw size={14} className="animate-spin text-stone-400 ml-1" />}
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Add money to get started. Withdraw anytime.
          </p>
        </div>

        {/* Action Buttons: [+ Add money] [•••] (Screenshot 6) */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 py-3 px-4 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-full shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <span className="text-sm font-bold">+</span>
            <span>Add money</span>
          </button>

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-11 h-11 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center cursor-pointer transition-colors shrink-0"
            title="More Options (Send, Swap, Tronscan)"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* More Options Dropdown Menu */}
        {showMoreMenu && (
          <div className="p-2 bg-white rounded-2xl border border-stone-200 shadow-xl space-y-1 text-xs animate-fade-in">
            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSendModal(true);
              }}
              className="w-full px-3 py-2 text-left rounded-xl hover:bg-stone-50 flex items-center gap-2 font-semibold text-stone-800 cursor-pointer"
            >
              <Send size={14} className="text-blue-600" />
              <span>Send / Withdraw to External Wallet</span>
            </button>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSwapModal(true);
              }}
              className="w-full px-3 py-2 text-left rounded-xl hover:bg-stone-50 flex items-center gap-2 font-semibold text-stone-800 cursor-pointer"
            >
              <ArrowRightLeft size={14} className="text-emerald-600" />
              <span>Swap Tokens (USDT ⇄ TRX)</span>
            </button>

            <a
              href={`https://tronscan.org/#/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
              className="w-full px-3 py-2 text-left rounded-xl hover:bg-stone-50 flex items-center gap-2 font-semibold text-stone-800 cursor-pointer"
            >
              <ExternalLink size={14} className="text-purple-600" />
              <span>View On-Chain on Tronscan Explorer</span>
            </a>

            <button
              onClick={() => {
                setShowMoreMenu(false);
                setShowSyncModal(true);
              }}
              className="w-full px-3 py-2 text-left rounded-xl hover:bg-stone-50 flex items-center gap-2 font-semibold text-stone-800 cursor-pointer"
            >
              <RefreshCw size={14} className="text-amber-600" />
              <span>Match Mobile App Balance ($4.35)</span>
            </button>
          </div>
        )}

        {/* Segmented Tabs: Spot | History (Screenshot 6) */}
        <div className="flex items-center justify-between pt-2 border-b border-stone-100 pb-1">
          <div className="flex items-center gap-4 text-base font-bold">
            <button
              onClick={() => setActiveTab("spot")}
              className={`cursor-pointer transition-colors ${
                activeTab === "spot" ? "text-stone-900 border-b-2 border-stone-900 pb-1" : "text-stone-400"
              }`}
            >
              Spot
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`cursor-pointer transition-colors ${
                activeTab === "history" ? "text-stone-900 border-b-2 border-stone-900 pb-1" : "text-stone-400"
              }`}
            >
              History
            </button>
          </div>

          <button
            onClick={() => fetchOneKeyState()}
            className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
            title="Filter / Refresh"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {/* TAB 1: SPOT TOKENS LIST (Screenshot 6) */}
        {activeTab === "spot" && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-stone-900">Tokens</div>

            {/* 1. TRX Token Item (Screenshot 6) */}
            <div className="flex items-center justify-between py-1.5 hover:bg-stone-50 rounded-xl px-2 transition-colors cursor-pointer"
                 onClick={() => {
                   setSendToken("TRX");
                   setShowSendModal(true);
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                  {/* Tron Diamond */}
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 15 10-15-10-5zm0 3.3L18.4 7 12 16.6 5.6 7 12 5.3z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs text-stone-900">TRX</span>
                    <span title="Gas token"><Fuel size={12} className="text-stone-400" /></span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    ${trxToken.price}{" "}
                    <span className="text-rose-500">{trxToken.change}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-xs text-stone-900">
                  {trxToken.balance > 0 ? trxToken.balance.toFixed(2) : "0"}
                </div>
                <div className="text-[11px] text-stone-400">
                  ${trxToken.usdValue > 0 ? trxToken.usdValue.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>

            {/* 2. USDT TRC-20 Token Item (Screenshot 6) */}
            <div className="flex items-center justify-between py-1.5 hover:bg-stone-50 rounded-xl px-2 transition-colors cursor-pointer"
                 onClick={() => {
                   setSendToken("USDT");
                   setShowSendModal(true);
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  ₮
                </div>
                <div>
                  <div className="font-extrabold text-xs text-stone-900">USDT</div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    ${usdtToken.price}{" "}
                    <span className="text-rose-500">{usdtToken.change}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-xs text-stone-900">
                  {usdtToken.balance > 0 ? usdtToken.balance.toFixed(2) : "0"}
                </div>
                <div className="text-[11px] text-stone-400">
                  ${usdtToken.usdValue > 0 ? usdtToken.usdValue.toFixed(2) : "0.00"}
                </div>
              </div>
            </div>

            {/* 3. USDC Token Item (Screenshot 6) */}
            <div className="flex items-center justify-between py-1.5 hover:bg-stone-50 rounded-xl px-2 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                  $
                </div>
                <div>
                  <div className="font-extrabold text-xs text-stone-900">USDC</div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    ${usdcToken.price}{" "}
                    <span className="text-rose-500">{usdcToken.change}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-xs text-stone-900">0</div>
                <div className="text-[11px] text-stone-400">$0.00</div>
              </div>
            </div>

            {/* Can't find your token? Add token -> (Screenshot 6) */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setShowDepositModal(true)}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium cursor-pointer transition-colors"
              >
                Can't find your token? Add token →
              </button>
            </div>

            {/* Market Section (Screenshot 6) */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-xs font-bold text-stone-900">Market</span>
              <button
                onClick={() => setShowSwapModal(true)}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                + Add 4 tokens
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY (Transactions & Rewards Engine Transfers) */}
        {activeTab === "history" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Recent Activity ({transactions.length})</span>
              <button onClick={() => fetchOneKeyState()} className="text-blue-600 hover:underline">
                Refresh
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No transactions yet. Withdraw from Franz Rewards to see funds arrive in real time!
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] ${
                        tx.type === "deposit"
                          ? "bg-emerald-100 text-emerald-700"
                          : tx.type === "swap"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tx.type === "deposit" ? "↓" : tx.type === "swap" ? "⇄" : "↑"}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 capitalize">
                        {tx.source || (tx.type === "deposit" ? "Incoming Deposit" : "External Send")}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Tron TRC-20
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-xs ${
                        tx.type === "deposit" ? "text-emerald-600" : "text-stone-900"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}{tx.amount.toFixed(2)} {tx.token}
                    </div>
                    <a
                      href={`https://tronscan.org/#/transaction/${tx.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9.5px] font-mono text-purple-600 hover:underline"
                    >
                      TxHash ↗
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 4. BOTTOM MOBILE NAVIGATION BAR (Screenshot 6: Wallet, Trade, Perps)  */}
      {/* ==================================================================== */}
      <div className="pt-2 pb-1 px-4 bg-white border-t border-stone-100 flex items-center justify-between text-stone-400 shrink-0">
        <button
          onClick={() => {
            setBottomNav("wallet");
            setActiveTab("spot");
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            bottomNav === "wallet" ? "text-stone-900 font-bold" : "hover:text-stone-600"
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px]">Wallet</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("trade");
            setShowSwapModal(true);
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            bottomNav === "trade" ? "text-stone-900 font-bold" : "hover:text-stone-600"
          }`}
        >
          <ArrowRightLeft size={18} />
          <span className="text-[10px]">Trade</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("perps");
            setActiveTab("spot");
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            bottomNav === "perps" ? "text-stone-900 font-bold" : "hover:text-stone-600"
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">Perps</span>
        </button>

        <button
          onClick={() => {
            setBottomNav("discover");
            window.open("https://tronscan.org", "_blank");
          }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            bottomNav === "discover" ? "text-stone-900 font-bold" : "hover:text-stone-600"
          }`}
        >
          <Compass size={18} />
          <span className="text-[10px]">Discover</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 5. ANDROID SYSTEM NAVIGATION BAR (Screenshot 6: ||| ⬭ <)             */}
      {/* ==================================================================== */}
      <div className="py-1 px-8 bg-white flex items-center justify-around text-stone-400 shrink-0 text-sm">
        <button className="hover:text-stone-800 cursor-pointer font-bold tracking-widest">
          |||
        </button>
        <button className="hover:text-stone-800 cursor-pointer font-bold">
          ⬭
        </button>
        <button className="hover:text-stone-800 cursor-pointer font-bold text-base">
          ‹
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: RECEIVE / DEPOSIT MODAL (QR CODE + TRC-20 ADDRESS)          */}
      {/* ==================================================================== */}
      {showDepositModal && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Receive USDT (TRC-20)</h3>
                <p className="text-[11px] text-stone-500">Scan or copy address to deposit</p>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center py-2">
              <div className="p-3 bg-white border-2 border-stone-200 rounded-2xl shadow-sm">
                <img
                  src={qrUrl}
                  alt="OneKey TRC-20 QR"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <span className="mt-2 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                Network: TRON (TRC-20)
              </span>
            </div>

            {/* Address Display & Copy */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <span className="text-[10px] text-stone-400 block font-bold">YOUR WALLET ADDRESS:</span>
                <span className="font-mono text-xs font-bold text-stone-800 break-all select-all">
                  {walletAddress}
                </span>
              </div>
              <button
                onClick={() => handleCopyAddress()}
                className="px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-colors flex items-center gap-1"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              ⚠️ Only deposit USDT (TRC-20) or TRX to this address. Funds sent from external exchanges or Franz Rewards reflect in real time.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SEND / WITHDRAW TO EXTERNAL WALLET                         */}
      {/* ==================================================================== */}
      {showSendModal && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Send / Withdraw</h3>
                <p className="text-[11px] text-stone-500">Transfer from OneKey to another external wallet</p>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {sendFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-100 text-xs text-stone-800 font-medium">
                {sendFeedback}
              </div>
            )}

            <form onSubmit={handleSendSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">Asset:</label>
                  <select
                    value={sendToken}
                    onChange={(e) => setSendToken(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none"
                  >
                    <option value="USDT">USDT (Avail: {usdtToken.balance.toFixed(2)})</option>
                    <option value="TRX">TRX (Avail: {trxToken.balance.toFixed(2)})</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-500 block mb-1">Network:</label>
                  <div className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700">
                    Tron (TRC-20)
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1">Amount:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSendAmount(sendToken === "USDT" ? usdtToken.balance.toString() : trxToken.balance.toString())}
                    className="absolute right-2 top-2 px-1.5 py-0.5 bg-stone-200 text-[9px] font-bold rounded text-stone-700"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1">Destination TRC-20 Address:</label>
                <input
                  type="text"
                  required
                  placeholder="T... (Tron TRC-20 Address)"
                  value={sendDestination}
                  onChange={(e) => setSendDestination(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                {isSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Broadcast Transfer to Network</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: INSTANT TOKEN SWAP                                          */}
      {/* ==================================================================== */}
      {showSwapModal && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Trade / Swap</h3>
                <p className="text-[11px] text-stone-500">Instant on-chain exchange in OneKey</p>
              </div>
              <button
                onClick={() => setShowSwapModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {swapFeedback && (
              <div className="p-2.5 rounded-xl bg-stone-100 text-xs text-stone-800 font-medium">
                {swapFeedback}
              </div>
            )}

            <form onSubmit={handleSwapSubmit} className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 mb-1">
                  <span>Pay:</span>
                  <span>Avail: {swapFrom === "USDT" ? usdtToken.balance.toFixed(2) : trxToken.balance.toFixed(2)} {swapFrom}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const temp = swapFrom;
                      setSwapFrom(swapTo);
                      setSwapTo(temp);
                    }}
                    className="px-3 py-2 bg-stone-100 rounded-xl text-xs font-bold text-stone-800 cursor-pointer"
                  >
                    {swapFrom} ⇄ {swapTo}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl text-xs font-mono text-stone-700 flex justify-between">
                <span>Estimated Receive:</span>
                <strong className="text-emerald-600">
                  {swapFrom === "USDT"
                    ? (parseFloat(swapAmount || "0") * 2.9493).toFixed(4)
                    : (parseFloat(swapAmount || "0") * 0.339).toFixed(4)}{" "}
                  {swapTo}
                </strong>
              </div>

              <button
                type="submit"
                disabled={isSwapping}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                {isSwapping ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                <span>Execute Instant Swap</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: GOOGLE AUTHENTICATION MODAL                                */}
      {/* ==================================================================== */}
      {showAuthModal && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span className="font-bold text-blue-600">G</span> Google Authentication
                </h3>
                <p className="text-[11px] text-stone-500">Sign in to sync your OneKey wallet profile</p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {authFeedback && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
                {authFeedback}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-1">Enter Gmail / Email Address:</label>
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="kansasnelly@gmail.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Mail size={15} />
                <span>Continue with Google Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputEmail("kansasnelly@gmail.com");
                  handleAuthSubmit({ preventDefault: () => {} } as any);
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl cursor-pointer"
              >
                ⚡ 1-Click Login as Kansas Nelly (kansasnelly@gmail.com)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: MATCH MOBILE APP BALANCE ($4.35)                            */}
      {/* ==================================================================== */}
      {showSyncModal && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs p-4 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">Mobile App Balance Match</h3>
                <p className="text-[11px] text-stone-500">Ensure ecosystem balance matches your phone app exactly</p>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              💡 As specified, when you have <strong>$4.35 USDT</strong> in your physical OneKey mobile app, your ecosystem balance will reflect <strong>$4.35 USDT</strong> identically!
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 block mb-1">Set Target USDT Balance:</label>
              <input
                type="number"
                step="0.01"
                value={syncUsdtInput}
                onChange={(e) => setSyncUsdtInput(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none"
              />
            </div>

            <button
              onClick={handleSetBalance}
              className="w-full py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              Confirm Exact Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
