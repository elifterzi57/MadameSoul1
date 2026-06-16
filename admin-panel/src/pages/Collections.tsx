import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Calendar, ArrowUpDown, RefreshCw, Search } from 'lucide-react';
import { startOfDay, startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';

const COLLECTIONS = [
  { id: 'users', name: 'Kullanıcılar (users)', dateField: 'lastLogin' },
  { id: 'user_moons', name: 'Kullanıcı Moon Bakiyeleri (user_moons)', dateField: 'lastDailyClaimedAt' },
  { id: 'moon_transactions', name: 'Moon İşlemleri (moon_transactions)', dateField: 'createdAt' },
  { id: 'ai_feedback', name: 'AI Geri Bildirimleri (ai_feedback)', dateField: 'createdAt' },
  { id: 'messages_tr', name: 'Destek Mesajları TR (messages_tr)', dateField: 'createdAt' },
  { id: 'messages_en', name: 'Destek Mesajları EN (messages_en)', dateField: 'createdAt' },
  { id: 'error_logs', name: 'Hata Logları (error_logs)', dateField: 'timestamp' },
  { id: 'admin_users', name: 'Yöneticiler & Çalışanlar (admin_users)', dateField: 'createdAt' },
];

export default function Collections() {
  const [selectedCol, setSelectedCol] = useState(COLLECTIONS[0]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'monthly' | 'yearly'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, selectedCol.id);
      // Fetch up to 200 documents for visualization
      const q = query(colRef, limit(200));
      const querySnapshot = await getDocs(q);
      const fetchedDocs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocs(fetchedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedCol]);

  // Helper to parse firestore timestamp or ISO string or generic date
  const getDocDate = (doc: any) => {
    const val = doc[selectedCol.dateField];
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000); // Firestore Timestamp
    if (typeof val === 'string') return parseISO(val);
    if (val instanceof Date) return val;
    return null;
  };

  // Filter and Sort Logic
  const processedDocs = docs
    .filter(doc => {
      // Time filtering
      if (timeFilter !== 'all') {
        const date = getDocDate(doc);
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
    .filter(doc => {
      // Search term filtering
      if (!searchTerm) return true;
      const searchStr = JSON.stringify(doc).toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      // A-Z sorting based on document ID or primary field if available
      const valA = (a.email || a.id || '').toString().toLowerCase();
      const valB = (b.email || b.id || '').toString().toLowerCase();
      
      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        {/* Collection Selector */}
        <div className="w-full xl:w-80">
          <label className="block text-xs font-serif font-semibold text-[#ecd8a6]/50 uppercase tracking-widest mb-2">Koleksiyon Seçin</label>
          <select
            value={selectedCol.id}
            onChange={(e) => {
              const found = COLLECTIONS.find(c => c.id === e.target.value);
              if (found) setSelectedCol(found);
            }}
            className="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-3 py-2 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/60 transition-all outline-none cursor-pointer"
          >
            {COLLECTIONS.map(col => (
              <option key={col.id} value={col.id} className="bg-[#0a0512] text-[#ecd8a6]">{col.name}</option>
            ))}
          </select>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
          {/* Time Filter */}
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

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg px-3 py-2 text-xs font-serif text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#ecd8a6]" />
            SIRALA: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchDocs}
            disabled={loading}
            className="p-2 bg-[#0a0512] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/40 rounded-lg text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg flex items-center px-3 focus-within:border-[#ecd8a6]/55 transition-all">
        <Search className="w-4 h-4 text-[#ecd8a6]/40" />
        <input
          type="text"
          placeholder="Sonuçlarda ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 px-3 bg-transparent text-sm text-[#ecd8a6] outline-none placeholder:text-[#ecd8a6]/30 font-sans"
        />
      </div>

      {/* Database Document List Table */}
      <div className="bg-[#0a0512]/80 backdrop-blur-md border border-[#ecd8a6]/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,216,166,0.02)]">
        {loading ? (
          <div className="p-12 text-center text-[#ecd8a6]/60 font-sans font-light">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#ecd8a6]/70" />
            Veriler yükleniyor...
          </div>
        ) : processedDocs.length === 0 ? (
          <div className="p-12 text-center text-[#ecd8a6]/50 font-sans">Seçilen kriterlerde hiç belge bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ecd8a6]/10 text-left text-sm">
              <thead className="bg-[#120a1c] font-serif font-bold text-[#ecd8a6] tracking-wider text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Belge ID (Document ID)</th>
                  <th className="px-6 py-4">Veri (Data)</th>
                  <th className="px-6 py-4">Tarih ({selectedCol.dateField})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8a6]/10 text-[#ecd8a6]/80 font-sans">
                {processedDocs.map(doc => {
                  const date = getDocDate(doc);
                  const displayDate = date ? date.toLocaleString('tr-TR') : '-';
                  const { id, ...data } = doc;
                  return (
                    <tr key={doc.id} className="hover:bg-[#1e1332]/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-[#ecd8a6] font-semibold">
                        <span className="bg-[#120a1c]/60 border border-[#ecd8a6]/10 px-2 py-1 rounded">
                          {doc.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-lg">
                        <pre className="text-xs bg-[#05000a]/80 p-3 rounded-lg border border-[#ecd8a6]/10 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono text-[#ecd8a6]/90 scrollbar-thin">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </td>
                      <td className="px-6 py-4 text-xs font-light text-[#ecd8a6]/70">{displayDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
