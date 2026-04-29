import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

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

    if (profile.role !== "user") {
      alert("Not a user account");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-layout">
      <div className="login-left">
        <h1>🏥 Smart Health Monitoring</h1>
        <p>
          Track hospital disease reports, analytics,
          and patient trends in real time.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>User Login</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={login}>Login</button>

          <button onClick={() => setOpen(true)}>
            Create Account
          </button>

          <button onClick={() => navigate("/admin")}>
            Admin Login
          </button>
        </div>
      </div>

      {open && (
        <SignupModal close={() => setOpen(false)} />
      )}
    </div>
  );
};

export default UserLogin;