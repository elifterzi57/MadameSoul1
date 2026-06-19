import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { ArrowUpDown, RefreshCw, FileText, Download } from 'lucide-react';

interface CollectionsTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
  selectedCollection: string;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({ userRole: _userRole, selectedCollection }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, { email: string; displayName?: string }>>({});
  const [moonsMap, setMoonsMap] = useState<Record<string, any>>({});
  
  // Filters & Sorting state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortByField, setSortByField] = useState<string>('id');

  useEffect(() => {
    const fetchUsersMap = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const mapping: Record<string, { email: string; displayName?: string }> = {};
        usersSnap.forEach((docSnap) => {
          const data = docSnap.data();
          mapping[docSnap.id] = {
            email: data.email || '',
            displayName: data.displayName || data.name || ''
          };
        });
        setUsersMap(mapping);
      } catch (err) {
        console.error("Kullanıcı haritası yüklenirken hata oluştu:", err);
      }
    };
    fetchUsersMap();
  }, []);

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
      if (selectedCollection === 'users') {
        try {
          const moonsSnap = await getDocs(collection(db, 'user_moons'));
          const mMapping: Record<string, any> = {};
          moonsSnap.forEach((docSnap) => {
            mMapping[docSnap.id] = docSnap.data();
          });
          setMoonsMap(mMapping);
        } catch (mErr) {
          console.error("user_moons fetch failed:", mErr);
        }
      }
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
    try {
      const val = doc.createdAt || doc.timestamp || doc.updatedAt;
      if (!val) return null;
      let date: Date;
      if (typeof val.toDate === 'function') {
        date = val.toDate();
      } else if (val.seconds !== undefined) {
        date = new Date(val.seconds * 1000);
      } else {
        date = new Date(val);
      }
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error("Tarih ayrıştırılırken hata oluştu:", e);
      return null;
    }
  };

  // Filter logic
  const getFilteredDocs = () => {
    return documents.filter((doc) => {
      // Date filter checks
      const docDate = getDocDate(doc);
      if (docDate) {
        let docDateStr = '';
        try {
          const year = docDate.getFullYear();
          const month = String(docDate.getMonth() + 1).padStart(2, '0');
          const day = String(docDate.getDate()).padStart(2, '0');
          docDateStr = `${year}-${month}-${day}`;
        } catch (e) {
          console.error("Tarih formatlanırken hata oluştu:", e);
          return false;
        }

        if (startDate && docDateStr < startDate) return false;
        if (endDate && docDateStr > endDate) return false;
      } else if (startDate || endDate) {
        return false;
      }

      // Search Query filter checks (IDs, username, email, modelName, description etc.)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesUserId = doc.userId?.toLowerCase().includes(query);
        const matchesDocId = doc.id?.toLowerCase().includes(query);
        
        // Resolve username & email mappings
        const username = (usersMap[doc.userId]?.displayName || doc.userName || doc.displayName || doc.name || '').toLowerCase();
        const email = (usersMap[doc.userId]?.email || doc.userEmail || doc.email || '').toLowerCase();
        
        const matchesUser = username.includes(query);
        const matchesEmail = email.includes(query);
        const matchesModel = doc.modelName?.toLowerCase().includes(query);
        const matchesDesc = doc.description?.toLowerCase().includes(query);

        if (!matchesUserId && !matchesDocId && !matchesUser && !matchesEmail && !matchesModel && !matchesDesc) {
          return false;
        }
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
      'amount': 'amount',
      'paymentprovider': 'paymentProvider',
      'userbrithplace': 'userBirthplace',
      'userbirhthdate': 'userDob',
      'userlanguage': 'userLanguage',
      'userrelationship': 'userRelationship',
      'pdfdowlanded': 'pdfDownloaded',
      'clientmetadata': 'clientMetadata'
    };
    const dbKey = fieldMapping[col] || col;
    const val = doc[dbKey];

    if (col === 'Username') {
      return val || usersMap[doc.userId]?.displayName || '-';
    }

    if (col === 'Mail') {
      return usersMap[doc.userId]?.email || doc.userEmail || '-';
    }

    // Format cards array nicely
    if (col === 'Cards') {
      if (Array.isArray(val)) {
        return val.map((c: any) => c.name || c.id || '').join(', ');
      }
      return val || '-';
    }

    if (col === 'clientmetadata') {
      const meta = val;
      if (meta && typeof meta === 'object') {
        const parts = [];
        if (meta.os) parts.push(meta.os);
        if (meta.appVersion) parts.push(`v${meta.appVersion}`);
        return parts.length > 0 ? parts.join(' - ') : '-';
      }
      return meta || '-';
    }

    return val;
  };

  // Helper to get value of user fields mapped
  const getUserValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'ID': 'id',
      'NAME': 'displayName',
      'EMAIL': 'email',
      'PHONENUMBER': 'phoneNumber',
      'BIRTHDAY': 'dob',
      'BIRTHPLACE': 'birthplace',
      'RELATIONSHIP': 'relationship',
      'FoCUS': 'focus',
      'CREATEDAT': 'createdAt',
      'UPDATEDAT': 'updatedAt',
      'CONSENTACCEPTEDAT': 'consentsAcceptedAt',
      'TERMSACCEPTEDAT': 'termsAcceptedAt',
      'ONBOARDINGCOMPLETED': 'onboardingCompleted',
      'TIMEZONE': 'timezone',
      'LASTLOGIN': 'lastLogin',
      'DEVICEINFo': 'deviceInfo',
      'PROVIDERID': 'providerId'
    };

    if (col === 'NAME') {
      return doc.displayName || doc.name || '-';
    }
    if (col === 'TERMSACCEPTEDAT') {
      return doc.termsAcceptedAt || doc.legalAcceptedAt || '-';
    }
    if (col === 'ONBOARDINGCOMPLETED') {
      return doc.onboardingCompleted !== undefined ? (doc.onboardingCompleted ? 'Evet' : 'Hayır') : '-';
    }
    if (col === 'METADATA BROWSER') {
      return doc.metadata?.browser || '-';
    }
    if (col === 'METADATA LOCATION') {
      return doc.metadata?.location || '-';
    }

    if (col === 'BALANCE') {
      return moonsMap[doc.id]?.balance !== undefined ? moonsMap[doc.id].balance : '-';
    }
    if (col === 'PURCHASEDBALANCE') {
      return moonsMap[doc.id]?.purchasedBalance !== undefined ? moonsMap[doc.id].purchasedBalance : '-';
    }
    if (col === 'DAILYFREEBALANCE') {
      return moonsMap[doc.id]?.dailyFreeBalance !== undefined ? moonsMap[doc.id].dailyFreeBalance : '-';
    }
    if (col === 'LASTDAILYCLAIMEDAT') {
      const val = moonsMap[doc.id]?.lastDailyClaimedAt;
      if (!val) return '-';
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      return new Date(val).toLocaleString('tr-TR');
    }

    const dbKey = fieldMapping[col] || col;
    return doc[dbKey];
  };

  // Helper to get value of ai_feedback fields mapped
  const getFeedbackValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'USERID': 'userId',
      'RATING': 'rating',
      'TRANSACTIONID': 'id',
      'CREATEDAT': 'createdAt',
      'COMMENT': 'comment'
    };

    if (col === 'USERNAME') {
      return usersMap[doc.userId]?.displayName || '-';
    }

    const dbKey = fieldMapping[col] || col;
    return doc[dbKey];
  };

  // Helper to get value of ai_usage_logs fields mapped
  const getUsageLogValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'ID': 'id',
      'USERID': 'userId',
      'MODELNAME': 'modelName',
      'CREATEDAT': 'createdAt'
    };

    if (col === 'USERNAME') {
      return usersMap[doc.userId]?.displayName || '-';
    }

    if (col === 'PROMPT_TOKENS') {
      return doc.usage?.prompt_tokens !== undefined ? doc.usage.prompt_tokens : (doc.promptTokens !== undefined ? doc.promptTokens : '-');
    }
    if (col === 'COMPLETION_TOKENS') {
      return doc.usage?.completion_tokens !== undefined ? doc.usage.completion_tokens : (doc.completionTokens !== undefined ? doc.completionTokens : '-');
    }
    if (col === 'TOTAL_TOKENS') {
      return doc.usage?.total_tokens !== undefined ? doc.usage.total_tokens : (doc.totalTokens !== undefined ? doc.totalTokens : '-');
    }
    if (col === 'REASONING_TOKENS') {
      return doc.usage?.completion_tokens_details?.reasoning_tokens !== undefined 
        ? doc.usage.completion_tokens_details.reasoning_tokens 
        : (doc.reasoningTokens !== undefined ? doc.reasoningTokens : '-');
    }

    const dbKey = fieldMapping[col] || col;
    return doc[dbKey];
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
      } else if (selectedCollection === 'users') {
        aVal = getUserValue(a, sortByField);
        bVal = getUserValue(b, sortByField);
      } else if (selectedCollection === 'ai_feedback') {
        aVal = getFeedbackValue(a, sortByField);
        bVal = getFeedbackValue(b, sortByField);
      } else if (selectedCollection === 'ai_usage_logs') {
        aVal = getUsageLogValue(a, sortByField);
        bVal = getUsageLogValue(b, sortByField);
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
      if (typeof val.toDate === 'function') {
        return val.toDate().toLocaleString('tr-TR');
      }
      if (val.seconds !== undefined) {
        return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      }
      return JSON.stringify(val);
    }
    return val.toString();
  };

  const exportToExcel = () => {
    if (sortedAndFilteredDocs.length === 0) {
      alert(selectedCollection === 'users' ? 'İndirilecek kullanıcı verisi bulunamadı.' : 'İndirilecek veri bulunamadı.');
      return;
    }

    // Prepare headers
    const csvHeaders = columns.map(col => col.toUpperCase()).join(';');

    // Prepare rows
    const csvRows = sortedAndFilteredDocs.map(doc => {
      return columns.map(col => {
        let val = '';
        if (selectedCollection === 'moon_transactions') {
          val = renderValue(getMoonTxValue(doc, col));
        } else if (selectedCollection === 'users') {
          val = renderValue(getUserValue(doc, col));
        } else if (selectedCollection === 'ai_feedback') {
          val = renderValue(getFeedbackValue(doc, col));
        } else if (selectedCollection === 'ai_usage_logs') {
          val = renderValue(getUsageLogValue(doc, col));
        } else {
          val = renderValue(doc[col]);
        }
        
        // Clean value for CSV (replace double quotes, semicolons, and newlines)
        const cleaned = val.replace(/"/g, '""').replace(/;/g, ',').replace(/\n/g, ' ');
        return `"${cleaned}"`;
      }).join(';');
    });

    const csvContent = '\uFEFF' + [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `${selectedCollection}_export_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamically extract columns from documents, except for moon_transactions
  const getColumns = () => {
    if (selectedCollection === 'moon_transactions') {
      return [
        'ID',
        'Username',
        'Mail',
        'createdat',
        'Description',
        'Cards',
        'status',
        'type',
        'amount',
        'paymentprovider',
        'userbrithplace',
        'userbirhthdate',
        'userlanguage',
        'userrelationship',
        'pdfdowlanded',
        'clientmetadata'
      ];
    }
    if (selectedCollection === 'users') {
      return [
        'ID',
        'NAME',
        'EMAIL',
        'PHONENUMBER',
        'BIRTHDAY',
        'BIRTHPLACE',
        'RELATIONSHIP',
        'FoCUS',
        'CREATEDAT',
        'UPDATEDAT',
        'CONSENTACCEPTEDAT',
        'TERMSACCEPTEDAT',
        'ONBOARDINGCOMPLETED',
        'TIMEZONE',
        'LASTLOGIN',
        'DEVICEINFo',
        'METADATA BROWSER',
        'METADATA LOCATION',
        'PROVIDERID',
        'BALANCE',
        'PURCHASEDBALANCE',
        'DAILYFREEBALANCE',
        'LASTDAILYCLAIMEDAT'
      ];
    }
    if (selectedCollection === 'ai_feedback') {
      return [
        'USERID',
        'USERNAME',
        'RATING',
        'TRANSACTIONID',
        'CREATEDAT',
        'COMMENT'
      ];
    }
    if (selectedCollection === 'ai_usage_logs') {
      return [
        'ID',
        'USERID',
        'USERNAME',
        'MODELNAME',
        'PROMPT_TOKENS',
        'COMPLETION_TOKENS',
        'TOTAL_TOKENS',
        'REASONING_TOKENS',
        'CREATEDAT'
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
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 rounded-lg bg-[#ecd8a6]/10 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-[#ecd8a6]/20 transition text-sm text-[#ecd8a6]"
          >
            <Download className="h-4 w-4" />
            Excel İndir
          </button>
          <button
            onClick={fetchCollectionData}
            className="flex items-center gap-2 rounded-lg bg-purple-900/20 border border-[#ecd8a6]/20 px-4 py-2 hover:bg-purple-900/30 transition text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Yenile
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-4">
        {/* Date & Query Filter Range */}
        <div className="flex-1 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Ara (UID, E-posta, Ad, Model)</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ID, e-posta, isim veya model ile ara..."
              className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 transition placeholder-[#ecd8a6]/30 font-medium"
            />
          </div>
          <div className="w-full sm:w-[150px]">
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 transition"
            />
          </div>
          <div className="w-full sm:w-[150px]">
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 transition"
            />
          </div>
          {(startDate || endDate || searchQuery) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
              }}
              className="mt-6 sm:mt-auto rounded-lg bg-red-950/20 border border-red-900/30 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 transition h-[38px] flex items-center justify-center whitespace-nowrap"
            >
              Filtreleri Temizle
            </button>
          )}
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
                          <span>{col.toUpperCase()}</span>
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
                          : selectedCollection === 'users'
                          ? renderValue(getUserValue(doc, col))
                          : selectedCollection === 'ai_feedback'
                          ? renderValue(getFeedbackValue(doc, col))
                          : selectedCollection === 'ai_usage_logs'
                          ? renderValue(getUsageLogValue(doc, col))
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
