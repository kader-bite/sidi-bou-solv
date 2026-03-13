import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/SideBar";
import "./Quiz.css";

const Quiz = ({ genre, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [quizReady, setQuizReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const encodedGenre = encodeURIComponent(genre);
        const res = await fetch(`http://localhost:5000/api/questions/${encodedGenre}`);
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [genre]);

  const current = questions[currentIndex];

  // Countdown starts after loading is done
  useEffect(() => {
    if (loading || quizReady) return;
    if (countdown === 0) { setQuizReady(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, quizReady, loading]);

  // 60s quiz timer
  useEffect(() => {
    if (!quizReady || quizFinished) return;
    if (timeLeft === 0) { setQuizFinished(true); return; }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [quizReady, timeLeft, quizFinished]);

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

  if (error) return (
    <div className="container">
      <Sidebar />
      <div className="questions-section">
        <div className="quiz-card">
          <div className="question-box">
            <h2 className="question-title">⚠️ Error</h2>
            <p className="question-text">{error} — make sure the API is running on port 5000</p>
          </div>
          <button className="btn-next" onClick={onFinish}>← Back</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Sidebar />
      <div className="questions-section">

        {/* Loading or countdown overlay */}
        {(loading || !quizReady) && (
          <div className="countdown-overlay">
            <div className="countdown-box">
              {loading ? (
                <>
                  <p className="countdown-label">Loading questions...</p>
                  <span className="countdown-spinner" />
                </>
              ) : (
                <>
                  <p className="countdown-label">Quiz starts in</p>
                  <span className="countdown-number" key={countdown}>{countdown}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="nav-btn">
          <p className="slogan">{genre}</p>
          <div className="start-btn">
            <button className="btn-outline" onClick={onFinish}>← Back</button>
          </div>
        </div>

        {quizFinished ? (
          <div className="quiz-card">
            <div className="question-box">
              <h2 className="question-title">
                {timeLeft === 0 ? "⏰ Time's Up!" : "Quiz Complete! 🎉"}
              </h2>
              <p className="question-text">
                You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
              </p>
            </div>
            <button className="btn-next" onClick={onFinish}>Back to Quizzes</button>
          </div>
        ) : current ? (
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
                  disabled={!quizReady || (selectedAnswer !== null && index !== current.correct && index !== selectedAnswer)}
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
              <button
                className="btn-next"
                onClick={handleNext}
                disabled={selectedAnswer === null}
              >
                Next ▶
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quiz;