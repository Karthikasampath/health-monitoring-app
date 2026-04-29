import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./Components/LoginPage/UserLogin";
import AdminLogin from "./Components/LoginPage/AdminLogin";
import HomePage from "./Components/HomePage/HomePage";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import UserDashboard from "./Components/HomePage/UserDashboard"; // ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/user-dashboard" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ADD NEW ROUTE HERE */}
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;