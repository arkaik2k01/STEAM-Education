import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

export const MonPyEditor = ({
    initialContent,
    onComplete,
    codeEndpoint
}) => {
    const [editorContent, setEditorContent] = useState('# Loading module . . .');

    //Util states
    const [submitting, setSubmitting] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (initialContent) {
            setEditorContent(initialContent);
        }
    }, [initialContent]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    }

    const handleSubmit = async () => {
        if (!codeEndpoint) {
            setError(new Error('No submit endpoint provided'));
            return;
        }

        setSubmitting(true);
        setError(null);


        // REWORK THIS
        try {
            const response = await fetch(codeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editorRef.current.getValue()
                })
            });

            if (!response.ok) {
                throw new Error(`Submission failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setResult(data);

            if (data.success) {
                onComplete?.();
            }
        } catch (err) {
            setError(err);
            console.error('Error submitting code:', err);
        } finally {
            setSubmitting(false);
        }
    }

    const handleReset = () => {
        setResetting(true);
        setError(null);
        setResult(null);

        if (initialContent && editorRef.current) {
            editorRef.current.setValue(initialContent);
        }

        setResetting(false);
    }


    return (
        <div className='flex flex-col h-[500px] bg-opacity-20 bg-gray-800 rounded-lg overflow-hidden'>
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

            <div className="flex items-center justify-between p-4 bg-opacity-30 bg-gray-900">
                <div className="flex items-center">
                    {submitting && (
                        <span className="text-gray-300 mr-4">
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
                            Code submitted successfully!
                        </span>
                    )}
                </div>
                <button
                    onClick={handleReset}
                    disabled={!initialContent || resetting}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                    disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {resetting ? 'Resetting...' : 'Reset Code'}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!codeEndpoint || submitting}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                                 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Code'}
                </button>
            </div>
        </div>
    );

}

