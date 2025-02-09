import React, { useState, useEffect } from 'react';

export const GzWebFrame = ({ endpoint }) => {
    const [gzWebURL, setGzWebURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch URL to display
    const fetchGzWebURL = async () => {
        if (!endpoint) {
            setError(new Error('No endpoint provided'));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint); // URL END POINT GOES HERE
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
    }, [endpoint]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-opacity-10 bg-white">
                <div className="text-white">Loading simulation...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-opacity-10 bg-white">
                <div className="text-red-400 p-4">
                    Error loading simulation: {error.message}
                </div>
            </div>
        );
    }


    return (
        <div className="h-full w-full">
            {gzWebURL ? (
                <iframe
                    src={gzWebURL}
                    title="GzWeb Simulation Viewer"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                />
            ) : (
                <div className="flex items-center justify-center h-full bg-opacity-10 bg-white">
                    <div className="text-white">No simulation URL available</div>
                </div>
            )}
        </div>
    )
}