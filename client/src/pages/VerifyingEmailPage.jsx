// src/pages/auth/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import api from "../lib/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token found in the URL.");
        toast.error("No verification token found in URL.");
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        const data = res.data;

        if (res.status === 200) {
          setStatus("success");
          setMessage(data.message);
          toast.success("Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
          toast.error(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");

        // Check if server responded with a message
        const errorMessage =
            err.response?.data?.message || "Server error. Please try again later.";

        setMessage(errorMessage);
        toast.error(errorMessage);
        }

    };

    verify();
  }, [token]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-black/10 backdrop-blur-sm">
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Email Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-8 text-center">
          {status === "loading" && (
            <p className="text-gray-300">Verifying your email...</p>
          )}
          {status === "success" && (
            <p className="text-green-400 font-medium">{message}</p>
          )}
          {status === "error" && (
            <>
              <p className="text-red-400 font-medium mb-4">{message}</p>
              {!token && (
                <Link to="/resend-verification">
                  <button
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md"
                  >
                    Resend Verification Email
                  </button>
                </Link>
              )}
            </>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm text-gray-300 underline hover:text-blue-400 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
