import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useProgressStore } from './state/progressStore';
import './index.css';

function App() {
  const status = useProgressStore((s) => s.status);
  const hydrate = useProgressStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (status !== 'ready') {
    return (
      <p className="grid min-h-dvh place-items-center text-slate-500" role="status">
        Loading…
      </p>
    );
  }
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
