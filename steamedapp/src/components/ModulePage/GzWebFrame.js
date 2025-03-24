import React, { useState, useEffect, useRef } from 'react'; 
import './GzWebFrame.css';
import { SceneManager } from 'gzweb'; 

// Create react functional component 
const GzWebFrame = () => {

    // Create state variables and setter functions 
    const [wsUrl, setWsUrl] = useState(''); // websocket URL
    const [sceneManager, setSceneManager] = useState(null); // SceneManager instance
    const [connectionStatus, setConnectionStatus] = useState(false); // Tracks connection status 

    // Create reference to container where simulation is rendered
    const containerRef = useRef(null);

    // Handle connection to simulation status updates
    useEffect(() => {
        if (sceneManager) {
            const subscription = sceneManager.getConnectionStatusAsObservable().subscribe(
                (status) => {
                    setConnectionStatus(status); 
                }
            );
            return () => {
                subscription.unsubscribe(); 
            };
        }
    }, [sceneManager]);

    // Connect to simulation, creates new SceneManager instance 
    const connect = () => {
        const manager = new SceneManager({
            websocketUrl: wsUrl,
            websocketKey: '',
            elementId: 'container',
        }); 
        setSceneManager(manager); 
    };

    // Take a snapshot of the simulation
    const snapshot = () => {
        if (sceneManager) {
            sceneManager.snapshot(); 
        }
    };

    // Reset view of the simulation
    const resetView = () => {
        if (sceneManager) {
            sceneManager.resetView(); 
        }
    };

    return (
        <>
            <section>
                <div className="form-field"> 
                    <input 
                        id="wsUrl"
                        type="text"
                        value={wsUrl}
                        onChange={(e) => setWsUrl(e.target.value)}
                        placeholder="websocket URL"
                        />
                </div>

                {(!sceneManager || !connectionStatus) && (
                    <button className="primary-button" onClick={connect}>Connect</button>
                )}
                
                {sceneManager && connectionStatus && (
                    <React.Fragment>
                        <button className="primary-button" onClick={snapshot}>Take Screenshot</button>
                        <button className="primary-button" onClick={resetView}>Reset View</button>
                    </React.Fragment>
                )}

            </section>
            <div id="container" ref={containerRef}></div>
        </>
    );

};

export { GzWebFrame };