use anchor_lang::prelude::*;

#[error_code]
pub enum GroupError {
    #[msg("Group is not active")]
    GroupNotActive,
    #[msg("Group is not completed")]
    GroupNotCompleted,
} 