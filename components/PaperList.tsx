import React from 'react';
import { Paper } from '../types';
import { FileText, Calendar, User } from 'lucide-react';
import { Badge } from './Badge';

interface PaperListProps {
  papers: Paper[];
  selectedPaperId: number | null;
  onSelectPaper: (paper: Paper) => void;
}

export const PaperList: React.FC<PaperListProps> = ({ papers, selectedPaperId, onSelectPaper }) => {
  if (papers.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
        <FileText className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum documento encontrado</h3>
        <p className="mt-1 text-sm text-slate-500">Tente ajustar os termos da sua busca.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pr-2 custom-scrollbar">
      {papers.map((paper) => (
        <div
          key={paper.id}
          onClick={() => onSelectPaper(paper)}
          className={`
            group relative p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer
            ${selectedPaperId === paper.id 
              ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <Badge text={paper.type} color="teal" />
            <div className="flex items-center text-slate-500 text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {paper.year}
            </div>
          </div>
          
          <h3 className={`text-sm font-bold mb-2 line-clamp-2 ${selectedPaperId === paper.id ? 'text-emerald-900' : 'text-slate-800'}`}>
            {paper.title}
          </h3>
          
          <div className="flex items-center text-xs text-slate-600 mb-3">
            <User className="w-3 h-3 mr-1.5 flex-shrink-0 text-emerald-600" />
            <span className="truncate">{paper.authors}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {paper.keywords.slice(0, 2).map((kw, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                #{kw}
              </span>
            ))}
            {paper.keywords.length > 2 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5">+{paper.keywords.length - 2}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};