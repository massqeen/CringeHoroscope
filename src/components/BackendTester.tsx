import { ReactNode, useState } from 'react';

import HoroscopeTest from './HoroscopeTest';
import CringeMapping from './CringeMapping';

const BackendTester = (): ReactNode => {
  const [activeTab, setActiveTab] = useState<'test' | 'mapping'>('test');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 tabIndex={0}>🔧 Backend Development & Testing</h2>
      <p>API Testing & Cringe Level Mapping Visualization</p>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        gap: '10px'
      }}>
        <button
          onClick={() => setActiveTab('test')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'test' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: activeTab === 'test' ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          🧪 API Testing
        </button>
        
        <button
          onClick={() => setActiveTab('mapping')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'mapping' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: activeTab === 'mapping' ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
          }}
        >
          🎛️ Cringe Mapping
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'test' && <HoroscopeTest />}
      {activeTab === 'mapping' && <CringeMapping />}
    </div>
  );
};

export default BackendTester;
