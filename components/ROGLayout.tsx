import React, { ReactNode } from 'react';
import { Cpu, Zap, Activity, Minus, Maximize2, X, Disc, LayoutGrid, MessageSquare, Files } from 'lucide-react';
import { AppModule } from '../types';

interface ROGLayoutProps {
  children: ReactNode;
  activeModule: AppModule;
  onNavigate: (module: AppModule) => void;
}

const ROGLayout: React.FC<ROGLayoutProps> = ({ children, activeModule, onNavigate }) => {
  
  const NavItem = ({ module, icon: Icon, label }: { module: AppModule; icon: any; label: string }) => {
    const isActive = activeModule === module;
    return (
      <button
        onClick={() => onNavigate(module)}
        className={`
          flex items-center gap-3 px-4 py-3 w-full rounded-md transition-all duration-300
          ${isActive 
            ? 'bg-[#151515] border-l-2 border-[#ff0033] text-white shadow-[inset_0_0_10px_rgba(255,0,51,0.1)]' 
            : 'text-gray-500 hover:text-white hover:bg-[#111]'
          }
        `}
      >
        <Icon size={18} className={isActive ? 'text-[#ff0033]' : ''} />
        <span className="font-rog text-xs tracking-wider">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-[#ff0033] selection:text-white flex items-center justify-center p-0 md:p-4 lg:p-8 relative overflow-hidden font-rajdhani">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff0033] via-[#00ccff] to-[#9d00ff] opacity-50"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff0033] rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#00ccff] rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Application Window Container */}
      <div className="relative z-10 w-full max-w-[1600px] bg-[#080808]/90 backdrop-blur-md border-x border-y md:border border-[#222] md:rounded-lg shadow-2xl flex flex-col h-screen md:h-[90vh] overflow-hidden">
        
        {/* Window Title Bar */}
        <header className="flex justify-between items-center px-4 py-2 bg-[#0a0a0a] border-b border-[#222] select-none shrink-0">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute -inset-1 bg-[#ff0033] rounded-full blur-sm opacity-50"></div>
                <Cpu className="w-5 h-5 text-[#ff0033] relative z-10" />
             </div>
             <span className="font-rog text-sm tracking-widest text-white">ROG OMNI-TOOL <span className="text-[#00ccff] text-[10px] ml-2">SUITE</span></span>
          </div>
          
          <div className="flex items-center gap-1">
             <div className="hidden md:flex w-8 h-6 items-center justify-center hover:bg-[#222] rounded transition-colors cursor-pointer"><Minus size={14} /></div>
             <div className="hidden md:flex w-8 h-6 items-center justify-center hover:bg-[#222] rounded transition-colors cursor-pointer"><Maximize2 size={12} /></div>
             <div className="hidden md:flex w-8 h-6 items-center justify-center hover:bg-[#ff0033] hover:text-white rounded transition-colors cursor-pointer"><X size={14} /></div>
          </div>
        </header>

        {/* Layout Body */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar Navigation */}
          <nav className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-[#222] p-4 gap-2">
             <div className="text-[10px] font-mono text-gray-600 mb-2 pl-4">MODULES</div>
             <NavItem module={AppModule.DASHBOARD} icon={LayoutGrid} label="DASHBOARD" />
             <NavItem module={AppModule.NEURAL_NEXUS} icon={MessageSquare} label="NEURAL NEXUS" />
             <NavItem module={AppModule.CONVERTER} icon={Files} label="UNI CONVERTER" />
             
             <div className="mt-auto pt-4 border-t border-[#222]">
                <div className="flex items-center gap-2 px-4">
                   <div className="w-2 h-2 bg-[#00ccff] rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-mono text-[#00ccff]">GEMINI API: ACTIVE</span>
                </div>
             </div>
          </nav>

          {/* Mobile Bottom Bar (Visible only on small screens) */}
          <nav className="md:hidden absolute bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-[#222] flex justify-around p-2 z-50">
             <button onClick={() => onNavigate(AppModule.DASHBOARD)} className={`p-2 rounded ${activeModule === AppModule.DASHBOARD ? 'text-[#ff0033]' : 'text-gray-500'}`}><LayoutGrid size={24} /></button>
             <button onClick={() => onNavigate(AppModule.NEURAL_NEXUS)} className={`p-2 rounded ${activeModule === AppModule.NEURAL_NEXUS ? 'text-[#ff0033]' : 'text-gray-500'}`}><MessageSquare size={24} /></button>
             <button onClick={() => onNavigate(AppModule.CONVERTER)} className={`p-2 rounded ${activeModule === AppModule.CONVERTER ? 'text-[#ff0033]' : 'text-gray-500'}`}><Files size={24} /></button>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-[#050505] relative custom-scrollbar pb-16 md:pb-0">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
};

export default ROGLayout;