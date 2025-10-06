import React, { useState } from "react";
import { Link } from "react-router-dom";
import LandingHero from "../components/LandingHero";
import RoleSelector from "../components/RoleSelector";
import ProjectOverview from "../components/ProjectOverview";

export default function Landing() {
  const [tab, setTab] = useState("student"); 

  return (
    <div style={{ paddingTop: 24 }}>
      
      <main style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
        <section style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Welcome to CourseHub</h2>
              <p style={{ color: "#666" }}>
                Build instructor-led courses with reading & quizzes. Students enroll, progress is tracked sequentially, quizzes are graded in real-time.
              </p>
            </div>

            <RoleSelector tab={tab} setTab={setTab} />
          </div>
        </section>

        <ProjectOverview />
      </main>
    </div>
  );
}
