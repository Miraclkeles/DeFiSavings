import React, { useState } from 'react';

interface DepositProps {
  savingsContractAddress: string;
  depositFunction: (amount: string) => Promise<void>;
}

const DepositComponent: React.FC<DepositProps> = ({ savingsContractAddress, depositFunction }) => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDeposit = async () => {
    try {
      setMessage('');
      setError('');

      if (isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
        setError('Please enter a valid deposit amount.');
        return;
      }

      await depositFunction(depositAmount);
      setMessage('Deposit successfully made!');
      setDepositAmount('');
    } catch (err) {
      setError((err as Error).message || 'An error occurred while making the deposit.');
    }
  };

  return (
    <div>
      <p>Deposit into contract at: {savingsContractAddress}</p>
      <input
        type="text"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Enter deposit amount"
      />
      <button onClick={handleDeposit}>Deposit</button>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default DepositComponent;