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
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-sm shadow-sm">
          <span className="px-2 text-slate-400"><Calendar className="w-4 h-4" /></span>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'all' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setTimeFilter('daily')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'daily' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Günlük
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'monthly' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Aylık
          </button>
          <button
            onClick={() => setTimeFilter('yearly')}
            className={`px-3 py-1 rounded-md transition-colors ${timeFilter === 'yearly' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Yıllık
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            Tarih: {sortOrder === 'desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative bg-white border border-slate-200 rounded-lg flex items-center px-3 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Hata kodu, mesajı veya kullanıcı ID ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-3 text-sm focus:outline-none"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
        ) : processedLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Kriterlere uygun hata günlüğü bulunamadı.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {processedLogs.map(log => {
              const date = getLogDate(log);
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${log.source === 'server' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
                            log.source === 'server' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.source}
                          </span>
                          <span className="font-mono text-sm font-semibold text-slate-800 break-all">{log.errorCode}</span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1 truncate">{log.errorMessage}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0 font-medium md:self-center self-end">
                      <span>{date ? date.toLocaleString('tr-TR') : '-'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Detail Box */}
                  {isExpanded && (
                    <div className="px-4 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Kullanıcı ID</span>
                          <span className="text-slate-800 text-sm font-mono break-all">{log.userId || 'Misafir (Oturum Açılmamış)'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Hata Kaydı ID</span>
                          <span className="text-slate-800 text-sm font-mono break-all">{log.id}</span>
                        </div>
                      </div>

                      {log.deviceMetadata && (
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cihaz Bilgisi / Metadata</span>
                          <pre className="text-xs bg-white border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono text-slate-600">
                            {JSON.stringify(log.deviceMetadata, null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.stackTrace && (
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hata Yığını (Stack Trace)</span>
                          <pre className="text-xs bg-slate-900 border border-slate-800 rounded-lg p-3 max-h-60 overflow-y-auto whitespace-pre font-mono text-slate-300">
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
