import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import TooManyRequests from "./components/TooManyRequestsPage.jsx";
import VerificationSentPage from "./pages/VerificationSentPage.jsx";
import VerifyingEmailPage from "./pages/VerifyingEmailPage.jsx";
import ResendEmailPage from "./pages/ResendEmailPage.jsx";

function App() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24" />

      <Routes>
        {/* Public pages with no navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verification_sent" element={<VerificationSentPage />} />
        <Route path="/verify-email" element={<VerifyingEmailPage />} />
        <Route path="/resend-verification" element={<ResendEmailPage />} />

        {/* Pages wrapped with Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route 
            path='/profile' 
            element={
            <ProtectedRoute>
              <UserProfilePage/>
            </ProtectedRoute>
        }>
        </Route>
        </Route>
        {/* Too Many Requests Page */}
        <Route path="/too-many-requests" element={<TooManyRequests />} />
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
