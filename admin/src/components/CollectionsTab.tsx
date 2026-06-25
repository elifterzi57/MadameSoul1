import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
import { ArrowUpDown, RefreshCw, FileText, Download } from 'lucide-react';

interface CollectionsTabProps {
  userRole: 'admin' | 'employee' | 'viewer' | null;
  selectedCollection: string;
}

interface UserContactInfo {
  email: string;
  displayName?: string;
  phoneNumber?: string;
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({ userRole: _userRole, selectedCollection }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, UserContactInfo>>({});
  const [lastPurchaseMap, setLastPurchaseMap] = useState<Record<string, { date: Date, raw: any }>>({});
  
  // Filters & Sorting state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortByField, setSortByField] = useState<string>('id');

  useEffect(() => {
    const fetchUsersMap = async () => {
      try {
        let usersSnap: any = null;
        let phonesSnap: any = null;

        try {
          usersSnap = await getDocs(collection(db, 'users'));
        } catch (e) {
          console.error("Failed to fetch users for mapping:", e);
        }

        try {
          phonesSnap = await getDocs(collection(db, 'phones'));
        } catch (e) {
          console.warn("Failed to fetch phones for mapping, proceeding without phones:", e);
        }

        const phoneByUserId: Record<string, string> = {};
        if (phonesSnap) {
          phonesSnap.forEach((docSnap: any) => {
            const data = docSnap.data();
            if (data.userId && data.phoneNumber) {
              phoneByUserId[data.userId] = data.phoneNumber;
            }
          });
        }

        const mapping: Record<string, UserContactInfo> = {};
        if (usersSnap) {
          usersSnap.forEach((docSnap: any) => {
            const data = docSnap.data();
            mapping[docSnap.id] = {
              email: data.email || '',
              displayName: data.displayName || data.name || '',
              phoneNumber: data.phoneNumber || data.phone || phoneByUserId[docSnap.id] || ''
            };
          });
        }
        setUsersMap(mapping);
      } catch (err) {
        console.error("Kullanıcı haritası yüklenirken hata oluştu:", err);
      }
    };
    fetchUsersMap();
  }, []);

  const getUserContact = (userId?: string, fallbackEmail?: string): string => {
    if (userId) {
      const userInfo = usersMap[userId];
      if (userInfo?.email) return userInfo.email;
      if (userInfo?.phoneNumber) return userInfo.phoneNumber;
    }

    return fallbackEmail || '-';
  };

  const getContactEmailOrPhone = (email?: string): string => {
    if (!email) return '-';

    const normalizedEmail = email.toLowerCase();
    const userInfo = Object.values(usersMap).find(u => u.email?.toLowerCase() === normalizedEmail);
    if (userInfo?.email) return userInfo.email;
    if (userInfo?.phoneNumber) return userInfo.phoneNumber;

    return email;
  };

  const fetchCollectionData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedCollection === 'contact_us') {
        const langs = ['en', 'tr', 'es', 'fr', 'zh', 'ko'];
        const promises = langs.map(lang => getDocs(query(collection(db, `messages_${lang}`), limit(50))));
        const snapshots = await Promise.all(promises);
        const docsData: any[] = [];
        snapshots.forEach((snap, idx) => {
          const lang = langs[idx];
          snap.forEach((docSnap) => {
            docsData.push({ id: docSnap.id, lang, ...docSnap.data() });
          });
        });
        docsData.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
          const tB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
          return tB - tA;
        });
        setDocuments(docsData.slice(0, 100));
      } else {
        const colRef = collection(db, selectedCollection);
        // Fetch up to 100 documents for visualization
        const q = query(colRef, limit(100));
        const querySnapshot = await getDocs(q);
        const docsData: any[] = [];
        querySnapshot.forEach((docSnap) => {
          docsData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDocuments(docsData);

        if (selectedCollection === 'user_moons') {
          try {
            const buyTxQuery = query(collection(db, 'moon_transactions'), where('type', '==', 'buy'));
            const buyTxSnap = await getDocs(buyTxQuery);
            const purchaseMap: Record<string, any> = {};
            buyTxSnap.forEach(docSnap => {
              const data = docSnap.data();
              const userId = data.userId;
              const createdAt = data.createdAt;
              if (userId && createdAt) {
                const date = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
                const currentLatest = purchaseMap[userId];
                if (!currentLatest || date > currentLatest.date) {
                  purchaseMap[userId] = {
                    date,
                    raw: createdAt
                  };
                }
              }
            });
            setLastPurchaseMap(purchaseMap);
          } catch (err) {
            console.error("Last purchase date loading error:", err);
          }
        }
      }
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
    return documents.filter((doc) => {
      const docDate = getDocDate(doc);
      if (!docDate) {
        if (startDate || endDate) return false;
        return true;
      }

      const docDateStr = docDate.toISOString().split('T')[0];

      if (startDate && docDateStr < startDate) return false;
      if (endDate && docDateStr > endDate) return false;

      return true;
    });
  };

  // Helper to get value of moon transaction fields mapped
  const getMoonTxValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'USERID': 'id',
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
      return getUserContact(doc.userId, doc.userEmail);
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
      'USERID': 'id',
      'NAME': 'displayName',
      'EMAIL': 'email',
      'PHONE NUMBER': 'phoneNumber',
      'BIRTHDAY': 'dob',
      'BIRTH PLACE': 'birthplace',
      'CRETEDAT': 'createdAt',
      'UPDATEAT': 'updatedAt',
      'CONSENTACCEPTEDAT': 'consentsAcceptedAt',
      'TIMEZONE': 'timezone',
      'LASTLOGIN': 'lastLogin',
      'DEVICEINFO': 'deviceInfo'
    };

    if (col === 'NAME') {
      return doc.displayName || doc.name || '-';
    }
    if (col === 'EMAIL') {
      return getUserContact(doc.id, doc.email);
    }
    if (col === 'PHONE NUMBER') {
      return doc.phoneNumber || usersMap[doc.id]?.phoneNumber || '-';
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

    const dbKey = fieldMapping[col] || col;
    return doc[dbKey];
  };

  // Helper to get value of user_moons fields mapped
  const getUserMoonsValue = (doc: any, col: string): any => {
    if (col === 'USERID') {
      return doc.id || doc.userId || '-';
    }
    if (col === 'MAIL') {
      return getUserContact(doc.id);
    }
    if (col === 'NAME') {
      return usersMap[doc.id]?.displayName || '-';
    }
    if (col === 'BALANCE') {
      return doc.balance !== undefined ? doc.balance : '-';
    }
    if (col === 'purchasedBalance') {
      return doc.purchasedBalance !== undefined ? doc.purchasedBalance : '-';
    }
    if (col === 'DAILYFREEBALANCE') {
      return doc.dailyFreeBalance !== undefined ? doc.dailyFreeBalance : '-';
    }
    if (col === 'lastDailyClaimedAt') {
      const val = doc.lastDailyClaimedAt;
      if (!val) return '-';
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      return new Date(val).toLocaleString('tr-TR');
    }
    if (col === 'updatedAt') {
      const val = doc.updatedAt || doc.lastDailyClaimedAt;
      if (!val) return '-';
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      return new Date(val).toLocaleString('tr-TR');
    }
    if (col === 'LASTPURCHASEDAT') {
      const purchase = lastPurchaseMap[doc.id];
      if (!purchase) return '-';
      const val = purchase.raw;
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      return new Date(val).toLocaleString('tr-TR');
    }
    return doc[col];
  };

  // Helper to get value of contact_us fields mapped
  const getContactUsValue = (doc: any, col: string): any => {
    if (col === 'USERID') {
      const foundUserId = Object.keys(usersMap).find(uid => usersMap[uid].email?.toLowerCase() === doc.email?.toLowerCase());
      return foundUserId || '-';
    }
    if (col === 'MAIL') {
      return getContactEmailOrPhone(doc.email);
    }
    if (col === 'FULLNAME') {
      return doc.fullName || '-';
    }
    if (col === 'CREATEDAT') {
      return doc.createdAt;
    }
    if (col === 'SUBJECT') {
      return doc.subject || '-';
    }
    if (col === 'MESSAGE') {
      return doc.message || '-';
    }
    return doc[col];
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

  // Helper to get value of ai_telemetry fields mapped
  const getTelemetryValue = (doc: any, col: string): any => {
    const fieldMapping: Record<string, string> = {
      'ID': 'id',
      'USERID': 'userId',
      'MODELNAME': 'modelName',
      'PROMPTTOKENS': 'promptTokens',
      'COMPLETIONTOKENS': 'completionTokens',
      'LATENCYMS': 'latencyMs',
      'CREATEDAT': 'createdAt'
    };

    if (col === 'TOTALTOKENS') {
      const prompt = Number(doc.promptTokens || 0);
      const completion = Number(doc.completionTokens || 0);
      return prompt + completion;
    }

    if (col === 'MAIL') {
      return getUserContact(doc.userId, doc.userEmail);
    }

    const dbKey = fieldMapping[col] || col;
    return doc[dbKey];
  };

  // Helper to get value of user_reflections fields mapped
  const getUserReflectionsValue = (doc: any, col: string): any => {
    if (col === 'USERID') {
      return doc.userId || '-';
    }
    if (col === 'MAIL') {
      return getUserContact(doc.userId);
    }
    if (col === 'CUSTOMTITLE') {
      return doc.customTitle || '-';
    }
    if (col === 'REFLECTIONNOTES') {
      return doc.reflectionNotes || '-';
    }
    if (col === 'UPDATEDAT') {
      const val = doc.updatedAt;
      if (!val) return '-';
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleString('tr-TR');
      return new Date(val).toLocaleString('tr-TR');
    }
    return doc[col];
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
      } else if (selectedCollection === 'ai_telemetry') {
        aVal = getTelemetryValue(a, sortByField);
        bVal = getTelemetryValue(b, sortByField);
      } else if (selectedCollection === 'contact_us') {
        aVal = getContactUsValue(a, sortByField);
        bVal = getContactUsValue(b, sortByField);
      } else if (selectedCollection === 'user_moons') {
        aVal = getUserMoonsValue(a, sortByField);
        bVal = getUserMoonsValue(b, sortByField);
      } else if (selectedCollection === 'user_reflections') {
        aVal = getUserReflectionsValue(a, sortByField);
        bVal = getUserReflectionsValue(b, sortByField);
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
        } else if (selectedCollection === 'ai_telemetry') {
          val = renderValue(getTelemetryValue(doc, col));
        } else if (selectedCollection === 'contact_us') {
          val = renderValue(getContactUsValue(doc, col));
        } else if (selectedCollection === 'user_moons') {
          val = renderValue(getUserMoonsValue(doc, col));
        } else if (selectedCollection === 'user_reflections') {
          val = renderValue(getUserReflectionsValue(doc, col));
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
        'USERID',
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
        'USERID',
        'NAME',
        'EMAIL',
        'PHONE NUMBER',
        'BIRTHDAY',
        'BIRTH PLACE',
        'CRETEDAT',
        'UPDATEAT',
        'CONSENTACCEPTEDAT',
        'TERMSACCEPTEDAT',
        'ONBOARDINGCOMPLETED',
        'TIMEZONE',
        'LASTLOGIN',
        'DEVICEINFO',
        'METADATA BROWSER',
        'METADATA LOCATION'
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
    if (selectedCollection === 'ai_telemetry') {
      return [
        'MAIL',
        'CREATEDAT',
        'MODELNAME',
        'PROMPTTOKENS',
        'COMPLETIONTOKENS',
        'TOTALTOKENS',
        'LATENCYMS'
      ];
    }
    if (selectedCollection === 'contact_us') {
      return [
        'USERID',
        'MAIL',
        'FULLNAME',
        'CREATEDAT',
        'SUBJECT',
        'MESSAGE'
      ];
    }
    if (selectedCollection === 'user_moons') {
      return [
        'USERID',
        'MAIL',
        'NAME',
        'BALANCE',
        'purchasedBalance',
        'DAILYFREEBALANCE',
        'lastDailyClaimedAt',
        'LASTPURCHASEDAT',
        'updatedAt'
      ];
    }
    if (selectedCollection === 'user_reflections') {
      return [
        'USERID',
        'MAIL',
        'CUSTOMTITLE',
        'REFLECTIONNOTES',
        'UPDATEDAT'
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

  const getCollectionStats = () => {
    if (sortedAndFilteredDocs.length === 0) return null;

    if (selectedCollection === 'users') {
      const total = sortedAndFilteredDocs.length;
      const premiumCount = sortedAndFilteredDocs.filter(d => d.isPremium).length;
      const onboardingCompleted = sortedAndFilteredDocs.filter(d => d.onboardingCompleted).length;
      return {
        total,
        premiumCount,
        premiumRate: total > 0 ? Math.round((premiumCount / total) * 100) : 0,
        onboardingCompleted,
        onboardingRate: total > 0 ? Math.round((onboardingCompleted / total) * 100) : 0
      };
    }

    if (selectedCollection === 'user_moons') {
      const total = sortedAndFilteredDocs.length;
      let totalBalance = 0;
      let totalPurchased = 0;
      sortedAndFilteredDocs.forEach(d => {
        totalBalance += Number(d.balance || 0);
        totalPurchased += Number(d.purchasedBalance || 0);
      });
      return {
        total,
        totalBalance,
        totalPurchased,
        avgBalance: total > 0 ? Math.round((totalBalance / total) * 10) / 10 : 0
      };
    }

    if (selectedCollection === 'moon_transactions') {
      const total = sortedAndFilteredDocs.length;
      let buyCount = 0;
      let spendCount = 0;
      let refundCount = 0;
      let bonusCount = 0;
      
      sortedAndFilteredDocs.forEach(d => {
        if (d.type === 'buy') buyCount++;
        else if (d.type === 'spend') spendCount++;
        else if (d.type === 'refund') refundCount++;
        else if (d.type === 'bonus') bonusCount++;
      });
      return {
        total,
        buyCount,
        spendCount,
        refundCount,
        bonusCount
      };
    }

    if (selectedCollection === 'ai_feedback') {
      const total = sortedAndFilteredDocs.length;
      let totalRating = 0;
      let ratingCount = 0;
      sortedAndFilteredDocs.forEach(d => {
        const r = Number(d.rating);
        if (r && !isNaN(r)) {
          totalRating += r;
          ratingCount++;
        }
      });
      return {
        total,
        avgRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0',
        ratingCount
      };
    }

    if (selectedCollection === 'contact_us') {
      const total = sortedAndFilteredDocs.length;
      const trCount = sortedAndFilteredDocs.filter(d => d.lang === 'tr').length;
      const enCount = sortedAndFilteredDocs.filter(d => d.lang === 'en').length;
      const otherCount = total - trCount - enCount;
      return {
        total,
        trCount,
        enCount,
        otherCount
      };
    }

    if (selectedCollection === 'user_reflections') {
      return {
        total: sortedAndFilteredDocs.length,
        uniqueUsers: new Set(sortedAndFilteredDocs.map(d => d.userId).filter(Boolean)).size
      };
    }

    return null;
  };

  const getTelemetryStats = () => {
    if (selectedCollection !== 'ai_telemetry' || sortedAndFilteredDocs.length === 0) {
      return null;
    }
    let totalPrompt = 0;
    let totalCompletion = 0;
    let totalCombined = 0;
    sortedAndFilteredDocs.forEach(doc => {
      const prompt = Number(doc.promptTokens || 0);
      const completion = Number(doc.completionTokens || 0);
      totalPrompt += prompt;
      totalCompletion += completion;
      totalCombined += (prompt + completion);
    });
    const count = sortedAndFilteredDocs.length;
    return {
      avgPrompt: Math.round(totalPrompt / count),
      avgCompletion: Math.round(totalCompletion / count),
      avgTotal: Math.round(totalCombined / count)
    };
  };

  const stats = getTelemetryStats();
  const collectionStats = getCollectionStats() as any;

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

      {/* Dynamic Collection Stats Widgets */}
      {collectionStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedCollection === 'users' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Kullanıcı</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Premium Kullanıcı</p>
                <p className="mt-2 text-2xl font-semibold text-amber-400">{collectionStats.premiumCount}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Premium Oranı</p>
                <p className="mt-2 text-2xl font-semibold text-amber-400">%{collectionStats.premiumRate}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Onboarding Tamamlanma</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-400">%{collectionStats.onboardingRate}</p>
              </div>
            </>
          )}

          {selectedCollection === 'user_moons' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Kullanıcı</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Bakiye (Moon)</p>
                <p className="mt-2 text-2xl font-semibold text-purple-400">{collectionStats.totalBalance}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Satın Alınan Moon</p>
                <p className="mt-2 text-2xl font-semibold text-amber-400">{collectionStats.totalPurchased}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Ortalama Bakiye</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-400">{collectionStats.avgBalance}</p>
              </div>
            </>
          )}

          {selectedCollection === 'moon_transactions' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam İşlem</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Harcama (Spend)</p>
                <p className="mt-2 text-2xl font-semibold text-red-400">{collectionStats.spendCount}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Satın Alım (Buy)</p>
                <p className="mt-2 text-2xl font-semibold text-green-400">{collectionStats.buyCount}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Diğer (Bonus/İade)</p>
                <p className="mt-2 text-2xl font-semibold text-amber-400">{collectionStats.bonusCount + collectionStats.refundCount}</p>
              </div>
            </>
          )}

          {selectedCollection === 'ai_feedback' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Geri Bildirim</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Ortalama Puan</p>
                <p className="mt-2 text-2xl font-semibold text-amber-400">★ {collectionStats.avgRating} / 5.0</p>
              </div>
            </>
          )}

          {selectedCollection === 'contact_us' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Mesaj</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Türkçe (TR)</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.trCount}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">İngilizce (EN)</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.enCount}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Diğer Diller</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.otherCount}</p>
              </div>
            </>
          )}

          {selectedCollection === 'user_reflections' && (
            <>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Toplam Yansıma Notu</p>
                <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{collectionStats.total}</p>
              </div>
              <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Yansıma Yazan Kullanıcılar</p>
                <p className="mt-2 text-2xl font-semibold text-purple-400">{collectionStats.uniqueUsers}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Telemetry Stats Widgets */}
      {selectedCollection === 'ai_telemetry' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Ortalama Prompt Tokens</p>
            <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{stats.avgPrompt}</p>
          </div>
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Ortalama Completion Tokens</p>
            <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{stats.avgCompletion}</p>
          </div>
          <div className="rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b]/40 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-[#ecd8a6]/60">Ortalama Total Tokens</p>
            <p className="mt-2 text-2xl font-semibold text-[#ecd8a6]">{stats.avgTotal}</p>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-[#ecd8a6]/10 bg-[#0e0a1b] p-4">
        {/* Date Filter Range */}
        <div className="flex-1 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Başlangıç Tarihi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-[#ecd8a6]/60 mb-2 font-medium">Bitiş Tarihi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-lg border border-[#ecd8a6]/20 bg-[#07040e] px-3 py-2 text-sm text-[#ecd8a6] outline-none focus:border-[#ecd8a6]/50 transition"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="mt-6 sm:mt-auto rounded-lg bg-red-950/20 border border-red-900/30 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 transition h-[38px] flex items-center justify-center"
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
                          : selectedCollection === 'ai_telemetry'
                          ? renderValue(getTelemetryValue(doc, col))
                          : selectedCollection === 'contact_us'
                          ? renderValue(getContactUsValue(doc, col))
                          : selectedCollection === 'user_moons'
                          ? renderValue(getUserMoonsValue(doc, col))
                          : selectedCollection === 'user_reflections'
                          ? renderValue(getUserReflectionsValue(doc, col))
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
