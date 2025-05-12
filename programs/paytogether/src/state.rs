use anchor_lang::prelude::*;

#[account]
pub struct Group {
    pub organizer: Pubkey,
    pub total_amount: u64,
    pub collected_amount: u64,
    pub participant_count: u8,
    pub paid_participants: u8,
    pub status: GroupStatus,
}

#[account]
pub struct Participant {
    pub wallet: Pubkey,
    pub contributed_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum GroupStatus {
    Active,
    Completed,
    Settled,
} 