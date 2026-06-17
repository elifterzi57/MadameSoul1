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
  const [sortByField, setSortByField] = useState<string>('id');

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
    if (selectedCollection === 'moon_transactions') {
      setSortByField('createdat');
      setSortOrder('desc');
    } else {
      setSortByField('id');
      setSortOrder('asc');
    }
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

  // Helper to get value of moon transaction fields mapped
  const getMoonTxValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'ID': 'id',
      'Username': 'userName',
      'createdat': 'createdAt',
      'Description': 'description',
      'Cards': 'cards',
      'status': 'status',
      'type': 'type',
      'userbrithplace': 'userBirthplace',
      'userbirhthdate': 'userDob',
      'userlanguage': 'userLanguage',
      'userrelationship': 'userRelationship',
      'pdfdowlanded': 'pdfDownloaded'
    };
    const dbKey = fieldMapping[col] || col;
    const val = doc[dbKey];

    // Format cards array nicely
    if (col === 'Cards') {
      if (Array.isArray(val)) {
        return val.map((c: any) => c.name || c.id || '').join(', ');
      }
      return val || '-';
    }

    return val;
  };

  // Sort logic (sorting dynamically by selected sortByField)
  const getSortedDocs = (docs: any[]) => {
    if (!sortByField) return docs;
    return [...docs].sort((a, b) => {
      let aVal = a[sortByField];
      let bVal = b[sortByField];

      if (selectedCollection === 'moon_transactions') {
        aVal = getMoonTxValue(a, sortByField);
        bVal = getMoonTxValue(b, sortByField);
      }

      let aCompare = aVal;
      let bCompare = bVal;

      if (aCompare && aCompare.seconds) aCompare = aCompare.seconds;
      if (bCompare && bCompare.seconds) bCompare = bCompare.seconds;

      if (aCompare instanceof Date) aCompare = aCompare.getTime();
      if (bCompare instanceof Date) bCompare = bCompare.getTime();

      const aNum = Number(aCompare);
      const bNum = Number(bCompare);

      if (!isNaN(aNum) && !isNaN(bNum) && aCompare !== null && aCompare !== undefined && bCompare !== null && bCompare !== undefined && typeof aCompare !== 'string' && typeof bCompare !== 'string') {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aStr = (aCompare === null || aCompare === undefined ? '' : aCompare).toString().toLowerCase();
      const bStr = (bCompare === null || bCompare === undefined ? '' : bCompare).toString().toLowerCase();

      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
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

  // Dynamically extract columns from documents, except for moon_transactions
  const getColumns = () => {
    if (selectedCollection === 'moon_transactions') {
      return [
        'ID',
        'Username',
        'createdat',
        'Description',
        'Cards',
        'status',
        'type',
        'userbrithplace',
        'userbirhthdate',
        'userlanguage',
        'userrelationship',
        'pdfdowlanded'
      ];
    }
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
                  {columns.map((col) => {
                    const isSorted = sortByField === col;
                    return (
                      <th key={col} className="px-6 py-4 font-semibold border-b border-[#ecd8a6]/10">
                        <button
                          onClick={() => {
                            if (sortByField === col) {
                              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortByField(col);
                              setSortOrder('asc');
                            }
                          }}
                          className="flex items-center gap-1 hover:text-[#ecd8a6] transition-colors focus:outline-none"
                        >
                          <span>{col}</span>
                          <ArrowUpDown className={`h-3.5 w-3.5 ${isSorted ? 'text-[#ecd8a6]' : 'opacity-30'}`} />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecd8a6]/10">
                {sortedAndFilteredDocs.map((doc, idx) => (
                  <tr key={doc.id || idx} className="hover:bg-purple-950/10 transition">
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4 font-mono text-xs max-w-[250px] truncate">
                        {selectedCollection === 'moon_transactions'
                          ? renderValue(getMoonTxValue(doc, col))
                          : renderValue(doc[col])}
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
