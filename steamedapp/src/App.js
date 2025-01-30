import './App.css';
import FillInTheBlank from './components/FillInTheBlank/FillInTheBlank';
import { MCQuestion } from './components/MCQuestion/MCQuestion';

function App() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fill in the Blanks Exercise</h1>
      <FillInTheBlank />
      <h1 className='text-2xl font-bold mb-6'>Multiple Choice Question</h1>
      <MCQuestion />
    </div>
  );
}

export default App;
