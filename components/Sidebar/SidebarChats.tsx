import React from 'react';

interface ChatItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarChatsProps {
  isCollapsed: boolean;
}

export const SidebarChats: React.FC<SidebarChatsProps> = ({ isCollapsed }) => {
  const chatItems: ChatItem[] = [
    { id: 'general', label: 'General', icon: '💬' },
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'sales', label: 'Sales', icon: '📊' },
    { id: 'research', label: 'Research', icon: '🔬' },
  ];

  if (isCollapsed) return null;

  return (
    <div className="border-t border-gray-200 px-3 py-4">
      <div className="mb-2 flex items-center justify-between px-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Chats</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <div className="space-y-1">
        {chatItems.map((chat) => (
          <button
            key={chat.id}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="text-lg">{chat.icon}</span>
            <span className="flex-1 text-left">{chat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
