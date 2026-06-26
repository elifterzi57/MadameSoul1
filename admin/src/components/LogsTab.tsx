import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Play, Pause, RefreshCw, Terminal, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface LogsTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const LogsTab: React.FC<LogsTabProps> = ({ userRole: _userRole }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  // Filtering & Sorting
  const [dateFilter, setDateFilter] = useState<'all' | 'daily' | 'monthly' | 'yearly'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const liveTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchLogs = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const logsRef = collection(db, 'error_logs');
      // Query error logs, order by date (timestamp or createdAt)
      const q = query(logsRef, limit(100));
      const qSnap = await getDocs(q);
      const fetchedLogs: any[] = [];
      qSnap.forEach((docSnap) => {
        fetchedLogs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setLogs(fetchedLogs);
    } catch (err: any) {
      console.error(err);
      setError(`${t('logs.refresh')}: ${err.message || err}`);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Live stream mode toggle
  useEffect(() => {
    if (isLive) {
      liveTimer.current = setInterval(() => {
        fetchLogs(false);
      }, 5000); // refresh every 5 seconds
    } else {
      if (liveTimer.current) {
        clearInterval(liveTimer.current);
      }
    }
    return () => {
      if (liveTimer.current) clearInterval(liveTimer.current);
    };
  }, [isLive]);

  const toggleExpandLog = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('logs.copied'));
  };

  const getDocDate = (doc: any): Date | null => {
    const val = doc.timestamp || doc.createdAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
  };

  // Filter logs
  const getFilteredLogs = () => {
    const now = new Date();
    return logs.filter((log) => {
      // Search filter
      const message = (log.message || log.error || '').toString().toLowerCase();
      const code = (log.code || '').toString().toLowerCase();
      const searchMatch = message.includes(searchQuery.toLowerCase()) || code.includes(searchQuery.toLowerCase());
      if (!searchMatch) return false;

      // Date filter
      if (dateFilter === 'all') return true;
      const logDate = getDocDate(log);
      if (!logDate) return false;

      const diffTime = Math.abs(now.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === 'daily') {
        return diffDays <= 1;
      } else if (dateFilter === 'monthly') {
        return diffDays <= 30;
      } else if (dateFilter === 'yearly') {
        return diffDays <= 365;
      }
      return true;
    });
  };

  // Sort logs
  const getSortedLogs = (docs: any[]) => {
    return [...docs].sort((a, b) => {
      const dateA = getDocDate(a)?.getTime() || 0;
      const dateB = getDocDate(b)?.getTime() || 0;
      if (sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredLogs = getFilteredLogs();
  const sortedLogs = getSortedLogs(filteredLogs);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">{t('logs.title')}</h2>
          <p className="text-sm text-[#ecd8a6]/60">{t('logs.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {/* Live stream switch */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition cursor-pointer ${
              isLive 
                ? 'bg-green-500/20 text-green-300 border-green-500/40 animate-pulse'
                : 'bg-purple-900/20 text-[#ecd8a6] border-[#ecd8a6]/20'
            }`}
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLive ? t('logs.liveStreamOn') : t('logs.liveStream')}
          </button>
          <button
            onClick={() => fetchLogs(true)}
            className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            {t('logs.refresh')}
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-4">
        {/* Search */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('logs.searchLabel')}</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('logs.searchPlaceholder')}
            className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/40"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('logs.dateFilterLabel')}</label>
          <div className="flex rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] p-0.5">
            {(['all', 'daily', 'monthly', 'yearly'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
                  dateFilter === filter
                    ? 'bg-purple-900/40 text-[#ecd8a6]'
                    : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'
                }`}
              >
                {filter === 'all' ? t('logs.all') : filter === 'daily' ? t('logs.daily') : filter === 'monthly' ? t('logs.monthly') : t('logs.yearly')}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">{t('logs.sortOrderLabel')}</label>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex w-full items-center justify-between rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-sm text-[#ecd8a6] cursor-pointer"
          >
            <span>{sortOrder === 'desc' ? t('logs.sortDesc') : t('logs.sortAsc')}</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6]"></div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6 text-center text-red-400">
          {error}
        </div>
      ) : sortedLogs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 text-[#ecd8a6]/40">
          <Terminal className="h-12 w-12 stroke-[1]" />
          <p className="mt-3 text-sm">{t('logs.noLogs')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const logDate = getDocDate(log);
            return (
              <div
                key={log.id}
                className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 overflow-hidden transition"
              >
                <div
                  onClick={() => toggleExpandLog(log.id)}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-purple-950/5 transition select-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      ERROR
                    </span>
                    <span className="text-xs text-[#ecd8a6]/60 whitespace-nowrap">
                      {logDate ? logDate.toLocaleString('tr-TR') : '-'}
                    </span>
                    <p className="text-sm font-semibold truncate text-[#ecd8a6]/95">
                      {log.message || log.error || t('logs.unknownError')}
                    </p>
                  </div>
                  <div className="text-[#ecd8a6]/60">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#ecd8a6]/10 bg-[#07040e]/60 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs uppercase tracking-wider text-[#ecd8a6]/50">{t('logs.detailTitle')}</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                        className="flex items-center gap-1.5 rounded-lg border border-[#ecd8a6]/20 bg-purple-950/30 px-3 py-1 text-xs text-[#ecd8a6]/80 hover:bg-purple-950/50 transition cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {t('logs.copy')}
                      </button>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-[#ecd8a6]/10 bg-[#07040e] p-4 font-mono text-xs text-red-300 max-h-[300px]">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

