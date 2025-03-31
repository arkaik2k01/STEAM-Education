import React, { useState, useEffect, useRef } from 'react';
import './GzWebFrame.css';
import { SceneManager } from 'gzweb';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/services/auth';
import { requiresInfrastructure } from '../../utils/moduleInfoFile';

const GzWebFrame = ({ requiresInfrastructure: propRequiresInfra }) => {
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

    // Determine if this module requires infrastructure
    // Use prop if provided, otherwise check moduleConfig
    const needsInfrastructure = propRequiresInfra !== undefined 
        ? propRequiresInfra 
        : requiresInfrastructure(moduleID);

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

    // Connect to simulation on mount - only if module requires infrastructure
    useEffect(() => {
        // Only attempt to connect if the module requires infrastructure
        if (websocketUrl && !sceneManager && needsInfrastructure) {
            console.log('GzWebFrame: Attempting to connect to simulation');
            // Delay connection slightly to ensure DOM is ready
            setTimeout(() => {
                connect();
            }, 100);
        } else if (!needsInfrastructure) {
            console.log(`GzWebFrame: Module ${moduleID} doesn't require infrastructure - skipping simulation connection`);
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
    }, [websocketUrl, needsInfrastructure, moduleID]);

    // Connect to simulation, creates new SceneManager instance 
    const connect = () => {
        // Skip connection for modules that don't require infrastructure
        if (!needsInfrastructure) {
            console.log('GzWebFrame: Module doesn\'t require infrastructure - skipping connection');
            return;
        }
        
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

    // Render the placeholder for modules that don't require infrastructure
    const renderPlaceholder = () => {
        return (
            <div className="flex flex-col h-full bg-gray-800 bg-opacity-30 p-6 rounded-lg">
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <div className="w-24 h-24 mb-6 rounded-full bg-blue-600 bg-opacity-30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Interactive Simulations Coming Soon!</h3>
                    <p className="text-blue-200 mb-6">
                        In upcoming modules, this area will display interactive 3D robotics simulations where you can 
                        experiment with your code and see real-time results.
                    </p>
                    <div className="bg-black bg-opacity-20 p-4 rounded-lg text-green-300 mb-6">
                        <p className="mb-2 font-semibold">You'll be able to:</p>
                        <ul className="text-left space-y-2">
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Control virtual robots with your own code
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Visualize sensor data and algorithms in real-time
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Test and debug in a safe, virtual environment
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Learn robotics concepts through hands-on experimentation
                            </li>
                        </ul>
                    </div>
                    <p className="text-gray-400 italic">
                        Continue through this module to prepare for the exciting simulations ahead!
                    </p>
                </div>
            </div>
        );
    };

    // For modules that don't require infrastructure, show placeholder
    if (!needsInfrastructure) {
        console.log('GzWebFrame: Rendering placeholder for module without infrastructure');
        return renderPlaceholder();
    }

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