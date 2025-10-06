import React, { useState } from "react";
import api from "../api/api";
import "../styles/lectureForms.css";

export default function LectureForms({ courseId, lectures, fetchLectures }) {
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [readingLectureTitle, setReadingLectureTitle] = useState('');
  const [readingLectureContent, setReadingLectureContent] = useState('');
  const [quizLectureTitle, setQuizLectureTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  const handleAddReadingLecture = async (e) => {
    e.preventDefault();
    if (!readingLectureTitle || !readingLectureContent) {
      alert('Please fill in all fields for the reading lecture.');
      return;
    }

    const order = lectures.length + 1;
    const payload = { title: readingLectureTitle, type: 'reading', order, content: readingLectureContent };

    try {
      await api.lectures.add(courseId, payload);
      alert('Reading lecture added successfully!');
      setReadingLectureTitle('');
      setReadingLectureContent('');
      setShowReadingForm(false);
      fetchLectures();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add reading lecture');
      console.error(err);
    }
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...quizQuestions];
    newQuestions[index].questionText = value;
    setQuizQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quizQuestions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...quizQuestions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setQuizQuestions(newQuestions);
  };

  const handleAddQuizLecture = async (e) => {
    e.preventDefault();
    if (!quizLectureTitle || quizQuestions.some(q => !q.questionText || q.options.some(o => !o))) {
      alert('Please fill in all fields for the quiz lecture and questions.');
      return;
    }

    const order = lectures.length + 1;
    const payload = { title: quizLectureTitle, type: 'quiz', order, questions: quizQuestions };

    try {
      await api.lectures.add(courseId, payload);
      alert('Quiz lecture added successfully!');
      setQuizLectureTitle('');
      setQuizQuestions([
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
      ]);
      setShowQuizForm(false);
      fetchLectures();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add quiz lecture');
      console.error(err);
    }
  };

  return (
    <div className="lecture-forms-container">
      <div className="lecture-add-buttons">
        <button className="btn" onClick={() => setShowReadingForm(true)}>Add Reading Lecture</button>
        <button className="btn" onClick={() => setShowQuizForm(true)}>Add Quiz Lecture</button>
      </div>

      {showReadingForm && (
        <div className="lecture-form-modal">
          <h3>Add Reading Lecture</h3>
          <form onSubmit={handleAddReadingLecture} className="lecture-form">
            <div className="form-group">
              <label htmlFor="readingTitle">Title:</label>
              <input
                type="text"
                id="readingTitle"
                className="form-control"
                value={readingLectureTitle}
                onChange={(e) => setReadingLectureTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="readingContent">Content (Markdown):</label>
              <textarea
                id="readingContent"
                className="form-control"
                rows="10"
                value={readingLectureContent}
                onChange={(e) => setReadingLectureContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Reading Lecture</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowReadingForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showQuizForm && (
        <div className="lecture-form-modal">
          <h3>Add Quiz Lecture</h3>
          <form onSubmit={handleAddQuizLecture} className="lecture-form">
            <div className="form-group">
              <label htmlFor="quizTitle">Title:</label>
              <input
                type="text"
                id="quizTitle"
                className="form-control"
                value={quizLectureTitle}
                onChange={(e) => setQuizLectureTitle(e.target.value)}
                required
              />
            </div>

            {quizQuestions.map((question, qIndex) => (
              <div key={qIndex} className="quiz-question-group">
                <label htmlFor={`questionText-${qIndex}`}>Question {qIndex + 1}:</label>
                <input
                  type="text"
                  id={`questionText-${qIndex}`}
                  className="form-control"
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                  required
                />
                <div className="quiz-options">
                  <p>Options:</p>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="form-group form-check">
                      <input
                        type="radio"
                        id={`option-${qIndex}-${oIndex}`}
                        name={`correctAnswer-${qIndex}`}
                        className="form-check-input"
                        checked={question.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      />
                      <input
                        type="text"
                        className="form-control quiz-option-input"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button type="button" className="btn btn-info" onClick={handleAddQuestion}>Add New Question</button>
              <button type="submit" className="btn btn-primary">Add Quiz Lecture</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowQuizForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
