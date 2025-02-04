//  *** DEBUG ***
export const testData = {
    text: 'This is a text ____ with a fill in the ____ question using drag and ____.', // Blanks MUST be 4 underscores
    keywords: ['blank', 'sentence', 'drop'], // Keywords to drag
    answer_key: ['sentence', 'blank', 'drop'] // Correct order of keywords
}

// Gathers text content from the server, given a url
export const fetchFIBContent = async (url) => {
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