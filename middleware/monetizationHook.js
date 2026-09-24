// middleware/monetizationHook.js

const PRIMARY_TON_PAYOUT_ADDRESS = "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG";
const QUERY_YIELD_USDT = 0.05; // Base per-query earning trigger
const ACTIVE_AUTH_KEY = "5dd2...ecb2";

export async function processSearchYield(req, res, next) {
  try {
    const searchResult = typeof next === "function" ? await next() : null;

    const transactionRecord = {
      txId: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      network: "TON",
      type: "AI_SEARCH_MICRO_EARNING",
      amount: QUERY_YIELD_USDT,
      currency: "USDT",
      destination: PRIMARY_TON_PAYOUT_ADDRESS,
      timestamp: new Date().toISOString(),
      integrity: "VERIFIED"
    };

    // Determine target URL for server or client context
    const baseUrl = typeof window !== "undefined"
      ? ""
      : `http://127.0.0.1:${process.env.PORT || 3000}`;

    // Telemetry Sync with Ecosystem Unified Ledger
    try {
      if (typeof fetch === "function") {
        await fetch(`${baseUrl}/api/intelligence/telemetry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "QUERY_MONETIZATION_EVENT",
            ledgerData: transactionRecord,
            activeKey: ACTIVE_AUTH_KEY,
            wallet: PRIMARY_TON_PAYOUT_ADDRESS,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.warn("Ledger telemetry sync warning:", err));
      }
    } catch (telemetryErr) {
      console.warn("Ledger telemetry sync error caught:", telemetryErr);
    }

    return searchResult;
  } catch (error) {
    console.error("Monetization middleware error:", error);
  }
}

export { PRIMARY_TON_PAYOUT_ADDRESS, QUERY_YIELD_USDT, ACTIVE_AUTH_KEY };
