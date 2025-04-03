import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { auth } from '../../../firebase/services/auth';
import { useParams } from 'react-router-dom';
import { TeleopControls } from './TeleopControls';

export const MonPyEditor = ({
    code_content,
    onComplete,
    infrastructureDeployed = false, // Don't fully render module if infrastructure is not deployed
    onCodeExecuted = null // Callback for when code is successfully executed (for interactive questions)
}) => {
    // Editor states
    const [editorContent, setEditorContent] = useState('# Loading module...');
    const [editorHeight, setEditorHeight] = useState('300px');
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);

    // Connection states
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectionProgress, setConnectionProgress] = useState(0);

    // Execution states
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resetting, setResetting] = useState(false);

    // Teleop control states
    const isInteractive = code_content?.interactive_terminal || false;
    const [showTeleop, setShowTeleop] = useState(false);

    // Get user info for command connection
    const userID = auth.currentUser ? auth.currentUser.uid : 'no-id-user';
    const params = useParams();
    const moduleID = params ? params.moduleId : null;
    const questionID = code_content?.id || 'invalid-id';

    // --- Websocket setup ---
    const lowercaseUserID = userID.toLowerCase();
    const commandEndpoint = `wss://35.209.212.254/${lowercaseUserID}/${moduleID}/command`;
    // -----------------------
    // Establish a connection to websocket
    const connectToServerWithPromise = () => {
        return new Promise((resolve, reject) => {
            try {
                console.log('Connecting to command server:', commandEndpoint);
                const commandSocket = new WebSocket(commandEndpoint);

                // Add connection timeout
                const timeoutId = setTimeout(() => {
                    commandSocket.close();
                    reject(new Error('Connection timeout after 10000ms'));
                }, 10000);

                commandSocket.onopen = () => {
                    clearTimeout(timeoutId);
                    console.log('Connected to command server');
                    setSocket(commandSocket);
                    setConnected(true);
                    setConnecting(false);
                    resolve(commandSocket);
                };

                commandSocket.onerror = (error) => {
                    clearTimeout(timeoutId);
                    const errorMessage = 'Failed to connect to command server. Please check your network connection and try again.';
                    console.error('Error connecting to command server:', error);
                    setConnecting(false);
                    setConnected(false);
                    reject(new Error(errorMessage));
                };

                commandSocket.onclose = (event) => {
                    clearTimeout(timeoutId);
                    const closeMessage = `Connection closed${event.reason ? `: ${event.reason}` : ''}`;
                    console.log('WebSocket closed:', closeMessage);
                    setConnecting(false);
                    setConnected(false);
                };

                setConnecting(true);
            } catch (error) {
                setConnecting(false);
                reject(new Error(`Connection error: ${error.message}`));
            }
        });
    };

    // Function to properly format code with actual newlines and tabs
    const formatCodeString = (codeStr) => {
        if (!codeStr) return '';

        // Replace escaped newlines and tabs with actual ones
        return codeStr
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t');
    };

    // Load initial code content
    useEffect(() => {
        if (code_content && code_content.code) {
            const formattedCode = formatCodeString(code_content.code);
            setEditorContent(formattedCode);
        }
    }, [code_content]);

    // Calculate editor height based on container
    useLayoutEffect(() => {
        if (!editorContainerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            window.requestAnimationFrame(() => {
                if (!entries.length) return;
                const containerHeight = entries[0].contentRect.height;
                setEditorHeight(`${Math.max(200, containerHeight - 80)}px`);
            });
        });

        resizeObserver.observe(editorContainerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Handle editor mount
    const handleEditorMount = (editor) => {
        editorRef.current = editor;
        setTimeout(() => editor.layout(), 100);
    };

    // Submit code to server
    const handleSubmit = async () => {
        if (!infrastructureDeployed) return;

        setSubmitting(true);
        setError(null);
        setResult(null);

        try {
            let submitSocket = socket;

            // If not connected, establish connection first
            if (!connected) {
                console.log('Not connected to command server. Connecting...');
                submitSocket = await connectToServerWithPromise();
            }

            const payload = {
                module_id: moduleID,
                term_type: "general_terminal",
                python_script: editorRef.current.getValue(),
                interactive_input: null
            };
            console.log('Sending payload...');

            submitSocket.send(JSON.stringify(payload));
            console.log('Payload submitted!: ', payload);
        } catch (err) {
            setError(err.message || 'Error submitting code');
            console.error('Error submitting code:', err);
        } finally {
            setSubmitting(false);
        }
    };


    // Reset code editor to original content
    const handleReset = () => {
        setResetting(true);
        setError(null);
        setResult(null);

        if (code_content && editorRef.current) {
            const formattedCode = formatCodeString(code_content.code);
            editorRef.current.setValue(formattedCode);
        }

        setResetting(false);
    };

    return (
        <div
            ref={editorContainerRef}
            className='flex flex-col bg-opacity-20 bg-gray-800 rounded-lg overflow-hidden'
            style={{ height: '100%', maxHeight: '500px' }}
        >
            {/* Connection status */}
            <div className={`px-4 py-2 text-sm ${connected ? 'bg-green-900 bg-opacity-30 text-green-200' :
                connecting ? 'bg-yellow-900 bg-opacity-30 text-yellow-200' :
                    !infrastructureDeployed ? 'bg-gray-900 bg-opacity-30 text-gray-300' :
                        'bg-red-900 bg-opacity-30 text-red-200'
                }`}>
                {connected ? 'Connected to command server' :
                    connecting ? 'Connecting to command server...' :
                        !infrastructureDeployed ? 'Waiting for infrastructure deployment...' :
                            'Not connected to command server'}
            </div>

            {/* Timeline expectation notice */}
            <div className="px-4 py-1 text-xs text-gray-400 bg-opacity-20 bg-gray-800">
                Note: Code execution may take up to 2 minutes to complete. Please be patient.
            </div>

            {/* Connection progress bar */}
            {connecting && (
                <div className="px-4 py-2">
                    <div className="text-xs text-gray-400 mb-1 flex justify-between">
                        <span>Connecting...</span>
                        <span>{connectionProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${connectionProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

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
                        <span className="text-gray-300 flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Executing code...this may take a few moments
                        </span>
                    )}
                    {error && (
                        <span className="text-red-400">
                            {error}
                        </span>
                    )}
                    {result && !error && (
                        <span className={result.error ? "text-red-400" : "text-green-400"}>
                            {result.error || result.output || 'Code executed successfully!'}
                        </span>
                    )}
                    {!infrastructureDeployed && !error && (
                        <span className="text-yellow-400">
                            Waiting for infrastructure deployment to complete...
                        </span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={handleReset}
                        disabled={!code_content || resetting || submitting}
                        className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 
                                  disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        {resetting ? 'Resetting...' : 'Reset Code'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={connecting || submitting || !infrastructureDeployed}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                                 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center"
                    >
                        {submitting && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {submitting ? 'Executing...' :
                            !infrastructureDeployed ? 'Waiting for Infrastructure' :
                                !connected ? 'Not Connected. Submit your code to establish connection.' :
                                    'Execute Code'}
                    </button>
                    {isInteractive && (
                        <button
                            onClick={() => setShowTeleop(!showTeleop)}
                            disabled={!connected || !infrastructureDeployed}
                            className={`px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 
                                       disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
                        >
                            {showTeleop ? 'Hide Teleop' : 'Show Teleop'}
                        </button>
                    )}
                </div>
                {showTeleop && <TeleopControls />}
            </div>
        </div>
    );
};