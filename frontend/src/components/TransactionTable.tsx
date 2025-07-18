import React from 'react';

interface Transaction {
  status: 'Success' | 'Processing' | 'Failed';
  category: string;
  amount: number;
}

const transactions: Transaction[] = [
  { status: 'Success', category: 'Books', amount: 316 },
  { status: 'Success', category: 'Electronics', amount: 242 },
  { status: 'Processing', category: 'Groceries', amount: 837 },
  { status: 'Success', category: 'Clothing', amount: 874 },
  { status: 'Failed', category: 'Fitness', amount: 721 },
];

const TransactionTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <table className="min-w-full table-auto text-left text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="p-3">Status</th>
            <th className="p-3 flex items-center gap-1">
              Category
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </th>
            <th className="p-3">Amount</th>
            <th className="p-3 text-right">...</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, idx) => (
            <tr
              key={idx}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="p-3">{txn.status}</td>
              <td className="p-3">{txn.category}</td>
              <td className="p-3 font-semibold">${txn.amount.toFixed(2)}</td>
              <td className="p-3 text-right">⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
