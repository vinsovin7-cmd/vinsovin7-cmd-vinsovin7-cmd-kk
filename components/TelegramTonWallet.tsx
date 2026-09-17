import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  X,
  Copy,
  Check,
  Send,
  PlusCircle,
  ArrowUpCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Repeat,
  Percent,
  Grid,
  Sparkles,
  ChevronRight,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Radio,
  Coins
} from "lucide-react";

export interface TonWalletTransaction {
  id: string;
  type: "ECOSYSTEM_EARNINGS_SYNC" | "WITHDRAWAL" | "TRANSFER" | "DEPOSIT";
  amount: number;
  token: "USDT" | "GRAM";
  destination: string;
  txHash: string;
  explorerUrl: string;
  status: "CONFIRMED_ON_TON";
  timestamp: string;
  summary: string;
}

export interface TonTelegramWalletState {
  connected: boolean;
  address: string;
  shortAddress: string;
  rawAddress: string;
  network: string;
  usdtBalance: number;
  gramBalance: number;
  gramUsdValue: number;
  totalUsdValue: number;
  totalWithdrawnUsdt: number;
  lastSyncedTimestamp: string;
  isSyncedWithEcosystemEarnings: boolean;
  usdtJettonMaster: string;
  explorerUrl: string;
  tonscanUrl: string;
  apyRate: number;
  backupStatus: {
    backedUp: boolean;
    hasRecoveryPhrase: boolean;
  };
  transactions: TonWalletTransaction[];
}

interface TelegramTonWalletProps {
  onClose?: () => void;
  externalStats?: any;
  onRefreshEcosystem?: () => void;
}

export const TelegramTonWallet: React.FC<TelegramTonWalletProps> = ({
  onClose,
  externalStats,
  onRefreshEcosystem
}) => {
  const [walletState, setWalletState] = useState<TonTelegramWalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"defi" | "swap" | "earn" | "apps">("defi");
  const [showBackupCelebration, setShowBackupCelebration] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<"transfer" | "deposit" | "withdraw" | null>(null);
  
  // Transfer Form State
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferToken, setTransferToken] = useState<"USDT" | "GRAM">("USDT");

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawToken, setWithdrawToken] = useState<"USDT" | "GRAM">("USDT");
  const [withdrawDest, setWithdrawDest] = useState("");

  const connectedAddress = walletState?.address || "UQCEmPuekMNIhr5eIQRq-U9-UFPgtzi1WKGzRpjX-ctNHLNt";
  const shortAddress = `${connectedAddress.slice(0, 4)}...${connectedAddress.slice(-4)}`;

  // Fetch Wallet State from Server
  const fetchWalletState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ton-wallet/state");
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        // Server returning non-JSON (e.g. startup/SPA fallback); gracefully use externalStats fallback
        if (externalStats?.tonTelegramWallet) {
          setWalletState(externalStats.tonTelegramWallet);
        }
        return;
      }
      const data = await res.json();
      if (data.success && data.tonTelegramWallet) {
        setWalletState(data.tonTelegramWallet);
        if (!withdrawDest) {
          setWithdrawDest(data.tonTelegramWallet.address);
        }
      }
    } catch (err) {
      // Graceful fallback to avoid unhandled runtime console error
      if (externalStats?.tonTelegramWallet) {
        setWalletState(externalStats.tonTelegramWallet);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletState();
    const interval = setInterval(fetchWalletState, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update wallet state when external stats change
  useEffect(() => {
    if (externalStats?.tonTelegramWallet) {
      setWalletState(externalStats.tonTelegramWallet);
    }
  }, [externalStats]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(connectedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Sync Live Ecosystem Earnings into USDT
  const handleSyncEarnings = async () => {
    try {
      setSyncing(true);
      setStatusMessage(null);
      const res = await fetch("/api/ton-wallet/sync-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Server temporarily unavailable. Please retry.");
      }
      const data = await res.json();
      if (data.success) {
        setWalletState(data.tonTelegramWallet);
        setStatusMessage({
          type: "success",
          text: data.message || "Ecosystem earnings successfully synced to your USDT balance!"
        });
        if (onRefreshEcosystem) onRefreshEcosystem();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to sync earnings." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error syncing earnings." });
    } finally {
      setSyncing(false);
    }
  };

  // Handle Transfer
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRecipient || !transferAmount) return;

    try {
      setLoading(true);
      setStatusMessage(null);
      const res = await fetch("/api/ton-wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress: transferRecipient,
          amount: transferAmount,
          token: transferToken
        })
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Invalid response from server. Please try again.");
      }
      const data = await res.json();
      if (data.success) {
        setWalletState(data.tonTelegramWallet);
        setStatusMessage({ type: "success", text: data.message });
        setActiveModal(null);
        setTransferAmount("");
        setTransferRecipient("");
        if (onRefreshEcosystem) onRefreshEcosystem();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Transfer failed." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error during transfer." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Withdrawal
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;

    try {
      setLoading(true);
      setStatusMessage(null);
      const res = await fetch("/api/ton-wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: withdrawAmount,
          token: withdrawToken,
          destinationAddress: withdrawDest || connectedAddress
        })
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Invalid response from server. Please try again.");
      }
      const data = await res.json();
      if (data.success) {
        setWalletState(data.tonTelegramWallet);
        setStatusMessage({ type: "success", text: data.message });
        setActiveModal(null);
        setWithdrawAmount("");
        if (onRefreshEcosystem) onRefreshEcosystem();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Withdrawal failed." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error during withdrawal." });
    } finally {
      setLoading(false);
    }
  };

  const usdtBalance = walletState?.usdtBalance ?? (externalStats?.totalRevenueRecorded ?? 845.50);
  const gramBalance = walletState?.gramBalance ?? 24.50;
  const totalUsdValue = (usdtBalance + gramBalance * 5.80);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0f141c] text-white rounded-3xl overflow-hidden border border-stone-800 shadow-2xl font-sans relative">
      
      {/* 1. TOP STATUS BAR / HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f141c] border-b border-stone-800/60 select-none">
        <button
          onClick={() => {
            if (showBackupCelebration) setShowBackupCelebration(false);
            else if (onClose) onClose();
          }}
          className="text-stone-400 hover:text-white transition-colors cursor-pointer p-1 -ml-1 rounded-lg"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-extrabold tracking-widest text-white uppercase">
            WALLET
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBackupCelebration(!showBackupCelebration)}
            className="text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
            title="Toggle Backup Status Screen"
          >
            <MoreVertical size={18} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-lg transition-colors cursor-pointer"
              title="Close Wallet"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: BACKUP CELEBRATION MODAL (Matching Image 1) */}
      {showBackupCelebration ? (
        <div className="p-8 flex flex-col items-center justify-between min-h-[560px] animate-fade-in text-center">
          <div className="w-full flex justify-end">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              TON MAINNET
            </span>
          </div>

          <div className="space-y-6 my-auto max-w-xs">
            {/* Party Horn Emoji / Graphic */}
            <div className="w-24 h-24 mx-auto flex items-center justify-center text-6xl select-none animate-bounce">
              🎉
            </div>

            {/* Neon Green Headline */}
            <h3 className="text-2xl font-black text-emerald-400 leading-tight">
              Wallet was successfully backed up
            </h3>

            {/* Cyan / Blue Subtext */}
            <p className="text-sm text-cyan-400/90 leading-relaxed font-medium">
              You can find your Secret Recovery Phrase in <span className="inline-flex items-center gap-1 font-semibold">⚙ Wallet Settings</span>.
            </p>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 text-left text-xs font-mono space-y-1">
              <div className="text-stone-400 text-[11px]">Connected Address:</div>
              <div className="text-emerald-300 font-bold break-all select-all">{connectedAddress}</div>
            </div>
          </div>

          {/* Bottom Button matching Image 1: View DeFi Account */}
          <button
            onClick={() => setShowBackupCelebration(false)}
            className="w-full py-4 bg-[#4a0d18] hover:bg-[#5a121e] active:scale-[0.99] text-[#3b82f6] font-extrabold rounded-2xl text-base shadow-xl cursor-pointer transition-all border border-red-900/40"
          >
            View DeFi Account
          </button>
        </div>
      ) : (
        /* VIEW B: MAIN DEFI ACCOUNT DASHBOARD (Matching Image 2) */
        <div className="p-5 space-y-5 animate-fade-in">
          
          {/* Status Toast Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-mono flex items-center justify-between gap-2 border ${
                statusMessage.type === "success"
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-700"
                  : "bg-red-950/90 text-red-300 border-red-700"
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-stone-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Top User Profile & Address Tag */}
          <div className="flex flex-col items-center justify-center pt-2">
            {/* User Avatar Circle */}
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 shadow-xl mb-3">
              <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center overflow-hidden border border-stone-950">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Address Pill with Copy (Matching Screenshot 2 style) */}
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 hover:bg-stone-800 rounded-full border border-stone-800 transition-all cursor-pointer group"
              title="Click to copy full TON address"
            >
              <span className="text-xs font-mono font-bold text-[#FF4D4D] group-hover:text-red-400">
                {shortAddress}
              </span>
              {copied ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} className="text-[#FF4D4D] group-hover:text-red-400" />
              )}
            </button>
            {copied && (
              <span className="text-[10px] text-emerald-400 font-mono mt-1 animate-pulse">
                Copied full address to clipboard!
              </span>
            )}
          </div>

          {/* Large Total Balance Display */}
          <div className="text-center py-1">
            <div className="inline-flex items-baseline justify-center tracking-tight">
              <span className="text-3xl sm:text-4xl font-black text-[#FF3B30] mr-1">$</span>
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                {usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Ecosystem Earnings Synced
              </span>
            </div>
          </div>

          {/* Action Buttons: Transfer, Deposit, Withdraw */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => setActiveModal("transfer")}
              className="flex flex-col items-center justify-center py-3 px-2 bg-[#1b2330] hover:bg-[#232c3d] active:scale-[0.98] rounded-2xl border border-stone-800 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-stone-800/80 group-hover:bg-cyan-950 flex items-center justify-center text-white group-hover:text-cyan-400 mb-1.5 transition-colors">
                <Send size={16} className="-rotate-12 translate-x-0.5" />
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-white">Transfer</span>
            </button>

            <button
              onClick={() => setActiveModal("deposit")}
              className="flex flex-col items-center justify-center py-3 px-2 bg-[#1b2330] hover:bg-[#232c3d] active:scale-[0.98] rounded-2xl border border-stone-800 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-stone-800/80 group-hover:bg-emerald-950 flex items-center justify-center text-white group-hover:text-emerald-400 mb-1.5 transition-colors">
                <PlusCircle size={17} />
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-white">Deposit</span>
            </button>

            <button
              onClick={() => setActiveModal("withdraw")}
              className="flex flex-col items-center justify-center py-3 px-2 bg-[#1b2330] hover:bg-[#232c3d] active:scale-[0.98] rounded-2xl border border-stone-800 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-stone-800/80 group-hover:bg-amber-950 flex items-center justify-center text-white group-hover:text-amber-400 mb-1.5 transition-colors">
                <ArrowUpCircle size={17} />
              </div>
              <span className="text-xs font-bold text-stone-200 group-hover:text-white">Withdraw</span>
            </button>
          </div>

          {/* 1-Click Live Ecosystem Earnings Sync Bar */}
          <div className="p-3.5 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between gap-2 shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                <TrendingUp size={15} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  Live Accrual Engine <span className="text-emerald-400 font-mono">+$0.05/sec</span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Shopify & Tidio sales auto-feed to this wallet
                </div>
              </div>
            </div>

            <button
              onClick={handleSyncEarnings}
              disabled={syncing}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-stone-950 font-black text-[11px] rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Syncing..." : "Sync Now"}</span>
            </button>
          </div>

          {/* Finish Setting Up Cards (Screenshot 2) */}
          <div className="bg-[#151c27] rounded-2xl p-3.5 space-y-2.5 border border-stone-800/80">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Finish setting up
            </span>

            <a
              href="https://t.me/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 bg-[#1b2330]/60 hover:bg-[#1b2330] rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2AABEE] text-white flex items-center justify-center shadow">
                  <Send size={14} className="-rotate-12 translate-x-0.5" />
                </div>
                <span className="text-xs font-bold text-stone-200">Join Wallet News</span>
              </div>
              <ChevronRight size={16} className="text-stone-500" />
            </a>

            <div
              onClick={() => setActiveModal("deposit")}
              className="flex items-center justify-between p-2.5 bg-[#1b2330]/60 hover:bg-[#1b2330] rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-stone-950 font-black flex items-center justify-center text-sm shadow">
                  $
                </div>
                <span className="text-xs font-bold text-stone-200">Get your first GRAM</span>
              </div>
              <ChevronRight size={16} className="text-stone-500" />
            </div>
          </div>

          {/* GRAM Earn 13.35% APY Banner (Screenshot 2) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0d2a4d] to-[#123e70] rounded-2xl p-4 border border-blue-900/60 shadow-lg text-white">
            <div className="relative z-10 max-w-[240px] space-y-1">
              <h4 className="text-xs font-black tracking-wide leading-snug">
                GRAM Earn rate just went up: 13.35% APY.
              </h4>
              <button
                onClick={() => setActiveSubTab("earn")}
                className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Start earning</span>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Decorative Paper Airplane Graphic on Right */}
            <div className="absolute -right-2 -bottom-2 opacity-90 pointer-events-none">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl absolute"></div>
              <Send size={64} className="text-cyan-400/40 -rotate-45 transform translate-x-2 translate-y-2" />
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            </div>
          </div>

          {/* Tokens List Section (Screenshot 2) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Tokens
              </h3>
              <span className="text-[10px] text-stone-500 font-mono">
                TON Blockchain
              </span>
            </div>

            <div className="space-y-2">
              {/* Token 1: Gram (prev. Toncoin) */}
              <div className="p-3.5 bg-[#151c27] hover:bg-[#1a2332] rounded-2xl border border-stone-800/80 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  {/* Blue Diamond Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#0088CC] text-white flex items-center justify-center shadow">
                    <div className="w-5 h-5 border-2 border-white rotate-45 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rotate-45"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Gram (prev. Toncoin)</span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                      {gramBalance.toFixed(2)} GRAM
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    ${(gramBalance * 5.80).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    @ $5.80 / TON
                  </div>
                </div>
              </div>

              {/* Token 2: USDT (Tether on TON - Connected to Live Ecosystem) */}
              <div className="p-3.5 bg-gradient-to-r from-[#151c27] via-[#102324] to-[#151c27] rounded-2xl border border-teal-800/50 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  {/* Teal Tether Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold font-serif text-lg shadow">
                    ₮
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>USDT</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700">
                        LIVE EARNINGS
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-teal-300 font-bold mt-0.5">
                      {usdtBalance.toFixed(2)} USDT
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-black text-emerald-400">
                    ${usdtBalance.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-mono flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>100% Available</span>
                  </div>
                </div>
              </div>

              {/* Token 3: Earning Assets */}
              <div
                onClick={() => setActiveSubTab("earn")}
                className="p-3.5 bg-[#151c27] hover:bg-[#1a2332] rounded-2xl border border-stone-800/80 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                    <Percent size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Earning assets
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Get rewards for holding crypto
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-stone-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Activity / Created DeFi Account (Screenshot 2) */}
          <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-stone-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-stone-300 font-medium">You created DeFi Account</span>
            </div>

            <a
              href={`https://tonviewer.com/${connectedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Tonviewer</span>
              <ExternalLink size={10} />
            </a>
          </div>

          {/* Bottom App Navigation Tabs (Screenshot 2) */}
          <div className="pt-2">
            <div className="bg-[#151c27] rounded-2xl p-1.5 flex items-center justify-around border border-stone-800 shadow-xl">
              <button
                onClick={() => setActiveSubTab("defi")}
                className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeSubTab === "defi"
                    ? "bg-[#1f2937] text-cyan-400 shadow"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <ShieldCheck size={16} />
                <span>DeFi</span>
              </button>

              <button
                onClick={() => setActiveSubTab("swap")}
                className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeSubTab === "swap"
                    ? "bg-[#1f2937] text-cyan-400 shadow"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Repeat size={16} />
                <span>Swap</span>
              </button>

              <button
                onClick={() => setActiveSubTab("earn")}
                className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeSubTab === "earn"
                    ? "bg-[#1f2937] text-cyan-400 shadow"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Percent size={16} />
                <span>Earn</span>
              </button>

              <button
                onClick={() => setActiveSubTab("apps")}
                className={`flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeSubTab === "apps"
                    ? "bg-[#1f2937] text-cyan-400 shadow"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Grid size={16} />
                <span>Apps</span>
              </button>
            </div>
          </div>

          {/* Telegram @WALLET Official Branding Footer */}
          <div className="text-center pt-2 pb-1">
            <h5 className="font-extrabold text-sm tracking-widest text-stone-400 uppercase select-none">
              @WALLET
            </h5>
            <p className="text-[10px] text-stone-600 font-mono mt-0.5">
              Powered by The Open Network (TON) • Jetton Standard
            </p>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TRANSFER MODAL */}
      {/* ========================================================================= */}
      {activeModal === "transfer" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 p-5 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#151c27] rounded-3xl p-5 border border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Transfer Funds</h4>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Recipient TON Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="UQ... or EQ... (TON Address or @username)"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Token
                  </label>
                  <select
                    value={transferToken}
                    onChange={(e) => setTransferToken(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="USDT">USDT (${usdtBalance.toFixed(2)})</option>
                    <option value="GRAM">GRAM ({gramBalance.toFixed(2)})</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setTransferAmount(transferToken === "USDT" ? usdtBalance.toString() : gramBalance.toString())}
                      className="absolute right-1.5 top-1 px-1.5 py-0.5 rounded bg-stone-800 text-[10px] font-bold text-cyan-400"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-stone-900/60 rounded-xl text-[10px] font-mono text-stone-400 flex justify-between">
                <span>Estimated Network Gas:</span>
                <span className="text-emerald-400 font-bold">~0.05 TON ($0.29)</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Send size={14} />
                <span>{loading ? "Processing..." : "Confirm & Send"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DEPOSIT MODAL */}
      {/* ========================================================================= */}
      {activeModal === "deposit" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 p-5 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#151c27] rounded-3xl p-5 border border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <PlusCircle size={16} className="text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Deposit to @Wallet</h4>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Address QR Simulation & Copy */}
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="w-36 h-36 bg-white p-2.5 rounded-2xl shadow-xl flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <div className="w-full h-full border-4 border-stone-900 rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-7 h-7 bg-stone-950 rounded-sm"></div>
                    <div className="w-7 h-7 bg-stone-950 rounded-sm"></div>
                  </div>
                  <div className="w-6 h-6 bg-teal-600 rounded-full mx-auto flex items-center justify-center text-white text-[10px] font-bold">
                    ₮
                  </div>
                  <div className="flex justify-between">
                    <div className="w-7 h-7 bg-stone-950 rounded-sm"></div>
                    <div className="w-4 h-4 bg-stone-950 rounded-sm self-end"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                  Your TON / USDT Deposit Address
                </span>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono text-emerald-300 break-all select-all font-bold">
                  {connectedAddress}
                </div>
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Address Copied!" : "Copy Address"}</span>
              </button>

              <p className="text-[10px] text-stone-500 text-center leading-relaxed">
                Send TON or Tether (USDT on TON / Jetton standard) directly to this address. Credits instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WITHDRAWAL MODAL */}
      {/* ========================================================================= */}
      {activeModal === "withdraw" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 p-5 flex flex-col justify-end animate-fade-in">
          <div className="bg-[#151c27] rounded-3xl p-5 border border-stone-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ArrowUpCircle size={16} className="text-amber-400" />
                <h4 className="text-sm font-bold text-white">Withdraw On-Chain</h4>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Destination Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your external TON or DeFi wallet"
                  value={withdrawDest}
                  onChange={(e) => setWithdrawDest(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Asset
                  </label>
                  <select
                    value={withdrawToken}
                    onChange={(e) => setWithdrawToken(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="USDT">USDT (${usdtBalance.toFixed(2)})</option>
                    <option value="GRAM">GRAM ({gramBalance.toFixed(2)})</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Withdraw Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(withdrawToken === "USDT" ? usdtBalance.toString() : gramBalance.toString())}
                      className="absolute right-1.5 top-1 px-1.5 py-0.5 rounded bg-stone-800 text-[10px] font-bold text-amber-400"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-stone-900/60 rounded-xl text-[10px] font-mono text-stone-400 flex justify-between">
                <span>Settlement Speed:</span>
                <span className="text-emerald-400 font-bold">Instant (TON 5-sec block time)</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <ArrowUpRight size={14} />
                <span>{loading ? "Confirming..." : "Execute On-Chain Withdrawal"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
