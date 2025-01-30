// *** DEBUG ***
export const testData = {
    question: 'This is a multiple choice question.',
    answers: [
        { text: 'Incorrect', isCorrect: false },
        { text: 'Incorrect', isCorrect: false },
        { text: 'Correct', isCorrect: true },
        { text: 'Incorrect', isCorrect: false },
    ]
}

// Gathers question text and answers from backend, given a url
export const fetchMCQuestion = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to connect.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a error fetching module content:', error);
    }
}