import React, { useEffect, useRef, useState } from 'react';
import { Monaco } from '@monaco-editor/react';

function MonacoPythonEditor() {
    const [defaultValue, setDefaultValue] = useState('# Loading module . . .');
    const editorRef = useRef(null);

    //Fetch module information form the backend when the editor mounts
    const fetchModuleContent = async () => {
        try {
            const response = await fetch('BACK END URL END POINT HERE'); // <-----
            if (!response.ok) {
                throw new Error('Failed to connect.');
            }
            const data = await response.json();
            setDefaultValue(data.module || '# A connection was established, but invalid or NULL data was received from server.'); // Switch this part depending on end point return formatting
        } catch (error) {
            console.error('There was a error fetching module content:', error);
            setDefaultValue(`# Fetching module info failed. 
                An error occurred when communicating with the server, 
                or incorrect data was received.\n${error}`); // In case of error, editor will display error message
        }
    }

    //On mount
    useEffect(() => {
        //Fetch module and load from back end
        fetchModuleContent();
    }, []);
}

return (
    <Monaco
        height="90vh"
        theme="vs-dark"
        defaultLanguage="python"
        language="python"
        value={defaultValue} //Fetched value
        onMount={(editor, monaco) => {
            editorRef.current = editor;
            console.log('Mounting editor . . .');
        }}
    />
);

export default MonacoPythonEditor;
