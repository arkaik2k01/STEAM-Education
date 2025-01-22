import React, { useState, useEffect } from "react";

// Endpoint URL is assigned on the module page
const MultipleChoiceQuestion = ({ endpoint }) => {
  const [questions, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState({}); // Tracks feedback for each answer

  // Fetch question and answer
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchQuestion();
  }, [endpoint]);

  // Handle answer selection. On click of a answer, give feedback if the answer is correct or not
  const handleAnswerClick = (index, isCorrect) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [index]: isCorrect ? "Correct" : "Incorrect",
    }));
  };

  if (!questions) {
    return <div>Loading question...</div>;
  }

  return (
    <div>
      <h2>{questions.question}</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {questions.answers.map((answer, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => handleAnswerClick(index, answer.isCorrect)}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {answer.text}
            </button>
            {feedback[index] && (
              <span
                style={{
                  marginLeft: "10px",
                  color: feedback[index] === "Correct" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {feedback[index]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultipleChoiceQuestion;
