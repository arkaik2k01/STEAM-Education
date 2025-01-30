import React, { useState, useEffect } from "react";
import { testData, fetchMCQuestion } from "./util/fetchMCQuestion";

// Endpoint URL is assigned on the module page
export const MCQuestion = ({ endpoint }) => {
  const [questions, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState({}); // Tracks feedback for each answer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch question and answer
  useEffect(() => {
    setQuestion(testData);
    setLoading(false);

    // const fetchQuestion = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await fetchMCQuestion(endpoint);
    //     setQuestion(data);
    //   } catch (error) {
    //     console.error("Error fetching question data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchQuestion();
  }, [endpoint]);

  // Handle answer selection. On click of a answer, give feedback if the answer is correct or not
  const handleAnswerClick = (index, isCorrect) => {
    setFeedback(prev => ({
      ...prev,
      [index]: {
        status: isCorrect ? "Correct" : "Incorrect",
        isCorrect
      }
    }));
  };

  //Determine if the answer selected is correct and apply corresponding style
  const getButtonStyles = (index) => {
    if (!feedback[index]) {
      return "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800";
    }

    return feedback[index].isCorrect
      ? "bg-green-50 border-green-500 text-green-700"
      : "bg-red-50 border-red-500 text-red-700";
  };

  // Loading message
  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-gray-600'>Loading question...</div>
      </div>
    );
  }

  //If this shows up something really bad happened
  if (error) {
    return (
      <div className='p-4 bg-red-50 text-red-700 rounded-md'>
        <div className='text-red-600'>Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        {questions.question}
      </h2>
      <div className="space-y-4">
        {questions.answers.map((answer, index) => (
          <div key={index} className="flex items-center space-x-4">
            <button
              onClick={() => handleAnswerClick(index, answer.isCorrect)}
              className={`flex-1 p-4 text-left rounded-md transition-all duration-200
                ${getButtonStyles(index)} border`}
              disabled={feedback[index]}
            >
              {answer.text}
            </button>
            {feedback[index] && (
              <span className={`font-medium ${feedback[index].isCorrect
                  ? "text-green-600"
                  : "text-red-600"
                }`}>
                {feedback[index].isCorrect ? "✓" : "✗"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
