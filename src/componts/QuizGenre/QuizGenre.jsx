import React from "react";
import Sidebar from "../SideBar/SideBar";
import "./QuizGenre.css";

const genres = [
  { title: "General Knowledge", icon: "🧠", description: "A bit of everything!" },
  { title: "Science", icon: "🔬", description: "Physics, chemistry & more" },
  { title: "History", icon: "📜", description: "Past events & civilizations" },
  { title: "Geography", icon: "🌍", description: "Countries, capitals & maps" },
  { title: "Entertainment", icon: "🎬", description: "Movies, music & pop culture" },
  { title: "Sports", icon: "⚽", description: "Athletes & competitions" },
  { title: "Technology", icon: "💻", description: "Tech, AI & innovations" },
  { title: "Literature", icon: "📚", description: "Books, authors & poetry" },
  { title: "Personality", icon: "🌟", description: "Discover who you are" },
];

const QuizGenre = ({ onSelectGenre }) => {
  return (
    <div className="container">
      <Sidebar />
      <div className="genre-section">
        <div className="genre-header">
          <h1>Choose a Quiz</h1>
          <p>Select a category to start playing</p>
        </div>
        <div className="genre-grid">
          {genres.map((genre) => (
            <div
              key={genre.title}
              className="genre-card"
              onClick={() => onSelectGenre(genre.title)}
            >
              <span className="genre-icon">{genre.icon}</span>
              <h3 className="genre-title">{genre.title}</h3>
              <p className="genre-desc">{genre.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGenre;