use anchor_lang::prelude::*;

declare_id!("2ZzrLXe8EKYiY3BHthebN6wpC4zcP8QA1Bu1X1XE8PDF");

#[program]
pub mod paytogether {
    use super::*;

    pub fn create_group(ctx: Context<CreateGroup>, total_amount: u64) -> Result<()> {
        let group = &mut ctx.accounts.group;
        group.organizer = *ctx.accounts.organizer.key;
        group.total_amount = total_amount;
        group.collected_amount = 0;
        Ok(())
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        let group = &mut ctx.accounts.group;
        let participant = &mut ctx.accounts.participant;

        // Update the group's collected amount
        group.collected_amount += amount;

        // Set the participant's wallet and contributed amount
        participant.wallet = *ctx.accounts.contributor.key;
        participant.contributed_amount += amount;

        Ok(())
    }

    pub fn settle_payment(ctx: Context<SettlePayment>) -> Result<()> {
        let group = &mut ctx.accounts.group;

        // Only settle if the goal amount is met
        if group.collected_amount == group.total_amount {
            let organizer = &mut ctx.accounts.organizer;
            let to_transfer = group.total_amount;
            **organizer.to_account_info().try_borrow_mut_lamports()? += to_transfer;
            group.collected_amount = 0; // Reset collected amount after settling
        }

        Ok(())
    }
}

#[account]
pub struct Group {
    pub organizer: Pubkey,
    pub total_amount: u64,
    pub collected_amount: u64,
}

#[account]
pub struct Participant {
    pub wallet: Pubkey, // This is the participant's wallet address (their public key)
    pub contributed_amount: u64, // Amount the participant contributed
}

#[derive(Accounts)]
pub struct CreateGroup<'info> {
    #[account(init, payer = organizer, space = 8 + 8 + 8 + 32)]
    pub group: Account<'info, Group>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    #[account(init, payer = contributor, space = 8 + 8 + 32)]
    pub participant: Account<'info, Participant>,
    #[account(mut)]
    pub contributor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettlePayment<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    #[account(mut)]
    pub organizer: Signer<'info>,
}
