import React from 'react';
import { ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const tools = [
    { id: ToolType.LOGO, label: 'Logo Designer', icon: '🎨' },
    { id: ToolType.THUMBNAIL, label: 'Thumbnail Maker', icon: '🖼️' },
    { id: ToolType.SONG, label: 'Song Creator', icon: '🎵' },
    { id: ToolType.AD, label: 'Ad Generator', icon: '📢' },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full md:h-screen sticky top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          CreativeStudio
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">AI Powered</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="font-medium">{tool.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 text-center">Pro Mode Active</p>
        </div>
      </div>
    </aside>
  );
};
