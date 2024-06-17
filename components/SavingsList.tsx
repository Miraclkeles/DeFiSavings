import React, { useEffect, useState } from 'react';

interface Saving {
  id: string;
  amount: number;
  interestEarned: number;
}

interface FetchError {
  message: string;
}

const SavingsList: React.FC = () => {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  const fetchSavings = async () => {
    try {
      const response = await fetch('https://your-blockchain-api/savings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_BLOCKCHAIN_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings');
      }

      const data: Saving[] = await response.json();
      setSavings(data);
    } catch (error: any) {
      setError({ message: error.message || 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  if (loading) return <div>Loading savings...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Savings List</h2>
      {savings.length > 0 ? (
        <ul>
          {savings.map((saving) => (
            <li key={saving.id}>
              Amount: {saving.amount}, Interest Earned: {saving.interestEarned}
            </li>
          ))}
        </ul>
      ) : (
        <p>No savings found.</p>
      )}
    </div>
  );
};

export default SavingsList;