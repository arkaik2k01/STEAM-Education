import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase/services/auth';
import { useParams } from 'react-router-dom';

export const TeleopControls = (
    { hasMonPyConnected }
) => {
    // State
    const [socket, setSocket] = useState(null);
    const MonPyExists = hasMonPyConnected;
    const [connected, setConnected] = useState(hasMonPyConnected);
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState(null);
    
    // Get user info for command connection
    const userID = auth.currentUser ? auth.currentUser.uid : 'no-id-user';
    const params = useParams();
    const moduleID = params ? params.moduleId : null;

    // --- Websocket setup ---
    const lowercaseUserID = userID.toLowerCase();
    const commandEndpoint = `wss://35.209.212.254/${lowercaseUserID}/${moduleID}/command`;
    // -----------------------
    // Establish a connection to websocket
    const connectToServerWithPromise = () => {
        return new Promise((resolve, reject) => {
            try {
                console.log('Connecting teleop controls to command endpoint:', commandEndpoint);
                const ws = new WebSocket(commandEndpoint);
                
                ws.onopen = () => {
                    console.log('Teleop controls connected to command server');
                    setConnected(true);
                    setError(null);
                    resolve(ws);
                };
                
                ws.onmessage = (event) => {
                    console.log('Teleop received response:', event.data);
                    try {
                        const response = JSON.parse(event.data);
                        if (response.error) {
                            setError(response.error);
                        }
                    } catch (err) {
                        console.error('Error parsing teleop response:', err);
                    }
                };
                
                ws.onerror = (err) => {
                    console.error('Teleop WebSocket error:', err);
                    setError('Connection error. Controls may not work.');
                    setConnected(false);
                    reject(err);
                };
                
                ws.onclose = () => {
                    console.log('Teleop WebSocket connection closed');
                    setConnected(false);
                };
                
                setSocket(ws);
            } catch (err) {
                console.error('Error setting up Teleop WebSocket:', err);
                setError('Failed to establish connection for robot controls');
                reject(err);
            }
        });
    };

    // Array of control buttons with their labels, keycodes, and descriptions
    const controlButtons = [
        // Movement controls (main grid)
        { key: 'i', label: '↑', description: 'Forward', className: 'col-start-2', group: 'movement' },
        { key: 'j', label: '←', description: 'Turn Left', className: '', group: 'movement' },
        { key: 'k', label: '●', description: 'Stop', className: '', group: 'movement' },
        { key: 'l', label: '→', description: 'Turn Right', className: '', group: 'movement' },
        { key: ',', label: '↓', description: 'Backward', className: 'col-start-2', group: 'movement' },
        
        // Speed controls (separate section)
        { key: 'q', label: 'Q', description: 'Increase max speeds', className: '', group: 'speed' },
        { key: 'z', label: 'Z', description: 'Decrease max speeds', className: '', group: 'speed' },
        { key: 'w', label: 'W', description: 'Increase linear speed', className: '', group: 'speed' },
        { key: 'x', label: 'X', description: 'Decrease linear speed', className: '', group: 'speed' },
        { key: 'e', label: 'E', description: 'Increase angular speed', className: '', group: 'speed' },
        { key: 'c', label: 'C', description: 'Decrease angular speed', className: '', group: 'speed' },
    ];

    // Filter buttons by group
    const movementButtons = controlButtons.filter(btn => btn.group === 'movement');
    const speedButtons = controlButtons.filter(btn => btn.group === 'speed');

    // Connect to the command endpoint when enabled
    useEffect(() => {
        const connectToServer = async () => {
            try {
                console.log('Connecting teleop controls to command endpoint:', commandEndpoint);
                const ws = new WebSocket(commandEndpoint);
                
                ws.onopen = () => {
                    console.log('Teleop controls connected to command server');
                    setConnected(true);
                    setError(null);
                };
                
                ws.onmessage = (event) => {
                    console.log('Teleop received response:', event.data);
                    try {
                        const response = JSON.parse(event.data);
                        if (response.error) {
                            setError(response.error);
                        }
                    } catch (err) {
                        console.error('Error parsing teleop response:', err);
                    }
                };
                
                ws.onerror = (err) => {
                    console.error('Teleop WebSocket error:', err);
                    setError('Connection error. Controls may not work.');
                    setConnected(false);
                };
                
                ws.onclose = () => {
                    console.log('Teleop WebSocket connection closed');
                    setConnected(false);
                };
                
                setSocket(ws);
                
                return () => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.close();
                    }
                };
            } catch (err) {
                console.error('Error setting up Teleop WebSocket:', err);
                setError('Failed to establish connection for robot controls');
            }
        };
        
        connectToServer();
    }, [commandEndpoint, moduleID]);

    // Send keystroke input to interactive terminal
    const sendKeystroke = (keystroke) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setError('Not connected to server. Please try refreshing the page.');
            return;
        }

        try {
            // Construct payload according to WebSocketDoc.md
            const payload = {
                module_id: moduleID,
                term_type: "general_terminal",
                python_script: "", // Empty since code was already submitted
                interactive_input: keystroke // This is the input for interactive terminal
            };

            console.log(`Sending keystroke: ${keystroke}`);
            socket.send(JSON.stringify(payload));
            
            // Highlight the active key briefly
            setActiveKey(keystroke);
            setTimeout(() => setActiveKey(null), 300);
        } catch (err) {
            console.error('Error sending keystroke:', err);
            setError(`Failed to send command: ${err.message}`);
        }
    };

    // Create button element
    const renderButton = (button) => (
        <button
            key={button.key}
            onClick={() => sendKeystroke(button.key)}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md
                      hover:bg-blue-700
                      disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed
                      ${button.className} 
                      ${activeKey === button.key ? 'ring-2 ring-yellow-400 bg-blue-700' : ''}`}
            disabled={!connected}
            title={button.description}
            aria-label={button.description}
        >
            {button.label}
        </button>
    );

    return (
        <div className="bg-opacity-20 bg-gray-800 rounded-lg p-6">
            <div className="border-b border-gray-700 pb-4 mb-4 flex justify-between items-center">
                <h3 className="text-white text-lg font-medium">Robot Controls</h3>
                
                {/* Connection status */}
                <div className={`px-3 py-1 text-sm rounded-full ${
                    connected ? 'bg-green-900 bg-opacity-30 text-green-200' : 
                    'bg-red-900 bg-opacity-30 text-red-200'
                }`}>
                    {connected ? 'Connected' : 'Not Connected'}
                </div>
            </div>
            
            {/* Error message */}
            {error && (
                <div className="p-3 bg-red-900 bg-opacity-20 text-red-200 border border-red-500 rounded mb-4">
                    {error}
                </div>
            )}
            
            {/* Controls explanation */}
            <p className="text-gray-300 mb-4">
                Use these controls to move the robot in the simulation.
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Movement controls */}
                <div>
                    <h4 className="text-white text-sm font-medium mb-2">Movement</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {movementButtons.map(renderButton)}
                    </div>
                </div>
                
                {/* Speed controls */}
                <div>
                    <h4 className="text-white text-sm font-medium mb-2">Speed Adjustment</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {speedButtons.map(renderButton)}
                    </div>
                </div>
            </div>
            
            {/* Keyboard legend */}
            <div className="mt-4 p-3 bg-gray-800 bg-opacity-50 rounded-md text-xs text-gray-300">
                <p className="font-medium mb-1">Keyboard Controls:</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <li><span className="text-white font-mono">i</span>: move forward</li>
                    <li><span className="text-white font-mono">,</span>: move backward</li>
                    <li><span className="text-white font-mono">j</span>: turn left</li>
                    <li><span className="text-white font-mono">l</span>: turn right</li>
                    <li><span className="text-white font-mono">k</span>: stop</li>
                    <li><span className="text-white font-mono">q/z</span>: increase/decrease max speeds</li>
                    <li><span className="text-white font-mono">w/x</span>: increase/decrease linear speed</li>
                    <li><span className="text-white font-mono">e/c</span>: increase/decrease angular speed</li>
                </ul>
            </div>
        </div>
    );
};