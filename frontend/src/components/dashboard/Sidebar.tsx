// Sidebar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define sidebar items with explicit paths
  type SidebarIcon = 'dashboard' | 'create' | 'course';

const sidebarItems: { icon: SidebarIcon; label: string; path: string }[] =
  location.pathname.startsWith('/dashboard/create') ||
  location.pathname.startsWith('/dashboard/courses')
    ? [
        { icon: 'create', label: 'Create', path: '/dashboard/create' },
        { icon: 'course', label: 'Courses', path: '/dashboard/courses' },
      ]
    : [
        { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      ];


  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen w-64 bg-gray-200 shadow
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-0 lg:block
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-bold text-xl">📚 LearnX</span>
          <button onClick={onClose}>
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-center h-16 font-extrabold text-xl lg:text-2xl border-b border-indigo-100">
          <span className="flex items-center space-x-2">
            <span>LearnX</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
