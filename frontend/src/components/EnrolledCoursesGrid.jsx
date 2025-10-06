import React from "react";
import "../styles/myLearnings.css";

export default function EnrolledCoursesGrid({ enrolledCourses, loading, openCourse }) {
  return (
    <div className="enrolled-courses-grid-container">
      {loading && <div className="loading-message">Loading enrolled courses...</div>}

      <div className="enrolled-courses-grid">
        {enrolledCourses.length === 0 && !loading && <div className="no-courses-message">No enrolled courses yet.</div>}

        {enrolledCourses.map(({ course, progress }) => {
          const id = course._id || course.id;
          const percent = progress ? progress.percent || 0 : 0;
          const completed = progress ? progress.completedCount || 0 : 0;
          const total = progress ? progress.totalLectures || (course.lectures ? course.lectures.length : 0) : (course.lectures ? course.lectures.length : 0);

          return (
            <div key={id} className="enrolled-course-card">
              <h3 className="enrolled-course-title">{course.title}</h3>
              <p className="enrolled-course-description">{course.description}</p>
              <p className="enrolled-course-instructor">By {course.instructor?.name || course.instructorName || "Unknown"}</p>

              <div className="enrolled-course-progress">
                <div className="progress-text">{completed}/{total} completed</div>
                <div className="progress-bar-background">
                  <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="enrolled-course-actions">
                <button className="btn" onClick={() => openCourse(id)}>Open Course</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
