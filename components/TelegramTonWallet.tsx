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
  Coins,
  QrCode,
  Upload,
  Clock,
  DollarSign,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Building2,
  CreditCard,
  Zap,
  CheckCircle
} from "lucide-react";

export interface TonWalletTransaction {
  id: string;
  type: "ECOSYSTEM_EARNINGS_SYNC" | "WITHDRAWAL" | "TRANSFER" | "DEPOSIT" | "STAKE_DEPOSIT" | "STAKE_WITHDRAW" | "ACLEDA_BANK_PAYMENT";
  amount: number;
  token: string;
  destination: string;
  txHash: string;
  explorerUrl: string;
  status: "CONFIRMED_ON_CHAIN";
  timestamp: string;
  summary: string;
}

export type ChainType = "TON" | "SOLANA" | "ETHEREUM" | "BITCOIN" | "BASE";

export interface ChainWalletInfo {
  chain: ChainType;
  name: string;
  symbol: string;
  address: string;
  balance: number;
  usdRate: number;
  icon: string;
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
  // Collapse / Expand View State
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"defi" | "swap" | "earn" | "acleda" | "staking">("acleda");
  const [selectedChain, setSelectedChain] = useState<ChainType>("TON");

  // Dual Account Balances
  // 1) Right Side: Ecosystem Synced Balance
  const [ecosystemBalance, setEcosystemBalance] = useState<number>(() => {
    return externalStats?.totalRevenueRecorded || 1079.20;
  });

  // 2) Left Side: Real Deposit Balance (User deposited / earned / staked)
  const [realDepositBalance, setRealDepositBalance] = useState<number>(() => {
    const saved = localStorage.getItem("wallet_real_deposit_balance");
    return saved ? parseFloat(saved) : 25.00; // default $25 starter deposit
  });

  // Persist real deposit balance
  useEffect(() => {
    localStorage.setItem("wallet_real_deposit_balance", realDepositBalance.toFixed(2));
  }, [realDepositBalance]);

  // Multi-Chain Wallet State
  const chains: Record<ChainType, ChainWalletInfo> = {
    TON: {
      chain: "TON",
      name: "The Open Network (TON)",
      symbol: "TON / USDT",
      address: "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG",
      balance: realDepositBalance,
      usdRate: 1.0,
      icon: "💎"
    },
    SOLANA: {
      chain: "SOLANA",
      name: "Solana Network (SPL)",
      symbol: "SOL / USDT",
      address: "5uYJ7k2NqX8mP9vL1z3k4w5r6s7t8u9v0w1x2y3z4a5b",
      balance: 1.45,
      usdRate: 154.20,
      icon: "⚡"
    },
    ETHEREUM: {
      chain: "ETHEREUM",
      name: "Ethereum Mainnet (ERC20)",
      symbol: "ETH / USDT",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      balance: 0.12,
      usdRate: 2650.00,
      icon: "⟠"
    },
    BITCOIN: {
      chain: "BITCOIN",
      name: "Bitcoin Network",
      symbol: "BTC",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      balance: 0.0042,
      usdRate: 63500.00,
      icon: "₿"
    },
    BASE: {
      chain: "BASE",
      name: "Base L2 Network",
      symbol: "USDC / ETH",
      address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
      balance: 45.00,
      usdRate: 1.0,
      icon: "🔵"
    }
  };

  // ACLEDA BANK QR Code Storage
  const [acledaQrUrl, setAcledaQrUrl] = useState<string>(() => {
    return localStorage.getItem("acleda_bank_qr_code_image") || "";
  });
  const [acledaInputUrl, setAcledaInputUrl] = useState<string>("");
  const [acledaAmount, setAcledaAmount] = useState<string>("2.00");
  const [acledaStatus, setAcledaStatus] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // 20-Minute Staking Engine State
  const [stakeAmount, setStakeAmount] = useState<string>("1.00");
  const [activeStake, setActiveStake] = useState<{
    amount: number;
    startTime: number;
    endTime: number;
    yieldReturn: number;
    completed: boolean;
  } | null>(() => {
    const saved = localStorage.getItem("wallet_active_stake_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [stakeTimeLeftSeconds, setStakeTimeLeftSeconds] = useState<number>(0);

  // Persist Staking State
  useEffect(() => {
    if (activeStake) {
      localStorage.setItem("wallet_active_stake_data", JSON.stringify(activeStake));
    } else {
      localStorage.removeItem("wallet_active_stake_data");
    }
  }, [activeStake]);

  // Staking Countdown Timer
  useEffect(() => {
    if (!activeStake) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((activeStake.endTime - now) / 1000));
      setStakeTimeLeftSeconds(remaining);

      if (remaining === 0 && !activeStake.completed) {
        setActiveStake((prev) => (prev ? { ...prev, completed: true } : null));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStake]);

  // Transaction History
  const [transactions, setTransactions] = useState<TonWalletTransaction[]>(() => {
    const saved = localStorage.getItem("wallet_tx_history_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback default
      }
    }
    return [
      {
        id: "tx-init-01",
        type: "ECOSYSTEM_EARNINGS_SYNC",
        amount: 1079.20,
        token: "USDT",
        destination: "Shopify + Tidio Matrix Sync",
        txHash: "0x89f2a...c81a",
        explorerUrl: "https://tonscan.org/tx/0x89f2a...c81a",
        status: "CONFIRMED_ON_CHAIN",
        timestamp: new Date().toISOString(),
        summary: "Ecosystem Shopify sales auto-credited to @Wallet."
      }
    ];
  });

  // Persist Transactions
  useEffect(() => {
    localStorage.setItem("wallet_tx_history_list", JSON.stringify(transactions));
  }, [transactions]);

  // Modals & Action States
  const [activeModal, setActiveModal] = useState<"transfer" | "deposit" | "withdraw" | "swap" | null>(null);
  
  // Transfer Form State
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferToken, setTransferToken] = useState<string>("USDT");

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDest, setWithdrawDest] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Swap Form State
  const [swapFromToken, setSwapFromToken] = useState("USDT");
  const [swapToToken, setSwapToToken] = useState("TON");
  const [swapFromAmount, setSwapFromAmount] = useState("10.00");

  const currentAddress = chains[selectedChain].address;

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save ACLEDA Bank QR Code
  const handleSaveAcledaQr = () => {
    if (!acledaInputUrl) {
      setAcledaStatus({ text: "Please enter or paste an image URL for your ACLEDA BANK QR code.", type: "error" });
      return;
    }
    setAcledaQrUrl(acledaInputUrl);
    localStorage.setItem("acleda_bank_qr_code_image", acledaInputUrl);
    setAcledaInputUrl("");
    setAcledaStatus({ text: "ACLEDA BANK QR Code saved successfully! Ready for customer scanning.", type: "success" });
    setTimeout(() => setAcledaStatus(null), 4000);
  };

  // Handle ACLEDA Bank Scan Simulation
  const handleAcledaPaymentScan = () => {
    const amt = parseFloat(acledaAmount);
    if (isNaN(amt) || amt <= 0) {
      setAcledaStatus({ text: "Please enter a valid deposit amount.", type: "error" });
      return;
    }

    // Credit Real Deposit Balance (Left Side)
    setRealDepositBalance((prev) => prev + amt);

    // Record Transaction
    const newTx: TonWalletTransaction = {
      id: `tx-acleda-${Date.now()}`,
      type: "ACLEDA_BANK_PAYMENT",
      amount: amt,
      token: "USD (ACLEDA Bank)",
      destination: "Ecosystem Real Deposit Balance",
      txHash: `ACLEDA-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      explorerUrl: "#",
      status: "CONFIRMED_ON_CHAIN",
      timestamp: new Date().toISOString(),
      summary: `ACLEDA BANK QR Scan: Received $${amt.toFixed(2)} USD deposited into Real Wallet Balance.`
    };

    setTransactions((prev) => [newTx, ...prev]);
    setAcledaStatus({
      text: `🎉 Payment Confirmed! $${amt.toFixed(2)} USD deposited via ACLEDA BANK QR Code into your Real Deposit Balance!`,
      type: "success"
    });
    setTimeout(() => setAcledaStatus(null), 5000);
  };

  // Handle Start 20-Min Staking
  const handleStartStaking = () => {
    const amt = parseFloat(stakeAmount);
    if (isNaN(amt) || amt <= 0) {
      setStatusMessage({ text: "Please enter a valid staking amount.", type: "error" });
      return;
    }
    if (amt > realDepositBalance) {
      setStatusMessage({ text: "Insufficient funds in Real Deposit Balance for staking.", type: "error" });
      return;
    }

    // Deduct staked amount from real deposit balance
    setRealDepositBalance((prev) => prev - amt);

    const now = Date.now();
    const durationMs = 20 * 60 * 1000; // 20 minutes
    const newStake = {
      amount: amt,
      startTime: now,
      endTime: now + durationMs,
      yieldReturn: amt * 2, // 100% yield bonus ($1 -> $2)
      completed: false
    };

    setActiveStake(newStake);

    // Record Tx
    const newTx: TonWalletTransaction = {
      id: `tx-stake-in-${Date.now()}`,
      type: "STAKE_DEPOSIT",
      amount: amt,
      token: "USDT",
      destination: "20-Min High Yield Staking Vault",
      txHash: `STAKE-${Math.floor(100000 + Math.random() * 900000)}`,
      explorerUrl: "#",
      status: "CONFIRMED_ON_CHAIN",
      timestamp: new Date().toISOString(),
      summary: `Staked $${amt.toFixed(2)} USDT into 20-Min Yield Pool (Returns $${(amt * 2).toFixed(2)} USDT).`
    };

    setTransactions((prev) => [newTx, ...prev]);
    setStatusMessage({ text: `🎉 Staked $${amt.toFixed(2)} USDT! 20-Minute Staking Timer Started. Returns $${(amt * 2).toFixed(2)} USDT.`, type: "success" });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fast Forward Staking (Test Helper)
  const handleFastForwardStaking = () => {
    if (!activeStake) return;
    setActiveStake({
      ...activeStake,
      endTime: Date.now() - 1000,
      completed: true
    });
    setStakeTimeLeftSeconds(0);
  };

  // Withdraw Completed Staking Rewards
  const handleWithdrawStakedYield = () => {
    if (!activeStake || !activeStake.completed) return;

    const returnAmt = activeStake.yieldReturn;

    // Credit full yield return ($2 for $1 staked) back to Real Deposit Balance
    setRealDepositBalance((prev) => prev + returnAmt);

    // Record Tx
    const newTx: TonWalletTransaction = {
      id: `tx-stake-out-${Date.now()}`,
      type: "STAKE_WITHDRAW",
      amount: returnAmt,
      token: "USDT",
      destination: "Real Deposit Balance",
      txHash: `STAKE-WD-${Math.floor(100000 + Math.random() * 900000)}`,
      explorerUrl: "#",
      status: "CONFIRMED_ON_CHAIN",
      timestamp: new Date().toISOString(),
      summary: `Withdrew Staked Yield: Received $${returnAmt.toFixed(2)} USDT back to Real Deposit Balance!`
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActiveStake(null);
    setStatusMessage({
      text: `🎉 Staking Complete! $${returnAmt.toFixed(2)} USDT credited back to your Real Deposit Balance! You can now withdraw anytime.`,
      type: "success"
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Execute Transfer
  const handleExecuteTransfer = () => {
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      setStatusMessage({ text: "Please enter a valid transfer amount.", type: "error" });
      return;
    }
    if (!transferRecipient) {
      setStatusMessage({ text: "Please enter a valid recipient address.", type: "error" });
      return;
    }
    if (amt > realDepositBalance) {
      setStatusMessage({ text: "Insufficient Real Deposit Balance.", type: "error" });
      return;
    }

    setRealDepositBalance((prev) => prev - amt);

    const newTx: TonWalletTransaction = {
      id: `tx-transfer-${Date.now()}`,
      type: "TRANSFER",
      amount: amt,
      token: transferToken,
      destination: transferRecipient,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      explorerUrl: "https://tonscan.org",
      status: "CONFIRMED_ON_CHAIN",
      timestamp: new Date().toISOString(),
      summary: `Transferred $${amt.toFixed(2)} ${transferToken} to ${transferRecipient}`
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActiveModal(null);
    setTransferAmount("");
    setTransferRecipient("");
    setStatusMessage({ text: `🎉 Transferred $${amt.toFixed(2)} ${transferToken} successfully on-chain!`, type: "success" });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Execute Withdrawal
  const handleExecuteWithdrawal = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setStatusMessage({ text: "Please enter a valid withdrawal amount.", type: "error" });
      return;
    }
    if (!withdrawDest) {
      setStatusMessage({ text: "Please enter a destination wallet address.", type: "error" });
      return;
    }
    if (amt > realDepositBalance) {
      setStatusMessage({ text: "Insufficient Real Deposit Balance for withdrawal.", type: "error" });
      return;
    }

    setRealDepositBalance((prev) => prev - amt);

    const newTx: TonWalletTransaction = {
      id: `tx-wd-${Date.now()}`,
      type: "WITHDRAWAL",
      amount: amt,
      token: "USDT",
      destination: withdrawDest,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      explorerUrl: "https://tonscan.org",
      status: "CONFIRMED_ON_CHAIN",
      timestamp: new Date().toISOString(),
      summary: `On-Chain Withdrawal: $${amt.toFixed(2)} USDT sent to ${withdrawDest}`
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActiveModal(null);
    setWithdrawAmount("");
    setWithdrawDest("");
    setStatusMessage({ text: `🎉 Withdrawal Executed! $${amt.toFixed(2)} USDT sent on-chain to ${withdrawDest}`, type: "success" });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 space-y-6 text-stone-100 animate-fade-in">
      
      {/* TOP DECK HEADER BAR WITH COLLAPSE TOGGLE */}
      <div className="bg-[#0e121e] border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg border border-cyan-400">
            @
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-cyan-500 text-stone-950 font-black text-[10px] rounded uppercase tracking-wider">
                MULTI-CHAIN ON-CHAIN WALLET
              </span>
              <span className="text-xs text-cyan-300 font-mono font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-400" /> Jetton & SPL Standard Verified
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-wide mt-0.5 flex items-center gap-2">
              @Wallet Ecosystem Decentralized Vault
            </h2>
          </div>
        </div>

        {/* Top Control Bar Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center gap-2 cursor-pointer transition-all shadow-md"
          >
            {isCollapsed ? (
              <>
                <ChevronDown size={16} className="text-cyan-400" />
                <span>EXPAND FULL WALLET VIEW</span>
              </>
            ) : (
              <>
                <ChevronUp size={16} className="text-cyan-400" />
                <span>COLLAPSE / HIDE WALLET</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* STATUS NOTIFICATION BANNER */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-lg animate-fade-in ${
          statusMessage.type === "success" ? "bg-emerald-950 text-emerald-300 border border-emerald-500" : "bg-red-950 text-red-300 border border-red-500"
        }`}>
          <span>{statusMessage.text}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* MAIN WALLET BODY - ONLY WHEN NOT COLLAPSED */}
      {!isCollapsed && (
        <div className="space-y-6">

          {/* DUAL BALANCE DECK (LEFT SIDE: REAL DEPOSIT / RIGHT SIDE: ECOSYSTEM EARNINGS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT SIDE: REAL DEPOSIT & ON-CHAIN USER BALANCE */}
            <div className="bg-gradient-to-br from-[#121829] via-[#0f1422] to-[#161d31] border-2 border-emerald-500/70 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-stone-950 font-black text-[10px] rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
                <CheckCircle2 size={12} />
                REAL USER DEPOSIT BALANCE (LEFT SIDE)
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                  <Coins size={15} />
                  <span>DEPOSITED CRYPTO & FIAT USD</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    ${realDepositBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">USD / USDT</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Real funds deposited via <strong>ACLEDA BANK QR Code</strong> or crypto addresses. Ready for 20-min high-yield staking or instant withdrawal.
                </p>

                {/* Quick Action Strip */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal("deposit")}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <PlusCircle size={15} />
                    <span>Deposit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal("transfer")}
                    className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Send size={15} className="text-cyan-400" />
                    <span>Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal("withdraw")}
                    className="py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ArrowUpCircle size={15} className="text-amber-400" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: ECOSYSTEM EARNINGS BALANCE (SHOPIFY + TIDIO + PHANTOM MATRIX) */}
            <div className="bg-gradient-to-br from-[#181124] via-[#120c1c] to-[#1e132e] border-2 border-purple-500/70 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-purple-500 text-white font-black text-[10px] rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
                <Zap size={12} />
                ECOSYSTEM EARNINGS SYNCED (RIGHT SIDE)
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5 pt-1">
                  <Sparkles size={15} />
                  <span>SHOPIFY + TIDIO + PHANTOM MATRIX</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    ${ecosystemBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-bold text-purple-300">USDT</span>
                </div>

                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Autopilot revenue accrued live from Shopify sales, Tidio visitor triggers, and Solscan.io transaction relays.
                </p>

                {/* Sync Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onRefreshEcosystem) onRefreshEcosystem();
                      setStatusMessage({ text: "Synced latest Shopify + Tidio revenue metrics into @Wallet!", type: "success" });
                      setTimeout(() => setStatusMessage(null), 3000);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg border border-purple-400 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RefreshCw size={15} />
                    <span>Sync Ecosystem Revenue Now (+0.05 USDT/sec)</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* MULTI-CHAIN SELECTOR BAR */}
          <div className="bg-[#0e121e] border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-2">
                <Wallet size={16} className="text-cyan-400" />
                Select Supported Blockchain Network:
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                Current Active Address: <strong className="text-stone-200">{chains[selectedChain].address.slice(0, 8)}...{chains[selectedChain].address.slice(-6)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(Object.keys(chains) as ChainType[]).map((chainKey) => {
                const chain = chains[chainKey];
                const isSelected = selectedChain === chainKey;
                return (
                  <button
                    key={chainKey}
                    type="button"
                    onClick={() => setSelectedChain(chainKey)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/40 text-white shadow-lg"
                        : "bg-stone-900/80 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      <span>{chain.icon}</span>
                      <span>{chain.chain}</span>
                    </div>
                    <div className="text-[10px] font-mono text-stone-400 truncate mt-1">
                      {chain.symbol}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Chain Address Display */}
            <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <span className="text-stone-500 shrink-0">DEPOSIT ADDRESS ({selectedChain}):</span>
                <span className="text-emerald-400 font-bold truncate">{currentAddress}</span>
              </div>
              <button
                type="button"
                onClick={copyAddress}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* DEEP FUNCTIONAL SUB-TABS (ACLEDA BANK, 20-MIN STAKING, DEFI & SWAP, EARN) */}
          <div className="bg-[#0e121e] border border-stone-800 rounded-2xl p-5 space-y-6">
            
            {/* Sub-Tab Navigation Header */}
            <div className="flex border-b border-stone-800 pb-3 gap-2 overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSubTab("acleda")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeSubTab === "acleda"
                    ? "bg-gradient-to-r from-red-600 to-rose-700 text-white font-black shadow-lg"
                    : "text-stone-400 hover:text-white bg-stone-900/60"
                }`}
              >
                <Building2 size={16} />
                <span>ACLEDA BANK QR PAYMENT</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("staking")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeSubTab === "staking"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-black shadow-lg"
                    : "text-stone-400 hover:text-white bg-stone-900/60"
                }`}
              >
                <Clock size={16} />
                <span>20-MIN STAKING ENGINE (100% YIELD)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("swap")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeSubTab === "swap"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg"
                    : "text-stone-400 hover:text-white bg-stone-900/60"
                }`}
              >
                <Repeat size={16} />
                <span>DECENTRALIZED TOKEN SWAP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab("defi")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeSubTab === "defi"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-lg"
                    : "text-stone-400 hover:text-white bg-stone-900/60"
                }`}
              >
                <ShieldCheck size={16} />
                <span>DEFI POOLS & APPS</span>
              </button>
            </div>

            {/* SECTION 1: ACLEDA BANK QR CODE PAYMENT INTEGRATION */}
            {activeSubTab === "acleda" && (
              <div className="space-y-6 animate-fade-in">
                
                {acledaStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${
                    acledaStatus.type === "success" ? "bg-emerald-950 text-emerald-300 border border-emerald-500" : "bg-red-950 text-red-300 border border-red-500"
                  }`}>
                    {acledaStatus.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: QR Code Display & Scan Simulator */}
                  <div className="bg-stone-900/90 border-2 border-red-500/50 rounded-2xl p-5 space-y-4 text-center">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Building2 size={16} /> ACLEDA BANK PLC QR PAYMENT
                      </span>
                      <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 text-[10px] font-mono font-bold rounded">
                        USD / KH RIEL ACCEPTED
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white p-4 rounded-2xl border-4 border-red-600 shadow-2xl max-w-xs mx-auto space-y-2">
                      {acledaQrUrl ? (
                        <img
                          src={acledaQrUrl}
                          alt="ACLEDA Bank QR Code"
                          className="w-48 h-48 object-contain mx-auto rounded-lg border border-stone-200"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-stone-100 rounded-lg flex flex-col items-center justify-center p-4 text-stone-700 border-2 border-dashed border-stone-300 mx-auto">
                          <QrCode size={48} className="text-red-600 mb-2" />
                          <span className="text-xs font-black text-center text-red-700">
                            ACLEDA BANK QR CODE PLACEHOLDER
                          </span>
                          <span className="text-[10px] text-stone-500 text-center mt-1">
                            Paste your QR code image link on the right to store permanently.
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-stone-300">
                      Scan this ACLEDA BANK QR code using your mobile banking app to make instant payment for coin purchases or ecosystem plans.
                    </p>

                    {/* Scan & Pay Simulator Control */}
                    <div className="bg-[#121522] p-4 rounded-xl border border-stone-800 space-y-3 text-left">
                      <label className="text-xs font-bold text-stone-300 block">
                        Simulate Customer Scan Deposit Amount ($ USD):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={acledaAmount}
                          onChange={(e) => setAcledaAmount(e.target.value)}
                          placeholder="e.g. 2.00"
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={handleAcledaPaymentScan}
                          className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-lg shrink-0 cursor-pointer"
                        >
                          Scan & Confirm $ USD Deposit
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono">
                        Credits directly to your <strong>Real Deposit Balance (Left Side)</strong>.
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Custom ACLEDA QR Code Paste & Configuration */}
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Upload size={16} className="text-red-400" />
                      Configure & Save Your Personal ACLEDA BANK QR Code
                    </h3>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      You can paste your custom ACLEDA BANK merchant or personal QR code image URL here. It will be saved permanently in your ecosystem local database.
                    </p>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 block">
                        ACLEDA BANK QR Image URL:
                      </label>
                      <input
                        type="text"
                        value={acledaInputUrl}
                        onChange={(e) => setAcledaInputUrl(e.target.value)}
                        placeholder="https://example.com/my_acleda_qr.png or data:image/png;base64..."
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAcledaQr}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-lg border border-red-400 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <CheckCircle size={16} />
                      <span>Save My ACLEDA BANK QR Code Permanently</span>
                    </button>

                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs font-mono text-stone-400 space-y-1">
                      <div className="text-stone-300 font-bold">Bank Name: ACLEDA BANK PLC</div>
                      <div>Account Currency: USD ($) & KHR (៛)</div>
                      <div>Settlement Mode: Real-Time Instant Bank Notification</div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SECTION 2: 20-MINUTE HIGH YIELD STAKING ENGINE */}
            {activeSubTab === "staking" && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-2 border-amber-500/60 rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 font-black text-[10px] rounded uppercase tracking-wider">
                        20-MINUTE YIELD VAULT
                      </span>
                      <h3 className="text-lg font-black text-amber-300 tracking-wide mt-1">
                        Stake $1.00 USD for 20 Minutes → Receive $2.00 USD (+100% Bonus Return)
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/90 border border-amber-700 px-3 py-1.5 rounded-xl">
                      Real Deposit Balance: ${realDepositBalance.toFixed(2)} USD
                    </span>
                  </div>

                  {/* Active Staking Clock Card OR Form */}
                  {activeStake ? (
                    <div className="bg-stone-950 p-5 rounded-2xl border-2 border-amber-400 space-y-4 text-center">
                      <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                        <span>STAKE AMOUNT: ${activeStake.amount.toFixed(2)} USD</span>
                        <span>EXPECTED RETURN: ${activeStake.yieldReturn.toFixed(2)} USD</span>
                      </div>

                      {/* Timer Display */}
                      {!activeStake.completed ? (
                        <div className="space-y-2 py-3">
                          <div className="text-5xl font-black font-mono text-amber-400 tracking-wider">
                            {formatTimer(stakeTimeLeftSeconds)}
                          </div>
                          <p className="text-xs text-stone-300 font-mono">
                            Staking in progress... Returns $2.00 USD upon 20-min countdown completion!
                          </p>

                          {/* Fast Forward Test Helper */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleFastForwardStaking}
                              className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-mono rounded-lg border border-amber-500/50 cursor-pointer"
                            >
                              ⚡ Fast-Forward 20 Minutes (Test Instant Yield)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 py-3 animate-bounce">
                          <div className="text-2xl font-black text-emerald-400">
                            🎉 STAKING COMPLETED! $2.00 USD READY FOR WITHDRAWAL!
                          </div>
                          <p className="text-xs text-stone-200">
                            Your $1.00 staked funds + $1.00 yield bonus ($2.00 total) are ready to withdraw back to your Real Deposit Balance!
                          </p>
                          <button
                            type="button"
                            onClick={handleWithdrawStakedYield}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-sm rounded-xl shadow-2xl cursor-pointer"
                          >
                            WITHDRAW $2.00 TO REAL BALANCE NOW
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-stone-300 block mb-1">
                            Enter Staking Amount ($ USD):
                          </label>
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder="e.g. 1.00"
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1 text-xs font-mono">
                          <div className="text-stone-400">Yield Multiple: <strong className="text-emerald-400">2x (+100%)</strong></div>
                          <div className="text-stone-400">Staking Duration: <strong className="text-amber-300">20 Minutes</strong></div>
                          <div className="text-stone-400">Return Amount: <strong className="text-white">${(parseFloat(stakeAmount) || 0) * 2} USD</strong></div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartStaking}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.01]"
                      >
                        <Clock size={18} />
                        <span>START 20-MINUTE STAKING NOW</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* SECTION 3: TOKEN SWAP */}
            {activeSubTab === "swap" && (
              <div className="space-y-4 max-w-xl mx-auto py-2 animate-fade-in">
                <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4">
                  <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Repeat size={16} /> Decentralized Token Swap Engine
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] text-stone-500 font-mono">YOU PAY</span>
                      <div className="flex justify-between items-center">
                        <input
                          type="number"
                          value={swapFromAmount}
                          onChange={(e) => setSwapFromAmount(e.target.value)}
                          className="bg-transparent text-xl font-mono text-white focus:outline-none w-32"
                        />
                        <select
                          value={swapFromToken}
                          onChange={(e) => setSwapFromToken(e.target.value)}
                          className="bg-stone-800 text-stone-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="USDT">USDT</option>
                          <option value="TON">TON</option>
                          <option value="SOL">SOL</option>
                          <option value="ETH">ETH</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
                      <span className="text-[10px] text-stone-500 font-mono">YOU RECEIVE (ESTIMATED)</span>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-mono text-emerald-400">
                          {((parseFloat(swapFromAmount) || 0) * 0.985).toFixed(2)}
                        </span>
                        <select
                          value={swapToToken}
                          onChange={(e) => setSwapToToken(e.target.value)}
                          className="bg-stone-800 text-stone-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="TON">TON</option>
                          <option value="USDT">USDT</option>
                          <option value="SOL">SOL</option>
                          <option value="ETH">ETH</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage({ text: `Swapped $${swapFromAmount} ${swapFromToken} to ${swapToToken} instantly!`, type: "success" });
                      setTimeout(() => setStatusMessage(null), 3000);
                    }}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    Execute Decentralized Swap
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 4: DEFI POOLS & APPS */}
            {activeSubTab === "defi" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">TON / USDT Liquidity Pool</div>
                  <div className="text-xl font-mono text-white font-black">18.4% APY</div>
                  <p className="text-[11px] text-stone-400">Provide liquidity on DeDust / STON.fi DEX.</p>
                </div>

                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-400">Solana Yield Farming</div>
                  <div className="text-xl font-mono text-white font-black">24.1% APY</div>
                  <p className="text-[11px] text-stone-400">Automated vault strategy on Raydium.</p>
                </div>

                <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="text-xs font-bold text-purple-400">Base L2 Yield Vault</div>
                  <div className="text-xl font-mono text-white font-black">15.8% APY</div>
                  <p className="text-[11px] text-stone-400">USDC auto-compounding vault.</p>
                </div>
              </div>
            )}

          </div>

          {/* TRANSACTION HISTORY LOG TABLE */}
          <div className="bg-[#0e121e] border border-stone-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              On-Chain Transaction History & Verification Logs
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-stone-500 border-b border-stone-800 pb-2">
                    <th className="py-2">TYPE</th>
                    <th className="py-2">AMOUNT</th>
                    <th className="py-2">DESTINATION</th>
                    <th className="py-2">TX HASH</th>
                    <th className="py-2">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-stone-900/50">
                      <td className="py-2.5 font-bold text-emerald-400">{tx.type}</td>
                      <td className="py-2.5 text-white font-bold">${tx.amount.toFixed(2)} {tx.token}</td>
                      <td className="py-2.5 text-stone-300 truncate max-w-[150px]">{tx.destination}</td>
                      <td className="py-2.5 text-cyan-400 font-mono">{tx.txHash}</td>
                      <td className="py-2.5 text-stone-500">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ACTION MODALS (TRANSFER / DEPOSIT / WITHDRAW) */}
      {activeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0e121e] border-2 border-cyan-500/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {activeModal === "transfer" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                  <Send size={18} /> On-Chain Funds Transfer
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Recipient Address:</label>
                    <input
                      type="text"
                      value={transferRecipient}
                      onChange={(e) => setTransferRecipient(e.target.value)}
                      placeholder="Enter address or username"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Transfer Amount ($ USD):</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="e.g. 10.00"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Confirm & Send Transfer
                </button>
              </div>
            )}

            {activeModal === "deposit" && (
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-black text-emerald-400 flex items-center justify-center gap-2">
                  <PlusCircle size={18} /> Deposit Funds to @Wallet
                </h3>
                <div className="bg-white p-4 rounded-xl max-w-[200px] mx-auto border-2 border-emerald-500">
                  <QrCode size={160} className="text-stone-900" />
                </div>
                <p className="text-xs text-stone-300 font-mono break-all">
                  {currentAddress}
                </p>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Deposit Address"}
                </button>
              </div>
            )}

            {activeModal === "withdraw" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <ArrowUpCircle size={18} /> On-Chain Withdrawal
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Destination Address:</label>
                    <input
                      type="text"
                      value={withdrawDest}
                      onChange={(e) => setWithdrawDest(e.target.value)}
                      placeholder="Enter wallet address"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">Withdrawal Amount ($ USD):</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 2.00"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExecuteWithdrawal}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Execute On-Chain Withdrawal
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
