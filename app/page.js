"use client";

import PaymentForm from "@/components/PaymentForm";
import StatusChecker from "@/components/StatusChecker";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Payment Gateway Tester
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Initiate Deposit</h2>
            <PaymentForm type="deposit" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Initiate Payout</h2>
            <PaymentForm type="payout" />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Check Transaction Status
          </h2>
          <StatusChecker />
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
