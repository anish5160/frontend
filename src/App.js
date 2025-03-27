import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Importing pages
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import LoginReg from "./pages/auth/LoginReg";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import { useEffect } from "react";

function App() {
  const { access_token } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("API URL:", process.env.REACT_APP_API_URL);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="login"
            element={!access_token ? <LoginReg /> : <Navigate to="/dashboard" />}
          />
          <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />

          {/* ✅ Corrected Reset Password Route */}
          <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard route */}
        <Route
          path="/dashboard/:subjectName?"
          element={access_token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<h1>Error 404: Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
