package main

import (
	"errors"
	"os"
	"strconv"
)

type SavingsAccount struct {
	Balance float64
}

type DepositRequest struct {
	Amount float64
}

type WithdrawRequest struct {
	Amount float64
}

func NewSavingsAccount(initialBalance float64) *SavingsAccount {
	return &SavingsAccount{Balance: initialBalance}
}

func (sa *SavingsAccount) Deposit(req DepositRequest) error {
	if req.Amount <= 0 {
		return errors.New("deposit amount must be greater than 0")
	}
	sa.Balance += req.Amount
	return nil
}

func (sa *SavingsAccount) Withdraw(req WithdrawRequest) error {
	if req.Amount <= 0 {
		return errors.New("withdrawal amount must be greater than 0")
	}
	if req.Amount > sa.Balance {
		return errors.New("insufficient funds for withdrawal")
	}
	sa.Balance -= req.Amount
	return nil
}

func main() {
	initialBalanceVal, err := strconv.ParseFloat(os.Getenv("INITIAL_BALANCE"), 64)
	if err != nil {
		panic("Invalid initial balance value.")
	}

	account := NewSavingsAccount(initialBalanceVal)
	depositReq := DepositRequest{Amount: 1000.50}
	withdrawReq := WithdrawRequest{Amount: 500.25}

	err = account.Deposit(depositReq)
	if err != nil {
		panic(err)
	}

	err = account.Withdraw(withdrawReq)
	if err != nil {
		panic(err)
	}

	println("Current balance: $", account.Balance)
}