import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { LogoTool } from './components/LogoTool';
import { ThumbnailTool } from './components/ThumbnailTool';
import { SongTool } from './components/SongTool';
import { AdTool } from './components/AdTool';
import { ToolType } from './types';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.LOGO);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.LOGO:
        return <LogoTool />;
      case ToolType.THUMBNAIL:
        return <ThumbnailTool />;
      case ToolType.SONG:
        return <SongTool />;
      case ToolType.AD:
        return <AdTool />;
      default:
        return <LogoTool />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row font-sans">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
      
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="p-6 md:p-8 flex justify-between items-center border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back, Creator.</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="h-2 w-2 rounded-full bg-green-500"></div>
             <span className="text-sm text-slate-400">System Online</span>
          </div>
        </header>

        <div className="p-2 md:p-4">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderTool()}
          </div>
        </div>
      </main>
    </div>
  );
}
