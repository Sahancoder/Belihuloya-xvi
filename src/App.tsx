import React from 'react';
import { ControlPage } from './pages/ControlPage';
import { OverlayPage } from './pages/OverlayPage';

const isOverlay = () => {
  const page = document.getElementById('root')?.dataset.page;
  return page === 'overlay' || (!page && window.location.pathname.includes('overlay'));
};

export const App: React.FC = () => (isOverlay() ? <OverlayPage /> : <ControlPage />);

export default App;
