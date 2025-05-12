use anchor_lang::prelude::*;

pub mod state;
pub mod error;
pub mod instructions;

use instructions::*;

declare_id!("2ZzrLXe8EKYiY3BHthebN6wpC4zcP8QA1Bu1X1XE8PDF");

#[program]
pub mod paytogether {
    use super::*;

    pub fn create_group(
        ctx: Context<CreateGroup>,
        total_amount: u64,
        participant_count: u8,
    ) -> Result<()> {
        instructions::create_group(ctx, total_amount, participant_count)
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        instructions::contribute(ctx, amount)
    }

    pub fn settle_payment(ctx: Context<SettlePayment>) -> Result<()> {
        instructions::settle_payment(ctx)
    }
}
