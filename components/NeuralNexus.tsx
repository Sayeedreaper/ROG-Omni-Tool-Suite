import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, NeuralGem } from '../types';
import { createChatSession } from '../services/geminiService';
import { Send, Bot, User, RefreshCw, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Default Gems
const PRESET_GEMS: NeuralGem[] = [
  {
    id: 'gem_default',
    name: 'ROG Assistant',
    description: 'General purpose AI assistant.',
    systemInstruction: 'You are a helpful AI assistant integrated into the ASUS ROG Omni-Tool interface. You are concise, tech-savvy, and helpful.',
    icon: 'Bot',
    color: '#ff0033'
  },
  {
    id: 'gem_coder',
    name: 'Code Architect',
    description: 'Expert in Python, React, and Systems Programming.',
    systemInstruction: 'You are an elite senior software engineer. You specialize in clean, efficient code. You prefer TypeScript and Python. You answer with code blocks and minimal fluff.',
    icon: 'Code',
    color: '#00ccff'
  },
  {
    id: 'gem_sec',
    name: 'NetRunner',
    description: 'Cybersecurity and Hex analysis expert.',
    systemInstruction: 'You are a cybersecurity expert. You analyze data for vulnerabilities. You speak in cyberpunk slang occasionally. You are paranoid but helpful.',
    icon: 'Shield',
    color: '#9d00ff'
  }
];

const NeuralNexus: React.FC = () => {
  const [gems, setGems] = useState<NeuralGem[]>(PRESET_GEMS);
  const [activeGemId, setActiveGemId] = useState<string>(PRESET_GEMS[0].id);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  // Custom Gem Creator State
  const [isCreating, setIsCreating] = useState(false);
  const [newGemName, setNewGemName] = useState('');
  const [newGemInst, setNewGemInst] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeGem = gems.find(g => g.id === activeGemId) || gems[0];

  // Initialize Chat Session when Gem changes
  useEffect(() => {
    setChatHistory([{
      role: 'model',
      text: `System initialized. ${activeGem.name} active. ${activeGem.description}`,
      timestamp: Date.now()
    }]);
    
    try {
      const chat = createChatSession("gemini-3-flash-preview", activeGem.systemInstruction);
      setChatSession(chat);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, [activeGemId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage(userMsg.text);
      const responseText = result.response.text();
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Error: Connection interrupted.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewGem = () => {
    if (!newGemName || !newGemInst) return;
    const newGem: NeuralGem = {
      id: `gem_${Date.now()}`,
      name: newGemName,
      description: 'Custom User Gem',
      systemInstruction: newGemInst,
      icon: 'User',
      color: '#ffffff'
    };
    setGems([...gems, newGem]);
    setActiveGemId(newGem.id);
    setIsCreating(false);
    setNewGemName('');
    setNewGemInst('');
  };

  return (
    <div className="flex flex-col md:flex-row h-full max-h-[calc(100vh-100px)]">
      
      {/* Gem Selector Sidebar */}
      <div className="w-full md:w-64 bg-[#080808] border-b md:border-b-0 md:border-r border-[#222] p-4 flex flex-col gap-3 shrink-0">
        <div className="font-rog text-sm text-gray-400 mb-2 flex justify-between items-center">
          NEURAL GEMS
          <button onClick={() => setIsCreating(!isCreating)} className="p-1 hover:bg-[#222] rounded text-[#00ccff]"><Plus size={16} /></button>
        </div>
        
        {isCreating && (
          <div className="bg-[#111] p-3 rounded border border-[#333] mb-2 animate-in fade-in slide-in-from-top-2">
            <input 
              className="w-full bg-[#050505] border border-[#333] rounded px-2 py-1 text-xs mb-2 text-white" 
              placeholder="Gem Name"
              value={newGemName}
              onChange={e => setNewGemName(e.target.value)}
            />
            <textarea 
              className="w-full bg-[#050505] border border-[#333] rounded px-2 py-1 text-xs mb-2 text-white h-20" 
              placeholder="System Instructions (Persona)"
              value={newGemInst}
              onChange={e => setNewGemInst(e.target.value)}
            />
            <button 
              onClick={createNewGem}
              className="w-full bg-[#00ccff] hover:bg-[#00b3e6] text-black font-bold text-xs py-1 rounded"
            >
              INITIALIZE GEM
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          {gems.map(gem => (
            <div 
              key={gem.id}
              onClick={() => setActiveGemId(gem.id)}
              className={`
                p-3 rounded border cursor-pointer transition-all flex items-center gap-3
                ${activeGemId === gem.id 
                  ? `bg-[#1a1a1a] border-[${gem.color}]` 
                  : 'bg-[#0a0a0a] border-[#222] hover:bg-[#111]'
                }
              `}
              style={{ borderColor: activeGemId === gem.id ? gem.color : '#222' }}
            >
               <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: gem.color }}></div>
               <div className="overflow-hidden">
                 <div className={`font-bold text-sm ${activeGemId === gem.id ? 'text-white' : 'text-gray-400'}`}>{gem.name}</div>
                 <div className="text-[10px] text-gray-600 truncate">{gem.description}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#050505] relative">
         {/* Active Gem Header */}
         <div className="p-4 border-b border-[#222] flex items-center gap-3 bg-[#080808]/50 backdrop-blur">
            <div className="p-2 rounded-full bg-[#111] border border-[#222]">
               <Bot size={20} style={{ color: activeGem.color }} />
            </div>
            <div>
               <div className="font-rog text-white">{activeGem.name}</div>
               <div className="text-xs font-mono text-gray-500">GEMINI-3-FLASH // {activeGem.id.toUpperCase()}</div>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`
                   w-8 h-8 rounded shrink-0 flex items-center justify-center
                   ${msg.role === 'user' ? 'bg-[#222]' : `bg-[${activeGem.color}]/10 border border-[${activeGem.color}]/30`}
                 `}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} style={{ color: activeGem.color }} />}
                 </div>
                 <div className={`
                   max-w-[80%] rounded-lg p-3 text-sm leading-relaxed
                   ${msg.role === 'user' ? 'bg-[#151515] text-gray-200' : 'bg-transparent text-gray-300'}
                 `}>
                    <div className="whitespace-pre-wrap font-mono">{msg.text}</div>
                    <div className="mt-2 text-[10px] text-gray-700 font-mono text-right">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                 </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center bg-[${activeGem.color}]/10`}>
                     <Bot size={16} style={{ color: activeGem.color }} />
                  </div>
                  <div className="text-[#00ccff] font-mono text-xs animate-pulse pt-2">COMPUTING RESPONSE...</div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 bg-[#080808] border-t border-[#222]">
            <div className="relative">
               <textarea
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder={`Message ${activeGem.name}...`}
                 className="w-full bg-[#050505] border border-[#333] rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#ff0033] focus:ring-1 focus:ring-[#ff0033] resize-none h-12 custom-scrollbar"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim()}
                 className="absolute right-2 top-2 p-2 text-gray-400 hover:text-[#ff0033] disabled:opacity-50 transition-colors"
               >
                  <Send size={16} />
               </button>
            </div>
            <div className="text-[10px] text-gray-600 font-mono mt-2 text-center">
               AI GENERATED CONTENT MAY BE INACCURATE. VERIFY IMPORTANT DATA.
            </div>
         </div>
      </div>
    </div>
  );
};

export default NeuralNexus;