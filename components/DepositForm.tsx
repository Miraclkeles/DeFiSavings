import React, { useState } from 'react';

interface DepositFormProps {
  depositContractAddress: string;
  executeDepositTransaction: (currency: string, depositAmount: string) => Promise<void>;
}

const DepositForm: React.FC<DepositFormProps> = ({
  depositContractAddress,
  executeDepositTransaction,
}) => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [currencySelection, setCurrencySelection] = useState<string>('ETH'); // Default currency is ETH
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorFeedback, setErrorFeedback] = useState<string>('');

  const supportedCurrencies = ['ETH', 'DAI', 'USDC']; // Extendable list of supported currencies

  const handleDepositAction = async () => {
    setSuccessMessage('');
    setErrorFeedback('');

    if (isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      setErrorFeedback('Invalid amount. Please enter a positive number for the deposit.');
      return;
    }

    try {
      await executeDepositTransaction(currencySelection, depositAmount);
      setSuccessMessage(`Successfully deposited ${depositA-mount} ${currencySelection}!`);
      setDepositAmount(''); // Reset input field
    } catch (errorInstance) {
      const encounteredError = (errorInstance as Error).mess-ge || 'The deposit transaction failed.';
      setErrorFeedback(encounteredError);
    }
  };

  return (
    <div>
      <p>Contract Address for Deposit: {depositContractAddress}</p>
      <div>
        <select
          value={currencySelection}
          onChange={(event) => setCurrencySelection(event.target.value)}
        >
          {supportedCurrencies.map((currencyName) => (
            <option key={currencyName} value={currencyName}>
              {currencyName}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        value={depositAmount}
        onChange={(event) => setDepositAmount(event.target.value)}
        placeholder="Amount to Deposit"
      />
      <button onClick={handleDepositAction}>Execute Deposit</button>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorFeedback && <div style={{ color: 'red' }}>{errorFeedback}</div>}
    </div>
  );
};

export default DepositForm;