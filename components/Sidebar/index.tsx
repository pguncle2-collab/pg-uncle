'use client';

import React, { useState } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarChats } from './SidebarChats';
import { SidebarFooter } from './SidebarFooter';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <SidebarNav isCollapsed={isCollapsed} />
      <SidebarChats isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};
