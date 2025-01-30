import logo from './logo.svg';
import './App.css';
import FillInTheBlank from './components/FillInTheBlank/FillInTheBlank';

function App() {
  return (
    <div className="container mx-auto">
    <h1 className="text-2xl font-bold mb-6">Fill in the Blanks Exercise</h1>
    <FillInTheBlank />
  </div>
  );
}

export default App;
