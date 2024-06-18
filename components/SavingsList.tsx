import React, { useEffect, useState } from 'react';

interface SavingAccount {
  id: string;
  amount: number;
  interestEarned: number;
}

interface APIError {
  message: string;
}

const SavingsList: React.FC = () => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<APIError | null>(null);

  const fetchSavingsAccounts = async () => {
    try {
      const response = await fetch('https://your-blockchain-api/savings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_BLOCKCHAIN_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings accounts');
      }

      const accountsData: SavingAccount[] = await response.json();
      setSavingsAccounts(accountsData);
    } catch (error: any) {
      setApiError({ message: error.message || 'Failed to fetch data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsAccounts();
  }, []);

  if (isLoading) return <div>Loading savings accounts...</div>;
  if (apiError) return <div>Error: {apiError.message}</div>;

  return (
    <div>
      <h2>Savings Accounts</h2>
      {savingsAccounts.length > 0 ? (
        <ul>
          {savingsAccounts.map((account) => (
            <li key={account.id}>
              Amount: {account.amount}, Interest Earned: {account.interestEarned}
            </li>
          ))}
        </ul>
      ) : (
        <p>No savings accounts found.</p>
      )}
    </div>
  );
};

export default SavingsList;