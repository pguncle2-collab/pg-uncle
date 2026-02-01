import React from 'react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
      {!isCollapsed && (
        <button className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-gray-50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
            D
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gray-900">Durable</div>
            <div className="truncate text-xs text-gray-500">durable.co</div>
          </div>
          <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </button>
      )}
      <button
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>
    </div>
  );
};
