import React, { useState, useEffect, useRef } from 'react';
import './GzWebFrame.css';
import { SceneManager } from 'gzweb';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/services/auth';

const GzWebFrame = () => {
    // State variables
    const [sceneManager, setSceneManager] = useState(null); // SceneManager instance
    const [connectionStatus, setConnectionStatus] = useState(false); // Tracks connection status
    const [connectionError, setConnectionError] = useState(null); // Tracks connection errors
    const [isRendering, setIsRendering] = useState(false); // Tracks initial rendering state
    
    // Container reference for the simulation
    const containerRef = useRef(null);

    // Sim back end variables
    const userID = auth.currentUser ? auth.currentUser.uid : 'no-id-user';
    const params = useParams();
    const moduleID = params ? params.moduleId : 'no-id-module';

    // Websocket URL
    const websocketUrl = `ws://35.209.212.254/${userID}/${moduleID}/simulation`;

    // Handle connection to simulation status updates
    useEffect(() => {
        if (sceneManager) {
            const subscription = sceneManager.getConnectionStatusAsObservable().subscribe(
                (status) => {
                    setConnectionStatus(status);
                    // Give the SceneManager time to initialize
                    if (status && !isRendering) {
                        setIsRendering(true);
                        // Delay the first render to avoid ResizeObserver loops
                        setTimeout(() => {
                            if (sceneManager) {
                                try {
                                    sceneManager.resetView();
                                } catch (err) {
                                    console.warn('Error during initial view reset:', err);
                                }
                            }
                        }, 500);
                    }
                }
            );
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [sceneManager, isRendering]);

    // Handle window resize events to properly resize the scene
    useEffect(() => {
        const handleResize = () => {
            // Debounce resize events to avoid ResizeObserver loops
            if (sceneManager) {
                if (window.resizeTimeout) {
                    clearTimeout(window.resizeTimeout);
                }
                window.resizeTimeout = setTimeout(() => {
                    try {
                        sceneManager.refresh();
                    } catch (err) {
                        console.warn('Error during scene refresh:', err);
                    }
                }, 200);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.resizeTimeout) {
                clearTimeout(window.resizeTimeout);
            }
        };
    }, [sceneManager]);

    // Connect to simulation on mount
    useEffect(() => {
        if (websocketUrl && !sceneManager) {
            // Delay connection slightly to ensure DOM is ready
            setTimeout(() => {
                connect();
            }, 100);
        }
        
        // Cleanup function for component unmount
        return () => {
            if (sceneManager) {
                try {
                    // Clean up any SceneManager resources
                    sceneManager.cleanup && sceneManager.cleanup();
                } catch (err) {
                    console.warn('Error during SceneManager cleanup:', err);
                }
            }
        };
    }, [websocketUrl]);

    // Connect to simulation, creates new SceneManager instance 
    const connect = () => {
        try {
            console.log('Connecting to simulation:', websocketUrl);
            
            // Create a new SceneManager with proper error handling
            const manager = new SceneManager({
                websocketUrl: websocketUrl,
                websocketKey: '',
                elementId: 'container',
                // Add error handling options if supported by the SceneManager
                errorHandler: (err) => {
                    console.error('SceneManager error:', err);
                    setConnectionError(`SceneManager error: ${err.message || 'Unknown error'}`);
                }
            });
            
            setSceneManager(manager);
            setConnectionError(null);
        } catch (error) {
            console.error('Failed to connect to simulation:', error);
            setConnectionError('Failed to connect to simulation. Please try again later.');
        }
    };

    // Take a snapshot of the simulation
    const snapshot = () => {
        if (sceneManager) {
            try {
                sceneManager.snapshot();
            } catch (err) {
                console.warn('Error taking snapshot:', err);
                setConnectionError('Failed to take snapshot. Please try again.');
            }
        }
    };

    // Reset view of the simulation
    const resetView = () => {
        if (sceneManager) {
            try {
                sceneManager.resetView();
            } catch (err) {
                console.warn('Error resetting view:', err);
                setConnectionError('Failed to reset view. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <section className="flex-shrink-0">
                {/* Connection status and controls */}
                <div className={`px-4 py-2 text-sm ${connectionStatus ? 'bg-green-900 bg-opacity-30 text-green-200' : 'bg-red-900 bg-opacity-30 text-red-200'}`}>
                    {connectionStatus ? 'Connected to simulation' : 'Connecting to simulation...'}
                </div>
                
                {connectionError && (
                    <div className="px-4 py-2 text-sm bg-red-900 bg-opacity-30 text-red-200">
                        {connectionError}
                    </div>
                )}
                
                <div className="flex items-center px-4 py-2 gap-2">
                    {(!sceneManager || !connectionStatus) && (
                        <button 
                            className="primary-button" 
                            onClick={connect}
                            disabled={!websocketUrl}
                        >
                            Connect
                        </button>
                    )}
                    
                    {sceneManager && connectionStatus && (
                        <>
                            <button className="primary-button" onClick={snapshot}>Take Screenshot</button>
                            <button className="primary-button" onClick={resetView}>Reset View</button>
                        </>
                    )}
                </div>
            </section>
            
            {/* Simulation container */}
            <div 
                id="container" 
                ref={containerRef} 
                className="flex-grow relative"
                style={{ minHeight: '300px' }}
            >
                {!connectionStatus && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="text-white text-lg">Loading simulation...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { GzWebFrame };