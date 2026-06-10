import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User as UserIcon, 
  Settings, 
  ShieldAlert, 
  Activity, 
  Plus, 
  Minus, 
  Save, 
  Lock, 
  Loader2, 
  UserPlus,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  getDoc, 
  doc, 
  writeBatch, 
  serverTimestamp, 
  limit, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import ActivityStream from './components/ActivityStream';

// Initialize Firebase
const firebaseConfig = {
  projectId: "madamesoul-926f6",
  appId: "1:829664664972:web:053b4c40375cd27b26caa9",
  apiKey: "AIzaSyCUVqxJDiJlWpQIJeIscXz7sGFCQOsZn84",
  authDomain: "madamesoul-926f6.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "madamesoul-926f6.firebasestorage.app",
  messagingSenderId: "829664664972",
  measurementId: "G-FR79LF6KS6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// KatinaMoon Animated Brand Icon
export function KatinaMoon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Ethereal Glow Layer */}
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.35, 0.15],
            scale: [1, 1.25, 1] 
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[#ecd8a6]/20 blur-[40px] rounded-full scale-150"
        />
        
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#ecd8a6] relative z-10 drop-shadow-[0_0_12px_rgba(236,216,166,0.5)]">
          {/* Detailed Crescent */}
          <path 
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
            fill="currentColor"
            fillOpacity="0.1"
            stroke="currentColor" 
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Mystic Star hanging off the tip area */}
          <motion.path
            d="M19 7l0.5 1.2 1.2 0.5-1.2 0.5-0.5 1.2-0.5-1.2-1.2-0.5 1.2-0.5 0.5-1.2z"
            fill="currentColor"
            animate={{ 
              scale: [0.7, 1.1, 0.7],
              opacity: [0.3, 0.9, 0.3],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Floating dust particles inside crescent */}
          <motion.circle
            cx="8" cy="12" r="0.2"
            fill="currentColor"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="12" cy="16" r="0.15"
            fill="currentColor"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
          <motion.circle
            cx="10" cy="8" r="0.1"
            fill="currentColor"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// Helper functions for search highlighting
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, search: string) => {
  if (!search.trim()) return <span>{text}</span>;
  const escapedSearch = escapeRegExp(search);
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-[#ecd8a6]/25 text-[#ecd8a6] rounded px-0.5 border border-[#ecd8a6]/40 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Section Keywords mapping for search filter and auto-expansion
const sectionKeywords = {
  users: ["kullanıcılar", "kullanıcı", "bakiye", "credit", "dusting", "bakiye düzenleme", "kullanıcı adı", "e-posta", "uid", "fal hareketleri", "ekle", "düşür", "arama sonuçları", "katina moon"],
  ui: ["reklam", "arayüz", "afiş", "görsel", "yönlendirme", "bağlantısı", "ad banner", "aktif", "kaydet", "dinamik"],
  system: ["sistem", "ayarları", "yapay zeka", "model", "versiyonu", "gemini", "istek", "limiti", "performans", "metrikler", "telemetry", "latency", "gecikme", "tokens"],
  roles: ["yetki", "yönetimi", "rol", "atama", "hedef", "claims", "employee", "admin", "user"],
  authorizedUsers: ["yetkili", "personel", "listesi", "kaldır", "revoke", "adminler", "çalışanlar", "listele"]
};

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'employee' | 'admin' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Accordion Sections State
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    users: true, // open by default
    ui: false,
    system: false,
    roles: false,
    authorizedUsers: false
  });

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Live Config Changes Banner State
  const [lastConfigChange, setLastConfigChange] = useState<any | null>(null);

  // Balance Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{ isAdd: boolean; amount: number } | null>(null);

  // Global loading and status messaging states
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Users Section States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserMoons, setSelectedUserMoons] = useState<{ dailyFreeBalance: number, purchasedBalance: number, balance: number } | null>(null);
  const [isAddMode, setIsAddMode] = useState(true);
  const [moonDelta, setMoonDelta] = useState(1);
  const [adjustmentDesc, setAdjustmentDesc] = useState('');
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [isLoadingUserHistory, setIsLoadingUserHistory] = useState(false);

  // UI Configs (Ads) State
  const [adsConfig, setAdsConfig] = useState({
    ad1: { active: true, pdfImage: '', link: '', showAfterPage: 1 },
    ad2: { active: true, pdfImage: '', link: '', showAfterPage: 2 }
  });

  // System Configs State
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [hourRateLimit, setHourRateLimit] = useState(15);
  const [telemetryStats, setTelemetryStats] = useState({
    avgLatency: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalRequests: 0
  });

  // YZ Diagnostic Connection Test States (MS-207)
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [testGeminiResult, setTestGeminiResult] = useState<{
    status: 'success' | 'error';
    model: string;
    latencyMs: number;
    message?: string;
    error?: string;
  } | null>(null);

  // Role Assignment State
  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState<'user' | 'employee' | 'admin'>('employee');
  const [targetPassword, setTargetPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  // Authorized Users List States
  const [usersWithRoles, setUsersWithRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Auth observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const tokenResult = await u.getIdTokenResult(true);
          let role = (tokenResult.claims.role as 'user' | 'employee' | 'admin') || 'user';
          // @ts-ignore
          if (import.meta.env.DEV) {
            role = 'admin';
          }
          setUserRole(role);
        } catch (err) {
          console.error("Error reading custom claims:", err);
          // @ts-ignore
          setUserRole(import.meta.env.DEV ? 'admin' : 'user');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Listen to configuration changes (MS-189)
  useEffect(() => {
    if (!user || (userRole !== 'admin' && userRole !== 'employee')) return;
    const q = query(
      collection(db, 'config_logs'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setLastConfigChange({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setLastConfigChange(null);
      }
    }, (err) => {
      console.error("Error listening to config logs:", err);
    });
    return unsub;
  }, [user, userRole]);

  // Handle Search Input changing -> Auto Expand Accordion Sections matching query
  useEffect(() => {
    if (!globalSearchQuery.trim()) return;
    const q = globalSearchQuery.toLowerCase();
    const updated = { ...expandedSections };
    let changed = false;

    Object.entries(sectionKeywords).forEach(([section, keywords]) => {
      const match = keywords.some(k => k.includes(q)) || section.includes(q);
      if (match && !expandedSections[section]) {
        updated[section] = true;
        changed = true;
      }
    });

    if (changed) {
      setExpandedSections(updated);
    }
  }, [globalSearchQuery]);

  // Initial configuration loading
  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'employee')) {
      fetchUIConfig();
      if (userRole === 'admin') {
        fetchSystemConfigAndTelemetry();
        fetchUsersWithRoles();
      }
    }
  }, [user, userRole]);

  // Load users with roles when roles or authorizedUsers section expands or on initial load
  useEffect(() => {
    if ((expandedSections.roles || expandedSections.authorizedUsers) && user && userRole === 'admin') {
      fetchUsersWithRoles();
    }
  }, [expandedSections.roles, expandedSections.authorizedUsers, user, userRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginLoading(true);
    setLoginError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await cred.user.getIdTokenResult(true);
      let role = (tokenResult.claims.role as 'user' | 'employee' | 'admin') || 'user';
      // @ts-ignore
      if (import.meta.env.DEV) {
        role = 'admin';
      }
      setUserRole(role);
      if (role !== 'employee' && role !== 'admin') {
        setLoginError('Yetkisiz hesap: Bu panele erişim yetkiniz bulunmamaktadır.');
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const tokenResult = await cred.user.getIdTokenResult(true);
      let role = (tokenResult.claims.role as 'user' | 'employee' | 'admin') || 'user';
      // @ts-ignore
      if (import.meta.env.DEV) {
        role = 'admin';
      }
      setUserRole(role);
      if (role !== 'employee' && role !== 'admin') {
        setLoginError('Yetkisiz hesap: Bu panele erişim yetkiniz bulunmamaktadır.');
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setLoginError('Açılır pencere engellendi. Lütfen izin verip tekrar deneyin.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setLoginError('Giriş penceresi kapatıldı.');
      } else {
        setLoginError(err.message || 'Google ile giriş yapılamadı.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
    setEmail('');
    setPassword('');
  };

  // 1. Fetch Users
  const handleSearchUsers = async () => {
    if (!userSearchQuery.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), limit(50));
      const snap = await getDocs(q);
      const allUsers = snap.docs.map(d => d.data());
      
      const queryLower = userSearchQuery.toLowerCase();
      const filtered = allUsers.filter((u: any) => 
        (u.name && u.name.toLowerCase().includes(queryLower)) ||
        (u.email && u.email.toLowerCase().includes(queryLower)) ||
        (u.userId && u.userId.toLowerCase().includes(queryLower))
      );
      
      setSearchedUsers(filtered);
      if (filtered.length === 0) {
        showStatus("Kullanıcı bulunamadı.", 'error');
      }
    } catch (err: any) {
      console.error(err);
      showStatus("Kullanıcılar aranamadı.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Select User Details
  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchUserMoonsAndHistory = async () => {
      setIsLoadingUserHistory(true);
      try {
        const moonSnap = await getDoc(doc(db, 'user_moons', selectedUser.userId));
        if (moonSnap.exists()) {
          const d = moonSnap.data()!;
          setSelectedUserMoons({
            dailyFreeBalance: d.dailyFreeBalance || 0,
            purchasedBalance: d.purchasedBalance || 0,
            balance: d.balance || 0
          });
        } else {
          setSelectedUserMoons({ dailyFreeBalance: 0, purchasedBalance: 0, balance: 0 });
        }

        const histSnap = await getDocs(query(
          collection(db, 'moon_transactions'),
          where('userId', '==', selectedUser.userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        ));
        setUserHistory(histSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoadingUserHistory(false);
      }
    };

    fetchUserMoonsAndHistory();
  }, [selectedUser]);

  // 3. Adjust User Moons (MS-190, MS-193)
  const handleAdjustMoons = async (isAdd: boolean) => {
    if (!selectedUser || !selectedUserMoons) return;
    setLoading(true);
    
    const amount = isAdd ? moonDelta : -moonDelta;
    const finalDesc = adjustmentDesc.trim() || "Sistem yöneticisi tarafından düzenleme";
    
    const moonRef = doc(db, 'user_moons', selectedUser.userId);
    const txRef = doc(collection(db, 'moon_transactions'));
    const auditRef = doc(collection(db, 'admin_audit_logs'));
    
    try {
      const batch = writeBatch(db);
      const newPurchased = Math.max(0, selectedUserMoons.purchasedBalance + amount);
      const newBalance = selectedUserMoons.dailyFreeBalance + newPurchased;
      
      // Update balance
      batch.set(moonRef, {
        userId: selectedUser.userId,
        dailyFreeBalance: selectedUserMoons.dailyFreeBalance,
        purchasedBalance: newPurchased,
        balance: newBalance,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      const operatorEmail = auth.currentUser?.email || "unknown";
      const targetUserString = selectedUser.name 
        ? `${selectedUser.name} (${selectedUser.email || ""})` 
        : (selectedUser.email || "unknown");

      const clientMetadata = {
        userAgent: navigator.userAgent,
        os: navigator.userAgent.includes("Mac") ? "macOS" :
            navigator.userAgent.includes("Win") ? "Windows" :
            navigator.userAgent.includes("Linux") ? "Linux" :
            navigator.userAgent.includes("Android") ? "Android" :
            navigator.userAgent.includes("like Mac") ? "iOS" : "Unknown",
        appVersion: "1.0.0"
      };

      // Write Transaction document with type 'refund' (as requested to not mix with bonus)
      batch.set(txRef, {
        userId: selectedUser.userId,
        amount,
        type: 'refund',
        status: 'success',
        description: `Admin: ${finalDesc}`,
        pdfDownloaded: 0,
        performedBy: operatorEmail,
        targetUser: targetUserString,
        paymentProvider: 'admin_dusting',
        idempotencyKey: `admin_dusting_${txRef.id}`,
        clientMetadata,
        createdAt: serverTimestamp()
      });

      // Write Audit Log document (MS-193)
      batch.set(auditRef, {
        operatorUid: auth.currentUser?.uid || "unknown",
        operatorEmail,
        targetUid: selectedUser.userId,
        actionType: "credit_dusting",
        details: {
          amount,
          description: finalDesc,
          targetEmail: selectedUser.email || "unknown",
          targetName: selectedUser.name || "unknown"
        },
        timestamp: serverTimestamp()
      });

      // Write Activity Stream log document
      const activityRef = doc(collection(db, 'activity_stream'));
      batch.set(activityRef, {
        userId: selectedUser.userId,
        eventType: 'purchase',
        status: 'success',
        message: `Admin bakiye güncellemesi: ${amount > 0 ? '+' : ''}${amount} Katina Moons (${finalDesc})`,
        email: selectedUser.email || null,
        details: { amount, operatorEmail, finalDesc },
        createdAt: serverTimestamp()
      });
      
      await batch.commit();
      
      setSelectedUserMoons({
        dailyFreeBalance: selectedUserMoons.dailyFreeBalance,
        purchasedBalance: newPurchased,
        balance: newBalance
      });

      // Instantly prepend to local history list
      setUserHistory(prev => [
        {
          id: txRef.id,
          description: `Admin: ${finalDesc}`,
          amount,
          type: 'refund',
          createdAt: { toDate: () => new Date() }
        },
        ...prev.slice(0, 9)
      ]);

      setAdjustmentDesc('');
      setConfirmModal(null);
      showStatus("Kullanıcı bakiyesi güncellendi.");
    } catch (err: any) {
      console.error(err);
      showStatus("Bakiye güncellenemedi.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch UI Config (Ads)
  const fetchUIConfig = async () => {
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/ui-configs/ads`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdsConfig({
          ad1: data.ad1 || { active: true, pdfImage: '', link: '', showAfterPage: 1 },
          ad2: data.ad2 || { active: true, pdfImage: '', link: '', showAfterPage: 2 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Save UI Config (Ads)
  const handleSaveUIConfig = async () => {
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/ui-configs/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify(adsConfig)
      });
      if (res.ok) {
        showStatus("Arayüz reklam ayarları kaydedildi.");
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error(err);
      showStatus("Kayıt başarısız.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // 6. Fetch System Configurations & Telemetry
  const fetchSystemConfigAndTelemetry = async () => {
    if (userRole !== 'admin') return;
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      
      const modelRes = await fetch(`/api/admin/system-configs/gemini`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (modelRes.ok) {
        const d = await modelRes.json();
        setGeminiModel(d.model || 'gemini-2.5-flash');
      }

      const limitsRes = await fetch(`/api/admin/system-configs/limits`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (limitsRes.ok) {
        const d = await limitsRes.json();
        setHourRateLimit(d.generateHourLimit || 15);
      }

      const telemetrySnap = await getDocs(collection(db, 'ai_telemetry'));
      let totalLatency = 0;
      let promptTokens = 0;
      let compTokens = 0;
      const count = telemetrySnap.size;
      
      telemetrySnap.docs.forEach(doc => {
        const data = doc.data();
        totalLatency += data.latencyMs || 0;
        promptTokens += data.promptTokens || 0;
        compTokens += data.completionTokens || 0;
      });

      setTelemetryStats({
        avgLatency: count > 0 ? Math.round(totalLatency / count) : 0,
        totalPromptTokens: promptTokens,
        totalCompletionTokens: compTokens,
        totalRequests: count
      });
    } catch (err) {
      console.error("System configs load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 7. Save System Configurations
  const handleSaveSystemConfig = async () => {
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      
      const geminiRes = await fetch(`/api/admin/system-configs/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ model: geminiModel })
      });

      const limitsRes = await fetch(`/api/admin/system-configs/limits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ generateHourLimit: hourRateLimit })
      });

      if (geminiRes.ok && limitsRes.ok) {
        showStatus("Sistem ayarları başarıyla kaydedildi.");
      } else {
        throw new Error("Save error");
      }
    } catch (err) {
      console.error(err);
      showStatus("Sistem ayarları kaydedilemedi.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // 7.1. Test Gemini Connection (Admin/Employee only) (MS-207)
  const handleTestGemini = async () => {
    setIsTestingGemini(true);
    setTestGeminiResult(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/test-gemini`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTestGeminiResult({
          status: 'success',
          model: data.model,
          latencyMs: data.latencyMs,
          message: data.message
        });
        showStatus("YZ Modeli bağlantı testi başarılı.", 'success');
      } else {
        setTestGeminiResult({
          status: 'error',
          model: data.model || geminiModel,
          latencyMs: data.latencyMs || 0,
          error: data.error || "Sunucudan hata yanıtı alındı."
        });
        showStatus("YZ Modeli bağlantı testi başarısız.", 'error');
      }
    } catch (err: any) {
      console.error("Gemini test connection failed:", err);
      setTestGeminiResult({
        status: 'error',
        model: geminiModel,
        latencyMs: 0,
        error: err.message || "Ağ hatası nedeniyle bağlantı kurulamadı."
      });
      showStatus("Bağlantı testi yapılamadı.", 'error');
    } finally {
      setIsTestingGemini(false);
    }
  };

  // 8. Fetch Users with Roles
  const fetchUsersWithRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const q = query(
        collection(db, 'admin_users'),
        where('role', 'in', ['admin', 'employee'])
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ userId: doc.id, ...doc.data() }));
      setUsersWithRoles(list);
    } catch (err) {
      console.error("Error fetching users with roles:", err);
      showStatus("Yetkili kullanıcılar listelenemedi.", 'error');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // 9. Update/Revoke User Role
  const handleUpdateRole = async (emailToUpdate: string, newRole: 'user' | 'employee' | 'admin', passwordVal?: string) => {
    setRoleLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/set-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ email: emailToUpdate, role: newRole, password: passwordVal })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'password_required') {
          showStatus(data.message, 'error');
          setShowPasswordInput(true);
        } else {
          showStatus(`'${emailToUpdate}' kullanıcısının yetkisi '${newRole}' olarak güncellendi.`);
          setShowPasswordInput(false);
          setTargetPassword('');
          setTargetEmail('');
          fetchUsersWithRoles();
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Rol güncellenemedi.');
      }
    } catch (err: any) {
      console.error(err);
      showStatus(err.message || "Rol güncelleme işlemi başarısız.", 'error');
    } finally {
      setRoleLoading(false);
    }
  };

  const handleEmailChange = (val: string) => {
    setTargetEmail(val);
    if (showPasswordInput) {
      setShowPasswordInput(false);
      setTargetPassword('');
    }
  };

  const handleAssignRoleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    await handleUpdateRole(targetEmail, targetRole, showPasswordInput ? targetPassword : undefined);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060309] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ecd8a6]" />
      </div>
    );
  }

  // Login View
  if (!user || (userRole !== 'admin' && userRole !== 'employee')) {
    return (
      <div className="min-h-screen bg-[#060309] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/25 p-8 shadow-[0_0_50px_rgba(236,216,166,0.05)] text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 via-[#ecd8a6] to-pink-500" />
          
          <div className="w-20 h-20 rounded-full bg-[#ecd8a6]/10 border border-[#ecd8a6]/30 flex items-center justify-center mx-auto mb-6">
            <KatinaMoon className="w-10 h-10 text-[#ecd8a6]" />
          </div>
          
          <h2 className="text-xl font-serif text-[#ecd8a6] tracking-widest uppercase mb-2">MadameSoul</h2>
          <p className="text-xs text-[#ecd8a6]/50 uppercase tracking-widest font-serif mb-6">Yönetim Giriş Paneli</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] text-[#ecd8a6]/60 uppercase tracking-widest font-serif mb-1.5">E-posta</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#160d26] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#ecd8a6]/60 uppercase tracking-widest font-serif mb-1.5">Şifre</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#160d26] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-serif leading-relaxed">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#ecd8a6] hover:bg-white text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(236,216,166,0.1)]"
            >
              {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              GİRİŞ YAP
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ecd8a6]/20"></div>
              </div>
              <span className="relative px-3 bg-[#0a0512] text-[10px] text-[#ecd8a6]/50 uppercase tracking-widest font-serif">Veya</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="w-full py-3 bg-[#160d26] hover:bg-[#201535] text-[#ecd8a6] border border-[#ecd8a6]/30 hover:border-[#ecd8a6]/60 rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google İle Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#060309] text-[#ecd8a6] font-sans flex flex-col items-center p-4 md:p-8">
      {/* Container */}
      <div className="w-full max-w-6xl bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/20 overflow-hidden shadow-[0_0_50px_rgba(236,216,166,0.08)] flex flex-col relative min-h-[85vh]">
        
        {/* Toast Status Notification */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-4 left-4 z-50 p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-lg backdrop-blur-md ${
                statusMsg.type === 'success' ? 'bg-green-950/80 border-green-500/30 text-green-400' : 'bg-red-950/80 border-red-500/30 text-red-400'
              }`}
            >
              {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <div className="p-6 text-center border-b border-[#ecd8a6]/10 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ecd8a6]/5 to-transparent" />
          
          {/* Logout Button */}
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={handleLogout}
              className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-all flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-widest px-3 border border-[#ecd8a6]/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Çıkış
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#ecd8a6]/10 border border-[#ecd8a6]/30 flex items-center justify-center mb-3">
              <KatinaMoon className="w-8 h-8 text-[#ecd8a6]" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-[#ecd8a6] tracking-widest uppercase">
              MADAMESOUL YÖNETİM MERKEZİ
            </h2>
            <p className="text-[10px] text-[#ecd8a6]/40 uppercase tracking-widest font-serif mt-1">
              Bağımsız Yönetim ve Sistem Yapılandırma Uygulaması
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Live Config Logs Notification Banner (MS-189) */}
          <AnimatePresence>
            {lastConfigChange && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-purple-950/40 via-[#ecd8a6]/5 to-pink-950/40 border border-[#ecd8a6]/20 rounded-2xl p-4 mb-6 flex items-start gap-3 relative overflow-hidden shadow-[0_0_15px_rgba(236,216,166,0.05)]"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-[#ecd8a6]" />
                <Sparkles className="w-5 h-5 text-[#ecd8a6] animate-pulse flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs space-y-1">
                  <div className="font-serif font-bold text-[#ecd8a6] tracking-wider uppercase">
                    Son Konfigürasyon Güncellemesi
                  </div>
                  <div className="text-[#ecd8a6]/80 leading-relaxed font-sans">
                    <span className="font-serif font-semibold text-[#ecd8a6]">{lastConfigChange.changedSetting}</span> ayarı,{" "}
                    <span className="font-medium text-[#ecd8a6]">{lastConfigChange.performedBy}</span> tarafından güncellendi.
                  </div>
                  {lastConfigChange.createdAt && (
                    <div className="text-[10px] text-[#ecd8a6]/40 uppercase tracking-widest font-serif pt-0.5">
                      {lastConfigChange.createdAt?.toDate().toLocaleString()}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canlı İşlem Akışı */}
          <ActivityStream db={db} />

          {/* Sticky Search bar floating at the top of content (MS-188) */}
          <div className="sticky top-0 z-30 bg-[#0a0512]/95 backdrop-blur-md py-4 border-b border-[#ecd8a6]/10 mb-6 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
              <input 
                type="text"
                placeholder="Ayar, etiket veya bölüm başlığı arayın (örn: gemini, bakiye, reklam, yetki)..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full bg-[#160d26] border border-[#ecd8a6]/20 rounded-2xl pl-12 pr-4 py-3 text-sm text-[#ecd8a6] placeholder-[#ecd8a6]/35 focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
              />
            </div>
          </div>

          {/* Single-Page Accordion Layout - Stacked Vertically (MS-194) */}
          <div className="space-y-6">
              
              {/* Accordion 1: Kullanıcı Yönetimi */}
              <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#ecd8a6]/30">
                <button 
                  onClick={() => toggleSection('users')}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none bg-gradient-to-r from-[#160d26]/40 to-transparent"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-[#ecd8a6]" />
                    <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6]">
                      {highlightText("Kullanıcı ve Bakiye Yönetimi", globalSearchQuery)}
                    </span>
                  </div>
                  {expandedSections.users ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/60" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/60" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedSections.users && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <hr className="border-[#ecd8a6]/10 mb-4" />
                        
                        {/* Search Input inside Section */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ecd8a6]/40" />
                            <input 
                              type="text"
                              placeholder="Kullanıcı adı, e-posta veya UID girin..."
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                              className="w-full bg-[#160d26] border border-[#ecd8a6]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#ecd8a6] placeholder-[#ecd8a6]/30 focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                            />
                          </div>
                          <button 
                            onClick={handleSearchUsers}
                            disabled={loading}
                            className="px-6 py-2.5 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(236,216,166,0.15)]"
                          >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            ARA
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {/* Search Results List */}
                          <div className="space-y-2.5 bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-4 max-h-[250px] overflow-y-auto">
                            <h3 className="text-[9px] font-serif tracking-[0.2em] text-[#ecd8a6]/50 uppercase mb-2">
                              {highlightText(`Arama Sonuçları (${searchedUsers.length})`, globalSearchQuery)}
                            </h3>
                            {searchedUsers.map((u) => (
                              <button
                                key={u.userId}
                                onClick={() => setSelectedUser(u)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedUser?.userId === u.userId ? 'bg-[#ecd8a6]/10 border-[#ecd8a6]/50 shadow-[0_0_10px_rgba(236,216,166,0.05)]' : 'bg-[#1a1025]/50 border-[#ecd8a6]/10 hover:bg-[#ecd8a6]/5'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-sans font-medium text-[#ecd8a6]">{u.name || "İsimsiz Kullanıcı"}</div>
                                  <div className="text-[10px] font-sans text-[#ecd8a6]/40 mt-1">{u.email || "No Email"}</div>
                                </div>
                                <UserIcon className="w-4 h-4 text-[#ecd8a6]/40" />
                              </button>
                            ))}
                            {searchedUsers.length === 0 && (
                              <div className="text-center py-8 text-[10px] text-[#ecd8a6]/30 font-serif tracking-widest uppercase">
                                Arama başlatmak için kriter girin
                              </div>
                            )}
                          </div>

                          {/* Selected User details and operations */}
                          {selectedUser ? (
                            <div className="bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6 space-y-6">
                              <div>
                                <h4 className="font-serif text-[10px] tracking-widest text-[#ecd8a6]/50 uppercase mb-3">
                                  {highlightText("Kullanıcı Detayları", globalSearchQuery)}
                                </h4>
                                <div className="space-y-2 text-xs text-[#ecd8a6]/80 font-serif">
                                  <div className="flex justify-between border-b border-[#ecd8a6]/5 pb-1">
                                    <span className="text-[#ecd8a6]/40">UID:</span> 
                                    <span className="font-sans text-[10px] font-mono">{selectedUser.userId}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#ecd8a6]/5 pb-1">
                                    <span className="text-[#ecd8a6]/40">İsim:</span> 
                                    <span className="font-sans font-medium">{selectedUser.name || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#ecd8a6]/5 pb-1">
                                    <span className="text-[#ecd8a6]/40">E-posta:</span> 
                                    <span className="font-sans">{selectedUser.email || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#ecd8a6]/5 pb-1">
                                    <span className="text-[#ecd8a6]/40">Doğum Tarihi:</span> 
                                    <span className="font-sans">{selectedUser.dob || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-[#ecd8a6]/5 pb-1">
                                    <span className="text-[#ecd8a6]/40">İlişki Durumu:</span> 
                                    <span className="font-sans">{selectedUser.relationship || "N/A"}</span>
                                  </div>
                                  {selectedUserMoons && (
                                    <div className="mt-3 p-3 bg-[#160d26] border border-[#ecd8a6]/15 rounded-xl flex items-center justify-between shadow-inner">
                                      <span className="text-xs text-[#ecd8a6]/60 font-serif">
                                        {highlightText("Bakiye Durumu", globalSearchQuery)}:
                                      </span>
                                      <span className="text-xs text-[#ecd8a6] font-bold font-serif">
                                        {selectedUserMoons.balance} Moons <span className="text-[9px] font-normal text-[#ecd8a6]/40">({selectedUserMoons.dailyFreeBalance} Free / {selectedUserMoons.purchasedBalance} Paid)</span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Dual Balance Modifier UI (MS-190) */}
                              <div className="border-t border-[#ecd8a6]/10 pt-4 space-y-4">
                                <h4 className="font-serif text-[10px] tracking-widest text-[#ecd8a6]/50 uppercase">
                                  {highlightText("Bakiye Düzenleme (Credit Dusting)", globalSearchQuery)}
                                </h4>
                                
                                {/* Direction Selector Control */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1025] rounded-xl border border-[#ecd8a6]/10">
                                  <button
                                    type="button"
                                    onClick={() => setIsAddMode(true)}
                                    className={`py-2 text-[10px] font-serif tracking-widest uppercase rounded-lg transition-all cursor-pointer font-bold ${
                                      isAddMode 
                                        ? 'bg-green-950/60 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                                        : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'
                                    }`}
                                  >
                                    Bakiye Ekle (+)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsAddMode(false)}
                                    className={`py-2 text-[10px] font-serif tracking-widest uppercase rounded-lg transition-all cursor-pointer font-bold ${
                                      !isAddMode 
                                        ? 'bg-red-950/60 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                                        : 'text-[#ecd8a6]/60 hover:text-[#ecd8a6]'
                                    }`}
                                  >
                                    Bakiye Düşür (-)
                                  </button>
                                </div>

                                {/* Amount Selector delta input with presets */}
                                <div className="space-y-2">
                                  <label className="block text-[10px] text-[#ecd8a6]/50 uppercase font-serif">Miktar</label>
                                  <div className="flex gap-2">
                                    {[1, 5, 10].map(val => (
                                      <button
                                        key={val}
                                        type="button"
                                        onClick={() => setMoonDelta(val)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-serif border transition-all cursor-pointer ${
                                          moonDelta === val 
                                            ? 'bg-[#ecd8a6]/25 border-[#ecd8a6] text-[#ecd8a6] font-bold' 
                                            : 'bg-[#1a1025] border-[#ecd8a6]/20 text-[#ecd8a6]/60 hover:border-[#ecd8a6]/45'
                                        }`}
                                      >
                                        {isAddMode ? `+${val}` : `-${val}`}
                                      </button>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2 mt-2">
                                    <button 
                                      type="button"
                                      onClick={() => setMoonDelta(prev => Math.max(1, prev - 1))}
                                      className="p-2 bg-[#1a1025] hover:bg-[#ecd8a6]/10 rounded-lg text-[#ecd8a6] border border-[#ecd8a6]/20 transition-all cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <input 
                                      type="number" 
                                      min="1"
                                      value={moonDelta}
                                      onChange={(e) => setMoonDelta(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                      className="w-20 bg-[#1a1025] border border-[#ecd8a6]/20 rounded-lg px-2 py-1.5 text-center text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => setMoonDelta(prev => prev + 1)}
                                      className="p-2 bg-[#1a1025] hover:bg-[#ecd8a6]/10 rounded-lg text-[#ecd8a6] border border-[#ecd8a6]/20 transition-all cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="block text-[10px] text-[#ecd8a6]/50 uppercase font-serif">İşlem Açıklaması</label>
                                  <input 
                                    type="text" 
                                    placeholder="İşlem nedeni girin (Örn: Hatalı çekim iadesi, kampanya yüklemesi)..."
                                    value={adjustmentDesc}
                                    onChange={(e) => setAdjustmentDesc(e.target.value)}
                                    className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] placeholder-[#ecd8a6]/30 focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setConfirmModal({ isAdd: isAddMode, amount: moonDelta })}
                                  className={`w-full py-3 rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(236,216,166,0.05)] ${
                                    isAddMode 
                                      ? 'bg-green-600 hover:bg-green-500 text-[#0a0512]' 
                                      : 'bg-red-600 hover:bg-red-500 text-[#0a0512]'
                                  }`}
                                >
                                  {isAddMode ? 'BAKİYE EKLE (+)' : 'BAKİYE DÜŞÜR (-)'}
                                </button>
                              </div>

                              {/* Transaction History list */}
                              <div className="border-t border-[#ecd8a6]/10 pt-4">
                                <h4 className="font-serif text-[10px] tracking-widest text-[#ecd8a6]/50 uppercase mb-3">
                                  {highlightText("Son Fal Hareketleri", globalSearchQuery)}
                                </h4>
                                {isLoadingUserHistory ? (
                                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-[#ecd8a6]/40" /></div>
                                ) : userHistory.length > 0 ? (
                                  <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {userHistory.map(h => (
                                      <div key={h.id} className="flex justify-between items-center p-2.5 bg-[#1a1025]/50 border border-[#ecd8a6]/10 rounded-lg text-[10px] text-[#ecd8a6]">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-medium truncate max-w-[150px]">{h.description}</span>
                                          {h.performedBy && (
                                            <span className="text-[8px] text-[#ecd8a6]/45 font-sans font-medium uppercase">
                                              Operatör: {h.performedBy}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                          <span className={`font-semibold ${h.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {h.amount > 0 ? `+${h.amount}` : h.amount} Kredi
                                          </span>
                                          <span className="text-[#ecd8a6]/35 text-[8px]">
                                            {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-[10px] text-[#ecd8a6]/30 uppercase font-serif">
                                    Fal geçmişi bulunmamaktadır
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#130b1c]/20 border border-[#ecd8a6]/5 border-dashed rounded-2xl p-12 text-center text-[#ecd8a6]/30 text-xs font-serif uppercase tracking-wider">
                              Düzenleme yapmak için listeden bir kullanıcı seçin.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Reklam & Arayüz Konfigürasyonu */}
              <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#ecd8a6]/30">
                <button 
                  onClick={() => toggleSection('ui')}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none bg-gradient-to-r from-[#160d26]/40 to-transparent"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#ecd8a6]" />
                    <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6]">
                      {highlightText("Reklam & Arayüz Konfigürasyonu", globalSearchQuery)}
                    </span>
                  </div>
                  {expandedSections.ui ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/60" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/60" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedSections.ui && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <hr className="border-[#ecd8a6]/10 mb-4" />
                        
                        <div className="space-y-6 bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6">
                          <div className="flex items-center gap-2 pb-3 border-b border-[#ecd8a6]/10">
                            <Sparkles className="w-4 h-4 text-[#ecd8a6]" />
                            <h3 className="font-serif text-xs text-[#ecd8a6] uppercase tracking-wider">
                              {highlightText("Dinamik Reklam Ayarları (PDF Reklamları)", globalSearchQuery)}
                            </h3>
                          </div>

                          {/* AD 1 */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-serif font-bold text-[#ecd8a6]">
                                {highlightText("1. Reklam Ürünü (Ad Banner 1)", globalSearchQuery)}
                              </h4>
                              <input 
                                type="checkbox" 
                                checked={adsConfig.ad1.active}
                                onChange={(e) => setAdsConfig({ ...adsConfig, ad1: { ...adsConfig.ad1, active: e.target.checked } })}
                                className="w-4 h-4 rounded border-gray-300 accent-[#ecd8a6] cursor-pointer"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                  {highlightText("Afiş Görsel Bağlantısı (pdfImage URL)", globalSearchQuery)}
                                </label>
                                <input 
                                  type="text" 
                                  value={adsConfig.ad1.pdfImage}
                                  onChange={(e) => setAdsConfig({ ...adsConfig, ad1: { ...adsConfig.ad1, pdfImage: e.target.value } })}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                  {highlightText("Tıklama Yönlendirme Bağlantısı (link URL)", globalSearchQuery)}
                                </label>
                                <input 
                                  type="text" 
                                  value={adsConfig.ad1.link}
                                  onChange={(e) => setAdsConfig({ ...adsConfig, ad1: { ...adsConfig.ad1, link: e.target.value } })}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                />
                              </div>
                            </div>
                          </div>

                          <hr className="border-[#ecd8a6]/10" />

                          {/* AD 2 */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-serif font-bold text-[#ecd8a6]">
                                {highlightText("2. Reklam Ürünü (Ad Banner 2)", globalSearchQuery)}
                              </h4>
                              <input 
                                type="checkbox" 
                                checked={adsConfig.ad2.active}
                                onChange={(e) => setAdsConfig({ ...adsConfig, ad2: { ...adsConfig.ad2, active: e.target.checked } })}
                                className="w-4 h-4 rounded border-gray-300 accent-[#ecd8a6] cursor-pointer"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                  {highlightText("Afiş Görsel Bağlantısı (pdfImage URL)", globalSearchQuery)}
                                </label>
                                <input 
                                  type="text" 
                                  value={adsConfig.ad2.pdfImage}
                                  onChange={(e) => setAdsConfig({ ...adsConfig, ad2: { ...adsConfig.ad2, pdfImage: e.target.value } })}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                  {highlightText("Tıklama Yönlendirme Bağlantısı (link URL)", globalSearchQuery)}
                                </label>
                                <input 
                                  type="text" 
                                  value={adsConfig.ad2.link}
                                  onChange={(e) => setAdsConfig({ ...adsConfig, ad2: { ...adsConfig.ad2, link: e.target.value } })}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <button
                              onClick={handleSaveUIConfig}
                              disabled={loading}
                              className="px-6 py-2.5 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(236,216,166,0.15)]"
                            >
                              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-4 h-4" />}
                              AYARLARI KAYDET
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Accordion 3: Yapay Zeka & Sistem Ayarları */}
              <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#ecd8a6]/30">
                <button 
                  onClick={() => toggleSection('system')}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none bg-gradient-to-r from-[#160d26]/40 to-transparent"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[#ecd8a6]" />
                    <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6]">
                      {highlightText("Sistem Ayarları & AI Performans", globalSearchQuery)}
                    </span>
                  </div>
                  {expandedSections.system ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/60" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/60" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedSections.system && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <hr className="border-[#ecd8a6]/10 mb-4" />
                        
                        {userRole !== 'admin' ? (
                          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
                            <h3 className="font-serif text-xs text-red-200 uppercase tracking-widest">
                              {highlightText("YETKİSİZ ERİŞİM ENGELİ", globalSearchQuery)}
                            </h3>
                            <p className="text-[10px] text-[#ecd8a6]/60 leading-relaxed max-w-sm mx-auto">
                              Sistem konfigürasyon sekmelerine ve API yönetimine yalnızca yetkili sistem yöneticileri (Admin) erişebilir.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Telemetry Stats */}
                            <div className="bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6 space-y-4">
                              <div className="flex items-center gap-2 pb-2 border-b border-[#ecd8a6]/10">
                                <Activity className="w-4 h-4 text-[#ecd8a6]" />
                                <h4 className="font-serif text-[10px] text-[#ecd8a6] uppercase tracking-wider font-bold">
                                  {highlightText("YAPAY ZEKA PERFORMANS VE METRİKLER (TELEMETRY)", globalSearchQuery)}
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-[#1a1025]/60 border border-[#ecd8a6]/10 rounded-xl text-center">
                                  <div className="text-[9px] text-[#ecd8a6]/40 uppercase tracking-wider font-serif mb-1 truncate">
                                    {highlightText("Toplam İstek", globalSearchQuery)}
                                  </div>
                                  <div className="text-sm text-[#ecd8a6] font-bold font-serif">{telemetryStats.totalRequests}</div>
                                </div>
                                <div className="p-3 bg-[#1a1025]/60 border border-[#ecd8a6]/10 rounded-xl text-center">
                                  <div className="text-[9px] text-[#ecd8a6]/40 uppercase tracking-wider font-serif mb-1 truncate">
                                    {highlightText("Ort. Gecikme", globalSearchQuery)}
                                  </div>
                                  <div className="text-sm text-[#ecd8a6] font-bold font-serif">{telemetryStats.avgLatency} ms</div>
                                </div>
                                <div className="p-3 bg-[#1a1025]/60 border border-[#ecd8a6]/10 rounded-xl text-center">
                                  <div className="text-[9px] text-[#ecd8a6]/40 uppercase tracking-wider font-serif mb-1 truncate">
                                    {highlightText("Prompt Tokens", globalSearchQuery)}
                                  </div>
                                  <div className="text-sm text-[#ecd8a6] font-bold font-serif">{telemetryStats.totalPromptTokens}</div>
                                </div>
                                <div className="p-3 bg-[#1a1025]/60 border border-[#ecd8a6]/10 rounded-xl text-center">
                                  <div className="text-[9px] text-[#ecd8a6]/40 uppercase tracking-wider font-serif mb-1 truncate">
                                    {highlightText("Completion Tokens", globalSearchQuery)}
                                  </div>
                                  <div className="text-sm text-[#ecd8a6] font-bold font-serif">{telemetryStats.totalCompletionTokens}</div>
                                </div>
                              </div>
                            </div>

                            {/* System & AI Configurations */}
                            <div className="bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6 space-y-6">
                              <div className="flex items-center gap-2 pb-2 border-b border-[#ecd8a6]/10">
                                <Lock className="w-4 h-4 text-[#ecd8a6]" />
                                <h4 className="font-serif text-[10px] text-[#ecd8a6] uppercase tracking-wider font-bold">
                                  {highlightText("YAPAY ZEKA VE SİSTEM YAPILANDIRMASI", globalSearchQuery)}
                                </h4>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-1.5">
                                  <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                    {highlightText("Aktif YZ Model Versiyonu", globalSearchQuery)}
                                  </label>
                                  <select
                                    value={geminiModel}
                                    onChange={(e) => setGeminiModel(e.target.value)}
                                    className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2.5 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all appearance-none"
                                  >
                                    <option value="gemini-2.5-flash" className="bg-[#0a0512]">Gemini 2.5 Flash (Standart)</option>
                                    <option value="gemini-2.5-pro" className="bg-[#0a0512]">Gemini 2.5 Pro (Gelişmiş)</option>
                                  </select>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[9px] text-[#ecd8a6]/50 uppercase font-serif">
                                    {highlightText("İstek Limiti (Kullanıcı Başına Saatlik Limit)", globalSearchQuery)}
                                  </label>
                                  <input 
                                    type="number"
                                    value={hourRateLimit}
                                    onChange={(e) => setHourRateLimit(parseInt(e.target.value, 10) || 15)}
                                    className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={handleSaveSystemConfig}
                                  disabled={loading}
                                  className="px-6 py-2.5 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(236,216,166,0.15)]"
                                >
                                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-4 h-4" />}
                                  SİSTEM AYARLARINI KAYDET
                                </button>
                              </div>

                              {/* YZ Bağlantı Testi (Health Check) (MS-207) */}
                              <div className="pt-4 border-t border-[#ecd8a6]/10 space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                  <div className="space-y-0.5">
                                    <h5 className="font-serif text-[9px] text-[#ecd8a6] uppercase tracking-wider font-bold">
                                      {highlightText("YZ Canlı Bağlantı Denetimi", globalSearchQuery)}
                                    </h5>
                                    <p className="text-[10px] text-[#ecd8a6]/40 max-w-sm">
                                      Sistemdeki aktif YZ modeliyle canlı bağlantı ve gecikme testi gerçekleştirir.
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleTestGemini}
                                    disabled={isTestingGemini || loading}
                                    className="px-4 py-2 bg-[#1a1025] border border-[#ecd8a6]/30 text-[#ecd8a6] hover:bg-[#ecd8a6] hover:text-[#0a0512] rounded-xl text-[10px] font-serif font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    {isTestingGemini ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Activity className="w-3 h-3" />
                                    )}
                                    BAĞLANTIYI TEST ET
                                  </button>
                                </div>

                                {/* Test Result Display */}
                                {testGeminiResult && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
                                      testGeminiResult.status === 'success'
                                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                        : 'bg-red-500/5 border-red-500/20 text-red-400'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5">
                                      {testGeminiResult.status === 'success' ? (
                                        <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-400 mt-0.5" />
                                      ) : (
                                        <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400 mt-0.5" />
                                      )}
                                      <div className="space-y-1 w-full">
                                        <div className="font-serif uppercase tracking-wider font-bold text-[10px]">
                                          {testGeminiResult.status === 'success' ? "BAĞLANTI BAŞARILI" : "BAĞLANTI HATASI"}
                                        </div>
                                        <div>
                                          {testGeminiResult.status === 'success'
                                            ? `Sistemdeki aktif model (${testGeminiResult.model}) başarıyla yanıt verdi.`
                                            : `Aktif YZ modeli (${testGeminiResult.model}) ile bağlantı kurulamadı. Hata Ayrıntısı:`}
                                        </div>
                                        {testGeminiResult.error && (
                                          <pre className="mt-2 p-2.5 bg-black/40 rounded border border-red-500/10 text-[10px] leading-normal font-mono text-red-300 overflow-x-auto whitespace-pre-wrap max-w-full">
                                            {testGeminiResult.error}
                                          </pre>
                                        )}
                                        <div className="text-[10px] text-[#ecd8a6]/40 pt-1">
                                          Gecikme Süresi: <span className="font-bold">{testGeminiResult.latencyMs} ms</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 4: Yetki ve Rol Yönetimi */}
              <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#ecd8a6]/30">
                <button 
                  onClick={() => toggleSection('roles')}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none bg-gradient-to-r from-[#160d26]/40 to-transparent"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5 text-[#ecd8a6]" />
                    <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6]">
                      {highlightText("Rol ve Yetki Yönetimi", globalSearchQuery)}
                    </span>
                  </div>
                  {expandedSections.roles ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/60" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/60" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedSections.roles && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <hr className="border-[#ecd8a6]/10 mb-4" />
                        
                        {userRole !== 'admin' ? (
                          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
                            <h3 className="font-serif text-xs text-red-200 uppercase tracking-widest">
                              {highlightText("YETKİSİZ ERİŞİM ENGELİ", globalSearchQuery)}
                            </h3>
                            <p className="text-[10px] text-[#ecd8a6]/60 leading-relaxed max-w-sm mx-auto">
                              Kullanıcı yetkilendirmelerine müdahale etme yetkisi yalnızca Sistem Yöneticilerine (Admin) aittir.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-2 pb-3 border-b border-[#ecd8a6]/10">
                              <UserPlus className="w-4 h-4 text-[#ecd8a6]" />
                              <h3 className="font-serif text-xs text-[#ecd8a6] uppercase tracking-wider font-bold">
                                {highlightText("KULLANICI YETKİ VE ROL ATAMA YÖNETİMİ", globalSearchQuery)}
                              </h3>
                            </div>

                            <form onSubmit={handleAssignRoleFormSubmit} className="space-y-4 max-w-md">
                              <div className="space-y-1.5">
                                <label className="block text-[9px] text-[#ecd8a6]/50 uppercase tracking-widest font-serif">
                                  {highlightText("Hedef Kullanıcı E-posta Adresi", globalSearchQuery)}
                                </label>
                                <input 
                                  type="email" 
                                  required
                                  placeholder="Örn: test@madamesoul.com"
                                  value={targetEmail}
                                  onChange={(e) => handleEmailChange(e.target.value)}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all font-sans"
                                />
                              </div>

                              {showPasswordInput && (
                                <div className="space-y-1.5">
                                  <label className="block text-[9px] text-[#ecd8a6]/50 uppercase tracking-widest font-serif">
                                    {highlightText("Yeni Kullanıcı İçin Giriş Şifresi", globalSearchQuery)}
                                  </label>
                                  <input 
                                    type="password" 
                                    required
                                    placeholder="En az 6 karakterli bir şifre belirleyin"
                                    value={targetPassword}
                                    onChange={(e) => setTargetPassword(e.target.value)}
                                    className="w-full bg-[#1a1025] border border-red-500/40 rounded-lg px-3 py-2 text-xs text-[#ecd8a6] focus:outline-none focus:border-red-500/60 transition-all font-sans"
                                  />
                                  <p className="text-[10px] text-red-400 mt-1 leading-relaxed">
                                    Bu e-posta adresiyle sistemde kayıtlı bir kullanıcı bulunamadı. Lütfen yeni personelin panele giriş yapabilmesi için bir şifre belirleyin.
                                  </p>
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <label className="block text-[9px] text-[#ecd8a6]/50 uppercase tracking-widest font-serif">
                                  {highlightText("Atanacak Rol Yetkisi", globalSearchQuery)}
                                </label>
                                <select
                                  value={targetRole}
                                  onChange={(e) => setTargetRole(e.target.value as any)}
                                  className="w-full bg-[#1a1025] border border-[#ecd8a6]/25 rounded-lg px-3 py-2.5 text-xs text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 transition-all appearance-none"
                                >
                                  <option value="employee" className="bg-[#0a0512]">Employee (Çalışan Yetkileri - Bakiye/Reklam düzenleyebilir)</option>
                                  <option value="admin" className="bg-[#0a0512]">Admin (Tam Yetki - Sistem ve Yetkilendirme yapabilir)</option>
                                  <option value="user" className="bg-[#0a0512]">User (Standart Kullanıcı - Panele erişemez)</option>
                                </select>
                              </div>

                              <div className="pt-2">
                                <button
                                  type="submit"
                                  disabled={roleLoading}
                                  className="px-6 py-2.5 bg-[#ecd8a6] text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(236,216,166,0.15)]"
                                >
                                  {roleLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                  ROL YETKİSİNİ GÜNCELLE
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 5: Yetkili Personel Listesi */}
              <div className="bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/15 overflow-hidden transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#ecd8a6]/30">
                <button 
                  onClick={() => toggleSection('authorizedUsers')}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none bg-gradient-to-r from-[#160d26]/40 to-transparent"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-[#ecd8a6]" />
                    <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#ecd8a6]">
                      {highlightText("Yetkili Personel Listesi", globalSearchQuery)}
                    </span>
                  </div>
                  {expandedSections.authorizedUsers ? <ChevronUp className="w-4 h-4 text-[#ecd8a6]/60" /> : <ChevronDown className="w-4 h-4 text-[#ecd8a6]/60" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {expandedSections.authorizedUsers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 space-y-6">
                        <hr className="border-[#ecd8a6]/10 mb-4" />
                        
                        {userRole !== 'admin' ? (
                          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
                            <h3 className="font-serif text-xs text-red-200 uppercase tracking-widest">
                              {highlightText("YETKİSİZ ERİŞİM ENGELİ", globalSearchQuery)}
                            </h3>
                            <p className="text-[10px] text-[#ecd8a6]/60 leading-relaxed max-w-sm mx-auto">
                              Yetkili personel listesini görüntüleme yetkisi yalnızca Sistem Yöneticilerine (Admin) aittir.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-[#130b1c]/40 border border-[#ecd8a6]/10 rounded-2xl p-6 space-y-4">
                            {isLoadingRoles ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-[#ecd8a6]/40" />
                              </div>
                            ) : usersWithRoles.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs font-serif">
                                  <thead>
                                    <tr className="border-b border-[#ecd8a6]/15 text-[#ecd8a6]/50">
                                      <th className="py-2 px-3">{highlightText("Kullanıcı Bilgisi", globalSearchQuery)}</th>
                                      <th className="py-2 px-3">{highlightText("Rol / Yetki", globalSearchQuery)}</th>
                                      <th className="py-2 px-3 text-right">{highlightText("İşlemler", globalSearchQuery)}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#ecd8a6]/5 text-[#ecd8a6]/85">
                                    {usersWithRoles.map((u: any) => (
                                      <tr key={u.userId} className="hover:bg-[#ecd8a6]/5 transition-colors">
                                        <td className="py-3 px-3">
                                          <div className="font-sans font-medium text-[#ecd8a6]">
                                            {u.name || "İsimsiz Kullanıcı"}
                                          </div>
                                          <div className="text-[10px] font-sans text-[#ecd8a6]/40 font-mono mt-0.5">
                                            {u.email || "E-posta yok"}
                                          </div>
                                        </td>
                                        <td className="py-3 px-3">
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-serif uppercase tracking-wider ${
                                            u.role === 'admin' 
                                              ? 'bg-purple-950/60 text-purple-400 border border-purple-500/30' 
                                              : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                          }`}>
                                            {u.role}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                          <button
                                            onClick={() => handleUpdateRole(u.email, 'user')}
                                            disabled={roleLoading}
                                            className="px-2.5 py-1 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-serif uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                                          >
                                            {highlightText("Yetkiyi Kaldır", globalSearchQuery)}
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-6 text-[10px] text-[#ecd8a6]/30 uppercase font-serif">
                                Yetkili personel bulunmamaktadır
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

          </div>

        </div>
      </div>

      {/* Confirmation Modal Overlay (MS-190) */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0512] rounded-3xl border border-[#ecd8a6]/25 p-8 shadow-[0_0_50px_rgba(236,216,166,0.15)] text-center relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-[#ecd8a6] to-pink-500" />
              
              <div className="w-16 h-16 rounded-full bg-[#ecd8a6]/10 border border-[#ecd8a6]/30 flex items-center justify-center mx-auto mb-6">
                <KatinaMoon className="w-8 h-8 text-[#ecd8a6]" />
              </div>
              
              <h3 className="text-lg font-serif text-[#ecd8a6] tracking-wider uppercase mb-2">
                İşlem Onayı
              </h3>
              <p className="text-xs text-[#ecd8a6]/60 font-serif mb-6 leading-relaxed">
                Aşağıdaki bakiye değişikliğini onaylıyor musunuz? Bu işlem geri alınamaz ve tüm operator denetim günlüklerine kaydedilecektir.
              </p>
              
              <div className="bg-[#160d26] border border-[#ecd8a6]/15 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-xs font-serif text-[#ecd8a6]/90 shadow-inner">
                <div>
                  <span className="text-[#ecd8a6]/40">Kullanıcı:</span>{" "}
                  <span className="font-sans font-medium text-[#ecd8a6]">
                    {selectedUser?.name || "İsimsiz Kullanıcı"} ({selectedUser?.email})
                  </span>
                </div>
                <div>
                  <span className="text-[#ecd8a6]/40">UID:</span>{" "}
                  <span className="font-sans text-[10px] bg-black/30 px-1.5 py-0.5 rounded border border-[#ecd8a6]/10 font-mono">
                    {selectedUser?.userId}
                  </span>
                </div>
                <div>
                  <span className="text-[#ecd8a6]/40">Mevcut Bakiye:</span>{" "}
                  <span className="font-semibold">{selectedUserMoons?.balance} Moons</span>
                </div>
                <div className="border-t border-[#ecd8a6]/10 pt-2.5 flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#ecd8a6]/40 text-xs">Değişiklik:</span>
                  <span className={confirmModal.isAdd ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {confirmModal.isAdd ? "+" : "-"}{confirmModal.amount} Moons
                  </span>
                </div>
                <div>
                  <span className="text-[#ecd8a6]/40">İşlem Açıklaması:</span>{" "}
                  <span className="italic text-xs font-sans text-[#ecd8a6]/85">
                    "{adjustmentDesc.trim() || "Sistem yöneticisi tarafından düzenleme"}"
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3 bg-[#160d26] hover:bg-[#201535] text-[#ecd8a6]/70 hover:text-[#ecd8a6] border border-[#ecd8a6]/20 rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all cursor-pointer font-semibold"
                >
                  İptal
                </button>
                <button 
                  onClick={() => handleAdjustMoons(confirmModal.isAdd)}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#ecd8a6] hover:bg-white text-[#0a0512] rounded-xl text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(236,216,166,0.15)]"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Evet, Onayla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
