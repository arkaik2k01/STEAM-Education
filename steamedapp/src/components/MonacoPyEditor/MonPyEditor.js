import React, { useEffect, useRef, useState } from 'react';
import { listen, createMessageConnection } from 'vscode-ws-jsonrpc';
import { Monaco } from '@monaco-editor/react';
import { createWebSocket, configLSP } from './LSPClient';
import { pyRegister } from './PyFallback';

function MonacoPythonEditor({ LSPurl }) {
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
            setDefaultValue('# Fetching module info failed. A error occurred when communicating with the back end.'); // In case of error, editor will display error message
        }
    }

    //On mount
    useEffect(() => {
        //Fetch module and load from back end
        fetchModuleContent();

        //Establish a connection with the back end LSP
        if (LSPurl) {
            const url = `ws://${LSPurl}`;
            const webSocket = createWebSocket(url);

            // Connect WebSocket to LSP
            listen({
                webSocket,
                onConnection: (connection) => {
                    const transports = createMessageConnection(connection);
                    const langClient = configLSP(transports);
                    langClient.start();
                    connection.onClose(() => langClient.stop())
                },
            });
        } else {
            console.warn('A connection with the language server was not able to be established. Switching to basic Python support.');
        }
    }, [LSPurl]);
}

return (
    <Monaco
        height="90vh"
        theme="vs-dark"
        defaultLanguage="python"
        language="python"
        value={defaultValue} //Fetched value
        onMount={(editorRef, monaco) => {
            editorRef.current = editor
            pyRegister(monaco);
        }}
    />
);
