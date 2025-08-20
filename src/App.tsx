import { ReactNode } from 'react';
import './styles/app.css';

const App = (): ReactNode => {
  return (
    <div className="app-container" aria-label="">
      <h1 tabIndex={0} aria-label="app header"></h1>
    </div>
  );
};

export default App;
