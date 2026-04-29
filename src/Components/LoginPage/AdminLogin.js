import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ ADDED

  const navigate = useNavigate();

  const login = async () => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile.role !== "admin") {
      alert("Not an admin account");
      return;
    }

    navigate("/admin-dashboard");
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-left">
        <h1>🏥 Admin Control Portal</h1>
        <p>
          Manage hospital reports, disease records,
          and daily case entries from one dashboard.
        </p>
      </div>

      <div className="admin-login-right">
        <div className="admin-login-card">
          <h2>Admin Login</h2>

          <input
            type="email"
            placeholder="Enter Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* ✅ PASSWORD WITH EYE ICON */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#8ab4f8",
                fontSize: "18px",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button onClick={login}>
            Login
          </button>

          <button onClick={() => navigate("/")}>
            Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;