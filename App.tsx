import React, { useState } from 'react';
import ROGLayout from './components/ROGLayout';
import Dashboard from './components/Dashboard';
import NeuralNexus from './components/NeuralNexus';
import UniversalConverter from './components/UniversalConverter';
import { AppModule } from './types';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.DASHBOARD);

  const renderModule = () => {
    switch (activeModule) {
      case AppModule.DASHBOARD:
        return <Dashboard onNavigate={setActiveModule} />;
      case AppModule.NEURAL_NEXUS:
        return <NeuralNexus />;
      case AppModule.CONVERTER:
        return <UniversalConverter />;
      default:
        return <Dashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <ROGLayout activeModule={activeModule} onNavigate={setActiveModule}>
       {renderModule()}
    </ROGLayout>
  );
};

export default App;