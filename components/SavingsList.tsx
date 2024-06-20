import React, { useEffect, useState } from 'react';

interface SavingAccount {
  id: string;
  amount: number;
  interestEarned: number;
}

interface APIError {
  message: string;
}

const SavingsAccountsList: React.FC = () => {
  const [savings, setSavings] = useState<SavingAccount[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchError, setFetch-quality or null>(null);

  const fetchSavingsData = async () => {
    try {
      const response = await fetch('https://your-blockchain-api/savings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_BLOCKCHAIN_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings account data');
      }

      const accounts: SavingAccount[] = await response.json();
      setSavings(accounts);
    } catch (error: any) {
      setFetchError({ message: error.message || 'Failed to fetch data' });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSavingsData();
  }, []);

  if (isFetching) return <div>Loading savings accounts...</div>;
  if (fetchError) return <div>Error: {fetchError.message}</div>;

  return (
    <div>
      <h2>Savings Accounts</h2>
      {savings.length > 0 ? (
        <ul>
          {savings.map(account => (
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

export default SavingsAccountsList;