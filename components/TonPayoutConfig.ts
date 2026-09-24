// components/TonPayoutConfig.ts
import { TonConnectUI } from '@tonconnect/ui';

export const PRIMARY_RECEIVER_ADDRESS = "UQDlOTSlGL73BFgqkrYbBH2qZjPGtjhT0V41bv6ObdhpWgrG";
export const ACTIVE_AUTH_KEY = "5dd2...ecb2";
export const PRIMARY_ECOSYSTEM_DOMAIN = "ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app";
export const PRIMARY_MIRROR_DOMAIN = "earnings.ink";

export const initTonConnect = (elementId: string) => {
  if (typeof window === "undefined") return null;
  try {
    return new TonConnectUI({
      manifestUrl: 'https://ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app/tonconnect-manifest.json',
      buttonRootId: elementId,
    });
  } catch (err) {
    console.warn("TON Connect initialization warning:", err);
    return null;
  }
};
