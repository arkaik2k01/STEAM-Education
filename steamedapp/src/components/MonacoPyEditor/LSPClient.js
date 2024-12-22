import { MonacoLanguageClient, CloseAction, ErrorAction } from "monaco-languageclient";
import { listen } from 'vscode-ws-jsonrpc';

// Create web socket to communicate the Monaco Editor with the LSP back-end
const createWebSocketTransport = (url) => {
    const webSocket = new WebSocket(url);
    return listen({
        webSocket,
        onConnection: (connection) => {
            return { reader: connection, writer: connection};
        },
    });
};


// TODO: Notice languageServer is just a placeholder until back-end infrastructure is ready
export const startLSP = (editor, languageServer = 'ws://localhost:8080') => {
    editor.languages.register({ id: 'python'});

    //Initiate connection and promise to return object bridge, used to communicate between LSP and Editor
    return createWebSocketTransport(languageServer).then((bridge) => {

        const languageClient = new MonacoLanguageClient({
            name: 'Python LSP',
            clientOptions: {
                documentSelector: ['python'],
                errorHandler: {
                    error: () => ErrorAction.Continue, // Note that if connection errors, editor will still be online
                    closed: () => CloseAction.Restart, // TODO: Is this really needed? Research docs !!!!!!!!
                },
            },
            connectionProvider: {
                get: () => Promise.resolve(bridge), //Resolve async
            },
        });

        languageClient.start();
        return languageClient;
    });
};