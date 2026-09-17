import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ArrowDown,
  ArrowUpRight,
  ExternalLink,
  RotateCw,
  Maximize2,
  Minimize2,
  Lock,
  Copy,
  Check,
  ChevronRight,
  Phone,
  Video,
  Info,
  QrCode,
  Download,
  Share2,
  Sparkles
} from "lucide-react";

interface TelegramInEcosystemAppProps {
  onOpenPhoneLogin?: () => void;
  onOpenApkHub?: () => void;
  onOpenTonWallet?: () => void;
  initialChat?: "wallet" | "notifications" | "cinema" | "quantum";
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "service";
  senderName: string;
  text: string;
  timestamp: string;
  isWalletCard?: boolean;
  isCodeCard?: boolean;
  code?: string;
  amount?: number;
  token?: string;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  badge?: string;
  isVerified?: boolean;
  isBot?: boolean;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  pinned?: boolean;
}

export const TelegramInEcosystemApp: React.FC<TelegramInEcosystemAppProps> = ({
  onOpenPhoneLogin,
  onOpenApkHub,
  onOpenTonWallet,
  initialChat = "wallet"
}) => {
  const [activeChatId, setActiveChatId] = useState<string>(initialChat);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"ecosystem_app" | "web_k_proxy">("ecosystem_app");
  const [iframeKey, setIframeKey] = useState<number>(0);

  const tonAddress = "UQCEmPuekMNIhr5eIQRq-U9-UFPgtzi1WKGzRpjX-ctNHLNt";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat contacts list
  const contacts: ChatContact[] = [
    {
      id: "wallet",
      name: "Wallet",
      avatar: "💎",
      avatarBg: "bg-blue-600",
      isVerified: true,
      isBot: true,
      lastMessage: "Deposit Confirmed! Received 500.00 USDT on TON",
      time: "Just now",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "notifications",
      name: "Telegram Notifications",
      avatar: "✈️",
      avatarBg: "bg-sky-600",
      isVerified: true,
      lastMessage: "Login code: 84920. Do not give this code to anyone...",
      time: "10:30",
      unreadCount: 1,
      pinned: true
    },
    {
      id: "cinema",
      name: "Sreymara Cinema & VIP Studio",
      avatar: "🎬",
      avatarBg: "bg-amber-600",
      isVerified: true,
      lastMessage: "🎥 80/20 Video Revenue Stream: +$1,240.00 credited",
      time: "14:12"
    },
    {
      id: "quantum",
      name: "AlphaQubit Quantum Paper",
      avatar: "⚛️",
      avatarBg: "bg-purple-600",
      isVerified: true,
      lastMessage: "Nature Paper: Neural decoders for quantum surface codes published",
      time: "12:45"
    },
    {
      id: "saved",
      name: "Saved Messages",
      avatar: "📁",
      avatarBg: "bg-stone-700",
      lastMessage: `Connected Address: ${tonAddress}`,
      time: "Yesterday"
    },
    {
      id: "news",
      name: "Telegram News",
      avatar: "📢",
      avatarBg: "bg-sky-700",
      isVerified: true,
      lastMessage: "Mini Apps 2.0: Fullscreen mode, device motion, and subscription plans",
      time: "Sep 15"
    }
  ];

  // Dynamic message threads by chat ID
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    wallet: [
      {
        id: "w-1",
        sender: "bot",
        senderName: "Wallet (@wallet)",
        text: "👋 Welcome to Telegram @Wallet! Your wallet is permanently synchronized with the ecosystem TON treasury address UQCE...HLNt.",
        timestamp: "10:15"
      },
      {
        id: "w-2",
        sender: "bot",
        senderName: "Wallet (@wallet)",
        text: "💎 Live USDT & TON Jetton Balance Summary:",
        timestamp: "10:16",
        isWalletCard: true,
        amount: 1345.50,
        token: "USDT"
      },
      {
        id: "w-3",
        sender: "bot",
        senderName: "Wallet (@wallet)",
        text: "✅ Direct deposit of 500.00 USDT acknowledged from SAP Enterprise Integration via API Key 5dd2...ecb2. Credited immediately to your TON Jetton account!",
        timestamp: "Just now"
      }
    ],
    notifications: [
      {
        id: "n-1",
        sender: "service",
        senderName: "Telegram Notifications",
        text: "Official Service Notification: You requested an authentication code to log in to Telegram on a new web client or device.",
        timestamp: "10:29"
      },
      {
        id: "n-2",
        sender: "service",
        senderName: "Telegram Notifications",
        text: "Login code: 84920\n\nThis code can be used to log in to your Telegram account. We have not sent any SMS with this code.\n\nDo not give this code to anyone, even if they say they're from Telegram! This code can be used to delete your account. Having trouble? You can also log in using your phone and code.",
        timestamp: "10:30",
        isCodeCard: true,
        code: "84920"
      }
    ],
    cinema: [
      {
        id: "c-1",
        sender: "bot",
        senderName: "Sreymara Cinema Bot",
        text: "🎬 Sreymara Cinema & VIP Studio 80/20 Revenue share is active! Live visitor metrics and video plays generate continuous yield.",
        timestamp: "14:10"
      },
      {
        id: "c-2",
        sender: "bot",
        senderName: "Sreymara Cinema Bot",
        text: "🎥 Latest batch of viewer rewards: 25.00 USDT allocated to creator pool. Transferred directly to connected TON treasury.",
        timestamp: "14:12"
      }
    ],
    quantum: [
      {
        id: "q-1",
        sender: "bot",
        senderName: "AlphaQubit Research",
        text: "⚛️ Welcome to AlphaQubit Quantum Error Correction. Our Nature research demonstrated that Transformer neural decoders achieve higher fidelity on Sycamore surface codes than MWPM.",
        timestamp: "12:40"
      },
      {
        id: "q-2",
        sender: "bot",
        senderName: "AlphaQubit Research",
        text: "Check out the interactive Surface Code Decoder diagrams and real-time noise simulation in the Quantum tab above!",
        timestamp: "12:45"
      }
    ],
    saved: [
      {
        id: "s-1",
        sender: "user",
        senderName: "You",
        text: `Permanent Ecosystem TON Address: ${tonAddress}\nAPI Key: 5dd22e8e-0ba3-47f7-bb4b-ef1becb2\nOfficial CDN APK: cdn4.telesco.pe/file/Telegram.apk`,
        timestamp: "Yesterday"
      }
    ],
    news: [
      {
        id: "nw-1",
        sender: "bot",
        senderName: "Telegram News",
        text: "🚀 Telegram releases major updates to Web Apps: Telegram Mini Apps can now run fullscreen, access device orientation, send custom notifications, and natively process TON & USDT Jetton payments!",
        timestamp: "Sep 15"
      }
    ]
  });

  const activeContact = contacts.find(c => c.id === activeChatId) || contacts[0];
  const activeMessages = chatMessages[activeChatId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: "You",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updated = {
      ...chatMessages,
      [activeChatId]: [...(chatMessages[activeChatId] || []), newMsg]
    };
    setChatMessages(updated);
    setInputMessage("");

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Bot Auto-Response Simulation
    setTimeout(() => {
      let replyText = "Received. Your request has been acknowledged by the ecosystem node.";
      let isWallet = false;
      let amountVal: number | undefined;

      const lower = userText.toLowerCase();
      if (activeChatId === "wallet") {
        if (lower.includes("balance") || lower.includes("/balance") || lower.includes("usdt") || lower.includes("wallet")) {
          replyText = "💎 Current Telegram @Wallet Balance: 1,345.50 USDT + 12.45 TON. Synchronized on-chain with address UQCE...HLNt.";
          isWallet = true;
          amountVal = 1345.50;
        } else if (lower.includes("send") || lower.includes("pay")) {
          replyText = "To send USDT, tap 'Send USDT' on the wallet card above, or use the Telegram @Wallet tab in the Ecosystem.";
        } else if (lower.includes("/start")) {
          replyText = "👋 Telegram @Wallet is active! Send, receive, and store USDT & TON with 0% fee on internal transfers.";
          isWallet = true;
          amountVal = 1345.50;
        } else {
          replyText = `Understood: "${userText}". Telegram @Wallet bot is ready to process your on-chain operations.`;
        }
      } else if (activeChatId === "notifications") {
        replyText = "Telegram service notifications is an official automated channel. You cannot reply directly to this chat.";
      } else if (activeChatId === "cinema") {
        replyText = "🎬 Sreymara Cinema Bot: Tracking visitor engagement and 80/20 royalty payouts in real-time.";
      } else if (activeChatId === "quantum") {
        replyText = "⚛️ AlphaQubit AI decoder active: Sycamore 53-qubit lattice noise model verified.";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        senderName: activeContact.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isWalletCard: isWallet,
        amount: amountVal,
        token: "USDT"
      };

      setChatMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), botMsg]
      }));

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 800);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    if (onOpenPhoneLogin) {
      onOpenPhoneLogin();
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tonAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className={`w-full rounded-2xl border border-stone-800 bg-[#0e1621] overflow-hidden shadow-2xl transition-all duration-300 ${
      isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)]" : "h-[740px]"
    }`}>
      {/* Top Application Bar */}
      <div className="h-14 bg-[#17212b] border-b border-stone-800/80 px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white text-sm font-black shadow-md">
            ✈️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wide">
                Telegram v11.4.2
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono border border-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ECOSYSTEM RUNTIME
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 bg-sky-950 text-sky-300 rounded text-[9px] font-mono border border-sky-800">
                CDN4 APK INSTALLED
              </span>
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-2">
              <span>Connected via MTProto WASM Engine</span>
              <span className="text-stone-600">•</span>
              <span className="text-emerald-400 font-mono">Bound: UQCE...HLNt</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Ecosystem App vs Web K */}
          <div className="hidden md:flex bg-black/50 p-1 rounded-xl border border-stone-800 text-[11px] font-bold">
            <button
              onClick={() => setViewMode("ecosystem_app")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "ecosystem_app" ? "bg-sky-600 text-white shadow" : "text-stone-400 hover:text-white"
              }`}
            >
              Ecosystem App (Active)
            </button>
            <button
              onClick={() => setViewMode("web_k_proxy")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "web_k_proxy" ? "bg-sky-600 text-white shadow" : "text-stone-400 hover:text-white"
              }`}
            >
              Web K Frame
            </button>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs transition-all border border-stone-700 cursor-pointer flex items-center gap-1"
            title="Scan Telegram QR Code to Link Mobile Device"
          >
            <QrCode size={14} className="text-sky-400" />
            <span className="text-[11px] hidden sm:inline">QR Sync</span>
          </button>

          {onOpenTonWallet && (
            <button
              onClick={onOpenTonWallet}
              className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-800 cursor-pointer flex items-center gap-1.5 shadow"
              title="Open Connected Telegram @Wallet Jetton Treasury"
            >
              <Wallet size={13} className="text-blue-400" />
              <span>@Wallet</span>
              <span className="px-1.5 py-0.2 bg-black/40 text-blue-200 rounded text-[9px] font-mono">1,345.50</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs transition-all border border-stone-700 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen App"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <a
            href="https://web.telegram.org/k/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-sky-950 hover:bg-sky-900 text-sky-300 hover:text-white rounded-xl text-xs transition-all border border-sky-700 cursor-pointer"
            title="Open Telegram Web in External Window"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "web_k_proxy" ? (
        <div className="w-full h-[calc(100%-3.5rem)] relative bg-[#0e1621] flex flex-col">
          <div className="p-3 bg-amber-950/40 border-b border-amber-800/50 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-amber-400" />
              <span>
                External browser frames to <code>web.telegram.org</code> may be blocked by browser frame isolation policies. If you see a refused connection, switch back to <strong>Ecosystem App</strong> above.
              </span>
            </div>
            <button
              onClick={() => setViewMode("ecosystem_app")}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
            >
              Return to Ecosystem App
            </button>
          </div>
          <iframe
            key={iframeKey}
            src="https://web.telegram.org/k/"
            title="Official Telegram Web K"
            className="w-full flex-1 border-0"
            allow="camera; microphone; geolocation; clipboard-read; clipboard-write; autoplay; encrypted-media; fullscreen"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
          />
        </div>
      ) : (
        <div className="w-full h-[calc(100%-3.5rem)] flex overflow-hidden">
          {/* Left Column: Chats List */}
          <div className="w-80 sm:w-88 border-r border-stone-800/80 bg-[#17212b] flex flex-col shrink-0">
            {/* Search Input */}
            <div className="p-3 border-b border-stone-800/60">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats, bots, channels..."
                  className="w-full pl-9 pr-4 py-2 bg-[#242f3d] rounded-xl text-xs text-stone-200 placeholder:text-stone-500 border border-transparent focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Chats Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-800/30">
              {contacts
                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((contact) => {
                  const isActive = contact.id === activeChatId;
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setActiveChatId(contact.id)}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#2b5278] text-white"
                          : "hover:bg-[#202b36] text-stone-300"
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`w-11 h-11 rounded-full ${contact.avatarBg} flex items-center justify-center text-lg font-bold shrink-0 shadow`}>
                        {contact.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs font-bold truncate">
                              {contact.name}
                            </span>
                            {contact.isVerified && (
                              <CheckCircle2 size={12} className={isActive ? "text-sky-200" : "text-sky-400"} />
                            )}
                          </div>
                          <span className={`text-[10px] font-mono shrink-0 ${isActive ? "text-sky-200" : "text-stone-500"}`}>
                            {contact.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-[11px] truncate ${isActive ? "text-stone-200" : "text-stone-400"}`}>
                            {contact.lastMessage}
                          </p>
                          {contact.unreadCount && !isActive && (
                            <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-1">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Bottom Quick Hub */}
            <div className="p-3 bg-[#111822] border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <button
                onClick={onOpenApkHub}
                className="hover:text-amber-400 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Download size={13} className="text-amber-400" />
                <span>APK Node (72MB)</span>
              </button>
              <button
                onClick={onOpenPhoneLogin}
                className="hover:text-sky-400 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Phone size={13} className="text-sky-400" />
                <span>Phone Auth</span>
              </button>
            </div>
          </div>

          {/* Right Column: Chat History & Interactive Composer */}
          <div className="flex-1 bg-[#0e1621] flex flex-col min-w-0">
            {/* Active Chat Header */}
            <div className="h-14 bg-[#17212b] border-b border-stone-800/80 px-4 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full ${activeContact.avatarBg} flex items-center justify-center text-base shrink-0`}>
                  {activeContact.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white truncate">
                      {activeContact.name}
                    </span>
                    {activeContact.isVerified && (
                      <CheckCircle2 size={13} className="text-sky-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-sky-400 font-mono">
                    {activeContact.isBot ? "bot • official service" : "verified chat • online"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-400">
                {activeContact.id === "wallet" && onOpenTonWallet && (
                  <button
                    onClick={onOpenTonWallet}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Full Wallet View</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
                {activeContact.id === "notifications" && onOpenPhoneLogin && (
                  <button
                    onClick={onOpenPhoneLogin}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1"
                  >
                    <span>Fill in Phone Login</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
                <button className="p-1.5 hover:text-white rounded-lg hover:bg-stone-800">
                  <Search size={15} />
                </button>
                <button className="p-1.5 hover:text-white rounded-lg hover:bg-stone-800">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0e1621] via-[#0c131c] to-[#0a1017]">
              {activeMessages.map((msg) => {
                const isMe = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
                  >
                    <div className="text-[10px] font-mono text-stone-500 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </div>

                    {/* Standard Text Bubble */}
                    <div
                      className={`max-w-md lg:max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg whitespace-pre-line ${
                        isMe
                          ? "bg-[#2b5278] text-white rounded-tr-none"
                          : "bg-[#182533] text-stone-200 border border-stone-800/80 rounded-tl-none"
                      }`}
                    >
                      {msg.text}

                      {/* Official Verification Code Card */}
                      {msg.isCodeCard && msg.code && (
                        <div className="mt-3 p-3.5 bg-sky-950/80 rounded-xl border border-sky-700/80 text-center space-y-2">
                          <div className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                            TELEGRAM ONE-TIME LOGIN CODE
                          </div>
                          <div className="text-2xl font-mono font-black text-white tracking-[0.25em] bg-black/50 py-2 rounded-lg border border-sky-800">
                            {msg.code}
                          </div>
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <button
                              onClick={() => handleCopyCode(msg.code!)}
                              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                            >
                              {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                              <span>{copiedCode ? "Copied!" : "Copy Code & Log In"}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Telegram @Wallet Interactive Card */}
                      {msg.isWalletCard && (
                        <div className="mt-3 p-4 bg-gradient-to-br from-[#101c30] to-[#0a1222] rounded-xl border border-blue-800/80 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Wallet size={16} className="text-blue-400" />
                              <span className="font-bold text-white text-xs">USDT & TON Balance</span>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[9px] font-mono font-bold border border-emerald-700">
                              APY 5.2% ACTIVE
                            </span>
                          </div>

                          <div className="p-3 bg-black/50 rounded-xl border border-blue-900/40">
                            <div className="text-[10px] text-stone-400 font-mono">Total Balance (USDT)</div>
                            <div className="text-xl font-bold font-mono text-emerald-400">
                              $1,345.50 <span className="text-xs text-stone-400 font-sans">USDT</span>
                            </div>
                            <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                              + 12.4500 TON ($67.23 USD)
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-stone-400 break-all bg-black/30 p-2 rounded border border-stone-800 flex items-center justify-between">
                            <span className="truncate">TON: {tonAddress}</span>
                            <button
                              onClick={handleCopyAddress}
                              className="text-sky-400 hover:text-white shrink-0 ml-2 cursor-pointer"
                              title="Copy TON Address"
                            >
                              {copiedAddress ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {onOpenTonWallet && (
                              <button
                                onClick={onOpenTonWallet}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                              >
                                <ArrowUpRight size={13} />
                                <span>Send USDT</span>
                              </button>
                            )}
                            <button
                              onClick={() => setShowQrModal(true)}
                              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border border-stone-700"
                            >
                              <QrCode size={13} className="text-emerald-400" />
                              <span>Receive / QR</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Composer Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#17212b] border-t border-stone-800/80 flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-[#202b36] transition-all cursor-pointer"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Write a message to ${activeContact.name}... (Try: /balance, /wallet, /start)`}
                className="flex-1 px-4 py-2.5 bg-[#242f3d] rounded-xl text-xs text-white placeholder:text-stone-500 border border-transparent focus:border-sky-500 focus:outline-none font-sans"
              />

              <button
                type="button"
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-[#202b36] transition-all cursor-pointer"
                title="Emoji"
              >
                <Smile size={18} />
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center"
                title="Send Message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Sync Dialog */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17212b] border border-stone-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-700 text-sky-400 flex items-center justify-center mx-auto text-xl">
              ✈️
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Scan with Telegram App
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Open Telegram on your phone → Settings → Devices → Link Desktop Device
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-xl inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent("tg://login?token=alphaqubit_ecosystem_ton_sync_v11")}`}
                alt="Telegram QR Login"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>

            <p className="text-[11px] text-stone-400">
              Synchronizes contacts, Telegram @Wallet balances, and active channels with your ecosystem runtime.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowQrModal(false)}
                className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  if (onOpenPhoneLogin) onOpenPhoneLogin();
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Use Phone Number Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
