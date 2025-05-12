use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::*;

#[derive(Accounts)]
pub struct CreateGroup<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 8 + 8 + 1 + 1 + 1)]
    pub group: Account<'info, Group>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    #[account(init, payer = contributor, space = 8 + 32 + 8)]
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

pub fn create_group(
    ctx: Context<CreateGroup>,
    total_amount: u64,
    participant_count: u8,
) -> Result<()> {
    let group = &mut ctx.accounts.group;
    group.organizer = *ctx.accounts.organizer.key;
    group.total_amount = total_amount;
    group.collected_amount = 0;
    group.participant_count = participant_count;
    group.paid_participants = 0;
    group.status = GroupStatus::Active;
    Ok(())
}

pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let participant = &mut ctx.accounts.participant;

    require!(
        group.status == GroupStatus::Active,
        GroupError::GroupNotActive
    );

    // Update the group's collected amount
    group.collected_amount += amount;
    group.paid_participants += 1;

    // Set the participant's wallet and contributed amount
    participant.wallet = *ctx.accounts.contributor.key;
    participant.contributed_amount = amount;

    // Check if all participants have paid
    if group.paid_participants == group.participant_count {
        group.status = GroupStatus::Completed;
    }

    Ok(())
}

pub fn settle_payment(ctx: Context<SettlePayment>) -> Result<()> {
    let group = &mut ctx.accounts.group;

    require!(
        group.status == GroupStatus::Completed,
        GroupError::GroupNotCompleted
    );

    // Transfer the total amount to the organizer
    let organizer = &mut ctx.accounts.organizer;
    let to_transfer = group.total_amount;
    
    // Transfer lamports from the group account to the organizer
    **organizer.to_account_info().try_borrow_mut_lamports()? += to_transfer;
    **group.to_account_info().try_borrow_mut_lamports()? -= to_transfer;

    group.status = GroupStatus::Settled;
    Ok(())
} 