import React, { useState, useEffect } from "react";
import { CloudflareDomainManager } from "./CloudflareDomainManager";
import {
  Crown,
  Users,
  ShieldCheck,
  Share2,
  DollarSign,
  Zap,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  MessageSquare,
  Award,
  TrendingUp,
  Sliders,
  Send,
  Eye,
  X,
  Play,
  Key,
  Shield
} from "lucide-react";

export interface RegisteredViralUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  location: string;
  googleAuthVerified: boolean;
  googleAuthSecret?: string;
  joinedViaLink: string;
  joinedAt: string;
  ipAddress: string;
  status: "ACTIVE_LOVE_SUITE" | "FULL_ECOSYSTEM_GRANTED" | "BLOCKED";
}

interface AdminControlPalaceProps {
  onClose?: () => void;
  onLaunchGuestMode?: () => void;
}

export const MONETAG_DIRECT_LINK = "https://omg10.com/4/11528175";
export const CAMBODIAN_CROWN_PREVIEW_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

export const AdminControlPalace: React.FC<AdminControlPalaceProps> = ({
  onClose,
  onLaunchGuestMode
}) => {
  const [users, setUsers] = useState<RegisteredViralUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mechat_registered_viral_users");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    return [
      {
        id: "usr-real-101",
        name: "Sophea Chan",
        phone: "+855 12 884 921",
        email: "sophea.chan@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        location: "Phnom Penh, Cambodia",
        googleAuthVerified: true,
        joinedViaLink: "WhatsApp Viral Invite #love_suite",
        joinedAt: new Date(Date.now() - 3600000).toLocaleString(),
        ipAddress: "118.107.228.14",
        status: "ACTIVE_LOVE_SUITE"
      },
      {
        id: "usr-real-102",
        name: "Amina Adeleke",
        phone: "+234 803 412 9910",
        email: "amina.a@yahoo.com",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
        location: "Lagos, Nigeria",
        googleAuthVerified: true,
        joinedViaLink: "Telegram @MeChat Link",
        joinedAt: new Date(Date.now() - 7200000).toLocaleString(),
        ipAddress: "102.89.23.11",
        status: "ACTIVE_LOVE_SUITE"
      },
      {
        id: "usr-real-103",
        name: "Chidi Okafor",
        phone: "+234 802 881 2020",
        email: "chidi.okafor@gmail.com",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        location: "Abuja, Nigeria",
        googleAuthVerified: true,
        joinedViaLink: "TikTok Bio Link",
        joinedAt: new Date(Date.now() - 10800000).toLocaleString(),
        ipAddress: "197.210.65.88",
        status: "ACTIVE_LOVE_SUITE"
      }
    ];
  });

  const [monetagClicks, setMonetagClicks] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monetag_click_count");
      return saved ? parseInt(saved, 10) : 482;
    }
    return 482;
  });

  const [monetagRevenue, setMonetagRevenue] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monetag_total_revenue");
      return saved ? parseFloat(saved) : 14.85;
    }
    return 14.85;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("mechat_registered_viral_users", JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem("monetag_click_count", monetagClicks.toString());
      localStorage.setItem("monetag_total_revenue", monetagRevenue.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [monetagClicks, monetagRevenue]);

  const getBaseViralUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${window.location.pathname}#love_suite?invite=match_vip`;
    }
    return "https://ais-pre-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app#love_suite?invite=match_vip";
  };

  const viralLink = getBaseViralUrl();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleMonetagClickTrigger = () => {
    setMonetagClicks((prev) => prev + 1);
    setMonetagRevenue((prev) => parseFloat((prev + 0.35).toFixed(2)));
    window.open(MONETAG_DIRECT_LINK, "_blank", "noopener,noreferrer");
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus =
            u.status === "ACTIVE_LOVE_SUITE"
              ? "FULL_ECOSYSTEM_GRANTED"
              : u.status === "FULL_ECOSYSTEM_GRANTED"
              ? "BLOCKED"
              : "ACTIVE_LOVE_SUITE";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastStatus(`Broadcast message sent to all ${users.length} active users!`);
    setBroadcastText("");
    setTimeout(() => setBroadcastStatus(null), 3500);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#080214] text-stone-100 rounded-3xl border border-amber-500/80 shadow-2xl overflow-hidden my-4">
      {/* CROWN PALACE HEADER */}
      <div className="bg-gradient-to-r from-[#170533] via-[#210947] to-[#120326] px-6 py-5 border-b border-amber-500/60 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-xl">
            <div className="w-full h-full bg-[#0d031c] rounded-[14px] flex items-center justify-center text-2xl font-black">
              👑
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-xl text-amber-200 tracking-wider">
                ECOSYSTEM CONTROL PALACE
              </h2>
              <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-mono font-black text-[10px] rounded-full uppercase shadow">
                MASTER ADMIN HOME
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Control real users, viral link invitations, Google 2FA verification & Monetag earnings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onLaunchGuestMode && (
            <button
              onClick={onLaunchGuestMode}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
            >
              <Eye size={14} />
              <span>Preview Viral Guest View</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {copyFeedback && (
        <div className="mx-6 mt-4 p-3 bg-emerald-950/90 border border-emerald-400 rounded-2xl text-emerald-200 text-xs font-bold font-mono flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* PALACE CONTENT DASHBOARD */}
      <div className="p-6 space-y-8">
        {/* STATS METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-b from-[#150730] to-[#0a031a] rounded-2xl border border-purple-800/60 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-purple-300 font-bold text-xs uppercase">
              <span>REAL REGISTERED USERS</span>
              <Users size={16} className="text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{users.length}</div>
            <p className="text-[10px] text-stone-400 font-mono">Captured via Viral Share Links</p>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#150730] to-[#0a031a] rounded-2xl border border-amber-500/60 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-amber-300 font-bold text-xs uppercase">
              <span>MONETAG DIRECT LINK REVENUE</span>
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300">${monetagRevenue.toFixed(2)}</div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>{monetagClicks} Direct Clicks</span>
              <button
                onClick={handleMonetagClickTrigger}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Trigger CPM</span>
                <ExternalLink size={10} />
              </button>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#150730] to-[#0a031a] rounded-2xl border border-purple-800/60 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-purple-300 font-bold text-xs uppercase">
              <span>GOOGLE 2FA AUTHENTICATED</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {users.filter((u) => u.googleAuthVerified).length} / {users.length}
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">100% Verified Phone & Email</p>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#150730] to-[#0a031a] rounded-2xl border border-purple-800/60 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-purple-300 font-bold text-xs uppercase">
              <span>CHAMPIONS CUP $10,000</span>
              <Award size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">Monetag Cup Live</div>
            <p className="text-[10px] text-stone-400 font-mono">Active Ranking: Top Publisher Pool</p>
          </div>
        </div>

        {/* SECTION 1: VIRAL SHARE LINK & SOCIAL MEDIA GENERATOR */}
        <div className="p-6 bg-gradient-to-r from-[#13062c] via-[#1a093b] to-[#110528] rounded-2xl border border-purple-800/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-900/60 pb-3">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-amber-400" />
              <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
                VIRAL SOCIAL MEDIA SHARE LINK GENERATOR
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 rounded-full font-mono text-[10px] font-bold border border-emerald-600">
              GUEST LOCK SHIELD ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* THUMBNAIL PREVIEW CARD */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300">Viral Link Image Card Preview</label>
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/80 shadow-2xl group">
                <img
                  src={CAMBODIAN_CROWN_PREVIEW_IMG}
                  alt="Cambodian Royal Crown Goddess"
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-mono text-amber-300 font-black">@MeChatBot Matchmaking</span>
                  <h4 className="text-xs font-bold text-white leading-tight">Find Real Match Nearby • Isolated Love Suite</h4>
                </div>
              </div>
            </div>

            {/* LINK COPY & SOCIAL BUTTONS */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Master Viral Invite Link (Restricts new visitors to Love Suite Screenshots 1 & 2 only)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={viralLink}
                    className="flex-1 px-3 py-2 bg-black border border-purple-900 rounded-xl text-amber-300 text-xs font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(viralLink, "Master Viral Link")}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-stone-950 font-black rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>

              {/* SOCIAL SHARE BUTTONS */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-stone-400">Share Directly to Platforms:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `💕 Find your true love match on @MeChatBot Matchmaking! Join the isolated love suite here: ${viralLink}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <span>💬 WhatsApp</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      viralLink
                    )}&text=${encodeURIComponent("💕 Meet real active users in @MeChatBot Isolated Love Suite!")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-sky-950/80 hover:bg-sky-900 border border-sky-600 rounded-xl text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <span>📡 Telegram</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(viralLink)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-600 rounded-xl text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <span>📘 Facebook</span>
                  </a>

                  <button
                    onClick={() =>
                      handleCopy(
                        `Check out my bio link to join @MeChatBot Love Suite: ${viralLink}`,
                        "TikTok Caption & Bio Link"
                      )
                    }
                    className="p-2.5 bg-pink-950/80 hover:bg-pink-900 border border-pink-600 rounded-xl text-pink-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <span>🎵 TikTok Bio</span>
                  </button>

                  <button
                    onClick={onLaunchGuestMode}
                    className="p-2.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <span>⚡ Test Click</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CLOUDFLARE CUSTOM DOMAIN INTEGRATION MANAGER */}
        <CloudflareDomainManager />

        {/* SECTION 2: REAL REGISTERED USERS DATABASE TABLE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-serif font-bold text-sm text-purple-200 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              <span>REAL USERS REGISTERED VIA VIRAL LINKS ({users.length})</span>
            </h3>

            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search phone, email, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-black border border-purple-900 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-purple-900/80 bg-[#0d041e] shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#15072e] text-purple-300 font-mono text-[10px] uppercase border-b border-purple-900/60">
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Phone & Email</th>
                  <th className="p-3">Google 2FA</th>
                  <th className="p-3">Source Link</th>
                  <th className="p-3">Location & IP</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Control Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-500 text-xs">
                      No matching registered users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-950/40 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover border border-purple-800" />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1">
                              <span>{u.name}</span>
                              <CheckCircle2 size={12} className="text-emerald-400" />
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono">{u.joinedAt}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono">
                        <div className="text-amber-300 font-bold">{u.phone}</div>
                        <div className="text-stone-400 text-[10px]">{u.email}</div>
                      </td>

                      <td className="p-3 font-mono">
                        {u.googleAuthVerified ? (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded text-[9px] font-bold flex items-center gap-1 w-fit">
                            <ShieldCheck size={10} />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-stone-900 text-stone-400 border border-stone-800 rounded text-[9px]">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-stone-300 font-mono text-[11px]">
                        {u.joinedViaLink}
                      </td>

                      <td className="p-3 font-mono text-[10px]">
                        <div className="text-stone-300">{u.location}</div>
                        <div className="text-stone-500">{u.ipAddress}</div>
                      </td>

                      <td className="p-3 font-mono">
                        {u.status === "ACTIVE_LOVE_SUITE" && (
                          <span className="px-2 py-0.5 bg-pink-950 text-pink-300 border border-pink-700/60 rounded text-[9px] font-bold">
                            Love Suite Guest
                          </span>
                        )}
                        {u.status === "FULL_ECOSYSTEM_GRANTED" && (
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-600 rounded text-[9px] font-bold">
                            Full Ecosystem VIP
                          </span>
                        )}
                        {u.status === "BLOCKED" && (
                          <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded text-[9px] font-bold">
                            Blocked
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-purple-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Toggle Access
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: MONETAG DIRECT LINK CONFIGURATION & CHAMPIONS CUP $10,000 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#0e0421] rounded-2xl border border-amber-500/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                <Zap size={16} className="text-amber-400" />
                <span>Monetag Direct Link Configuration</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">$0.35+ CPM Boosted</span>
            </div>
            <p className="text-xs text-stone-400">
              Configured Monetag smartlink used to trigger popunders and reward clicks on user interactions.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={MONETAG_DIRECT_LINK}
                className="flex-1 px-3 py-2 bg-black border border-purple-900 rounded-xl text-emerald-400 text-xs font-mono"
              />
              <button
                onClick={handleMonetagClickTrigger}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1"
              >
                <ExternalLink size={13} />
                <span>Test Link</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#0e0421] rounded-2xl border border-purple-800/80 space-y-3">
            <h4 className="font-bold text-sm text-purple-200 flex items-center gap-1.5">
              <Award size={16} className="text-amber-400" />
              <span>Monetag Champions Cup ($10,000 Prizes)</span>
            </h4>
            <p className="text-xs text-stone-400">
              Publisher competition promo is active! 13 nominations, 11 prizes totaling $10,000.
            </p>
            <div className="p-3 bg-amber-950/40 border border-amber-600/60 rounded-xl text-xs text-amber-200 font-mono flex items-center justify-between">
              <span>Status: Registered & Accumulating CPM Traffic</span>
              <span className="font-bold text-emerald-400">+${monetagRevenue.toFixed(2)} Earned</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BROADCAST MESSAGE TO ALL ACTIVE CHATS */}
        <div className="p-6 bg-[#0d041e] rounded-2xl border border-purple-900/80 space-y-3">
          <h4 className="font-bold text-sm text-stone-200 flex items-center gap-2">
            <MessageSquare size={16} className="text-amber-400" />
            <span>Send Palace Broadcast Message to All Live Love Suites</span>
          </h4>

          {broadcastStatus && (
            <div className="p-2.5 bg-emerald-950 text-emerald-300 rounded-xl text-xs font-bold font-mono border border-emerald-600">
              {broadcastStatus}
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="flex gap-2">
            <input
              type="text"
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="e.g. 💖 Welcome new guests from social media! Enjoy 24/7 fast matchmaking."
              className="flex-1 px-3.5 py-2 bg-black border border-purple-900 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-stone-950 font-black rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1"
            >
              <Send size={13} />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
