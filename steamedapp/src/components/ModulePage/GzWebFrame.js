import React, { useState, useEffect } from 'react';

export const GzWebFrame = () => {
    const [gzWebURL, setGzWebURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch URL to display
    const fetchGzWebURL = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(""); // URL END POINT GOES HERE
            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            }
            const message = await response.json();

            if (message && message.url) { // MIGHT HAVE TO CHANGE DEPENDING OF FORMATTING OF END POINTS
                setGzWebURL(message.url);
            } else {
                throw new Error("A unexpected message was received. Wrong formatting or wrong message");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Finalize loading
        }
    };

    //On mount, we fetch the URL
    useEffect(() => {
        fetchGzWebURL();
    }, []);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && gzWebURL && (
                <iframe>
                    src={gzWebUrl}
                    title="GzWeb Viewer"
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                </iframe>
            )}
        </div>
    )
}