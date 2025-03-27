import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

export const MonPyEditor = ({
    code_content,
    onComplete,
    codeEndpoint
}) => {
    // General states
    const [editorContent, setEditorContent] = useState('# Loading module . . .');
    const [terminalType, setTerminalType] = useState('gen_terminal'); // Default terminal type

    // Websocket connection
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    // UI states
    const [submitting, setSubmitting] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const editorRef = useRef(null);

    // Initial setup
    useEffect(() => {
        if (code_content) {
            setEditorContent(code_content.code || '# A error has occurred when gathering the code.');
        }

        if (code_content.terminalType) {
            setTerminalType(code_content.terminalType);
        }
    }, [code_content]);

    // Web socket setup
    useEffect(() => {
        if (!codeEndpoint) return;

        try {
            let user_ws = codeEndpoint + '/user/' + userID + '/command';
            const ws = new WebSocket(user_ws);
            console.log('Connecting to websocket:', user_ws);

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
    }, [codeEndpoint, onComplete]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
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
                question_id: code_content?.id || 'unknown',
                term_type: terminalType,
                python_script: code,
                interactive_input: null // Default value, used for keystrokes in interactive mode
            };

            console.log('Sending code to server:', payload);
            socket.send(JSON.stringify(payload));
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
        <div className='flex flex-col h-[500px] bg-opacity-20 bg-gray-800 rounded-lg overflow-hidden'>
            {/* Connection status indicator */}
            <div className={`px-4 py-2 text-sm ${connected ? 'bg-green-900 bg-opacity-30 text-green-200' : 'bg-red-900 bg-opacity-30 text-red-200'}`}>
                {connected ? 'Connected to server' : 'Disconnected from server'}
            </div>
            
            {/* Editor component */}
            <div className='flex-grow'>
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

                {/* Interactive terminal controls - only shown for interactive terminals */}
                {terminalType === 'interactive_terminal' && (
                    <div className="flex items-center justify-center p-4 border-t border-gray-700">
                        <div className="grid grid-cols-3 gap-2">
                            {/* Up arrow */}
                            <button
                                onClick={() => sendKeystroke('\x1B[A')}
                                className="col-start-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                aria-label="Up"
                            >
                                ↑
                            </button>
                            
                            {/* Left arrow */}
                            <button 
                                onClick={() => sendKeystroke('\x1B[D')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                aria-label="Left"
                            >
                                ←
                            </button>
                            {/* Down arrow */}
                            <button
                                onClick={() => sendKeystroke('\x1B[B')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                aria-label="Down"
                            >
                                ↓
                            </button>
                            {/* Right arrow */}
                            <button
                                onClick={() => sendKeystroke('\x1B[C')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                aria-label="Right"
                            >
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
