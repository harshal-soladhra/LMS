import React, { useState } from 'react';

const quizQuestions = [
  {
    question: "Harry Potter and the ___ of Secrets",
    options: ["Chamber", "Goblet", "Prisoner", "Stone"],
    correctAnswer: "Chamber",
    type: "title",
  },
  {
    question: "Atomic ______",
    options: ["Guru", "Habits", "Noon", "Heat"],
    correctAnswer: "Habits",
    type: "title",
  },
  {
    question: "___ of the Rings",
    options: ["Lord", "King", "Prince", "Knight"],
    correctAnswer: "Lord",
    type: "title",
  },
  {
    question: "The Great ______",
    options: ["Gatsby", "Expectations", "Adventure", "Escape"],
    correctAnswer: "Gatsby",
    type: "title",
  },
  {
    question: "___ New World",
    options: ["Brave", "Lost", "New", "Dark"],
    correctAnswer: "Brave",
    type: "title",
  },
  {
    question: "Author of 'Pride and Prejudice': ______ Austen",
    options: ["Jane", "Emily", "Charlotte", "Anne"],
    correctAnswer: "Jane",
    type: "author",
  },
  {
    question: "Author of '1984': George ______",
    options: ["Orwell", "Eliot", "Hemingway", "Fitzgerald"],
    correctAnswer: "Orwell",
    type: "author",
  },
  {
    question: "The Catcher in the ______",
    options: ["Rye", "Wheat", "Corn", "Field"],
    correctAnswer: "Rye",
    type: "title",
  },
  {
    question: "Author of 'To Kill a Mockingbird': ______ Lee",
    options: ["Harper", "Virginia", "Sylvia", "Margaret"],
    correctAnswer: "Harper",
    type: "author",
  },
  {
    question: "A Game of ______",
    options: ["Thrones", "Kings", "Swords", "Crowns"],
    correctAnswer: "Thrones",
    type: "title",
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 5);
      setIsCorrect(true);
    } else {
      setScore(score - 2);
      setIsCorrect(false);
    }
    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }, 1000);
  };

  const getOptionColor = (option) => {
    if (selectedOption === null) return "bg-white hover:bg-blue-100";
    if (option === quizQuestions[currentQuestion].correctAnswer) return "bg-green-400";
    if (option === selectedOption) return "bg-red-400";
    return "bg-white";
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Book Quiz</h1>
          <div className="text-lg font-semibold text-blue-800">
            Score: <span className="text-blue-600">{score}</span>
          </div>
        </div>
        {currentQuestion < quizQuestions.length ? (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium text-blue-700 mb-4">
              {quizQuestions[currentQuestion].question}
            </h2>
            <div className="grid gap-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${getOptionColor(option)} border border-blue-200 hover:shadow-md ${
                    selectedOption === null ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Quiz Completed!</h2>
            <p className="text-lg text-blue-700">Your final score: <span className="font-bold">{score}</span></p>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setSelectedOption(null);
                setIsCorrect(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;