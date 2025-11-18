import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow shadow-sm"
          placeholder="Buscar por título, autor ou palavra-chave..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="text-right mt-2 text-xs text-emerald-700 font-medium">
        {resultCount} documentos encontrados
      </div>
    </div>
  );
};