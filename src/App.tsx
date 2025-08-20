import { ReactNode } from 'react';
import HoroscopeTest from './components/HoroscopeTest';
import './styles/app.css';

const App = (): ReactNode => {
  return (
    <div className="app-container">
      <h1 tabIndex={0}>🔮 Cringe Horoscope</h1>
      <p>Backend API Testing</p>
      
      <HoroscopeTest />
    </div>
  );
};

export default App;
