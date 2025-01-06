import { MonacoLanguageClient, MessageTransports } from "monaco-languageclient";
import { listen, createMessageConnection } from 'vscode-ws-jsonrpc';
import ReconnectingWebSocket from "reconnecting-websocket";

// Create web socket to communicate the Monaco Editor with the LSP back-end
export function createWebSocket(url) {
    const webSocket = new ReconnectingWebSocket(url, [], {maxRetries: 5}); //Try only to connect 5 times. Prevent server spam.
    return webSocket;
}

// Create config file for the LSP connection
export function startLSP(transports) {
    return new MonacoLanguageClient({
        name: 'Python LSP',
        clientOptions: {
            documentSelector: ['python'],
            errorHandler: {
                error: () => ({action: 1}), // Retry on error
                closed: () => ({action: 4}), // Do not restart on close
            },
        },
        connectionProvider: {
            get: () => Promise.resolve(transports),
        },
    });
}