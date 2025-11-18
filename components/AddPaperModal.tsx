import React, { useState, useRef, DragEvent } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { Paper } from '../types';

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paper: Omit<Paper, 'id' | 'viewCount' | 'downloadCount' | 'recentLocations'>) => void;
}

export const AddPaperModal: React.FC<AddPaperModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    type: 'Artigo',
    eventOrJournal: '',
    keywords: '',
    abstract: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, selecione apenas arquivos PDF.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.authors || !file) {
      setError('Preencha os campos obrigatórios e selecione um arquivo.');
      return;
    }

    const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

    // Create a blob URL for the uploaded file to allow immediate preview
    const objectUrl = URL.createObjectURL(file);

    const newPaper: Omit<Paper, 'id' | 'viewCount' | 'downloadCount' | 'recentLocations'> = {
      title: formData.title,
      authors: formData.authors,
      year: Number(formData.year),
      type: formData.type,
      eventOrJournal: formData.eventOrJournal,
      keywords: keywordsArray,
      abstract: formData.abstract,
      fileName: file.name,
      downloadUrl: objectUrl
    };

    onAdd(newPaper);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      authors: '',
      year: new Date().getFullYear(),
      type: 'Artigo',
      eventOrJournal: '',
      keywords: '',
      abstract: ''
    });
    setFile(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
          <div>
            <h2 className="text-lg font-bold text-emerald-900">Novo Trabalho</h2>
            <p className="text-xs text-emerald-600">Adicionar PDF e metadados ao repositório</p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form id="add-paper-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* File Upload */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer duration-200
                ${isDragging ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : ''}
                ${file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50'}
              `}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center text-emerald-700">
                  <div className="bg-emerald-100 p-3 rounded-full mb-2 shadow-sm">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="font-medium text-sm">{file.name}</span>
                  <span className="text-xs opacity-70 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className="text-xs font-semibold mt-2 flex items-center bg-white px-2 py-1 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3 mr-1" /> Pronto para enviar
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <div className={`p-3 rounded-full mb-2 transition-colors ${isDragging ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </div>
                  <span className="font-medium text-sm text-slate-700">
                    {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste o PDF aqui'}
                  </span>
                  <span className="text-xs opacity-60 mt-1">Apenas arquivos .pdf</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-shadow"
                  placeholder="Ex: O uso de tecnologias no ensino..."
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Autores *</label>
                <input
                  type="text"
                  name="authors"
                  required
                  value={formData.authors}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-shadow"
                  placeholder="Ex: Silva, João; Santos, Maria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ano *</label>
                <input
                  type="number"
                  name="year"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Trabalho</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white transition-shadow"
                >
                  <option value="Artigo">Artigo</option>
                  <option value="Dissertação">Dissertação</option>
                  <option value="Tese">Tese</option>
                  <option value="Resumo Expandido">Resumo Expandido</option>
                  <option value="Relato de Experiência">Relato de Experiência</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Evento ou Periódico</label>
              <input
                type="text"
                name="eventOrJournal"
                value={formData.eventOrJournal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-shadow"
                placeholder="Ex: ENEM 2024 ou Revista Brasileira de..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Palavras-chave</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-shadow"
                placeholder="Separe por vírgula. Ex: Geometria, Tecnologias, BNCC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resumo</label>
              <textarea
                name="abstract"
                rows={4}
                value={formData.abstract}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none transition-shadow"
                placeholder="Breve descrição do trabalho..."
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="add-paper-form"
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 shadow-sm transition-colors"
          >
            Adicionar Trabalho
          </button>
        </div>
      </div>
    </div>
  );
};