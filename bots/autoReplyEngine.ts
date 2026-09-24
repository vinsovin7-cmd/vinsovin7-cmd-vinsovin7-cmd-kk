// bots/autoReplyEngine.ts
import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.PROCESS_ENV_BOT_TOKEN;
export const LANDING_URL = "https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/";
export const MINI_APP_URL = "https://t.me/OnlineCustomerOptimizeTasksBot/sreymara";
export const TARGET_PAYOUT_WALLET = "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG";
export const ACTIVE_KEY = "5dd2...ecb2";

export let bot: Telegraf | null = null;

if (BOT_TOKEN) {
  try {
    bot = new Telegraf(BOT_TOKEN);

    // Handle all incoming messages across channels and chats
    bot.on('message', async (ctx: any) => {
      // Avoid responding to own bot outputs
      if (ctx.from && ctx.from.is_bot) return;

      const replyText = "🎯 **New High-Yield Quiz Challenge Available!**\nChoose an option below to engage and claim USDT rewards directly to your Telegram Wallet:";

      const inlineKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.webApp("➡️ Proceed & Play Quiz", MINI_APP_URL),
          Markup.button.callback("⏭️ Next / Quick Claim", "ACTION_NEXT_CLAIM")
        ]
      ]);

      await ctx.reply(replyText, { parse_mode: 'Markdown', ...inlineKeyboard }).catch((err: any) => {
        console.warn("Bot message reply warning:", err);
      });
    });

    // Callback handler for "Next / Quick Claim" button
    bot.action("ACTION_NEXT_CLAIM", async (ctx: any) => {
      await ctx.answerCbQuery("Processing micro-yield allocation...").catch(() => {});

      const baseUrl = `http://127.0.0.1:${process.env.PORT || 3000}`;

      // Trigger real-time ledger dispatch for "Next" interaction
      await fetch(`${baseUrl}/api/intelligence/telemetry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "INTERACTION_NEXT_BUTTON_CLICK",
          wallet: TARGET_PAYOUT_WALLET,
          yieldUSDT: 0.02,
          activeKey: ACTIVE_KEY,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn("Next button telemetry warning:", err));

      await ctx.reply(`✅ Micro-yield registered! Open the app to complete quests: ${MINI_APP_URL}`).catch(() => {});
    });
  } catch (err: any) {
    console.warn("[Telegraf] AutoReplyEngine initialization warning:", err.message);
  }
}

/**
 * Programmatic execution & simulation helper for the Dual-Button Engine
 */
export async function executeNextClaim(customWallet: string = TARGET_PAYOUT_WALLET) {
  const result = {
    event: "INTERACTION_NEXT_BUTTON_CLICK",
    wallet: customWallet,
    yieldUSDT: 0.02,
    activeKey: ACTIVE_KEY,
    timestamp: new Date().toISOString(),
    status: "PROCESSED",
    redirectUrl: MINI_APP_URL
  };

  const baseUrl = typeof window !== "undefined" ? "" : `http://127.0.0.1:${process.env.PORT || 3000}`;

  await fetch(`${baseUrl}/api/intelligence/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  }).catch(err => console.warn("Dual button telemetry sync error:", err));

  return result;
}
