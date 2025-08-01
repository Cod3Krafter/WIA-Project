import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center flex-col text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        Go back to homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
