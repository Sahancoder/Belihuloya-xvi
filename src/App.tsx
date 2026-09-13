import React, { useState, useEffect } from 'react';
import { AdminPage } from './pages/AdminPage';
import { OverlayPage } from './pages/OverlayPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine route: /overlay or /admin
  const isOverlay = currentPath.includes('/overlay');

  if (isOverlay) {
    return <OverlayPage />;
  }

  return <AdminPage />;
};

export default App;
