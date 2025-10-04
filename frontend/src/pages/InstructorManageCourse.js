import React from "react";
import { useParams } from "react-router-dom";

export default function InstructorManageCourse() {
  const { courseId } = useParams();

  const addLecture = () => {
    const type = prompt("Lecture type (reading|quiz)");
    if (!type) return;
    alert("Add lecture flow (dummy). Implement form & call to /api/courses/:id/lectures");
  };

  return (
    <div className="container">
      <h2>Manage Course {courseId}</h2>
      <div>
        <button className="btn" onClick={addLecture}>Add Lecture</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {/* list lectures and add reorder / edit / delete UI */}
        <p>Lecture list here (implement API to fetch lectures and display)</p>
      </div>
    </div>
  );
}
