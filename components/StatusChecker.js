import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StatusChecker = () => {
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/status/${transactionId}`
      );

      if (response.data.success) {
        setStatus(response.data.status);
        toast.success("Status fetched successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>
      {status && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm font-medium">Transaction Status: {status}</p>
        </div>
      )}
    </div>
  );
};

export default StatusChecker;
