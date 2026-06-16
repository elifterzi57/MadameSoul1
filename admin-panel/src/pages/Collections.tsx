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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Collection Selector */}
        <div className="w-full md:w-80">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Koleksiyon Seçin</label>
          <select
            value={selectedCol.id}
            onChange={(e) => {
              const found = COLLECTIONS.find(c => c.id === e.target.value);
              if (found) setSelectedCol(found);
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COLLECTIONS.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Time Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-sm">
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

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sırala: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchDocs}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative bg-white border border-slate-200 rounded-lg flex items-center px-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Sonuçlarda ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 px-3 text-sm focus:outline-none"
        />
      </div>

      {/* Database Document List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Yükleniyor...</div>
        ) : processedDocs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Hiç belge bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-6 py-3">Belge ID (Document ID)</th>
                  <th className="px-6 py-3">Veri (Data)</th>
                  <th className="px-6 py-3">Tarih ({selectedCol.dateField})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {processedDocs.map(doc => {
                  const date = getDocDate(doc);
                  const displayDate = date ? date.toLocaleString('tr-TR') : '-';
                  const { id, ...data } = doc;
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 font-semibold">{doc.id}</td>
                      <td className="px-6 py-4 max-w-lg truncate">
                        <pre className="text-xs bg-slate-50 p-2 rounded border border-slate-100 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </td>
                      <td className="px-6 py-4 text-xs">{displayDate}</td>
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
