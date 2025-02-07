import React, { useState, useEffect } from "react";
import { testData, fetchMCQuestion } from "../../util/fetchMCQuestion";
import { MCAnswers } from "./MCAnswers";

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
        {/* Display question */}
        {questions.question}
      </h2>
      {/* Display and build answer component */}
      <MCAnswers 
        answers={questions.answers}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    </div>
  );
};