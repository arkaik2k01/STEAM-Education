import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';

export const MonPyEditor = ({
    loadEndpoint,
    submitEndpoint,
    submitSuccess,
    submitError
}) => {
    const [editorContent, setEditorContent] = useState('# Loading module . . .');

    //Util states
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

    //Fetch module information form the backend when the editor mounts
    const fetchCodeContent = async (url) => {
        //Check if load endpoint is provided
        if (!loadEndpoint) {
            console.error('No load endpoint provided.');
            setEditorContent(`def main():
    # Your code goes here
    print("Hello, World!")
    
    # Example function call
    result = calculate_sum([1, 2, 3, 4, 5])
    print(f"Sum of numbers: {result}")`);
            setLoading(false);
            return;
        }

        //Fetch module content
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to connect.');
            }
            const data = await response.json();
            setEditorContent(data.module || '# A connection was established, but invalid or NULL data was received from server.'); // Switch this part depending on end point return formatting
        } catch (error) {
            console.error('There was a error fetching module content:', error);
            setEditorContent(`# Fetching module info failed. 
                An error occurred when communicating with the server, 
                or incorrect data was received.\n${error}`); // In case of error, editor will display error message
        }
    }

    //On mount
    useEffect(() => {
        //Fetch module and load from back end
        fetchCodeContent();
    }, [loadEndpoint]);

    //
    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    }

    const handleSubmit = () => {
        return; //Submit code
    }

    return (
        <div className="w-full h-screen min-h-[500px] flex flex-col">
            <div className="flex-grow relative">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={editorContent}
                    theme="vs-dark"
                    loading={<div className="p-4 text-gray-600">Loading editor...</div>}
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
    
            <div className="flex items-center justify-between p-4 bg-gray-100">
                <div className="flex items-center">
                    {submitting && (
                        <span className="text-gray-600 mr-4">
                            Submitting code...
                        </span>
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || submitting}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 
                                 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Code'}
                </button>
            </div>
        </div>
    );
    
}

