import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/SideBar";
// change this line at the top of Quiz.jsx
import { questions as allQuestions } from "../../assets/data/questions";
import "./Quiz.css";

const Quiz = ({ genre, onFinish }) => {
  const questions = allQuestions[genre] || [];

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[currentIndex];

  useEffect(() => {
    if (!quizStarted || quizFinished) return;
    if (timeLeft === 0) { setQuizFinished(true); return; }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [quizStarted, timeLeft, quizFinished]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === current.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) { setQuizFinished(true); return; }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
  };

  const getAnswerClass = (index) => {
    if (selectedAnswer === null) return "answer-btn";
    if (index === current.correct) return "answer-btn correct";
    if (index === selectedAnswer) return "answer-btn wrong";
    return "answer-btn disabled";
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="questions-section">
        <div className="nav-btn">
          <p className="slogan">{genre}</p>
          <div className="start-btn">
            <button className="btn-outline" onClick={onFinish}>← Back</button>
            <button className="btn-solid" onClick={() => setQuizStarted(true)} disabled={quizStarted}>
              {quizStarted ? "Quiz Started" : "Start Quiz"}
            </button>
          </div>
        </div>

        {quizFinished ? (
          <div className="quiz-card">
            <div className="question-box">
              <h2 className="question-title">{timeLeft === 0 ? "⏰ Time's Up!" : "Quiz Complete! 🎉"}</h2>
              <p className="question-text">You scored <strong>{score}</strong> out of <strong>{questions.length}</strong></p>
            </div>
            <button className="btn-next" onClick={onFinish}>Back to Quizzes</button>
          </div>
        ) : (
          <div className="quiz-card">
            <div className="question-box">
              <h2 className="question-title">Question {currentIndex + 1}</h2>
              <p className="question-text">{current.question}</p>
            </div>
            <div className="answers">
              {current.answers.map((answer, index) => (
                <button
                  key={index}
                  className={getAnswerClass(index)}
                  onClick={() => handleAnswer(index)}
                  disabled={!quizStarted || (selectedAnswer !== null && index !== current.correct && index !== selectedAnswer)}
                >
                  {answer}
                </button>
              ))}
            </div>
            <div className="number-time">
              <span className="question-number">{currentIndex + 1}/{questions.length}</span>
              <span className={`timer ${timeLeft <= 10 ? "timer-urgent" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                </svg>
                {timeLeft}
              </span>
              <button className="btn-next" onClick={handleNext} disabled={selectedAnswer === null || !quizStarted}>
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;