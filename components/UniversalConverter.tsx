import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataViewer from './DataViewer';
import { ProcessedFile, TabOption } from '../types';
import { bufferToHex, bufferToPythonBytes, bufferToBinaryString, bufferToCArray, bufferToBase64 } from '../utils/fileUtils';
import { generateSmartPythonScript } from '../services/geminiService';
import { FileText, Trash2, Database, Plus } from 'lucide-react';

const UniversalConverter: React.FC = () => {
  // Collection State
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.BINARY);
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());

  const activeFile = files.find(f => f.id === activeFileId) || null;

  const handleFileSelect = async (file: File) => {
    const newId = crypto.randomUUID();
    const arrayBuffer = await file.arrayBuffer();
    
    const hexPreview = bufferToHex(arrayBuffer);
    const binaryStr = bufferToBinaryString(arrayBuffer);
    const cArrayStr = bufferToCArray(arrayBuffer);
    const base64Str = bufferToBase64(arrayBuffer);

    const newFile: ProcessedFile = {
      id: newId,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      arrayBuffer,
      hexPreview,
      binaryString: binaryStr,
      cArray: cArrayStr,
      base64: base64Str,
      smartScript: "" // Empty initially
    };

    setFiles(prev => [newFile, ...prev]);
    setActiveFileId(newId);
    setActiveTab(TabOption.BINARY);

    runAiAnalysis(newId, file.name, newFile.type, hexPreview);
  };

  const runAiAnalysis = async (fileId: string, name: string, type: string, hexPreview: string) => {
    setLoadingFiles(prev => new Set(prev).add(fileId));
    try {
      const script = await generateSmartPythonScript(name, type, hexPreview);
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return { ...f, smartScript: script };
        }
        return f;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  };

  const removeFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFiles(prev => {
      const remaining = prev.filter(f => f.id !== id);
      if (id === activeFileId) {
         setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const getBinaryDisplay = () => {
    if (!activeFile) return "";
    return `FILE_ID: ${activeFile.id}\nFILE_NAME: ${activeFile.name}\nFILE_SIZE: ${activeFile.size} bytes\nTYPE: ${activeFile.type}\n\n[HEX DUMP START]\n${activeFile.hexPreview}\n\n[BINARY STREAM START]\n${activeFile.binaryString}\n...`;
  };

  const getPythonRawDisplay = () => {
    if (!activeFile) return "";
    return `# RAW BYTE LOADER FOR: ${activeFile.name}\n# Automatically generated\n${bufferToPythonBytes(activeFile.arrayBuffer)}`;
  };

  return (
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* LEFT PANEL: INPUT & COLLECTION */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            <div className="bg-[#080808] border border-[#222] p-4 md:p-6 rounded-lg shadow-lg relative overflow-hidden group shrink-0">
               <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#ff0033]/20 to-transparent clip-rog-top"></div>
               <h2 className="text-lg font-rog text-white mb-4 flex items-center gap-2">
                 <Plus className="w-4 h-4 text-[#ff0033]" />
                 NEW DATA ENTRY
               </h2>
               <FileUpload onFileSelect={handleFileSelect} />
            </div>

            <div className="flex-1 bg-[#080808] border border-[#222] rounded-lg relative overflow-hidden flex flex-col min-h-[300px]">
               <div className="p-4 border-b border-[#222] bg-[#0c0c0c] flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white font-rog text-sm">
                    <Database className="w-4 h-4 text-[#00ccff]" />
                    PROJECT LIBRARY
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{files.length} FILES</span>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                  {files.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-50">
                       <Database className="w-8 h-8" />
                       <span className="text-xs font-mono">NO DATA</span>
                    </div>
                  ) : (
                    files.map(file => (
                      <div 
                        key={file.id}
                        onClick={() => setActiveFileId(file.id)}
                        className={`
                          group relative p-3 rounded cursor-pointer border transition-all duration-200
                          ${activeFileId === file.id 
                            ? 'bg-[#151515] border-[#ff0033] shadow-[0_0_10px_rgba(255,0,51,0.1)]' 
                            : 'bg-[#0a0a0a] border-[#222] hover:border-[#444] hover:bg-[#111]'
                          }
                        `}
                      >
                         <div className="flex justify-between items-start">
                           <div className="flex items-start gap-3 overflow-hidden">
                              <div className={`mt-1 p-1.5 rounded bg-black border ${activeFileId === file.id ? 'border-[#ff0033]/50 text-[#ff0033]' : 'border-[#333] text-gray-500'}`}>
                                <FileText size={14} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className={`text-sm font-bold truncate ${activeFileId === file.id ? 'text-white' : 'text-gray-400'}`}>
                                  {file.name}
                                </span>
                              </div>
                           </div>
                           <button onClick={(e) => removeFile(e, file.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#ff0033] hover:text-white rounded text-gray-600 transition-all"><Trash2 size={12} /></button>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>

          {/* RIGHT PANEL: OUTPUT VIEWER */}
          <div className="lg:col-span-8 h-full">
            {activeFile ? (
              <DataViewer 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                binaryContent={getBinaryDisplay()}
                pythonRawContent={getPythonRawDisplay()}
                pythonSmartContent={activeFile.smartScript || "# Waiting for AI analysis..."}
                cArrayContent={activeFile.cArray}
                base64Content={activeFile.base64}
                isAiLoading={loadingFiles.has(activeFile.id)}
              />
            ) : (
              <div className="h-full bg-[#080808] border border-[#222] rounded-lg flex flex-col items-center justify-center text-center p-8">
                 <Database className="w-10 h-10 text-gray-600 mb-4" />
                 <h2 className="text-2xl font-rog text-gray-300 mb-2">AWAITING DATA</h2>
                 <p className="text-gray-500 font-mono">Select a file to view analysis</p>
              </div>
            )}
          </div>
       </div>
  );
};

export default UniversalConverter;