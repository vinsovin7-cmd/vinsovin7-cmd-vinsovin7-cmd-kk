use anchor_lang::prelude::*;

#[error_code]
pub enum YieldErrorCode {
    #[msg("Invalid split ratio: Platform Reserve must be 80% and Direct User Yield must be 20%.")]
    InvalidSplitRatio,
    #[msg("Math overflow during yield split calculation.")]
    MathOverflow,
    #[msg("Invalid USDT token mint provided.")]
    InvalidUsdtMint,
    #[msg("Unauthorized access to executive access configuration.")]
    UnauthorizedAccess,
    #[msg("Insufficient payment provided for executive access purchase.")]
    InsufficientEntryFee,
}
