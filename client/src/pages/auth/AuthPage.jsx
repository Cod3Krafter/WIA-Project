import { useState } from "react";
import { LoginForm } from "../../components/auth-page/LoginForm";
import RegisterForm from "../../components/auth-page/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Initialize with true or false as default

  const handleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#242038]">
      <div className="w-full max-w-md p-rounded-xl shadow-md">
        {isLogin ? (
          <>
            <LoginForm />
            <p className="mt-4 text-center text-white text-sm">
              Already have an account?{" "}
              <button
                className="hover:underline"
                onClick={handleForm}
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p className="mt-4 text-center text-white text-sm">
              Already have an account?{" "}
              <button
                className="hover:underline"
                onClick={handleForm}
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
