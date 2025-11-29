import { useState, useEffect } from 'react';

export default function VoteModal({ isOpen, onClose }) {
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vote count when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVoteCount();
    }
  }, [isOpen]);

  const fetchVoteCount = async () => {
    try {
      setError(null);
      const response = await fetch('/api/votes', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vote count');
      }
      const data = await response.json();
      setVoteCount(data.count);
    } catch (error) {
      console.error('Error fetching vote count:', error);
      setError('Failed to load vote count');
    }
  };

  const handleVote = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await fetch('/api/votes', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to increment vote');
      }
      const data = await response.json();
      setVoteCount(data.count);
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to increment vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Vote Count</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-green-600 mb-4">
            {voteCount}
          </div>
          <p className="text-gray-600 text-lg">Total Votes Counted</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleVote}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Counting...' : 'Increment Vote Count'}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
