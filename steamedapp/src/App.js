import './App.css';
import ModulePage from './pages/ModulePage';
import example from './components/util/example.json';
import StudentDashboardPage from './pages/StudentDashboardPage';

const moduleData = example;

const App = () => {
  return (
      <div className="min-h-screen">
          <StudentDashboardPage />
      </div>
  );
};

export default App;
