import React, { useState, useEffect, useRef } from 'react';
import './GzWebFrame.css';
import { SceneManager } from 'gzweb';
import { useParams } from 'react-router-dom';
import { auth } from '../../firebase/services/auth';
import { requiresInfrastructure } from '../../utils/moduleInfoFile';

const GzWebFrame = ({ requiresInfrastructure: propRequiresInfra,
    infrastructureDeployed = false // Don't fully render module if infrastructure is not deployed
}) => {
    // State variables
    const [sceneManager, setSceneManager] = useState(null); // SceneManager instance
    const [connectionStatus, setConnectionStatus] = useState(false); // Tracks connection status
    const [connectionError, setConnectionError] = useState(null); // Tracks connection errors
    const [isRendering, setIsRendering] = useState(false); // Tracks initial rendering state
    const [connectionAttempted, setConnectionAttempted] = useState(false); // Tracks if connection was attempted
    const [isConnecting, setIsConnecting] = useState(false); // Tracks connection in progress

    // Container reference for the simulation
    const containerRef = useRef(null);
    
    // Keep reference to any timeouts we set
    const timeoutRef = useRef(null);

    // Sim back end variables
    const userID = auth.currentUser ? auth.currentUser.uid : 'no-id-user';
    const params = useParams();
    const moduleID = params ? params.moduleId : 'no-id-module';

    const lowercaseUserID = userID.toLowerCase();

    // Websocket URLs
    const simulationURL = `ws://35.209.212.254/${lowercaseUserID}/${moduleID}/simulation`;
    const commandURL = `ws://35.209.212.254/${lowercaseUserID}/${moduleID}/command`;

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
                        setIsConnecting(false);
                        
                        // Clear any connection timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }
                        
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

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (sceneManager) {
                try {
                    // Clean up any SceneManager resources
                    sceneManager.cleanup && sceneManager.cleanup();
                } catch (err) {
                    console.warn('Error during SceneManager cleanup:', err);
                }
            }
            
            // Clear any pending timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [sceneManager]);

    // Connect to simulation, creates new SceneManager instance 
    const connect = () => {
        // Skip connection for modules that don't require infrastructure
        if (!needsInfrastructure) {
            console.log('GzWebFrame: Module doesn\'t require infrastructure - skipping connection');
            return;
        }
    
        // Only attempt connection if infrastructure is deployed
        if (!infrastructureDeployed) {
            console.log('GzWebFrame: Infrastructure not deployed yet - skipping connection');
            setConnectionError('Waiting for infrastructure deployment to complete');
            return;
        }
    
        try {
            console.log('Connecting to simulation:', simulationURL);
            setConnectionAttempted(true);
            setIsConnecting(true);
            setConnectionError(null);
            
            // Set a global connection timeout (3 minutes)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                if (!connectionStatus) {
                    setConnectionError('Connection timed out after 3 minutes. Please try again.');
                    setIsConnecting(false);
                }
            }, 180000); // 3 minutes timeout
    
            // First, send the "start" command through the command WebSocket
            console.log('Opening command socket to initialize simulation:', commandURL);
            const commandSocket = new WebSocket(commandURL);
            
            // Set a connection timeout for the command socket
            const commandSocketTimeout = setTimeout(() => {
                if (commandSocket && commandSocket.readyState !== WebSocket.OPEN) {
                    clearTimeout(timeoutRef.current);
                    setIsConnecting(false);
                    setConnectionError('Command socket connection timed out. Please try again.');
                    try { commandSocket.close(); } catch (e) {}
                }
            }, 30000); // 30 seconds timeout for initial connection
    
            commandSocket.onopen = () => {
                console.log('Command socket opened, sending start command');
                clearTimeout(commandSocketTimeout);
                
                // Send the initialization command
                const startCommand = {
                    term_type: "simulation_terminal",
                    module_id: moduleID,
                    command: "start"
                };
    
                console.log('Sending start command to simulation:', startCommand);
                commandSocket.send(JSON.stringify(startCommand));
            };
            
            // Flag to track if we've already started SceneManager initialization
            let initStarted = false;
            
            commandSocket.onmessage = (event) => {
                console.log('Received response from command socket:', event.data);
                
                // Skip processing if initialization already started
                if (initStarted) return;
                
                // Check for error indicators in the message
                if (typeof event.data === 'string' && 
                    (event.data.includes('Error') || 
                     event.data.includes('error') || 
                     event.data.includes('FATAL') || 
                     event.data.includes('CRITICAL'))) {
                    console.error('Error detected in command socket response:', event.data);
                    setConnectionError(`Simulation error: ${event.data.substring(0, 100)}...`);
                    setIsConnecting(false);
                    clearTimeout(timeoutRef.current);
                    commandSocket.close();
                    return;
                }
                
                // Once we receive any non-error response, we know the command was received
                // Set a flag so we don't re-initialize
                initStarted = true;
                
                // Wait a fixed time delay to allow simulation to start up
                console.log('Received response from simulation, waiting for startup...');
                
                // Clear the overall connection timeout since we've confirmed the simulation is starting
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                
                // Create a new timeout specifically for the initialization delay
                const initTimeoutId = setTimeout(() => {
                    try {
                        // Close the command socket since we're done with it
                        commandSocket.close();
                        
                        console.log('Initializing SceneManager after delay');
                        
                        // Create SceneManager instance after waiting for simulation to start
                        const manager = new SceneManager({
                            websocketUrl: simulationURL,
                            websocketKey: '',
                            elementId: 'container',
                            errorHandler: (err) => {
                                console.error('SceneManager error:', err);
                                setConnectionError(`SceneManager error: ${err.message || 'Unknown error'}`);
                                setIsConnecting(false);
                            }
                        });

                        setSceneManager(manager);
                        setConnectionError(null);
                    } catch (err) {
                        console.error('Error initializing SceneManager:', err);
                        setConnectionError(`Failed to initialize visualization: ${err.message || 'Unknown error'}`);
                        setIsConnecting(false);
                    }
                }, 45000); // Wait 1.5 minutes (90000 ms) to ensure simulation has initialized
                
                // Save this timeout reference so we can clear it if the component unmounts
                timeoutRef.current = initTimeoutId;
            };
    
            commandSocket.onerror = (error) => {
                console.error('Error connecting to command socket:', error);
                setConnectionError('Failed to connect to command endpoint. Please try again.');
                setIsConnecting(false);
                clearTimeout(timeoutRef.current);
                clearTimeout(commandSocketTimeout);
            };
    
            commandSocket.onclose = () => {
                console.log('Command socket closed');
                clearTimeout(commandSocketTimeout);
                // Don't set isConnecting to false here, as we're expecting SceneManager to connect
            };
        } catch (error) {
            console.error('Failed to connect to simulation:', error);
            setConnectionError('Failed to connect to simulation. Please try again later.');
            setIsConnecting(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
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

    // State to track simulation restart progress
    const [isRestarting, setIsRestarting] = useState(false);

    // Restart simulation - send restart command to the simulation endpoint
    const restartSimulation = () => {
        if (!simulationURL || !infrastructureDeployed || !sceneManager) {
            setConnectionError('Cannot restart simulation - no active connection');
            return;
        }

        try {
            // Set restarting state
            setIsRestarting(true);
            setConnectionError(null);

            console.log('Creating temporary WebSocket connection to send restart command');
            const restartSocket = new WebSocket(commandURL);

            restartSocket.onopen = () => {
                // Send restart command to the simulation endpoint
                const restartCommand = {
                    term_type: "simulation_terminal",
                    module_id: moduleID,
                    command: "restart"
                };

                console.log('Sending restart command to simulation:', restartCommand);
                restartSocket.send(JSON.stringify(restartCommand));

                // Close this temporary socket after sending command
                setTimeout(() => restartSocket.close(), 1000);
            };

            restartSocket.onmessage = (event) => {
                console.log('Received restart response:', event.data);
                // Don't try to parse as JSON - just accept any message as confirmation
            };

            restartSocket.onclose = () => {
                console.log('Restart command socket closed');

                // Refresh the view after restart
                if (sceneManager) {
                    try {
                        // Give the simulation time to restart before refreshing the view
                        setTimeout(() => {
                            // Refresh the scene
                            // sceneManager.refresh();
                            sceneManager.resetView();
                            console.log('View refreshed after simulation restart');

                            // Reset restarting state after a short delay
                            setTimeout(() => {
                                setIsRestarting(false);
                            }, 1000);
                        }, 5000); // 5-second delay to allow for restart
                    } catch (err) {
                        console.warn('Error refreshing view after restart:', err);
                        setConnectionError('Error refreshing view after restart.');
                        setIsRestarting(false);
                    }
                } else {
                    setIsRestarting(false);
                }
            };

            restartSocket.onerror = (error) => {
                console.error('Error sending restart command:', error);
                setConnectionError('Failed to restart simulation. Please try again.');
                setIsRestarting(false);
                restartSocket.close();
            };
        } catch (error) {
            console.error('Failed to restart simulation:', error);
            setConnectionError('Failed to restart simulation. Please try again.');
            setIsRestarting(false);
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
                <div className={`px-4 py-2 text-sm ${
                    connectionStatus ? 'bg-green-900 bg-opacity-30 text-green-200' :
                    !infrastructureDeployed ? 'bg-yellow-900 bg-opacity-30 text-yellow-200' :
                    isConnecting ? 'bg-blue-900 bg-opacity-30 text-blue-200' :
                    'bg-red-900 bg-opacity-30 text-red-200'
                }`}>
                    {connectionStatus ? 'Connected to simulation' :
                     !infrastructureDeployed ? 'Waiting for infrastructure deployment...' :
                     isConnecting ? 'Connecting to simulation...' : 
                     'Not connected to simulation'}
                </div>

                {/* Disclaimer about simulation timing */}
                <div className="px-4 py-2 text-xs text-gray-400 bg-gray-800 bg-opacity-50 italic">
                    Note: Simulation setup, connection, and restart actions may take up to a minutes to complete. Please be patient.
                </div>

                {connectionError && (
                    <div className="px-4 py-2 text-sm bg-red-900 bg-opacity-30 text-red-200">
                        {connectionError}
                    </div>
                )}

                <div className="flex items-center px-4 py-2 gap-2">
                    {/* Always show Connect button, but disable it once connected or if infrastructure isn't ready */}
                    <button
                        className="primary-button flex items-center"
                        onClick={connect}
                        disabled={connectionStatus || !simulationURL || !infrastructureDeployed || isConnecting}
                    >
                        {isConnecting && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {connectionStatus
                            ? 'Connected'
                            : isConnecting
                                ? 'Connecting...'
                                : !infrastructureDeployed
                                    ? 'Waiting for Infrastructure'
                                    : 'Connect to Simulation'}
                    </button>

                    {/* Only show these buttons when connected */}
                    {connectionStatus && (
                        <>
                            <button className="primary-button" onClick={snapshot}>Take Screenshot</button>
                            <button className="primary-button" onClick={resetView}>Reset View</button>
                            <button
                                className="primary-button flex items-center"
                                onClick={restartSimulation}
                                disabled={isRestarting}
                            >
                                {isRestarting && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isRestarting ? 'Restarting...' : 'Restart Simulation'}
                            </button>
                        </>
                    )}
                </div>
            </section>

            {/* Simulation container - only render when connected */}
            <div
                id="container"
                ref={containerRef}
                className="flex-grow relative"
                style={{ minHeight: '300px' }}
            >
                {!connectionStatus && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                        <div className="text-center p-6">
                            {!infrastructureDeployed ? (
                                <div className="text-yellow-200 text-lg">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p>Waiting for infrastructure deployment...</p>
                                    <p className="text-sm mt-2 text-gray-300">This process can take up to 2 minutes to complete</p>
                                </div>
                            ) : isConnecting ? (
                                <div className="text-blue-200 text-lg">
                                    <div className="mb-4 relative">
                                        <svg className="animate-spin h-12 w-12 mx-auto text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                    <p>Connecting to simulation...</p>
                                    <p className="text-sm mt-2 text-gray-300">This process can take up to 3 minutes</p>
                                </div>
                            ) : connectionAttempted ? (
                                <div className="text-red-200 text-lg">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p>Connection failed</p>
                                    <p className="text-sm mt-2 text-gray-300">Click the Connect button to try again</p>
                                </div>
                            ) : (
                                <div className="text-white text-lg">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p>Simulation Ready to Connect</p>
                                    <p className="text-sm mt-2 text-gray-300">Click the Connect button above to start</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { GzWebFrame };