import React, { useState } from 'react';

interface DepositProps {
  contractAddress: string;
  performDeposit: (currency: string, amount: string) => Promise<void>;
}

const DepositForm: React.FC<DepositProps> = ({
  contractAddress,
  performDeposit,
}) => {
  const [amountToDeposit, setAmountToDeposit] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ETH'); // Default currency
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currencies = ['ETH', 'DAI', 'USDC']; // Example currencies

  const handleDepositClick = async () => {
    setResponseMessage('');
    setErrorMessage('');

    if (isNaN(Number(amountToDeposit)) || Number(amountToDeposit) <= 0) {
      setErrorMessage('Invalid deposit amount. Please enter a positive number.');
      return;
    }

    try {
      await performDeposit(selectedCurrency, amountToDeposit);
      setResponseMessage(`Deposit of ${amountToDeposit} ${selectedCurrency} completed successfully!`);
      setAmountToDeposit('');
    } catch (err) {
      const errorText = (err as Error).message || 'Failed to complete the deposit.';
      setErrorMessage(errorText);
    }
  };

  return (
    <div>
      <p>Deposit Address: {contractAddress}</p>
      <div>
        <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={amountToDeposit}
        onChange={e => setAmountToDeposit(e.target.value)}
        placeholder="Deposit Amount"
      />
      <button onClick={handleDepositClick}>Make Deposit</button>
      {responseMessage && <div style={{ color: 'green' }}>{responseMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default DepositForm;