import Editor, { loader } from '@monaco-editor/react';
import { useState, useRef } from 'react';
import { startLSP } from './LSPClient';

const CodeEditor = () => {
    const [defaultValue, setDefaultValue] = useState('# Loading module . . .');
    const editorRef = useRef(null);

    //Async loading of the editor, fetches module info and connects to LSP
    useEffect(() => {
        const fetchModule = async () => {
            try {
                //Fetch module info
                const response = await fetch('') // TODO: When a loading function is made by the back end, change this
                const data = await response.json();
                setDefaultValue(data.module || '# ERR: No module was received. NULL or empty value.');
            } catch (error) {
                console.error('Error fetching module information', error);
                setDefaultValue('# ERR: No module was received. A error has occurred on connection.');
            }
        };

        //Initialize Monaco and set up LSP client once loaded
        loader.init().then((monacoInstance) => {
            startLSP(monacoInstance).catch((err) => {
                console.error('Error starting the LSP client: ', err);
            });

            //After Monaco is laoded, fetch module data
            fetchModule();
        });
    }, []); //Emoty dependency array means it'll run on mount of component
    
    return (
        <Editor
            height = "90vh" 
            theme = "vs-dark"
            defaultLanguage = "python"
            language = "python"
            value = {defaultValue} //Fetched value
            onMount = {(editorRef) => (editorRef.current = editorRef)}
        />

    );
};
