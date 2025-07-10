import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentForm = ({ type }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [telegramId, setTelegramId] = useState("7101997659");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!phoneNumber || !/^\+?\d{10,12}$/.test(phoneNumber)) {
      toast.error(
        "Please enter a valid phone number (10-12 digits, optional + prefix)"
      );
      return false;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return false;
    }
    if (!telegramId) {
      toast.error("Please enter a valid Telegram ID");
      return false;
    }
    return true;
  };

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error(`Unsupported protocol: ${parsed.protocol}`);
      }
      return true;
    } catch (error) {
      console.error("Invalid URL:", error.message);
      toast.error(`Invalid API URL: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!validateUrl(apiUrl)) {
      return;
    }
    setLoading(true);

    try {
      const endpoint =
        type === "deposit" ? "/api/payments/initiate" : "/api/payments/payout";
      const fullUrl = `${apiUrl}${endpoint}`;
      const payload = {
        phoneNumber,
        amount: parseFloat(amount),
        telegramId,
        ...(type === "payout" && { paymentMethod: "Telebirr" }),
      };

      console.log("Sending request to:", fullUrl);
      console.log("Payload:", payload);

      const response = await axios.post(fullUrl, payload, {
        timeout: 10000, // 10s timeout to avoid hanging
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        if (type === "deposit" && response.data.paymentUrl) {
          if (validateUrl(response.data.paymentUrl)) {
            toast.success("Redirecting to payment URL...");
            window.location.href = response.data.paymentUrl;
          } else {
            toast.error("Invalid payment URL returned by the server");
          }
        } else {
          toast.success(
            `${
              type === "deposit" ? "Payment" : "Payout"
            } initiated successfully!`
          );
        }
      } else {
        toast.error(response.data.message || `Failed to initiate ${type}`);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error code:", error.code);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Failed to initiate ${type}. Check console for details.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (ETB)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telegram ID
        </label>
        <input
          type="text"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : `Initiate ${type === "deposit" ? "Payment" : "Payout"}`}
      </button>
    </form>
  );
};

export default PaymentForm;
