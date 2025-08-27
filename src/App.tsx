import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';

// Pages
import Dashboard from './pages/Dashboard';
import MaterialsPage from './pages/MaterialsPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          
          {/* Dashboard */}
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          
          {/* Materials */}
          <Route path={ROUTES.MATERIALS} element={<MaterialsPage />} />
          
          {/* Placeholder routes - to be implemented */}
          <Route path={ROUTES.MATERIALS_CREATE} element={<div>Create Material Page</div>} />
          <Route path={ROUTES.MATERIALS_EDIT} element={<div>Edit Material Page</div>} />
          <Route path={ROUTES.MATERIALS_DETAIL} element={<div>Material Detail Page</div>} />
          
          <Route path={ROUTES.BUDGET} element={<div>Budget Page</div>} />
          <Route path={ROUTES.BUDGET_PROJECTS} element={<div>Budget Projects Page</div>} />
          <Route path={ROUTES.OUTPUT} element={<div>Output Page</div>} />
          <Route path={ROUTES.OUTPUT_REQUESTS} element={<div>Output Requests Page</div>} />
          <Route path={ROUTES.REPORTS} element={<div>Reports Page</div>} />
          <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />
          <Route path={ROUTES.CATEGORIES} element={<div>Categories Page</div>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
