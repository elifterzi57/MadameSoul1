import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { AlertCircle, Calendar, ArrowUpDown, RefreshCw, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { startOfDay, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';

interface ErrorLog {
  id: string;
  userId?: string | null;
  source: 'client' | 'server';
  errorCode: string;
  errorMessage: string;
  stackTrace?: string;
  deviceMetadata?: any;
  createdAt: any;
}

export default function Logs() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'monthly' | 'yearly'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'error_logs'),
        orderBy('createdAt', 'desc'),
        limit(150)
      );
      const snap = await getDocs(q);
      const fetchedLogs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ErrorLog[];
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogDate = (log: ErrorLog) => {
    const val = log.createdAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000);
    if (typeof val === 'string') return parseISO(val);
    if (val instanceof Date) return val;
    return null;
  };

  // Filter and Sort Logic
  const processedLogs = logs
    .filter(log => {
      // Time Filter
      if (timeFilter !== 'all') {
        const date = getLogDate(log);
        if (!date) return false;
        const now = new Date();
        if (timeFilter === 'daily') {
          return isAfter(date, startOfDay(now));
        } else if (timeFilter === 'monthly') {
          return isAfter(date, startOfMonth(now));
        } else if (timeFilter === 'yearly') {
          return isAfter(date, startOfYear(now));
        }
      }
      return true;
    })
    .filter(log => {
      // Search
      if (!searchTerm) return true;
      const searchStr = `${log.errorCode} ${log.errorMessage} ${log.source} ${log.userId || ''}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // Sort: Chronological or A-Z based on errorCode
      if (sortOrder === 'desc' || sortOrder === 'asc') {
        const dateA = getLogDate(a)?.getTime() || 0;
        const dateB = getLogDate(b)?.getTime() || 0;
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Controls & Filters */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center bg-[#0a0512] border border-[#ecd8a6]/20 rounded-lg p-1 text-xs font-serif">
          <span className="px-2 text-[#ecd8a6]/50"><Calendar className="w-3.5 h-3.5" /></span>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'all' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            TÜMÜ
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'daily' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            GÜNLÜK
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'monthly' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            AYLIK
          </button>
          <button
            onClick={() => setTimeFilter('yearly')}
            className={`px-3 py-1.5 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${timeFilter === 'yearly' ? 'bg-[#1e1332] text-[#ecd8a6] border border-[#ecd8a6]/20' : 'text-[#ecd8a6]/50 hover:text-[#ecd8a6]'}`}
          >
            YILLIK
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg px-3 py-2 text-xs font-serif text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#ecd8a6]" />
            Tarih: {sortOrder === 'desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg flex items-center px-3 focus-within:border-[#ecd8a6]/55 transition-all">
        <Search className="w-4 h-4 text-[#ecd8a6]/40" />
        <input
          type="text"
          placeholder="Hata kodu, mesajı veya kullanıcı ID ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 px-3 bg-transparent text-sm text-[#ecd8a6] outline-none placeholder:text-[#ecd8a6]/30 font-sans"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,216,166,0.02)]">
        {loading ? (
          <div className="p-12 text-center text-[#ecd8a6]/60 font-sans font-light">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ecd8a6]/70" />
            Loglar yükleniyor...
          </div>
        ) : processedLogs.length === 0 ? (
          <div className="p-12 text-center text-[#ecd8a6]/50 font-sans">Kriterlere uygun hata günlüğü bulunamadı.</div>
        ) : (
          <div className="divide-y divide-[#ecd8a6]/10">
            {processedLogs.map(log => {
              const date = getLogDate(log);
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="hover:bg-[#1e1332]/10 transition-colors font-sans">
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 border ${
                        log.source === 'server' 
                          ? 'bg-red-950/20 border-red-500/20 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
                          : 'bg-amber-950/20 border-amber-500/20 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                      }`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-serif font-bold uppercase px-2 py-0.5 rounded-full border ${
                            log.source === 'server' 
                              ? 'bg-red-950/40 border-red-500/25 text-red-300' 
                              : 'bg-amber-950/40 border-amber-500/25 text-amber-300'
                          }`}>
                            {log.source}
                          </span>
                          <span className="font-mono text-sm font-semibold text-[#ecd8a6] break-all">{log.errorCode}</span>
                        </div>
                        <p className="text-[#ecd8a6]/70 text-sm mt-1 truncate">{log.errorMessage}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#ecd8a6]/55 shrink-0 font-medium md:self-center self-end">
                      <span>{date ? date.toLocaleString('tr-TR') : '-'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/70" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/70" />}
                    </div>
                  </div>

                  {/* Expanded Detail Box */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-4 border-t border-[#ecd8a6]/10 bg-[#120a1c]/30 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-xs font-serif font-semibold text-[#ecd8a6]/50 uppercase tracking-widest mb-1">Kullanıcı ID</span>
                          <span className="text-[#ecd8a6] text-xs font-mono break-all bg-[#05000a]/60 px-3 py-1.5 rounded border border-[#ecd8a6]/10 inline-block">
                            {log.userId || 'Misafir (Oturum Açılmamış)'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-serif font-semibold text-[#ecd8a6]/50 uppercase tracking-widest mb-1">Hata Kaydı ID</span>
                          <span className="text-[#ecd8a6] text-xs font-mono break-all bg-[#05000a]/60 px-3 py-1.5 rounded border border-[#ecd8a6]/10 inline-block">
                            {log.id}
                          </span>
                        </div>
                      </div>

                      {log.deviceMetadata && (
                        <div>
                          <span className="block text-xs font-serif font-semibold text-[#ecd8a6]/50 uppercase tracking-widest mb-2">Cihaz Bilgisi / Metadata</span>
                          <pre className="text-xs bg-[#05000a]/80 border border-[#ecd8a6]/15 rounded-lg p-3 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono text-[#ecd8a6]/85">
                            {JSON.stringify(log.deviceMetadata, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.stackTrace && (
                        <div>
                          <span className="block text-xs font-serif font-semibold text-[#ecd8a6]/50 uppercase tracking-widest mb-2">Hata Yığını (Stack Trace)</span>
                          <pre className="text-xs bg-[#05000a] border border-red-500/10 rounded-lg p-4 max-h-60 overflow-y-auto whitespace-pre font-mono text-red-200/90 shadow-inner scrollbar-thin">
                            {log.stackTrace}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
