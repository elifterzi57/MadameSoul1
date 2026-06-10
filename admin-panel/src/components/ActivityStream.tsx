import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { 
  Activity, 
  Eye, 
  EyeOff, 
  Search, 
  Key, 
  Sparkles, 
  Coins, 
  ShieldAlert, 
  Clock, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityLog {
  id: string;
  userId: string | null;
  eventType: 'auth' | 'generation' | 'purchase' | 'error';
  status: 'success' | 'pending' | 'failed';
  message: string;
  email?: string | null;
  details?: Record<string, any> | null;
  createdAt: any; // Firestore Timestamp
}

interface ActivityStreamProps {
  db: Firestore;
}

export function maskEmail(email: string | null | undefined): string {
  if (!email) return "bilinmeyen@kullanici.com";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  
  const maskedLocal = local.length > 2 
    ? local.slice(0, 2) + "*".repeat(local.length - 2)
    : local + "*";
    
  const domainParts = domain.split(".");
  const maskedDomain = domainParts.map((part, index) => {
    if (index === domainParts.length - 1) return part; // Keep extension like .com
    return part.length > 2
      ? part.slice(0, 2) + "*".repeat(part.length - 2)
      : part + "*";
  }).join(".");
  
  return `${maskedLocal}@${maskedDomain}`;
}

export default function ActivityStream({ db }: ActivityStreamProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Controls
  const [limitCount, setLimitCount] = useState<50 | 100>(50);
  const [isMasked, setIsMasked] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const activityRef = collection(db, 'activity_stream');
    const q = query(
      activityRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedLogs: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        updatedLogs.push({
          id: doc.id,
          userId: data.userId || null,
          eventType: data.eventType,
          status: data.status,
          message: data.message || '',
          email: data.email || null,
          details: data.details || null,
          createdAt: data.createdAt
        });
      });
      setLogs(updatedLogs);
      setLoading(false);
    }, (err) => {
      console.error("Error subscribing to activity stream:", err);
      setError("Canlı işlem akışı yüklenemedi. Yetkiniz eksik olabilir.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, limitCount]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Type filter
      if (selectedType !== 'all' && log.eventType !== selectedType) {
        return false;
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const msgMatch = log.message?.toLowerCase().includes(queryLower);
        const emailMatch = log.email?.toLowerCase().includes(queryLower);
        const typeMatch = log.eventType?.toLowerCase().includes(queryLower);
        const idMatch = log.id?.toLowerCase().includes(queryLower);
        return msgMatch || emailMatch || typeMatch || idMatch;
      }
      
      return true;
    });
  }, [logs, selectedType, searchQuery]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <Key className="w-4 h-4 text-purple-400" />;
      case 'generation':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'purchase':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Activity className="w-4 h-4 text-[#ecd8a6]" />;
    }
  };

  const getMysticalIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <span className="text-xl">🔑</span>;
      case 'generation':
        return <span className="text-xl">🔮</span>;
      case 'purchase':
        return <span className="text-xl">🪙</span>;
      case 'error':
        return <span className="text-xl">⚠️</span>;
      default:
        return <Activity className="w-4 h-4 text-[#ecd8a6]" />;
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'auth':
        return 'bg-purple-950/40 text-purple-300 border-purple-500/20';
      case 'generation':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/20';
      case 'purchase':
        return 'bg-yellow-950/40 text-yellow-300 border-yellow-500/20';
      case 'error':
        return 'bg-rose-950/40 text-rose-300 border-rose-500/20';
      default:
        return 'bg-slate-900/60 text-slate-300 border-slate-700/20';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75 shadow-[0_0_10px_#00ff88]"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88] shadow-[0_0_8px_#00ff88]"></span></span>;
      case 'pending':
        return <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4b400] opacity-75 shadow-[0_0_10px_#f4b400]"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#f4b400] shadow-[0_0_8px_#f4b400]"></span></span>;
      case 'failed':
        return <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3333] opacity-75 shadow-[0_0_10px_#ff3333]"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3333] shadow-[0_0_8px_#ff3333]"></span></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-gray-500"></span>;
    }
  };

  const getLogTime = (createdAt: any) => {
    if (!createdAt) return 'Az önce';
    
    let date: Date;
    if (typeof createdAt.toDate === 'function') {
      date = createdAt.toDate();
    } else {
      date = new Date(createdAt);
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const toggleExpandLog = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] mb-6 hover:border-[#ecd8a6]/25">
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#160d26]/60 to-transparent border-b border-[#ecd8a6]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-5 h-5 text-[#ecd8a6]" />
            <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6] flex items-center gap-2">
              Canlı İşlem Akışı
            </h3>
            <p className="text-[10px] text-[#ecd8a6]/40 uppercase tracking-widest font-serif mt-0.5">
              Sistem Genelindeki Olayların Anlık İzlenmesi
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mask Email Toggle */}
          <button 
            onClick={() => setIsMasked(prev => !prev)}
            className="p-1.5 bg-black/40 border border-[#ecd8a6]/15 hover:bg-[#ecd8a6]/10 rounded-lg text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-all flex items-center gap-1.5 text-[10px] uppercase font-serif tracking-wider px-2.5 cursor-pointer"
            title={isMasked ? "E-postaları Göster (KVKK)" : "E-postaları Gizle (KVKK)"}
          >
            {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isMasked ? "Gözü Aç" : "Gizle"}</span>
          </button>

          {/* Row Limit Selector */}
          <select 
            value={limitCount}
            onChange={(e) => setLimitCount(Number(e.target.value) as 50 | 100)}
            className="bg-black/40 border border-[#ecd8a6]/15 rounded-lg text-[#ecd8a6] px-2.5 py-1 text-[10px] font-serif uppercase tracking-wider focus:outline-none focus:border-[#ecd8a6]/40"
          >
            <option value={50} className="bg-[#0a0512]">50 Kayıt</option>
            <option value={100} className="bg-[#0a0512]">100 Kayıt</option>
          </select>

          {/* Expand/Collapse */}
          <button 
            onClick={() => setIsCollapsed(prev => !prev)}
            className="p-1.5 hover:bg-[#ecd8a6]/10 rounded-lg text-[#ecd8a6]/60 hover:text-[#ecd8a6] transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Filters Row */}
            <div className="p-4 bg-black/20 border-b border-[#ecd8a6]/5 flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Type Filters */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'auth', label: 'Giriş/Kayıt' },
                  { id: 'generation', label: 'Tarot Üretimi' },
                  { id: 'purchase', label: 'Ödeme/Bakiye' },
                  { id: 'error', label: 'Hatalar' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedType(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-serif uppercase tracking-widest border transition-all cursor-pointer ${
                      selectedType === btn.id 
                        ? 'bg-[#ecd8a6] text-[#0a0512] border-[#ecd8a6] font-bold' 
                        : 'bg-black/30 text-[#ecd8a6]/60 border-[#ecd8a6]/10 hover:text-[#ecd8a6] hover:bg-[#ecd8a6]/5'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#ecd8a6]/40" />
                <input 
                  type="text"
                  placeholder="Mesaj veya e-posta ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-[#ecd8a6]/15 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#ecd8a6] placeholder-[#ecd8a6]/30 focus:outline-none focus:border-[#ecd8a6]/40"
                />
              </div>
            </div>

            {/* List Body */}
            <div className="relative max-h-[320px] overflow-y-auto px-4 py-2 bg-[#050209]/40 divide-y divide-[#ecd8a6]/5">
              {loading && logs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <div className="w-5 h-5 rounded-full border-2 border-[#ecd8a6]/20 border-t-[#ecd8a6] animate-spin" />
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#ecd8a6]/40">Canlı Veri Dinleniyor...</span>
                </div>
              )}

              {error && (
                <div className="py-8 text-center text-xs text-rose-400 font-serif">
                  {error}
                </div>
              )}

              {!loading && filteredLogs.length === 0 && (
                <div className="py-10 text-center text-xs text-[#ecd8a6]/40 font-serif uppercase tracking-widest">
                  Eşleşen Kehanet/Olay Bulunamadı.
                </div>
              )}

              <AnimatePresence initial={false}>
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="py-3 flex flex-col gap-1.5 hover:bg-[#ecd8a6]/5 px-2 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Icon & Message */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-black/50 border border-[#ecd8a6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getEventIcon(log.eventType)}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Mystical Icon */}
                            <div className="w-6 h-6 rounded-lg bg-black/50 border border-[#ecd8a6]/10 flex items-center justify-center flex-shrink-0">
                              {getMysticalIcon(log.eventType)}
                            </div>
                            
                            {/* Event Tag */}
                            <span className={`px-2 py-0.5 rounded text-[8px] font-serif uppercase border font-semibold tracking-wider ${getEventBadgeClass(log.eventType)}`}>
                              {log.eventType}
                            </span>
                            
                            {/* Status Dot */}
                            <span className="flex items-center gap-1.5 text-[9px] text-[#ecd8a6]/50">
                              {getStatusDot(log.status)}
                              <span className="capitalize">{log.status}</span>
                            </span>
                          </div>

                          <p className="text-xs text-[#ecd8a6] font-medium leading-relaxed">
                            {log.message}
                          </p>

                          {log.email && (
                            <span className="text-[10px] text-[#ecd8a6]/40 block font-mono">
                              {isMasked ? maskEmail(log.email) : log.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Time & Details Toggle */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
                        <span className="text-[9px] text-[#ecd8a6]/40 font-serif flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getLogTime(log.createdAt)}
                        </span>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <button
                            onClick={() => toggleExpandLog(log.id)}
                            className="text-[9px] font-serif uppercase tracking-widest text-[#ecd8a6]/50 hover:text-[#ecd8a6] flex items-center gap-0.5 cursor-pointer hover:underline"
                          >
                            <span>Detay</span>
                            {expandedLogId === log.id ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable details map */}
                    {expandedLogId === log.id && log.details && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/60 rounded-xl p-3 border border-[#ecd8a6]/10 overflow-x-auto text-[10px] font-mono text-purple-200/90 max-w-full"
                      >
                        <pre className="whitespace-pre-wrap word-break-all">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Footer Summary */}
            <div className="p-3 bg-black/40 border-t border-[#ecd8a6]/5 text-center text-[9px] font-serif uppercase tracking-widest text-[#ecd8a6]/30">
              * Bu akış test edilmeyen (Untested) geliştirmelerin doğrulanması amacıyla anlık olarak dinlenmektedir.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
