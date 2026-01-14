import React, { useEffect, useRef } from 'react';
import { Wisdom } from '../types';
import { Icon } from './Icon';

interface WisdomDisplayProps {
  activeWisdom: Wisdom | null;
  isSpinning: boolean;
}

const WisdomDisplay: React.FC<WisdomDisplayProps> = ({ activeWisdom, isSpinning }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger Prism highlight when the active wisdom changes
    if (activeWisdom && codeRef.current && (window as any).Prism) {
      (window as any).Prism.highlightElement(codeRef.current);
    }
  }, [activeWisdom]);

  if (!activeWisdom) return null;

  return (
    <div 
      className={`mt-8 md:mt-12 max-w-lg w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xl transition-all duration-500 transform ${
        isSpinning ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className={`p-3 rounded-lg ${activeWisdom.color} shadow-md shrink-0 mx-auto sm:mx-0`}>
          <Icon name={activeWisdom.iconName} size={28} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center sm:text-left">{activeWisdom.title}</h2>
          
          <div className="h-24 overflow-y-auto pr-2 mb-4">
            <p className="text-slate-600 text-sm leading-relaxed">
              {activeWisdom.detail}
            </p>
          </div>
          
          <div className="relative group rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
            <div className="absolute top-0 right-0 px-2 py-1 opacity-60 text-[10px] font-mono text-slate-500 select-none bg-slate-200/50 rounded-bl-md z-10">PHP</div>
            <div className="p-3 overflow-x-auto h-48 overflow-y-auto">
              <pre className="m-0">
                <code ref={codeRef} className="language-php text-xs sm:text-sm whitespace-pre">
                  {activeWisdom.codeSnippet}
                </code>
              </pre>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-black/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisdomDisplay;