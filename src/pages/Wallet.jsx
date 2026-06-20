

import { useEffect, useState } from "react";

export default function Wallet() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Simulate fetching wallet balance
    const fetchBalance = async () => {
      // Replace this with your actual API call
      const response = await fetch("/api/wallet/balance");
      const data = await response.json();
      setBalance(data.balance);
    };

    fetchBalance();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white dark:bg-[#1e2732] p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Wallet Balance</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300">${balance.toFixed(2)}</p>
      </div>
    </div>
  );
}