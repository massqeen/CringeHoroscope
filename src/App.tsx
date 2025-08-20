import { ReactNode } from 'react';
import BackendTester from './components/BackendTester';
import { ApiTester } from './components/ApiTester';
import { DeterminismTester } from './components/DeterminismTester';
import './styles/app.css';

const App = (): ReactNode => {
  return (
    <div className="app-container">
      <h1 tabIndex={0}>🔮 Cringe Horoscope</h1>
      <p>Backend Development Phase</p>
      
      <ApiTester />
      <DeterminismTester />
      <BackendTester />
    </div>
  );
};

export default App;
