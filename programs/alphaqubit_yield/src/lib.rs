use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

pub mod errors;
pub mod state;

use errors::YieldErrorCode;
use state::*;

declare_id!("AlphaQ11111111111111111111111111111111111111");

#[program]
pub mod alphaqubit_yield {
    use super::*;

    /// Initialize the AlphaQubit Quantum Ecosystem smart contract.
    /// Enforces an explicit 80% Platform Reserve / 20% Direct User Yield split for SPL-USDT.
    pub fn initialize_ecosystem(ctx: Context<InitializeEcosystem>) -> Result<()> {
        let ecosystem_config = &mut ctx.accounts.ecosystem_config;
        
        ecosystem_config.authority = ctx.accounts.authority.key();
        ecosystem_config.usdt_mint = ctx.accounts.usdt_mint.key();
        ecosystem_config.platform_reserve_vault = ctx.accounts.platform_reserve_vault.key();
        ecosystem_config.direct_user_yield_vault = ctx.accounts.direct_user_yield_vault.key();
        
        // Enforce immutable 80% Platform Reserve / 20% Direct User Yield split ratio
        ecosystem_config.platform_reserve_share_bps = 8000; // 80.00%
        ecosystem_config.direct_user_yield_share_bps = 2000; // 20.00%
        ecosystem_config.total_executive_passes_issued = 0;
        ecosystem_config.total_usdt_processed = 0;
        ecosystem_config.bump = ctx.bumps.ecosystem_config;

        msg!(
            "AlphaQubit Ecosystem Initialized: Platform Reserve Vault = 80%, Direct User Yield Vault = 20%"
        );
        Ok(())
    }

    /// Purchase Executive Access Pass with SPL-USDT entry fees.
    /// Executes CPI calls to automatically route 80% to platform_reserve_vault and 20% to direct_user_yield_vault.
    pub fn purchase_executive_access(
        ctx: Context<PurchaseExecutiveAccess>,
        entry_fee_amount: u64,
    ) -> Result<()> {
        require!(entry_fee_amount > 0, YieldErrorCode::InsufficientEntryFee);

        // Calculate 80% Platform Reserve share & 20% Direct User Yield share
        let platform_reserve_amount = entry_fee_amount
            .checked_mul(8000)
            .ok_or(YieldErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(YieldErrorCode::MathOverflow)?;

        let direct_user_yield_amount = entry_fee_amount
            .checked_sub(platform_reserve_amount)
            .ok_or(YieldErrorCode::MathOverflow)?;

        // Verify mathematical 80/20 ratio integrity
        require!(
            platform_reserve_amount + direct_user_yield_amount == entry_fee_amount,
            YieldErrorCode::InvalidSplitRatio
        );

        // CPI 1: Transfer 80% of entry fee to Platform Reserve Vault PDA
        let cpi_accounts_reserve = Transfer {
            from: ctx.accounts.buyer_usdt_account.to_account_info(),
            to: ctx.accounts.platform_reserve_vault.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program_reserve = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_reserve = CpiContext::new(cpi_program_reserve, cpi_accounts_reserve);
        token::transfer(cpi_ctx_reserve, platform_reserve_amount)?;

        // CPI 2: Transfer 20% of entry fee to Direct User Yield Vault PDA
        let cpi_accounts_yield = Transfer {
            from: ctx.accounts.buyer_usdt_account.to_account_info(),
            to: ctx.accounts.direct_user_yield_vault.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program_yield = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_yield = CpiContext::new(cpi_program_yield, cpi_accounts_yield);
        token::transfer(cpi_ctx_yield, direct_user_yield_amount)?;

        // Update Ecosystem global counters
        let ecosystem_config = &mut ctx.accounts.ecosystem_config;
        ecosystem_config.total_executive_passes_issued = ecosystem_config
            .total_executive_passes_issued
            .checked_add(1)
            .ok_or(YieldErrorCode::MathOverflow)?;
            
        ecosystem_config.total_usdt_processed = ecosystem_config
            .total_usdt_processed
            .checked_add(entry_fee_amount)
            .ok_or(YieldErrorCode::MathOverflow)?;

        msg!(
            "Executive Access Purchased: {} USDT total. Routed {} USDT (80%) to Reserve Vault, {} USDT (20%) to Direct Yield Vault.",
            entry_fee_amount,
            platform_reserve_amount,
            direct_user_yield_amount
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEcosystem<'info> {
    #[account(
        init,
        payer = authority,
        space = EcosystemConfig::LEN,
        seeds = [ECOSYSTEM_SEED],
        bump
    )]
    pub ecosystem_config: Account<'info, EcosystemConfig>,

    pub usdt_mint: Account<'info, Mint>,

    /// PDA-secured Token Account for 80% Platform Reserve
    #[account(
        init,
        payer = authority,
        seeds = [PLATFORM_RESERVE_SEED, usdt_mint.key().as_ref()],
        bump,
        token::mint = usdt_mint,
        token::authority = platform_reserve_vault
    )]
    pub platform_reserve_vault: Account<'info, TokenAccount>,

    /// PDA-secured Token Account for 20% Direct User Yield
    #[account(
        init,
        payer = authority,
        seeds = [DIRECT_YIELD_SEED, usdt_mint.key().as_ref()],
        bump,
        token::mint = usdt_mint,
        token::authority = direct_user_yield_vault
    )]
    pub direct_user_yield_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct PurchaseExecutiveAccess<'info> {
    #[account(
        mut,
        seeds = [ECOSYSTEM_SEED],
        bump = ecosystem_config.bump
    )]
    pub ecosystem_config: Account<'info, EcosystemConfig>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        constraint = buyer_usdt_account.owner == buyer.key(),
        constraint = buyer_usdt_account.mint == ecosystem_config.usdt_mint
    )]
    pub buyer_usdt_account: Account<'info, TokenAccount>,

    /// PDA-secured Platform Reserve Vault Token Account (receives 80%)
    #[account(
        mut,
        seeds = [PLATFORM_RESERVE_SEED, ecosystem_config.usdt_mint.as_ref()],
        bump
    )]
    pub platform_reserve_vault: Account<'info, TokenAccount>,

    /// PDA-secured Direct User Yield Vault Token Account (receives 20%)
    #[account(
        mut,
        seeds = [DIRECT_YIELD_SEED, ecosystem_config.usdt_mint.as_ref()],
        bump
    )]
    pub direct_user_yield_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
