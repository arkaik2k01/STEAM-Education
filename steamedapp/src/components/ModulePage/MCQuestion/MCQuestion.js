import React, { useState, useEffect, useRef } from "react";
import { MCAnswers } from "./MCAnswers";
import MarkdownText from "../../MarkdownText";

// Endpoint URL is assigned on the module page
export const MCQuestion = ({ mcq_content, onComplete }) => {
  const [feedback, setFeedback] = useState({}); // Tracks feedback for each answer
  const hasCompletedRef = useRef(false); // Track if onComplete has been called, prevents infinite loop

  // Fetch question and answer
  useEffect(() => {
    if(!onComplete || hasCompletedRef.current) return;

    const hasCorrectAnswer = Object.values(feedback).some(f => f.isCorrect);

    if (hasCorrectAnswer) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [feedback, onComplete]);

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <h2 className='text-xl font-semibold text-white mb-6'>
        {/* Display question with markdown support */}
        <MarkdownText 
          content={mcq_content.question} 
          size="text-xl"
          color="text-white"
        />
      </h2>
      {/* Display and build answer component */}
      <MCAnswers 
        options={mcq_content?.options || []}
        correctAnswer={mcq_content.correctAnswer}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    </div>
  );
};