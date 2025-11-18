import React, { useState, useMemo, useEffect } from 'react';
import { PaperList } from './components/PaperList';
import { PaperDetail } from './components/PaperDetail';
import { SearchBar } from './components/SearchBar';
import { AddPaperModal } from './components/AddPaperModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Paper, ViewState } from './types';
import { SAMPLE_PAPERS } from './data';
import { Library, GraduationCap, Plus, Check, Lock, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // Initialize papers from sample data, but keep it in state so we can add to it
  const [papers, setPapers] = useState<Paper[]>(SAMPLE_PAPERS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  
  // Admin & Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && viewState !== ViewState.DASHBOARD) {
        setViewState(ViewState.LIST); // Reset specific view state on desktop if not in dashboard
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewState]); // Added viewState dependency

  // Filter papers based on search query
  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return papers;

    const query = searchQuery.toLowerCase();
    return papers.filter((paper) => {
      const matchTitle = paper.title.toLowerCase().includes(query);
      const matchAuthors = paper.authors.toLowerCase().includes(query);
      const matchAbstract = paper.abstract.toLowerCase().includes(query);
      const matchKeywords = paper.keywords.some(k => k.toLowerCase().includes(query));
      
      return matchTitle || matchAuthors || matchAbstract || matchKeywords;
    });
  }, [searchQuery, papers]);

  const selectedPaper = useMemo(() => 
    papers.find(p => p.id === selectedPaperId) || null, 
  [selectedPaperId, papers]);

  // Navigation Logic
  const currentIndex = useMemo(() => 
    selectedPaperId ? filteredPapers.findIndex(p => p.id === selectedPaperId) : -1,
  [selectedPaperId, filteredPapers]);

  const hasNext = currentIndex !== -1 && currentIndex < filteredPapers.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleNextPaper = () => {
    if (hasNext) {
      const nextId = filteredPapers[currentIndex + 1].id;
      setSelectedPaperId(nextId);
      incrementViewCount(nextId);
    }
  };

  const handlePreviousPaper = () => {
    if (hasPrevious) {
      const prevId = filteredPapers[currentIndex - 1].id;
      setSelectedPaperId(prevId);
      incrementViewCount(prevId);
    }
  };

  const handlePaperSelect = (paper: Paper) => {
    setSelectedPaperId(paper.id);
    incrementViewCount(paper.id);
    if (isMobile) {
      setViewState(ViewState.DETAIL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we were in dashboard, switch back to main view
      if (viewState === ViewState.DASHBOARD) {
        setViewState(ViewState.LIST);
      }
    }
  };

  const handleBackToList = () => {
    setViewState(ViewState.LIST);
    setSelectedPaperId(null);
  };

  // Metrics Logic
  const incrementViewCount = (id: number) => {
    setPapers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, viewCount: p.viewCount + 1 };
      }
      return p;
    }));
  };

  const incrementDownloadCount = (id: number) => {
    // 1. Optimistically update count immediately
    setPapers(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          downloadCount: p.downloadCount + 1,
        };
      }
      return p;
    }));
    
    showToast("Download iniciado...");

    // 2. Attempt to record real user location via Geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          try {
            // Attempt reverse geocoding using Nominatim (OpenStreetMap)
            // Note: In a high-traffic production app, use a dedicated API service
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            
            if (response.ok) {
              const data = await response.json();
              const addr = data.address;
              
              // Try to construct a readable "City, State" string
              if (addr) {
                const city = addr.city || addr.town || addr.village || addr.municipality;
                const state = addr.state || addr.region || addr.state_district;
                const country = addr.country;
                
                if (city && state) {
                  locationName = `${city}, ${state}`;
                } else if (city) {
                  locationName = `${city}, ${country || ''}`;
                } else if (state) {
                  locationName = state;
                }
              }
            }
          } catch (error) {
            console.warn("Reverse geocoding failed:", error);
            // Fallback to coordinates is already set in locationName
          }

          // Update the specific paper with the resolved location
          setPapers(prev => prev.map(p => {
            if (p.id === id) {
              return { 
                ...p, 
                recentLocations: [locationName, ...p.recentLocations].slice(0, 20)
              };
            }
            return p;
          }));
        },
        (error) => {
          console.log("Geolocation permission denied or error:", error.message);
          // Record a fallback status so we still know a download occurred
          setPapers(prev => prev.map(p => {
            if (p.id === id) {
              return { 
                ...p, 
                recentLocations: ["Localização Não Identificada", ...p.recentLocations].slice(0, 20)
              };
            }
            return p;
          }));
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Authentication Handlers
  const handleLogin = (password: string) => {
    // Updated Password Check
    if (password === 'Dobby192032') {
      setIsAdmin(true);
      showToast('Bem-vindo, Administrador!');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setViewState(ViewState.LIST); // Exit dashboard if open
    showToast('Sessão encerrada.');
  };

  const handleAddPaper = (newPaperData: Omit<Paper, 'id' | 'viewCount' | 'downloadCount' | 'recentLocations'>) => {
    const newId = Math.max(...papers.map(p => p.id), 0) + 1;
    const newPaper: Paper = { 
      ...newPaperData, 
      id: newId,
      viewCount: 0,
      downloadCount: 0,
      recentLocations: []
    };
    
    setPapers(prev => [newPaper, ...prev]);
    setSelectedPaperId(newId);
    showToast('Trabalho adicionado com sucesso!');
    
    if (isMobile) {
      setViewState(ViewState.DETAIL);
    }
  };

  const toggleDashboard = () => {
    if (viewState === ViewState.DASHBOARD) {
      setViewState(ViewState.LIST);
    } else {
      setViewState(ViewState.DASHBOARD);
      setSelectedPaperId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <header className="bg-emerald-950 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setViewState(ViewState.LIST)}
          >
            <div className="bg-emerald-700 p-1.5 rounded-lg shadow-sm border border-emerald-600 relative overflow-hidden">
              <GraduationCap className="w-6 h-6 text-emerald-50 relative z-10" />
              {isAdmin && <div className="absolute inset-0 bg-emerald-400/20 animate-pulse" />}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-emerald-50 flex items-center gap-2">
                GT19 – Educação Matemática
                {isAdmin && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              </h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-medium hidden sm:block">Pesquisa e Prática</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button 
                  onClick={toggleDashboard}
                  className={`p-2 rounded-full transition-colors ${viewState === ViewState.DASHBOARD ? 'bg-emerald-800 text-white' : 'text-emerald-300 hover:text-white hover:bg-emerald-900'}`}
                  title="Painel de Métricas"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm border border-emerald-500 animate-fade-in"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Novo Trabalho</span>
                  <span className="sm:hidden">Novo</span>
                </button>
                
                <div className="h-6 w-px bg-emerald-800 mx-1"></div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-emerald-900 transition-colors text-emerald-300 hover:text-white"
                  title="Sair do modo Admin"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 text-emerald-400/80 hover:text-white hover:bg-emerald-900/50 px-3 py-1.5 rounded-md transition-all text-xs font-medium"
                title="Acesso Administrativo"
              >
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            
            {!isAdmin && <div className="h-6 w-px bg-emerald-800 mx-1"></div>}

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-emerald-900 transition-colors"
              title="Ver no GitHub"
            >
              <Library className="w-5 h-5 text-emerald-300" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)]">
        
        {/* Dashboard View */}
        {viewState === ViewState.DASHBOARD && isAdmin ? (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <AdminDashboard papers={papers} />
          </div>
        ) : (
          <>
            {/* Search Section - Only show in List view on mobile, always on desktop */}
            {(!isMobile || viewState === ViewState.LIST) && (
              <div className="mb-6 animate-fade-in">
                 <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Acervo Digital GT19</h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm">
                      Explore nossa coleção de pesquisas sobre Educação Matemática, ensino e aprendizagem.
                    </p>
                 </div>
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  resultCount={filteredPapers.length} 
                />
              </div>
            )}

            {/* Main Content Layout */}
            <div className="flex gap-6 h-full md:h-[calc(100vh-220px)]">
              
              {/* Left Panel: List */}
              {(!isMobile || viewState === ViewState.LIST) && (
                <div className={`flex-1 md:flex-[0_0_380px] lg:flex-[0_0_420px] flex flex-col min-h-0 ${isMobile ? 'h-auto pb-10' : ''}`}>
                   <div className="mb-3 flex items-center justify-between">
                     <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Resultados</h3>
                     {isAdmin && (
                       <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium border border-emerald-200">
                         Modo Edição
                       </span>
                     )}
                   </div>
                   <PaperList 
                     papers={filteredPapers} 
                     selectedPaperId={selectedPaperId} 
                     onSelectPaper={handlePaperSelect} 
                   />
                </div>
              )}

              {/* Right Panel: Detail */}
              {(!isMobile || viewState === ViewState.DETAIL) && (
                <div className="flex-1 min-w-0 flex flex-col min-h-0 animate-slide-in-right">
                   <PaperDetail 
                     paper={selectedPaper} 
                     onBack={handleBackToList}
                     onNext={handleNextPaper}
                     onPrevious={handlePreviousPaper}
                     onDownload={incrementDownloadCount}
                     hasNext={hasNext}
                     hasPrevious={hasPrevious}
                   />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <AddPaperModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddPaper} 
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-xl z-[200] flex items-center animate-fade-in">
            <Check className="w-5 h-5 mr-2 text-emerald-400" />
            <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;