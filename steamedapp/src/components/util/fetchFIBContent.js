// Gathers text content from the server
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