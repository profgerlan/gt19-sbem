import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Paper } from '../types';
import { Badge } from './Badge';
import { Download, ExternalLink, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, BookOpen, AlertCircle, Maximize2, X, Eye, Sparkles, BrainCircuit } from 'lucide-react';

interface PaperDetailProps {
  paper: Paper | null;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onDownload?: (paperId: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const PaperDetail: React.FC<PaperDetailProps> = ({ 
  paper, 
  onBack, 
  onNext, 
  onPrevious,
  onDownload,
  hasNext = false,
  hasPrevious = false 
}) => {
  const [pdfError, setPdfError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Reset states when paper changes
  useEffect(() => {
    setPdfError(false);
    setIsExpanded(false);
    setAiResult(null);
    setAiError(null);
    setAiLoading(false);
  }, [paper]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (isExpanded) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setIsExpanded(false);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          onBack();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          if (onNext && hasNext) onNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          if (onPrevious && hasPrevious) onPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onBack, onNext, onPrevious, hasNext, hasPrevious]);

  const handleAiAnalysis = async () => {
    if (!paper) return;
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Você é um especialista acadêmico em Educação Matemática (GT19). Analise o seguinte resumo:
          
          Título: "${paper.title}"
          Resumo: "${paper.abstract}"
          
          Por favor, forneça:
          1. Uma frase simples explicando o impacto deste trabalho para um professor iniciante.
          2. Três pontos-chave (bullet points) sobre a metodologia ou resultados.
          
          Use formatação Markdown simples.`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar com o servidor');
      }

      setAiResult(data.text);
    } catch (err) {
      console.error(err);
      setAiError('Não foi possível gerar a análise. Verifique se a chave de API está configurada no servidor.');
    } finally {
      setAiLoading(false);
    }
  };

  if (!paper) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <BookOpen className="w-16 h-16 text-emerald-200" />
        </div>
        <p className="text-lg font-medium text-slate-600">Selecione um trabalho para visualizar</p>
        <p className="text-sm mt-2 text-slate-400">Clique em um item da lista ao lado para ver os detalhes.</p>
      </div>
    );
  }

  const handleDownloadClick = () => {
    if (onDownload && paper) {
      onDownload(paper.id);
    }
  };

  const PdfViewer = ({ className = "", expanded = false }: { className?: string, expanded?: boolean }) => (
    !pdfError ? (
      <iframe 
        src={paper.downloadUrl} 
        title={expanded ? "PDF Viewer Expanded" : "PDF Viewer"}
        className={className}
        onError={() => setPdfError(true)}
      />
    ) : (
      <div className={`flex flex-col items-center justify-center text-slate-500 text-center ${expanded ? 'h-full' : 'absolute inset-0 p-4'}`}>
        <AlertCircle className="w-10 h-10 mb-2 text-slate-400" />
        <p>Não foi possível carregar a pré-visualização do PDF.</p>
        <p className="text-xs mt-1">Por favor, utilize o botão "Baixar PDF".</p>
      </div>
    )
  );

  return (
    <>
      <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header with Navigation */}
        <div className="border-b border-slate-100 p-3 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1.5 rounded-md transition-colors text-sm font-medium"
            title="Voltar para lista (Esc)"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </button>

          <div className="flex items-center gap-1">
             <button
               onClick={onPrevious}
               disabled={!hasPrevious}
               className={`p-1.5 rounded-md transition-colors ${hasPrevious ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900' : 'text-slate-300 cursor-not-allowed'}`}
               title="Item Anterior (Seta Esquerda/Cima)"
             >
               <ChevronUp className="w-5 h-5" />
             </button>
             <button
               onClick={onNext}
               disabled={!hasNext}
               className={`p-1.5 rounded-md transition-colors ${hasNext ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900' : 'text-slate-300 cursor-not-allowed'}`}
               title="Próximo Item (Seta Direita/Baixo)"
             >
               <ChevronDown className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-8">
            
            {/* Header Info */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge text={paper.type} color="teal" />
                <Badge text={String(paper.year)} color="gray" />
                {paper.eventOrJournal && <Badge text={paper.eventOrJournal} color="emerald" />}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                {paper.title}
              </h1>
              
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Autores</h3>
                  <p className="text-slate-800 font-medium">{paper.authors}</p>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center" title="Total de visualizações">
                    <Eye className="w-4 h-4 mr-1.5 text-slate-400" />
                    {paper.viewCount} views
                  </div>
                  <div className="flex items-center" title="Total de downloads">
                    <Download className="w-4 h-4 mr-1.5 text-slate-400" />
                    {paper.downloadCount} downloads
                  </div>
                </div>
              </div>
            </div>

            {/* Abstract & Keywords */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full mr-2"></span>
                    Resumo
                  </h3>
                  {!aiResult && (
                    <button 
                      onClick={handleAiAnalysis}
                      disabled={aiLoading}
                      className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-full transition-colors disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {aiLoading ? 'Analisando...' : 'Analisar com IA'}
                    </button>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-4">
                  {paper.abstract}
                </p>

                {/* AI Result Section */}
                {aiResult && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold text-sm">
                      <BrainCircuit className="w-4 h-4" />
                      Análise do Assistente GT19
                    </div>
                    <div className="text-sm text-slate-700 prose prose-sm prose-emerald max-w-none">
                      <div className="whitespace-pre-line leading-relaxed">
                        {aiResult}
                      </div>
                    </div>
                    <button 
                      onClick={() => setAiResult(null)}
                      className="text-[10px] text-emerald-600 hover:underline mt-2"
                    >
                      Fechar análise
                    </button>
                  </div>
                )}
                
                {aiError && (
                  <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 animate-fade-in">
                    {aiError}
                  </div>
                )}

              </div>
              <div className="lg:col-span-1">
                 <h3 className="text-sm font-bold text-slate-900 mb-2">Palavras-chave</h3>
                 <div className="flex flex-wrap gap-2">
                   {paper.keywords.map((kw, i) => (
                     <Badge key={i} text={kw} color="gray" />
                   ))}
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6 border-t border-slate-100 pt-6">
              <a 
                href={paper.downloadUrl} 
                download
                onClick={handleDownloadClick}
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </a>
              <a 
                href={paper.downloadUrl} 
                target="_blank" 
                rel="noreferrer"
                onClick={handleDownloadClick} // Count as download/view
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-slate-400"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir em nova aba
              </a>
            </div>

            {/* PDF Viewer Inline */}
            <div className="w-full bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group" style={{ height: '600px' }}>
              <PdfViewer className="w-full h-full" />
              
              {!pdfError && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="absolute top-3 right-3 bg-slate-900/75 hover:bg-emerald-900 text-white p-2 rounded-lg shadow-lg backdrop-blur-sm transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                  title="Expandir visualização"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">
              Visualizando: {paper.fileName}
            </p>

          </div>
        </div>
      </div>

      {/* Expanded Modal Portal */}
      {isExpanded && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-sm flex flex-col animate-fade-in p-4 sm:p-6">
          <div className="flex items-center justify-between text-white mb-4 w-full max-w-[1600px] mx-auto">
            <h2 className="text-lg font-bold truncate flex-1 pr-4 text-emerald-50">{paper.title}</h2>
            <div className="flex items-center gap-2 shrink-0">
               <a 
                  href={paper.downloadUrl} 
                  download
                  onClick={handleDownloadClick}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-white"
                  title="Baixar PDF"
               >
                  <Download className="w-5 h-5" />
               </a>
               <button 
                 onClick={() => setIsExpanded(false)}
                 className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-white"
                 title="Fechar (Esc)"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-[1600px] mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
             <PdfViewer className="w-full h-full" expanded={true} />
          </div>
          
          <div className="text-center text-emerald-200/50 text-xs mt-3 hidden sm:block">
            Pressione ESC para sair
          </div>
        </div>,
        document.body
      )}
    </>
  );
};