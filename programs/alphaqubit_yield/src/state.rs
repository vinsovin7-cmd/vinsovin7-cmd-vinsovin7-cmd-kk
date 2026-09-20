use anchor_lang::prelude::*;

pub const ECOSYSTEM_SEED: &[u8] = b"ecosystem_config";
pub const PLATFORM_RESERVE_SEED: &[u8] = b"platform_reserve_vault";
pub const DIRECT_YIELD_SEED: &[u8] = b"direct_user_yield_vault";

// Mainnet SPL-USDT Mint Address
pub const MAINNET_USDT_MINT: &str = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

#[account]
pub struct EcosystemConfig {
    pub authority: Pubkey,
    pub usdt_mint: Pubkey,
    pub platform_reserve_vault: Pubkey,
    pub direct_user_yield_vault: Pubkey,
    pub platform_reserve_share_bps: u16, // 8000 bps = 80%
    pub direct_user_yield_share_bps: u16, // 2000 bps = 20%
    pub total_executive_passes_issued: u64,
    pub total_usdt_processed: u64,
    pub bump: u8,
}

impl EcosystemConfig {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 2 + 2 + 8 + 8 + 1;
}
