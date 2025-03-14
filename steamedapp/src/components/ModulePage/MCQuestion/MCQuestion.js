import React, { useState, useEffect } from "react";
import { testData, fetchMCQuestion } from "../../util/fetchMCQuestion";
import { MCAnswers } from "./MCAnswers";

// Endpoint URL is assigned on the module page
export const MCQuestion = ({ questionData, onComplete }) => {
  const [feedback, setFeedback] = useState({}); // Tracks feedback for each answer

  // Fetch question and answer
  useEffect(() => {
    if(!onComplete) return;

    const hasCorrectAnswer = Object.values(feedback).some(f => f.isCorrect);

    if (hasCorrectAnswer) {
      onComplete();
    }
  }, [feedback, onComplete]);

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <h2 className='text-xl font-semibold text-white mb-6'>
        {/* Display question */}
        {questionData.question}
      </h2>
      {/* Display and build answer component */}
      <MCAnswers 
        options={questionData.options}
        correctAnswer={questionData.correctAnswer}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    </div>
  );
};