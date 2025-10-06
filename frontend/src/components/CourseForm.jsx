import React, { useState } from "react";
import "../styles/courseForm.css";

export default function CourseForm({ onAddCourse, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }
    onAddCourse(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="course-form-modal">
      <h3>Add New Course</h3>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="courseTitle">Title:</label>
          <input
            type="text"
            id="courseTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseDescription">Description:</label>
          <textarea
            id="courseDescription"
            className="form-control"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Course</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
