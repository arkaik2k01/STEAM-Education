//  *** DEBUG ***
export const testData = {
    text: 'This is a text ____ with a fill in the ____ question using drag and ____.',
    keywords: ['sentence', 'blank', 'drop'],
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