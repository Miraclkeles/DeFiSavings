package main

import (
    "errors"
    "os"
    "strconv"
)

type SavingsAccount struct {
    Balance float64
}

type DepositOperation struct {
    AmountToDeposit float64
}

type WithdrawalOperation struct {
    AmountToWithdraw float64
}

func NewSavingsAccount(initialBalance float64) *SavingsAccount {
    return &SavingsAccount{Balance: initialBalance}
}

func (account *SavingsAccount) Deposit(deposit DepositOperation) error {
    if deposit.AmountToDeposit <= 0 {
        return errors.New("deposit amount must be positive")
    }
    account.Balance += deposit.AmountToDeposit
    return nil
}

func (account *SavingsAccount) Withdraw(withdrawal WithdrawalOperation) error {
    if withdrawal.AmountToWithdraw <= 0 {
        return errors.New("withdrawal amount must be positive")
    }
    if withdrawal.AmountToWithdraw > account.Balance {
        return errors.New("insufficient balance for withdrawal")
    }
    account.Balance -= withdrawal.AmountToWithdraw
    return nil
}

func main() {
    initialBalanceEnv, err := strconv.ParseFloat(os.Getenv("INITIAL_BALANCE"), 64)
    if err != nil {
        panic("Invalid value for initial balance.")
    }

    savingsAccount := NewSavingsAccount(initialBalanceEnv)
    depositOperation := DepositOperation{AmountToDeposit: 1000.50}
    withdrawalOperation := WithdrawalOperation{AmountToWithdraw: 500.25}

    err = savingsAccount.Deposit(depositOperation)
    if err != nil {
        panic(err)
    }

    err = savingsAccount.Withdraw(withdrawalOperation)
    if err != nil {
    panic(err)
    }

    println("Current balance: $", savingsAccount.Balance)
}