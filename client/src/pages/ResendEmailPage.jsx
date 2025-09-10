// src/pages/auth/ResendEmailPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import api from "../lib/axios";

const ResendEmailPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email });
      toast.success(res.data.message || "Verification email resent!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-black/10 backdrop-blur-sm">
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Resend Verification Email
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <form onSubmit={handleResend} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-13 px-4 py-2 rounded-xl border border-gray-600 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-300 underline hover:text-blue-400 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResendEmailPage;
