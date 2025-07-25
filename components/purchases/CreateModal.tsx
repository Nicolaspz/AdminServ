import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function CreateModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-700 p-4">
          <h3 className="text-xl font-semibold text-slate-200">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-4 text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}