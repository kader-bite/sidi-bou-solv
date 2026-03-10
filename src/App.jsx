// src/App.jsx
import React, { useState } from "react";
import QuizGenre from "./componts/QuizGenre/QuizGenre";
import Quiz from "./componts/Quiz/Quiz";
import "./index.css";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  return selectedGenre ? (
    <Quiz genre={selectedGenre} onFinish={() => setSelectedGenre(null)} />
  ) : (
    <QuizGenre onSelectGenre={(genre) => setSelectedGenre(genre)} />
  );
};

export default App;