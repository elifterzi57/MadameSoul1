import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { ArrowUpDown, RefreshCw, FileText } from 'lucide-react';

interface CollectionsTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({ userRole: _userRole }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('users');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters & Sorting state
  const [dateFilter, setDateFilter] = useState<'all' | 'daily' | 'monthly' | 'yearly'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const collectionsList = [
    { id: 'users', label: 'Kullanıcılar (users)' },
    { id: 'moon_transactions', label: 'Moon Harcama Geçmişi (moon_transactions)' },
    { id: 'admin_audit_logs', label: 'Yönetim Denetim Kayıtları (admin_audit_logs)' },
    { id: 'error_logs', label: 'Sistem Hata Günlükleri (error_logs)' }
  ];

  const fetchCollectionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const colRef = collection(db, selectedCollection);
      // Fetch up to 100 documents for visualization
      const q = query(colRef, limit(100));
      const querySnapshot = await getDocs(q);
      const docsData: any[] = [];
      querySnapshot.forEach((docSnap) => {
        docsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDocuments(docsData);
    } catch (err: any) {
      console.error(err);
      setError(`Veriler çekilirken hata oluştu: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionData();
  }, [selectedCollection]);

  // Helper to extract timestamp for filtering
  const getDocDate = (doc: any): Date | null => {
    const val = doc.createdAt || doc.timestamp || doc.updatedAt;
    if (!val) return null;
    if (val.seconds) return new Date(val.seconds * 1000); // Firebase Timestamp
    return new Date(val);
  };

  // Filter logic
  const getFilteredDocs = () => {
    const now = new Date();
    return documents.filter((doc) => {
      if (dateFilter === 'all') return true;
      const docDate = getDocDate(doc);
      if (!docDate) return false;

      const diffTime = Math.abs(now.getTime() - docDate.getTime());
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

  // Sort logic (sorting by ID, or email, or main text field A-Z)
  const getSortedDocs = (docs: any[]) => {
    return [...docs].sort((a, b) => {
      // Find a suitable field to sort (email, name, or id as fallback)
      const aVal = (a.email || a.name || a.id || '').toString().toLowerCase();
      const bVal = (b.email || b.name || b.id || '').toString().toLowerCase();

      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  };

  const filteredDocs = getFilteredDocs();
  const sortedAndFilteredDocs = getSortedDocs(filteredDocs);

  // Helper to render value beautifully
  const renderValue = (val: any): string => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') {
      if (val.seconds) {
        return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      }
      return JSON.stringify(val);
    }
    return val.toString();
  };

  // Dynamically extract columns from documents
  const getColumns = () => {
    const cols = new Set<string>();
    cols.add('id'); // always show id first
    sortedAndFilteredDocs.forEach(doc => {
      Object.keys(doc).forEach(key => {
        if (key !== 'id') cols.add(key);
      });
    });
    return Array.from(cols).slice(0, 7); // Show max 7 columns for UI space
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#ecd8a6]">Veritabanı Görselleştirme</h2>
          <p className="text-sm text-[#ecd8a6]/60">Koleksiyonlar içerisindeki belgeleri izleyin ve filtreleyin.</p>
        </div>
        <button
          onClick={fetchCollectionData}
          className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-4">
        {/* Collection Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Koleksiyon Seçin</label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none"
          >
            {collectionsList.map((col) => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Zaman Filtresi</label>
          <div className="flex rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] p-0.5">
            {(['all', 'daily', 'monthly', 'yearly'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize transition ${
                  dateFilter === filter
                    ? 'bg-purple-900/40 text-[#ecd8a6]'
                    : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'
                }`}
              >
                {filter === 'all' ? 'Tümü' : filter === 'daily' ? 'Günlük' : filter === 'monthly' ? 'Aylık' : 'Yıllık'}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">A-Z Sıralama</label>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex w-full items-center justify-between rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-4 py-2 text-sm text-[#ecd8a6]"
          >
            <span>{sortOrder === 'asc' ? 'A\'dan Z\'ye' : 'Z\'den A\'ya'}</span>
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-[#ecd8a6] mx-auto"></div>
            <p className="mt-3 text-sm text-[#ecd8a6]/60">Veriler Yükleniyor...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6 text-center text-red-400">
          {error}
        </div>
      ) : sortedAndFilteredDocs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 text-[#ecd8a6]/40">
          <FileText className="h-12 w-12 stroke-[1]" />
          <p className="mt-3 text-sm">Filtrelere uygun veri bulunamadı.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-[#ecd8a6]/80">
              <thead className="bg-[#0e0a1b] text-xs uppercase tracking-wider text-[#ecd8a6]/60">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-6 py-4 font-semibold border-b border-[#ecd8a6]/10">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8a6]/10">
                {sortedAndFilteredDocs.map((doc, idx) => (
                  <tr key={doc.id || idx} className="hover:bg-purple-950/10 transition">
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4 font-mono text-xs max-w-[250px] truncate">
                        {renderValue(doc[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[#0e0a1b]/80 px-6 py-3 border-t border-[#ecd8a6]/10 text-xs text-[#ecd8a6]/60 flex justify-between">
            <span>Toplam {sortedAndFilteredDocs.length} kayıt listeleniyor</span>
            <span>En fazla 100 kayıt gösterilir</span>
          </div>
        </div>
      )}
    </div>
  );
};
