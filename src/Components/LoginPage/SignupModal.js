import React, { useState } from "react";
import { supabase } from "../../supabase";
import "./SignupModal.css";

const SignupModal = ({ close }) => {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false); // ✅ ADDED

  const signup = async () => {
    try {

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Signup failed");
        return;
      }

      const formattedLocation = form.location.toLowerCase().trim();

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: form.email,
          role: "user",
          location: formattedLocation,
        });

      if (profileError) {
        alert("Profile error: " + profileError.message);
        return;
      }

      alert("Signup successful 🎉");
      close();

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>Create Account</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* ✅ PASSWORD WITH EYE ICON */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
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

        <input
          placeholder="Location (City)"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <button onClick={signup}>Sign Up</button>

        <button onClick={close}>Cancel</button>

      </div>
    </div>
  );
};

export default SignupModal;