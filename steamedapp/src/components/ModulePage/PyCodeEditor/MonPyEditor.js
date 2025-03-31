import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { auth } from '../../../firebase/services/auth';
import { TeleopControls } from './TeleopControls';
import { useParams } from 'react-router-dom';

export const MonPyEditor = ({
    code_content,
    onComplete,
    codeEndpoint
}) => {
    // General states
    const [editorContent, setEditorContent] = useState('# Loading module . . .');
    const [terminalType, setTerminalType] = useState('gen_terminal'); // Default terminal type
    const [showTeleopControls, setShowTeleopControls] = useState(false); // Add missing state
    const [editorHeight, setEditorHeight] = useState('300px'); // Control editor height
    const editorContainerRef = useRef(null);

    // Websocket connection
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    // UI states
    const [submitting, setSubmitting] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const editorRef = useRef(null);

    // Get user info for simulation/command connection
    const userID = auth.currentUser ? auth.currentUser.uid : 'no-id-user';
    const questionID = code_content?.id || 'invalid-id';
    const params = useParams();
    const moduleID = params ? params.moduleId : null;

    // Initial setup
    useEffect(() => {
        if (code_content) {
            setEditorContent(code_content.code || '# A error has occurred when gathering the code.');
        }

        if (code_content.terminalType) {
            setTerminalType(code_content.terminalType);
        }
    }, [code_content]);

    // Calculate editor height based on container
    useLayoutEffect(() => {
        if (!editorContainerRef.current) return;

        // Use ResizeObserver to handle container size changes
        const resizeObserver = new ResizeObserver((entries) => {
            // Use requestAnimationFrame to avoid ResizeObserver loop errors
            window.requestAnimationFrame(() => {
                if (!entries.length) return;

                const containerHeight = entries[0].contentRect.height;
                // Set height slightly smaller than container to avoid overflow
                setEditorHeight(`${Math.max(200, containerHeight - 80)}px`);
            });
        });

        resizeObserver.observe(editorContainerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Web socket setup
    useEffect(() => {
        if (!codeEndpoint) return;

        try {
            // GATEWAY_IP: ws://35.209.212.254/{userID}/{moduleID}/command
            let user_ws = `ws://35.209.212.254/${userID}/${moduleID}/command`;
            console.log('Connecting to websocket:', user_ws);
            const ws = new WebSocket(user_ws);

            // Set up message handler to receive responses
            ws.onmessage = (event) => {
                console.log('Received response:', event.data);
                try {
                    const response = JSON.parse(event.data);
                    setResult(response);
                    setSubmitting(false);
                } catch (err) {
                    console.error('Error parsing response:', err);
                    setError(new Error('Received invalid response from server'));
                    setSubmitting(false);
                }
            };

            // Open connection to websocket
            ws.onopen = () => {
                console.log('Websocket connected');
                setConnected(true);
                setError(null);
            }

            // Catch and display errors
            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError(new Error('Connection error. Please try again.'));
                setConnected(false);
                setSubmitting(false);
            };

            // Close connection
            ws.onclose = () => {
                console.log('WebSocket connection closed');
                setConnected(false);
            };

            setSocket(ws);

            // Clean up WebSocket on component unmount
            return () => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        } catch (err) {
            console.error('Error setting up WebSocket:', err);
            setError(new Error('Failed to establish connection'));
        }
    }, [codeEndpoint, userID, moduleID, questionID, terminalType]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;

        // Delay layout operations to avoid ResizeObserver loop errors
        setTimeout(() => {
            editor.layout();
        }, 100);
    }

    // Submit code to server
    const handleSubmit = async () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setError(new Error('Not connected to server. Please refresh the page.'));
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const code = editorRef.current.getValue();

            const payload = {
                question_id: questionID,
                term_type: terminalType,
                python_script: code,
                interactive_input: null // Default value, used for keystrokes in interactive mode
            };

            console.log('Sending code to server:', payload);
            socket.send(JSON.stringify(payload));
            // Now that we have established a connection, we can show the teleop controls
            if (terminalType === 'interactive_terminal') {
                setShowTeleopControls(true);
            }
        } catch (err) {
            setError(err);
            console.error('Error submitting code:', err);
            setSubmitting(false);
        }
    };

    // Send keystroke input to interactive terminal
    const sendKeystroke = (keystroke) => {
        if (!socket || socket.readyState !== WebSocket.OPEN || terminalType !== 'interactive_terminal') {
            setError(new Error('Not connected to server. Please refresh the page.'));
            return;
        }

        try {
            const payload = {
                question_id: code_content?.id || 'unknown',
                term_type: 'interactive_terminal',
                python_script: editorRef.current.getValue(),
                interactive_input: keystroke
            };

            console.log(`Sending keystroke: ${keystroke}`);
            socket.send(JSON.stringify(payload));
        } catch (err) {
            console.error('Error sending keystroke:', err);
        }
    };

    // Reset code editor
    const handleReset = () => {
        setResetting(true);
        setError(null);
        setResult(null);

        if (code_content && editorRef.current) {
            editorRef.current.setValue(code_content.code);
        }

        setResetting(false);
    }

    return (
        <div
            ref={editorContainerRef}
            className='flex flex-col bg-opacity-20 bg-gray-800 rounded-lg overflow-hidden'
            style={{ height: '100%', maxHeight: '500px' }}
        >
            {/* Connection status indicator */}
            <div className={`px-4 py-2 text-sm ${connected ? 'bg-green-900 bg-opacity-30 text-green-200' : 'bg-red-900 bg-opacity-30 text-red-200'}`}>
                {connected ? 'Connected to server' : 'Disconnected from server'}
            </div>

            {/* Editor component */}
            <div className='flex-grow' style={{ height: editorHeight, minHeight: '200px' }}>
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={editorContent}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontSize: 14,
                        tabSize: 4,
                        renderWhitespace: 'selection',
                        formatOnType: true,
                        suggest: {
                            snippetsPreventQuickSuggestions: false
                        },
                        // Python-specific options
                        bracketPairColorization: { enabled: true },
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        autoIndent: 'full',
                        formatOnPaste: true,
                    }}
                    onMount={handleEditorMount}
                />
            </div>

            {/* Controls section */}
            <div className="flex flex-col bg-opacity-30 bg-gray-900">
                {/* Status messages */}
                <div className="px-4 py-2">
                    {submitting && (
                        <span className="text-gray-300">
                            Submitting code...
                        </span>
                    )}
                    {error && (
                        <span className="text-red-400">
                            {error.message}
                        </span>
                    )}
                    {result && !error && (
                        <span className="text-green-400">
                            {result.output || 'Code submitted successfully!'}
                        </span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleReset}
                        disabled={!code_content || resetting}
                        className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 
                        disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        {resetting ? 'Resetting...' : 'Reset Code'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!connected || submitting}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                                     disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit Code'}
                    </button>
                </div>

                {/* Interactive terminal controls - only shown for interactive terminals after successful code submission */}
                {terminalType === 'interactive_terminal' && showTeleopControls && (
                    <TeleopControls
                        sendKeystroke={sendKeystroke}
                        disabled={!connected || submitting}
                    />
                )}
            </div>
        </div>
    );
};