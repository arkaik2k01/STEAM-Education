import './App.css';
import { FillInTheBlank } from './components/ModulePage/FillInTheBlank/FillInTheBlank';
import { MCQuestion } from './components/ModulePage/MCQuestion/MCQuestion';
import { MonPyEditor } from './components/ModulePage/MonPyEditor';

function App() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fill in the Blanks Exercise</h1>
      <FillInTheBlank />
      <h1 className='text-2xl font-bold mb-6'>Multiple Choice Question</h1>
      <MCQuestion />
      <h1 className='text-2xl font-bold mb-6'>Code Editor</h1>
      <MonPyEditor loadEndpoint="" />
    </div>
  );
}


export default App;
