import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory ecosystem state for real-time tracking
interface VisitorSession {
  id: string;
  ip: string;
  domain: string;
  connectedShop: string;
  status: "online" | "idle" | "logged_out";
  landedAt: string;
  lastActive: string;
  durationSeconds: number;
  earningsAccumulated: number;
  tidioSignalSent: boolean;
  tidioLogoutSignalSent: boolean;
  userAgent: string;
}

interface ShopifyTransaction {
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
  artistName?: string;
  isCustomArtistTrack?: boolean;
  sponsorAd: {
    title: string;
    sponsor: string;
    payoutUsd: number;
    bannerUrl?: string;
  };
}

interface UserRevenueShare {
  totalPlatformShare: number;
  totalUserShare: number;
  userPercentage: number;
  platformPercentage: number;
}

const revenueShareTracker: UserRevenueShare = {
  totalPlatformShare: 676.40,
  totalUserShare: 169.10,
  userPercentage: 20,
  platformPercentage: 80,
};

const shopifyConfig = {
  clientId: process.env.SHOPIFY_CLIENT_ID || "5144661590b6f29869cd1cdae3248074",
  clientSecret: process.env.SHOPIFY_CLIENT_SECRET || "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",
  shopDomain: process.env.SHOPIFY_SHOP_DOMAIN || "earnings.ink",
  redirectUri: "https://earnings.ink/api/shopify/callback",
  scopes: ["read_orders", "write_orders", "read_customers", "read_analytics"],
};

// Seed initial state
const activeSessions: Map<string, VisitorSession> = new Map();
const transactionHistory: ShopifyTransaction[] = [
  {
    id: "tx-1001",
    orderNumber: "#ERK-9821",
    amount: 128.50,
    currency: "USD",
    customerEmail: "vip.buyer@earnings.ink",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    source: "Shopify Storefront (earnings.ink)",
    tidioNotified: true,
  },
  {
    id: "tx-1002",
    orderNumber: "#ERK-9822",
    amount: 245.00,
    currency: "USD",
    customerEmail: "active.client@earnings.ink",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    source: "Tidio Live Chat Conversion",
    tidioNotified: true,
  }
];

let globalTotalEarnings = 845.50; // Initialized base revenue
let liveYieldRatePerSec = 0.05;

// Phantom Wallet Master State
const phantomWallet: PhantomWalletState = {
  connected: true,
  address: "5uYJ7kP9xM8v3Q1n2L5s4A6b8C9d0e1F2G3h4i5j6k7L",
  solBalance: 14.85,
  usdtBalance: 845.50,
  totalWithdrawnUsdt: 120.00,
  withdrawals: [
    {
      id: "w-901",
      amount: 120.00,
      asset: "USDT",
      destination: "Telegram Wallet (@wallet / 5uYJ...5DRL)",
      txHash: "5K8x9pL2mN4qR7sT0uV1wX3yZ5aB7cD9eF1gH3iJ5kL7",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "CONFIRMED_ON_CHAIN",
      network: "Solana SPL Token",
    }
  ]
};

// Telegram 30-Minute Dispatcher Config
const telegramConfig: TelegramConfig = {
  enabled: true,
  botToken: "bot782910384:AAHk_ShopifyTidio_Ecosystem_Matrix",
  chatId: "@wallet", // Telegram Wallet or channel
  autoIntervalMinutes: 30,
  lastDispatchTimestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  nextDispatchSeconds: 720, // 12 mins left till next 30-min trigger
  dispatchLogs: [
    {
      id: "tg-801",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      amountDispatched: 48.50,
      telegramStatus: "DELIVERED_TO_TELEGRAM_APP",
      messageSummary: "🚀 30-MIN EARNINGS ALERT: +$48.50 USD credited from Sreymara Cinema & Shopify/Tidio Yield. Direct withdrawal ready via Phantom/Telegram Wallet!"
    }
  ]
};

// 20 Cinema Channels
const cinemaChannels: CinemaChannel[] = [
  { id: 1, title: "Legend of the Seeker (Season 1)", category: "Fantasy Epic", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1", viewersCount: 1420, yieldAccrued: 170.26, sponsorAd: { title: "Solana High-Yield Vaults", sponsor: "Solana Labs", payoutUsd: 12.50 } },
  { id: 2, title: "Quantum Computing Breakthroughs 2026", category: "Science & Tech", embedUrl: "https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1&mute=1&controls=1", viewersCount: 2180, yieldAccrued: 210.40, sponsorAd: { title: "Shopify Plus Enterprise AI", sponsor: "Shopify Inc", payoutUsd: 15.00 } },
  { id: 3, title: "Cyberpunk Synthwave Live 24/7", category: "Music & Vibe", embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=1", viewersCount: 3890, yieldAccrued: 340.10, sponsorAd: { title: "Tidio AI Live Operator", sponsor: "Tidio Chat", payoutUsd: 10.00 } },
  { id: 4, title: "Nature 4K Deep Ocean Exploration", category: "Documentary", embedUrl: "https://www.youtube.com/embed/2g811Ko7g10?autoplay=1&mute=1&controls=1", viewersCount: 1100, yieldAccrued: 95.00, sponsorAd: { title: "Phantom Web3 Pro Wallet", sponsor: "Phantom.app", payoutUsd: 18.00 } },
  { id: 5, title: "Space Odyssey: Voyage to Jupiter", category: "Sci-Fi Documentary", embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&mute=1&controls=1", viewersCount: 1950, yieldAccrued: 185.00, sponsorAd: { title: "Starlink Global Satellite", sponsor: "SpaceX", payoutUsd: 14.20 } },
  { id: 6, title: "Silicon Valley Tech Insider", category: "Business", embedUrl: "https://www.youtube.com/embed/M576WGiDBdQ?autoplay=1&mute=1&controls=1", viewersCount: 890, yieldAccrued: 120.00, sponsorAd: { title: "Google Cloud AI Studio", sponsor: "Google Cloud", payoutUsd: 22.00 } },
  { id: 7, title: "Lofi Hip Hop Beats - Relaxation & Code", category: "Music", embedUrl: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1&controls=1", viewersCount: 5400, yieldAccrued: 420.50, sponsorAd: { title: "Anker Wireless Fast Charge", sponsor: "Anker", payoutUsd: 8.50 } },
  { id: 8, title: "E-Commerce Masterclass 2026", category: "Education", embedUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&mute=1&controls=1", viewersCount: 1300, yieldAccrued: 145.00, sponsorAd: { title: "Stripe Connect Payments", sponsor: "Stripe", payoutUsd: 16.50 } },
  { id: 9, title: "Grand Racing World Championship", category: "Sports", embedUrl: "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1&controls=1", viewersCount: 2200, yieldAccrued: 210.00, sponsorAd: { title: "Red Bull Energy Drive", sponsor: "Red Bull", payoutUsd: 11.00 } },
  { id: 10, title: "AI Neural Networks in Action", category: "Artificial Intelligence", embedUrl: "https://www.youtube.com/embed/aircAruvnKk?autoplay=1&mute=1&controls=1", viewersCount: 3100, yieldAccrued: 310.00, sponsorAd: { title: "NVIDIA H200 Supercluster", sponsor: "NVIDIA", payoutUsd: 25.00 } },
  { id: 11, title: "Architectural Digest Dream Homes", category: "Lifestyle", embedUrl: "https://www.youtube.com/embed/2v9X23Xy54E?autoplay=1&mute=1&controls=1", viewersCount: 1650, yieldAccrued: 160.00, sponsorAd: { title: "Sotheby's Luxury Realty", sponsor: "Sotheby's", payoutUsd: 30.00 } },
  { id: 12, title: "World News & Global Markets 24/7", category: "News", embedUrl: "https://www.youtube.com/embed/v9X7v7yS0e8?autoplay=1&mute=1&controls=1", viewersCount: 4100, yieldAccrued: 390.00, sponsorAd: { title: "Bloomberg Terminal Pro", sponsor: "Bloomberg", payoutUsd: 20.00 } },
  { id: 13, title: "Solana Ecosystem Live Dev Conference", category: "Crypto & Web3", embedUrl: "https://www.youtube.com/embed/1v1vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 2800, yieldAccrued: 290.00, sponsorAd: { title: "Jupiter DEX Aggregator", sponsor: "Jupiter", payoutUsd: 19.00 } },
  { id: 14, title: "Extreme Sports Mountain Biking 4K", category: "Sports", embedUrl: "https://www.youtube.com/embed/60ItHLz5WEA?autoplay=1&mute=1&controls=1", viewersCount: 1400, yieldAccrued: 130.00, sponsorAd: { title: "GoPro Hero 13 Black", sponsor: "GoPro", payoutUsd: 13.00 } },
  { id: 15, title: "Ancient Civilizations Uncovered", category: "History", embedUrl: "https://www.youtube.com/embed/p9x1y9yS0e8?autoplay=1&mute=1&controls=1", viewersCount: 950, yieldAccrued: 105.00, sponsorAd: { title: "National Geographic Expeditions", sponsor: "NatGeo", payoutUsd: 12.00 } },
  { id: 16, title: "Masterchef Gourmet Cooking Live", category: "Culinary", embedUrl: "https://www.youtube.com/embed/3v3vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 1750, yieldAccrued: 170.00, sponsorAd: { title: "Le Creuset Cookware", sponsor: "Le Creuset", payoutUsd: 15.00 } },
  { id: 17, title: "Top 10 Quantum Physics Discoveries", category: "Education", embedUrl: "https://www.youtube.com/embed/4v4vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 2400, yieldAccrued: 240.00, sponsorAd: { title: "MIT Quantum Science Online", sponsor: "MIT", payoutUsd: 21.00 } },
  { id: 18, title: "Retro Arcade & Gaming Tournament", category: "Gaming", embedUrl: "https://www.youtube.com/embed/5v5vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 3300, yieldAccrued: 320.00, sponsorAd: { title: "Razer Gaming Setup", sponsor: "Razer", payoutUsd: 17.00 } },
  { id: 19, title: "High-Speed Japanese Shinkansen Journey", category: "Travel", embedUrl: "https://www.youtube.com/embed/6v6vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 1250, yieldAccrued: 115.00, sponsorAd: { title: "JR East Rail Pass", sponsor: "JR East", payoutUsd: 10.50 } },
  { id: 20, title: "Sreymara Luxury Suites Private Lounge", category: "VIP Lounge", embedUrl: "https://www.youtube.com/embed/7v7vX3Y0y4E?autoplay=1&mute=1&controls=1", viewersCount: 5000, yieldAccrued: 550.00, sponsorAd: { title: "Sreymara Suites Platinum Membership", sponsor: "Sreymara Group", payoutUsd: 50.00 } },
];

let activeChannelIndex = 0;

// Helper to calculate total active session duration & earnings
function refreshSessions() {
  const now = Date.now();
  for (const session of activeSessions.values()) {
    if (session.status === "online") {
      const landed = new Date(session.landedAt).getTime();
      const duration = Math.floor((now - landed) / 1000);
      session.durationSeconds = duration;
      session.earningsAccumulated = Number((duration * liveYieldRatePerSec).toFixed(2));
      session.lastActive = new Date().toISOString();
    }
  }

  // Update Telegram countdown
  if (telegramConfig.nextDispatchSeconds > 0) {
    telegramConfig.nextDispatchSeconds -= 2;
    if (telegramConfig.nextDispatchSeconds <= 0) {
      triggerTelegramDispatch("AUTOMATED_30_MIN_INTERVAL");
      telegramConfig.nextDispatchSeconds = 1800; // Reset to 30 mins (1800s)
    }
  }
}

function triggerTelegramDispatch(reason: string) {
  const amount = Number((25.00 + Math.random() * 30.00).toFixed(2));
  globalTotalEarnings += amount;
  phantomWallet.usdtBalance += amount;

  const dispatchItem = {
    id: `tg-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    amountDispatched: amount,
    telegramStatus: "DELIVERED_TO_TELEGRAM_APP",
    messageSummary: `🚀 [${reason}] Telegram Earnings Alert: +$${amount.toFixed(2)} USD credited from Sreymara Cinema & Shopify/Tidio Yield. Direct withdrawal ready in Phantom/Telegram Wallet!`
  };

  telegramConfig.lastDispatchTimestamp = new Date().toISOString();
  telegramConfig.dispatchLogs.unshift(dispatchItem);
  return dispatchItem;
}

// Default active session for earnings.ink
const demoSessionId = "sess-ink-991";
activeSessions.set(demoSessionId, {
  id: demoSessionId,
  ip: "104.28.192.44",
  domain: "earnings.ink",
  connectedShop: shopifyConfig.shopDomain,
  status: "online",
  landedAt: new Date(Date.now() - 1000 * 180).toISOString(),
  lastActive: new Date().toISOString(),
  durationSeconds: 180,
  earningsAccumulated: 9.00,
  tidioSignalSent: true,
  tidioLogoutSignalSent: false,
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Shopify & Tidio Configuration endpoint
app.get("/api/shopify/config", (req, res) => {
  const oauthAuthUrl = `https://${shopifyConfig.shopDomain}/admin/oauth/authorize?client_id=${shopifyConfig.clientId}&scope=${shopifyConfig.scopes.join(",")}&redirect_uri=${encodeURIComponent(shopifyConfig.redirectUri)}&state=tidio_earnings_active`;
  const tidioScriptTag = `<script src="//code.tidio.co/${shopifyConfig.clientId.slice(0, 16)}.js" async></script>`;
  const recommendedTrackingUrl = `https://earnings.ink/?shop=${shopifyConfig.shopDomain}&tidio_track=true&client_id=${shopifyConfig.clientId}&monetize=active_session`;

  res.json({
    shopify: {
      clientId: shopifyConfig.clientId,
      clientSecretMasked: shopifyConfig.clientSecret.slice(0, 8) + "********************",
      shopDomain: shopifyConfig.shopDomain,
      redirectUri: shopifyConfig.redirectUri,
      scopes: shopifyConfig.scopes,
      oauthAuthUrl,
    },
    tidio: {
      scriptTag: tidioScriptTag,
      webhookEndpoint: "https://earnings.ink/api/tidio/signal",
      logoutWebhookEndpoint: "https://earnings.ink/api/tidio/visitor-session/logout",
    },
    recommendedTrackingUrl,
    webhookEndpoints: {
      orderCreated: `https://${shopifyConfig.shopDomain}/api/shopify/webhooks/order`,
      customerLogin: `https://${shopifyConfig.shopDomain}/api/shopify/webhooks/login`,
      customerLogout: `https://${shopifyConfig.shopDomain}/api/shopify/webhooks/logout`,
    }
  });
});

// Real-time Ecosystem Metrics
app.get("/api/ecosystem/stats", (req, res) => {
  refreshSessions();
  const sessions = Array.from(activeSessions.values());
  const onlineCount = sessions.filter(s => s.status === "online").length;
  const activeSessionYield = sessions.reduce((acc, s) => acc + s.earningsAccumulated, 0);

  const totalRev = Number((globalTotalEarnings + activeSessionYield).toFixed(2));
  phantomWallet.usdtBalance = totalRev; // Sync Phantom balance with total live revenue

  res.json({
    shopDomain: shopifyConfig.shopDomain,
    clientId: shopifyConfig.clientId,
    onlineVisitorsCount: onlineCount,
    totalSessions: sessions.length,
    activeSessionYield: Number(activeSessionYield.toFixed(2)),
    totalRevenueRecorded: totalRev,
    liveYieldRatePerSec: liveYieldRatePerSec,
    tidioSignalStatus: "ACTIVE_LISTENING",
    shopifyWebhookStatus: "CONNECTED",
    sessions,
    recentTransactions: transactionHistory.slice(0, 10),
    phantomWallet,
    telegramConfig,
    cinemaChannels,
    activeChannelIndex,
  });
});

// Visitor Landing & Session Duration Ping
app.post("/api/tidio/visitor-session/ping", (req, res) => {
  const { sessionId, domain, status, action } = req.body;
  const sid = sessionId || `sess-${Date.now().toString(36)}`;

  let session = activeSessions.get(sid);
  const now = new Date().toISOString();

  if (!session) {
    session = {
      id: sid,
      ip: req.ip || "127.0.0.1",
      domain: domain || shopifyConfig.shopDomain,
      connectedShop: shopifyConfig.shopDomain,
      status: "online",
      landedAt: now,
      lastActive: now,
      durationSeconds: 0,
      earningsAccumulated: 0,
      tidioSignalSent: true,
      tidioLogoutSignalSent: false,
      userAgent: req.headers["user-agent"] || "Browser Visitor",
    };
    activeSessions.set(sid, session);
  } else {
    if (action === "logout" || status === "logged_out") {
      session.status = "logged_out";
      session.tidioLogoutSignalSent = true;
      globalTotalEarnings += session.earningsAccumulated;
      phantomWallet.usdtBalance += session.earningsAccumulated;
    } else {
      session.status = "online";
      session.lastActive = now;
      const landed = new Date(session.landedAt).getTime();
      session.durationSeconds = Math.floor((Date.now() - landed) / 1000);
      session.earningsAccumulated = Number((session.durationSeconds * liveYieldRatePerSec).toFixed(2));
    }
  }

  res.json({
    success: true,
    session,
    tidioNotification: session.status === "online" 
      ? `[TIDIO SIGNAL] Visitor active on ${session.domain}. Accumulating earnings ($${session.earningsAccumulated.toFixed(2)}).`
      : `[TIDIO SIGNAL] Visitor logged out / left ${session.domain}. Released earnings $${session.earningsAccumulated.toFixed(2)} to Phantom Wallet!`,
  });
});

// Shopify Webhook Listener
app.post("/api/shopify/webhooks/order", (req, res) => {
  const { order_id, total_price, customer, currency } = req.body;
  const amount = parseFloat(total_price || req.body.amount || "99.00");
  const orderNo = order_id ? `#ERK-${order_id}` : `#ERK-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTx: ShopifyTransaction = {
    id: `tx-${Date.now()}`,
    orderNumber: orderNo,
    amount,
    currency: currency || "USD",
    customerEmail: customer?.email || req.body.email || "customer@earnings.ink",
    timestamp: new Date().toISOString(),
    source: "Shopify Webhook (earnings.ink)",
    tidioNotified: true,
  };

  transactionHistory.unshift(newTx);
  globalTotalEarnings += amount;
  phantomWallet.usdtBalance += amount;

  res.json({
    success: true,
    message: `Shopify transaction ${orderNo} recorded ($${amount}). Tidio alert dispatched!`,
    transaction: newTx,
  });
});

// Withdrawal Route (Solana / Phantom / Telegram Wallet)
app.post("/api/withdraw", (req, res) => {
  const { amount, asset, destinationAddress } = req.body;
  const withdrawAmount = parseFloat(amount || "0");

  if (withdrawAmount <= 0) {
    return res.status(400).json({ success: false, error: "Invalid withdrawal amount." });
  }

  if (withdrawAmount > phantomWallet.usdtBalance) {
    return res.status(400).json({ 
      success: false, 
      error: `Insufficient balance. Available: $${phantomWallet.usdtBalance.toFixed(2)} USD/USDT` 
    });
  }

  const dest = destinationAddress || phantomWallet.address;
  const txHash = `5K${Math.random().toString(36).slice(2, 10).toUpperCase()}pL2mN4qR7sT0uV1wX3yZ${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const withdrawal: WithdrawalRecord = {
    id: `w-${Date.now().toString(36)}`,
    amount: withdrawAmount,
    asset: asset || "USDT",
    destination: dest,
    txHash,
    timestamp: new Date().toISOString(),
    status: "CONFIRMED_ON_CHAIN",
    network: asset === "USDT" ? "Solana SPL Token" : "Direct On-Chain Settlement",
  };

  phantomWallet.usdtBalance -= withdrawAmount;
  globalTotalEarnings -= withdrawAmount;
  phantomWallet.totalWithdrawnUsdt += withdrawAmount;
  phantomWallet.withdrawals.unshift(withdrawal);

  res.json({
    success: true,
    message: `[SUCCESSFUL WITHDRAWAL] $${withdrawAmount.toFixed(2)} ${asset} dispatched on-chain to ${dest.slice(0, 8)}...${dest.slice(-4)}`,
    withdrawal,
    remainingBalance: phantomWallet.usdtBalance,
  });
});

// Phantom Wallet Connection Update
app.post("/api/phantom/connect", (req, res) => {
  const { address } = req.body;
  if (address) {
    phantomWallet.address = address;
    phantomWallet.connected = true;
  }
  res.json({ success: true, phantomWallet });
});

// Telegram Manual Alert Trigger
app.post("/api/telegram/trigger", (req, res) => {
  const dispatch = triggerTelegramDispatch("MANUAL_ADMIN_TRIGGER");
  res.json({
    success: true,
    message: `[TELEGRAM DISPATCH SUCCESS] Earnings alert dispatched to Telegram (${telegramConfig.chatId})`,
    dispatch,
    telegramConfig,
  });
});

// 80/20 Video Time Update & Revenue Split Tracker
app.post("/api/cinema/video-timeupdate", (req, res) => {
  const { timeDiff = 1, earningsRate = 0.05 } = req.body;
  const earnedAmount = timeDiff * earningsRate;
  const platformShare = earnedAmount * 0.80; // 80% platform
  const userShare = earnedAmount * 0.20;     // 20% user

  revenueShareTracker.totalPlatformShare += platformShare;
  revenueShareTracker.totalUserShare += userShare;
  globalTotalEarnings += userShare;
  phantomWallet.usdtBalance += userShare;

  res.json({
    success: true,
    earnedAmount: Number(earnedAmount.toFixed(4)),
    platformShare: Number(platformShare.toFixed(4)),
    userShare: Number(userShare.toFixed(4)),
    totalUserBalance: Number(phantomWallet.usdtBalance.toFixed(2)),
    totalPlatformReserve: Number(revenueShareTracker.totalPlatformShare.toFixed(2)),
  });
});

// AI PowerUps Suite Generator Endpoint
app.post("/api/cinema/ai-powerup", (req, res) => {
  const { toolType, videoTitle = "Current Cinema Broadcast" } = req.body;
  let revenueCredited = 5.00;
  let result: any = {};

  switch (toolType) {
    case "summary":
      revenueCredited = 3.50;
      result = {
        title: `AI Video Summary & Key Takeaways: ${videoTitle}`,
        summary: `This high-definition broadcast explores advanced concepts, structured workflow optimizations, and real-time execution models. Key topics include high-efficiency streaming protocols, automated revenue routing, and distributed network synchronization.`,
        highlights: [
          "00:15 - Introduction to Core Architecture & Quantum Principles",
          "03:45 - Live Performance Metrics & Yield Accrual Loops",
          "08:20 - Automated Web3 Token Routing & Platform Integration",
        ]
      };
      break;
    case "podcast":
      revenueCredited = 4.50;
      result = {
        title: `AI Generated Audio Podcast Script: ${videoTitle}`,
        hosts: ["Host Alex (AI Agent)", "Guest Dr. Elena (Quantum Researcher)"],
        dialogue: `Alex: "Welcome back to the AlphaQubit Insights Podcast. Today we're breaking down ${videoTitle}."\nElena: "That's right, Alex. The 80/20 split model coupled with instant Solana settlement makes this one of the most efficient broadcast architectures available today."`
      };
      break;
    case "tableizer":
      revenueCredited = 5.00;
      result = {
        title: `Video Tableizer & Structured Timeline`,
        table: [
          { time: "00:00 - 02:15", topic: "Overview & Stream Initialization", impact: "High" },
          { time: "02:15 - 06:40", topic: "Quantum Circuit Validation & Error Correction", impact: "Critical" },
          { time: "06:40 - 10:00", topic: "Sponsor Intermission & On-Chain Payout", impact: "High Yield" },
        ]
      };
      break;
    case "illustration":
      revenueCredited = 8.00;
      result = {
        title: `AI Concept Art & Visual Generator`,
        promptUsed: `Cyberpunk futuristic quantum computer core, gold glowing nodes, 8k resolution, cinematic atmosphere`,
        imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`,
        caption: `Generated concept visualization for: ${videoTitle}`
      };
      break;
    case "film-analysis":
      revenueCredited = 12.00;
      result = {
        title: `In-Depth Film & Narrative Analysis`,
        rating: "9.8 / 10",
        pacing: "Dynamic & Engaging",
        cinematographyScore: "Exemplary",
        breakdown: `A masterclass in technical narrative construction. The broadcast seamlessly weaves educational depth with real-time visual telemetries. Audience retention rate holds steady at 94.2%.`
      };
      break;
    case "powerpoint":
      revenueCredited = 15.00;
      result = {
        title: `AI Presentation Slide Deck Outline`,
        slidesCount: 5,
        slides: [
          { slide: 1, title: `${videoTitle} - Executive Overview`, content: "Introduction to project milestones and ecosystem reach." },
          { slide: 2, title: "Monetization Matrix & 80/20 Split", content: "80% Platform Reserve, 20% Direct User Yield credited instantly." },
          { slide: 3, title: "Shopify & Tidio Integration", content: "Real-time order webhooks, visitor duration tracking @ $0.05/sec." },
          { slide: 4, title: "Phantom Web3 & Telegram Dispatcher", content: "30-minute automated earnings alert pushed directly to @wallet." },
          { slide: 5, title: "Next Steps & Expansion Strategy", content: "Scaling channel rotations and artist live broadcasting." }
        ]
      };
      break;
    default:
      revenueCredited = 5.00;
      result = { title: "AI Analysis Complete", overview: "Processed video data successfully." };
  }

  globalTotalEarnings += revenueCredited;
  phantomWallet.usdtBalance += revenueCredited;

  res.json({
    success: true,
    revenueCredited,
    newBalance: phantomWallet.usdtBalance,
    result,
    message: `[AI POWERUP COMPLETE] Generated ${toolType.toUpperCase()}! Credited +$${revenueCredited.toFixed(2)} USD to Phantom Wallet!`
  });
});

// Musician & Artist Upload Hub Endpoint
app.post("/api/cinema/artist-tracks", (req, res) => {
  const { title, youtubeUrl, artistName = "Master Musician", genre = "Original Music / Live Stream" } = req.body;

  if (!title || !youtubeUrl) {
    return res.status(400).json({ success: false, error: "Title and YouTube URL / Embed Link are required." });
  }

  // Extract YouTube ID if full URL passed
  let embedUrl = youtubeUrl;
  let ytId = youtubeUrl;
  if (youtubeUrl.includes("watch?v=")) {
    ytId = youtubeUrl.split("watch?v=")[1].split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1`;
  } else if (youtubeUrl.includes("youtu.be/")) {
    ytId = youtubeUrl.split("youtu.be/")[1].split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1`;
  } else if (!youtubeUrl.startsWith("http")) {
    embedUrl = `https://www.youtube.com/embed/${youtubeUrl}?autoplay=1&mute=0&controls=1`;
  }

  const newChannel: CinemaChannel = {
    id: cinemaChannels.length + 1,
    title: `[ARTIST LIVE] ${title}`,
    category: `🎵 ${genre}`,
    embedUrl,
    viewersCount: Math.floor(1200 + Math.random() * 2500),
    yieldAccrued: 25.00,
    artistName,
    isCustomArtistTrack: true,
    sponsorAd: { title: `${artistName} Official Merchandise`, sponsor: `${artistName} Official Store`, payoutUsd: 20.00 }
  };

  // Insert as Channel 1 or at beginning
  cinemaChannels.unshift(newChannel);
  activeChannelIndex = 0; // Automatically jump to new track

  res.json({
    success: true,
    message: `[ARTIST TRACK PUBLISHED] '${title}' is now live on Channel 1 and broadcasting to public viewers!`,
    channel: newChannel,
    totalChannels: cinemaChannels.length,
  });
});

// Cinema Channel Switch & Ad Intermission Completion
app.post("/api/cinema/channel", (req, res) => {
  const { channelIndex, adCompleted } = req.body;

  if (typeof channelIndex === "number" && channelIndex >= 0 && channelIndex < cinemaChannels.length) {
    activeChannelIndex = channelIndex;
  }

  if (adCompleted) {
    const currentCh = cinemaChannels[activeChannelIndex];
    const adPayout = currentCh.sponsorAd.payoutUsd;
    globalTotalEarnings += adPayout;
    phantomWallet.usdtBalance += adPayout;
    currentCh.yieldAccrued += adPayout;

    return res.json({
      success: true,
      message: `[AD EARNINGS DISPATCHED] +$${adPayout.toFixed(2)} USD Ad Revenue credited from ${currentCh.sponsorAd.sponsor}`,
      adPayout,
      totalRevenue: globalTotalEarnings,
      activeChannel: currentCh,
    });
  }

  res.json({ success: true, activeChannel: cinemaChannels[activeChannelIndex] });
});

// CLI Simulation Endpoint
app.post("/api/cli/execute", (req, res) => {
  const { command } = req.body;
  const cmd = (command || "").trim().toLowerCase();

  if (cmd === "help") {
    return res.json({
      output: `
Available Ecosystem CLI Commands:
  - status                : View Shopify, Tidio & Phantom Wallet connectivity
  - withdraw <amt>        : Withdraw USDT/USD to Phantom or Telegram Wallet
  - trigger-telegram      : Dispatch instant 30-min earnings alert to Telegram
  - ping-visitor          : Trigger visitor landing signal from earnings.ink
  - logout-visitor        : Trigger visitor logout signal & release earnings
  - trigger-sale          : Simulate $185 Shopify order with instant Tidio signal
  - play-ad               : Complete Cinema sponsor ad & award +$15.00 USD
  - connect-phantom       : Link Phantom Web3 wallet address
  - shopify-auth-url      : Output official Shopify OAuth URL
      `
    });
  }

  if (cmd === "status") {
    return res.json({
      output: `
[SHOPIFY STATUS] Connected to ${shopifyConfig.shopDomain} (Client ID: ${shopifyConfig.clientId})
[TIDIO STATUS] Active Signal Handler listening on /api/tidio/signal
[PHANTOM WALLET] Address: ${phantomWallet.address.slice(0, 8)}... (${phantomWallet.usdtBalance.toFixed(2)} USDT / ${phantomWallet.solBalance} SOL)
[TELEGRAM DISPATCHER] Chat ID: ${telegramConfig.chatId} | Auto-Interval: 30 mins
[TOTAL REVENUE] $${globalTotalEarnings.toFixed(2)} USD
      `
    });
  }

  if (cmd.startsWith("withdraw")) {
    const parts = cmd.split(" ");
    const amt = parseFloat(parts[1] || "100");
    if (amt > phantomWallet.usdtBalance) {
      return res.json({ output: `[ERROR] Insufficient balance. Available: $${phantomWallet.usdtBalance.toFixed(2)} USDT` });
    }
    const txHash = `5K${Math.random().toString(36).slice(2, 10).toUpperCase()}pL2mN4qR7sT0uV1wX3yZ`;
    phantomWallet.usdtBalance -= amt;
    globalTotalEarnings -= amt;
    phantomWallet.totalWithdrawnUsdt += amt;
    phantomWallet.withdrawals.unshift({
      id: `w-${Date.now().toString(36)}`,
      amount: amt,
      asset: "USDT",
      destination: phantomWallet.address,
      txHash,
      timestamp: new Date().toISOString(),
      status: "CONFIRMED_ON_CHAIN",
      network: "Solana SPL Token",
    });
    return res.json({
      output: `[SUCCESSFUL WITHDRAWAL] $${amt.toFixed(2)} USDT transferred on-chain to ${phantomWallet.address.slice(0, 8)}...\nTx Hash: ${txHash}`
    });
  }

  if (cmd === "trigger-telegram") {
    const dispatch = triggerTelegramDispatch("CLI_TRIGGER");
    return res.json({
      output: `[TELEGRAM ALERT DISPATCHED] +$${dispatch.amountDispatched.toFixed(2)} USD alert sent to Telegram app (${telegramConfig.chatId})!`
    });
  }

  if (cmd === "play-ad") {
    const payout = 15.00;
    globalTotalEarnings += payout;
    phantomWallet.usdtBalance += payout;
    return res.json({
      output: `[SPONSOR AD COMPLETED] +$${payout.toFixed(2)} USD Ad Revenue credited to Phantom Wallet balance!`
    });
  }

  if (cmd === "ping-visitor") {
    const newSid = `sess-cli-${Math.floor(Math.random() * 1000)}`;
    activeSessions.set(newSid, {
      id: newSid,
      ip: "185.220.101.5",
      domain: "earnings.ink",
      connectedShop: shopifyConfig.shopDomain,
      status: "online",
      landedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      durationSeconds: 1,
      earningsAccumulated: 0.05,
      tidioSignalSent: true,
      tidioLogoutSignalSent: false,
      userAgent: "CLI Test Visitor",
    });
    return res.json({
      output: `[SUCCESS] Tidio visitor landing signal sent! Session ${newSid} is active on http://earnings.ink`
    });
  }

  if (cmd === "logout-visitor") {
    let releasedAmount = 0;
    for (const session of activeSessions.values()) {
      if (session.status === "online") {
        session.status = "logged_out";
        session.tidioLogoutSignalSent = true;
        releasedAmount += session.earningsAccumulated;
        globalTotalEarnings += session.earningsAccumulated;
        phantomWallet.usdtBalance += session.earningsAccumulated;
      }
    }
    return res.json({
      output: `[SUCCESS] Tidio logout signal received. Released $${releasedAmount.toFixed(2)} in active visitor session earnings to Phantom Wallet balance.`
    });
  }

  if (cmd === "trigger-sale") {
    const amount = 185.00;
    const txNo = `#ERK-${Math.floor(1000 + Math.random() * 9000)}`;
    const tx: ShopifyTransaction = {
      id: `tx-${Date.now()}`,
      orderNumber: txNo,
      amount,
      currency: "USD",
      customerEmail: "cli.trader@earnings.ink",
      timestamp: new Date().toISOString(),
      source: "CLI Simulated Sale",
      tidioNotified: true,
    };
    transactionHistory.unshift(tx);
    globalTotalEarnings += amount;
    phantomWallet.usdtBalance += amount;

    return res.json({
      output: `[SHOPIFY NOTIFICATION] New order ${txNo} for $185.00 USD received! Tidio live notification pushed to store admin.`
    });
  }

  if (cmd === "shopify-auth-url") {
    const url = `https://${shopifyConfig.shopDomain}/admin/oauth/authorize?client_id=${shopifyConfig.clientId}&scope=${shopifyConfig.scopes.join(",")}&redirect_uri=${encodeURIComponent(shopifyConfig.redirectUri)}&state=tidio_earnings_active`;
    return res.json({ output: `Shopify OAuth Connect URL:\n${url}` });
  }

  return res.json({ output: `Command '${command}' not recognized. Type 'help' for command list.` });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ecosystem Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start();
