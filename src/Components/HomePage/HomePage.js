import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/");
      else setUser(data.user);
    };
    load();
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>User Dashboard</h2>

      {user && (
        <>
          <p>Email: {user.email}</p>
          <p>Name: {user.user_metadata?.name}</p>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;