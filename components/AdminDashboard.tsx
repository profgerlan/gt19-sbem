import React from 'react';
import { Paper } from '../types';
import { BarChart, Eye, Download, MapPin, TrendingUp, ArrowUpRight } from 'lucide-react';

interface AdminDashboardProps {
  papers: Paper[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ papers }) => {
  // Calculate Totals
  const totalViews = papers.reduce((acc, p) => acc + p.viewCount, 0);
  const totalDownloads = papers.reduce((acc, p) => acc + p.downloadCount, 0);
  const avgDownloads = papers.length ? (totalDownloads / papers.length).toFixed(1) : '0';

  // Sort by popularity
  const mostViewed = [...papers].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const mostDownloaded = [...papers].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5);

  // Aggregate locations
  const locationStats: Record<string, number> = {};
  papers.forEach(p => {
    p.recentLocations.forEach(loc => {
      locationStats[loc] = (locationStats[loc] || 0) + 1;
    });
  });
  
  const sortedLocations = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
    
  const maxLocationCount = sortedLocations.length > 0 ? sortedLocations[0][1] : 1;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart className="w-6 h-6 text-emerald-600" />
        Painel de Métricas
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total de Consultas</p>
          <p className="text-3xl font-bold text-slate-800">{totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Total de Downloads</p>
          <p className="text-3xl font-bold text-slate-800">{totalDownloads.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Média Downloads/Trabalho</p>
          <p className="text-3xl font-bold text-slate-800">{avgDownloads}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Viewed Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Eye className="w-4 h-4 mr-2 text-emerald-500" />
              Mais Visualizados
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {mostViewed.map((paper) => (
                  <tr key={paper.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]">
                      {paper.title}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {paper.viewCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Downloaded Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Download className="w-4 h-4 mr-2 text-blue-500" />
              Mais Baixados
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {mostDownloaded.map((paper) => (
                  <tr key={paper.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]">
                      {paper.title}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {paper.downloadCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Origem dos Acessos (Recentes)</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sortedLocations.map(([location, count]) => {
              // Scale bar relative to the highest count
              const percentage = Math.round((count / maxLocationCount) * 100);
              return (
                <div key={location}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1.5 text-slate-400" />
                      {location}
                    </span>
                    <span className="text-slate-500">{count} acessos</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }} 
                    ></div>
                  </div>
                </div>
              );
            })}
            {sortedLocations.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">Nenhum dado de localização registrado ainda.</p>
            )}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 flex items-start">
            <ArrowUpRight className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>Os dados de localização são baseados no IP aproximado ou GPS do dispositivo no momento do download.</p>
          </div>
        </div>
      </div>
    </div>
  );
};