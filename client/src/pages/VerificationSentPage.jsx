// src/pages/auth/VerificationSentPage.jsx
import { Link } from "react-router-dom";    
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerificationSentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-black/10 backdrop-blur-sm">
        <CardHeader className="pt-8 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-8 text-center">
          <p className="text-gray-300 text-sm sm:text-base mb-6">
            🎉 We’ve sent a verification link to your email.  
            Please check your inbox (and spam folder, just in case) to complete your registration.
          </p>

          <p className="text-xs text-gray-400 mb-6">
            Didn’t receive the email? Wait a few minutes or click below to resend.
          </p>

          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={() => {
                // 🔹 Hook this up to your backend resend endpoint
                console.log("Resend verification email");
              }}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md"
            >
              Resend Email
            </button>

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

export default VerificationSentPage;
