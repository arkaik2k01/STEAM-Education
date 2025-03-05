import './App.css';
import ModulePage from './pages/ModulePage';
import example from './components/util/example.json';

const moduleData = example;

const App = () => {
  return (
      <div className="min-h-screen">
          <ModulePage moduleData={moduleData} />
      </div>
  );
};

export default App;
