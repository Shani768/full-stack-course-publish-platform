// SidebarItem.tsx
import React from 'react';
import type { ComponentType } from 'react';
import { MdDashboard, MdSearch, MdCreate } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';

interface SidebarItemProps {
  icon: 'dashboard'  | 'create' | 'course';
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  dashboard: MdDashboard,
  search: MdSearch,
  create: MdCreate,
  course: FaChalkboardTeacher,
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  const baseStyle =
    'flex w-full items-center space-x-3 p-2 rounded-xl transition hover:scale-105';
  const activeStyle = 'bg-indigo-100 text-indigo-700 font-medium';
  const inactiveStyle =
    'hover:bg-indigo-50 cursor-pointer text-gray-700 hover:text-indigo-600';

  const IconComponent = iconMap[icon];

  return (
    <div onClick={onClick} className={`${baseStyle} ${active ? activeStyle : inactiveStyle}`}>
      <IconComponent className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
};

export default SidebarItem;
