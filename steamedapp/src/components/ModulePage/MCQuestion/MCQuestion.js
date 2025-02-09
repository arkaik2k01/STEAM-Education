import React, { useState, useEffect } from "react";
import { testData, fetchMCQuestion } from "../../util/fetchMCQuestion";
import { MCAnswers } from "./MCAnswers";

// Endpoint URL is assigned on the module page
export const MCQuestion = ({ question, answers, onComplete }) => {
  const [feedback, setFeedback] = useState({}); // Tracks feedback for each answer

  // Fetch question and answer
  useEffect(() => {
    if(!onComplete) return;

    const allCorrect = Object.values(feedback).every(f => f.isCorrect);

    if (allCorrect) {
      onComplete();
    }
  }, [feedback, answers, onComplete]);

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <h2 className='text-xl font-semibold text-white mb-6'>
        {/* Display question */}
        {question}
      </h2>
      {/* Display and build answer component */}
      <MCAnswers 
        answers={answers}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    </div>
  );
};