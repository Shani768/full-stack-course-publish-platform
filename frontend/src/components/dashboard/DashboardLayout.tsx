// DashboardLayout.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCreatePage = location.pathname === '/dashboard/create';

  return (
    <div className="relative flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden p-4 fixed top-4 right-4 z-50 text-indigo-600"
        onClick={() => setSidebarOpen(true)}
      >
        {/* Hamburger icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar with toggle props */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

<main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 z-0">
    <Header isCreatePage={isCreatePage} />
    {children}
  </main>
    </div>
  );
};

export default DashboardLayout;
