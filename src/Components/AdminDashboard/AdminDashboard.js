import React, { useState } from "react";
import "./AdminDashboard.css";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const AdminDashboard = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [disease, setDisease] = useState("");
  const [date, setDate] = useState("");
  const [cases, setCases] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  // ✅ SEND EMAIL (WITH LOCATION)
  const sendAlertEmail = async (
    diseaseName,
    increase,
    currentDate,
    outbreakLocation
  ) => {
    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("role", "user")
        .eq("location", outbreakLocation);

      if (error) {
        console.log("Error fetching users:", error);
        return;
      }

      if (!users || users.length === 0) {
        console.log("No users found");
        return;
      }

      for (let user of users) {
        try {
          await emailjs.send(
            "service_ohlu34a",
            "template_h4eaf4n",
            {
              to_email: user.email,
              disease: diseaseName,
              percentage: increase.toFixed(2),
              date: currentDate,
              location: outbreakLocation,
            },
            "s4XlCEOjfkXJUwHKh"
          );
        } catch (err) {
          console.log(
            "Email failed:",
            user.email
          );
        }

        // small delay
        await new Promise((res) =>
          setTimeout(res, 500)
        );
      }

      console.log("All emails sent");
    } catch (error) {
      console.log("Email error:", error);
    }
  };

  // ✅ OUTBREAK DETECTION
  const detectOutbreak = async (
    diseaseName,
    currentDate,
    outbreakLocation
  ) => {
    try {
      const previousDate = new Date(
        currentDate
      );

      previousDate.setDate(
        previousDate.getDate() - 1
      );

      const prevDateString =
        previousDate
          .toISOString()
          .split("T")[0];

      const { data: previousData } =
        await supabase
          .from("hospital_data")
          .select("admitted_cases")
          .eq("disease", diseaseName)
          .eq("date", prevDateString)
          .eq(
            "location",
            outbreakLocation
          );

      const { data: currentData } =
        await supabase
          .from("hospital_data")
          .select("admitted_cases")
          .eq("disease", diseaseName)
          .eq("date", currentDate)
          .eq(
            "location",
            outbreakLocation
          );

      if (!previousData || !currentData)
        return;

      const previousCases =
        previousData.reduce(
          (sum, item) =>
            sum +
            Number(
              item.admitted_cases
            ),
          0
        );

      const currentCases =
        currentData.reduce(
          (sum, item) =>
            sum +
            Number(
              item.admitted_cases
            ),
          0
        );

      if (previousCases === 0) return;

      const increase =
        ((currentCases -
          previousCases) /
          previousCases) *
        100;

      if (increase >= 30) {
        const { error: alertError } =
          await supabase
            .from("alerts")
            .insert([
              {
                hospital_name:
                  "ALL HOSPITALS",
                previous_cases:
                  previousCases,
                current_cases:
                  currentCases,
                percentage_increase:
                  increase.toFixed(2),
                date: currentDate,
              },
            ]);

        if (!alertError) {
          await sendAlertEmail(
            diseaseName,
            increase,
            currentDate,
            outbreakLocation
          );

          alert(
            `🚨 ${diseaseName} increased by ${increase.toFixed(
              2
            )}% in ${outbreakLocation}`
          );
        }
      }
    } catch (err) {
      console.log(
        "Outbreak error:",
        err
      );
    }
  };

  // ✅ SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: userData } =
        await supabase.auth.getUser();

      const user = userData.user;

      // ✅ DATE VALIDATION
      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      if (date > today) {
        alert(
          "Invalid date. Future dates are not allowed."
        );
        return;
      }

      // ✅ CASES VALIDATION
      if (Number(cases) <= 0) {
        alert(
          "Admitted cases must be greater than 0"
        );
        return;
      }

      const formattedLocation =
        location
          .toLowerCase()
          .trim();

      const { error } =
        await supabase
          .from("hospital_data")
          .insert([
            {
              hospital_name:
                hospitalName,
              disease: disease,
              date: date,
              admitted_cases:
                cases,
              location:
                formattedLocation,
              entered_by: user.id,
            },
          ]);

      if (error) {
        alert(
          "Error storing data: " +
            error.message
        );
      } else {
        alert(
          "Data stored successfully"
        );

        await detectOutbreak(
          disease,
          date,
          formattedLocation
        );

        setHospitalName("");
        setDisease("");
        setDate("");
        setCases("");
        setLocation("");
      }
    } catch (err) {
      alert("Something went wrong");
      console.log(err);
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>🏥 Admin Panel</h2>

        <ul>
          <li className="active">
            Dashboard
          </li>

          <li onClick={logout}>
            Logout
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>
            Hospital Data Entry
            Dashboard
          </h1>

          <p>
            Manage daily hospital
            reports
          </p>
        </div>

        <div className="admin-form-card">
          <h3>
            Enter New Hospital
            Record
          </h3>

          <form
            onSubmit={handleSubmit}
          >
            <div className="form-grid">
              <input
                type="text"
                placeholder="Hospital Name"
                value={hospitalName}
                onChange={(e) =>
                  setHospitalName(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Disease Name"
                value={disease}
                onChange={(e) =>
                  setDisease(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Admitted Cases"
                value={cases}
                onChange={(e) =>
                  setCases(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Location (City)"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <button type="submit">
              Submit Report
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;