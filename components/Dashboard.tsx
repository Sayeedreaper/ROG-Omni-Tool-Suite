import React from 'react';
import { AppModule } from '../types';
import { Activity, Shield, Cpu, ExternalLink, Zap, LayoutGrid } from 'lucide-react';

interface DashboardProps {
  onNavigate: (module: AppModule) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  
  const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded clip-rog relative overflow-hidden group">
       <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${color}/10 to-transparent`}></div>
       <div className="text-[10px] font-mono text-gray-500 mb-1">{label}</div>
       <div className={`text-2xl font-rog text-[${color}] group-hover:scale-105 transition-transform origin-left`}>{value}</div>
    </div>
  );

  const AppCard = ({ module, title, desc, icon: Icon, color }: { module: AppModule, title: string, desc: string, icon: any, color: string }) => (
    <div 
      onClick={() => onNavigate(module)}
      className="bg-[#0a0a0a] border border-[#222] p-6 rounded-lg cursor-pointer hover:border-[#444] hover:bg-[#111] transition-all group relative overflow-hidden"
    >
       <div className={`absolute top-0 left-0 w-1 h-full bg-[${color}] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
       <Icon className={`w-10 h-10 text-[${color}] mb-4`} />
       <h3 className="text-xl font-rog text-white mb-2">{title}</h3>
       <p className="text-sm font-mono text-gray-500">{desc}</p>
       <div className="mt-4 flex items-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
         LAUNCH MODULE <ExternalLink size={12} className="ml-2" />
       </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
       {/* Welcome Banner */}
       <div className="relative p-8 rounded-xl border border-[#222] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff0033]/10 via-transparent to-[#00ccff]/10"></div>
          <div className="relative z-10">
             <h1 className="text-4xl md:text-5xl font-rog text-white mb-2">
               WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] to-[#00ccff]">OPERATOR</span>
             </h1>
             <p className="font-mono text-gray-400 max-w-xl">
               ROG Omni-Tool Suite is online. Neural pathways connected. Select a module to begin operations.
             </p>
          </div>
       </div>

       {/* System Status */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded clip-rog relative overflow-hidden">
             <div className="text-[10px] font-mono text-gray-500 mb-1">SYSTEM STATUS</div>
             <div className="text-2xl font-rog text-[#00ccff]">ONLINE</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded clip-rog relative overflow-hidden">
             <div className="text-[10px] font-mono text-gray-500 mb-1">AI LATENCY</div>
             <div className="text-2xl font-rog text-[#ff0033]">12ms</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded clip-rog relative overflow-hidden">
             <div className="text-[10px] font-mono text-gray-500 mb-1">MEMORY</div>
             <div className="text-2xl font-rog text-[#9d00ff]">OPTIMAL</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded clip-rog relative overflow-hidden">
             <div className="text-[10px] font-mono text-gray-500 mb-1">MODULES</div>
             <div className="text-2xl font-rog text-white">2 ACTIVE</div>
          </div>
       </div>

       {/* App Grid */}
       <h2 className="text-xl font-rog text-white flex items-center gap-2">
         <LayoutGrid size={20} className="text-[#ff0033]" /> INSTALLED MODULES
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => onNavigate(AppModule.NEURAL_NEXUS)}
            className="bg-[#0a0a0a] border border-[#222] p-6 rounded-lg cursor-pointer hover:border-[#00ccff] hover:bg-[#111] transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={100} />
             </div>
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#00ccff]/10 rounded border border-[#00ccff]/30 text-[#00ccff]">
                   <Activity size={24} />
                </div>
                <h3 className="text-2xl font-rog text-white">NEURAL NEXUS</h3>
             </div>
             <p className="font-mono text-gray-400 mb-6">
                Advanced AI Chat interface with custom "Gems" (Personas). Configure system instructions for specialized tasks like coding, security analysis, or creative writing.
             </p>
             <span className="text-[#00ccff] font-bold text-sm tracking-wider flex items-center gap-2">
                ENTER NEXUS <ExternalLink size={14} />
             </span>
          </div>

          <div 
            onClick={() => onNavigate(AppModule.CONVERTER)}
            className="bg-[#0a0a0a] border border-[#222] p-6 rounded-lg cursor-pointer hover:border-[#ff0033] hover:bg-[#111] transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={100} />
             </div>
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#ff0033]/10 rounded border border-[#ff0033]/30 text-[#ff0033]">
                   <Zap size={24} />
                </div>
                <h3 className="text-2xl font-rog text-white">UNI CONVERTER</h3>
             </div>
             <p className="font-mono text-gray-400 mb-6">
                Universal file analysis tool. Convert any binary input into Hex, Python Bytes, C Arrays, or Base64. Includes AI-powered script generation.
             </p>
             <span className="text-[#ff0033] font-bold text-sm tracking-wider flex items-center gap-2">
                OPEN TOOL <ExternalLink size={14} />
             </span>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;