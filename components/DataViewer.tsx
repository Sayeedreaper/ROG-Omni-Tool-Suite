import React from 'react';
import { TabOption } from '../types';
import { FileCode, Binary, Cpu, Copy, Download, Code, Globe } from 'lucide-react';

interface DataViewerProps {
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
  binaryContent: string;
  pythonRawContent: string;
  pythonSmartContent: string;
  cArrayContent: string;
  base64Content: string;
  isAiLoading: boolean;
}

const DataViewer: React.FC<DataViewerProps> = ({
  activeTab,
  setActiveTab,
  binaryContent,
  pythonRawContent,
  pythonSmartContent,
  cArrayContent,
  base64Content,
  isAiLoading
}) => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadContent = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getActiveContent = () => {
    switch(activeTab) {
      case TabOption.BINARY: return binaryContent;
      case TabOption.PYTHON_RAW: return pythonRawContent;
      case TabOption.PYTHON_SMART: return pythonSmartContent;
      case TabOption.C_ARRAY: return cArrayContent;
      case TabOption.BASE64: return base64Content;
      default: return '';
    }
  };

  const getActiveFilename = () => {
    switch(activeTab) {
        case TabOption.BINARY: return 'dump.bin';
        case TabOption.PYTHON_RAW: return 'raw_loader.py';
        case TabOption.PYTHON_SMART: return 'smart_loader.py';
        case TabOption.C_ARRAY: return 'data.c';
        case TabOption.BASE64: return 'data.b64';
        default: return 'data.txt';
    }
  }

  const renderTabButton = (tab: TabOption, label: string, icon: React.ReactNode, colorClass: string) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`
          relative flex items-center gap-2 px-4 md:px-6 py-3 font-rog text-xs md:text-sm tracking-wider uppercase
          transition-all duration-300 clip-rog-top min-w-fit
          ${isActive 
            ? `bg-[#1a1a1a] text-white border-b-2 ${colorClass}` 
            : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-[#111]'
          }
        `}
      >
        <span className={`${isActive ? colorClass.replace('border-', 'text-') : ''}`}>{icon}</span>
        <span className="hidden md:inline">{label}</span>
        {isActive && (
           <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${colorClass.replace('border-', '')} to-transparent opacity-50`}></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full h-full bg-[#080808] border border-[#222] rounded-lg overflow-hidden shadow-2xl relative flex flex-col">
       {/* Ambient Glow */}
       <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent 
         ${activeTab === TabOption.BINARY ? 'via-[#00ccff]' : activeTab === TabOption.PYTHON_RAW ? 'via-[#ff0033]' : 'via-[#9d00ff]'} 
         to-transparent shadow-[0_0_20px_currentColor] opacity-50 transition-colors duration-500`}></div>

      {/* Tabs */}
      <div className="flex flex-nowrap overflow-x-auto border-b border-[#222] bg-[#0c0c0c] scrollbar-hide">
        {renderTabButton(TabOption.BINARY, 'Binary', <Binary size={16} />, 'border-[#00ccff]')}
        {renderTabButton(TabOption.C_ARRAY, 'C/C++', <Code size={16} />, 'border-yellow-500')}
        {renderTabButton(TabOption.PYTHON_RAW, 'Py Raw', <FileCode size={16} />, 'border-[#ff0033]')}
        {renderTabButton(TabOption.BASE64, 'Base64', <Globe size={16} />, 'border-green-500')}
        {renderTabButton(TabOption.PYTHON_SMART, 'AI Smart', <Cpu size={16} />, 'border-[#9d00ff]')}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#0a0a0a] border-b border-[#222]">
        <div className="text-xs font-mono text-gray-500 truncate mr-2">
          {activeTab === TabOption.PYTHON_SMART && isAiLoading ? 'ANALYZING NEURAL PATHWAYS...' : `RENDER: ${getActiveFilename()}`}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => copyToClipboard(getActiveContent())}
            className="flex items-center gap-2 px-3 py-1 bg-[#151515] hover:bg-[#222] border border-[#333] rounded text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Copy size={12} /> <span className="hidden sm:inline">COPY</span>
          </button>
          <button 
             onClick={() => downloadContent(getActiveContent(), getActiveFilename())}
             className="flex items-center gap-2 px-3 py-1 bg-[#151515] hover:bg-[#222] border border-[#333] rounded text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Download size={12} /> <span className="hidden sm:inline">SAVE</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 bg-[#050505] min-h-[400px]">
        {activeTab === TabOption.PYTHON_SMART && isAiLoading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-t-[#9d00ff] border-r-[#9d00ff]/30 border-b-[#9d00ff]/10 border-l-[#9d00ff]/30 rounded-full animate-spin"></div>
              <p className="font-rog text-[#9d00ff] animate-pulse">GEMINI AI PROCESSING</p>
              <p className="font-mono text-xs text-gray-600">Generating contextual Python logic...</p>
           </div>
        ) : (
          <div className="absolute inset-0 overflow-auto custom-scrollbar p-4">
            <pre className="font-mono text-sm leading-relaxed">
              <code className={
                activeTab === TabOption.BINARY ? 'text-[#00ccff]' : 
                activeTab === TabOption.PYTHON_RAW ? 'text-[#ff0033]' : 
                activeTab === TabOption.C_ARRAY ? 'text-yellow-400' :
                activeTab === TabOption.BASE64 ? 'text-green-400' :
                'text-[#aaddff]'
              }>
                {getActiveContent() || "NO DATA LOADED. PLEASE UPLOAD A FILE."}
              </code>
            </pre>
          </div>
        )}

        {/* Decor Lines in Editor */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#111]"></div>
        <div className="absolute top-0 left-8 w-[1px] h-full bg-[#222]"></div>
      </div>
    </div>
  );
};

export default DataViewer;