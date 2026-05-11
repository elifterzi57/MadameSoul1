import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as FirebaseUser, 
  updatePassword, 
  updateEmail, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  History, 
  Download, 
  Loader2, 
  Check, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ProfileProps {
  user: FirebaseUser;
  onClose: () => void;
  language: 'tr' | 'en' | 'es' | 'fr' | 'zh' | 'ko';
  locales: any;
}

export function Profile({ user, onClose, language, locales }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'readings'>('profile');
  const [readings, setReadings] = useState<any[]>([]);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [emailInput, setEmailInput] = useState(user.email || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [reauthPassword, setReauthPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);
  const [reauthAction, setReauthAction] = useState<'email' | 'password' | null>(null);

  const t = (path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], locales[language]) || path;
  };

  const profileLocales = {
    tr: {
      title: "Hesabım",
      profile: "Profil",
      history: "Fallarım",
      email: "E-posta",
      password: "Yeni Şifre",
      update: "Güncelle",
      download: "PDF İndir",
      noReadings: "Henüz bakılmış bir falınız yok.",
      reauthTitle: "Güvenlik Doğrulaması",
      reauthDesc: "Bu işlemi gerçekleştirmek için mevcut şifrenizi girmelisiniz.",
      reauthButton: "Doğrula ve Devam Et",
      successEmail: "E-posta başarıyla güncellendi.",
      successPassword: "Şifre başarıyla güncellendi.",
      errorReauth: "Şifre hatalı veya oturum süresi dolmuş.",
      readingsTitle: "Geçmiş Fallarım",
      readingDate: "Tarih",
      readingCards: "Kartlar",
      cancel: "İptal"
    },
    en: {
      title: "My Account",
      profile: "Profile",
      history: "My Readings",
      email: "Email",
      password: "New Password",
      update: "Update",
      download: "Download PDF",
      noReadings: "No readings found.",
      reauthTitle: "Security Verification",
      reauthDesc: "Please enter your current password to proceed.",
      reauthButton: "Verify & Continue",
      successEmail: "Email updated successfully.",
      successPassword: "Password updated successfully.",
      errorReauth: "Incorrect password or session expired.",
      readingsTitle: "Reading History",
      readingDate: "Date",
      readingCards: "Cards",
      cancel: "Cancel"
    },
    es: {
      title: "Mi Cuenta",
      profile: "Perfil",
      history: "Mis Lecturas",
      email: "Correo electrónico",
      password: "Nueva Contraseña",
      update: "Actualizar",
      download: "Descargar PDF",
      noReadings: "No se encontraron lecturas.",
      reauthTitle: "Verificación de Seguridad",
      reauthDesc: "Por favor, ingrese su contraseña actual para continuar.",
      reauthButton: "Verificar y Continuar",
      successEmail: "Correo electrónico actualizado con éxito.",
      successPassword: "Contraseña actualizada con éxito.",
      errorReauth: "Contraseña incorrecta o sesión expirada.",
      readingsTitle: "Historial de Lecturas",
      readingDate: "Fecha",
      readingCards: "Cartas",
      cancel: "Cancelar"
    },
    fr: {
      title: "Mon Compte",
      profile: "Profil",
      history: "Mes Lectures",
      email: "E-mail",
      password: "Nouveau Mot de Passe",
      update: "Mettre à jour",
      download: "Télécharger PDF",
      noReadings: "Aucune lecture trouvée.",
      reauthTitle: "Vérification de Sécurité",
      reauthDesc: "Veuillez entrer votre mot de passe actuel pour continuer.",
      reauthButton: "Vérifier et Continuer",
      successEmail: "E-mail mis à jour avec succès.",
      successPassword: "Mot de passe mis à jour avec succès.",
      errorReauth: "Mot de passe incorrect ou session expirée.",
      readingsTitle: "Historique des Lectures",
      readingDate: "Date",
      readingCards: "Cartes",
      cancel: "Annuler"
    },
    zh: {
      title: "我的帳戶",
      profile: "個人資料",
      history: "我的讀數",
      email: "電子郵件",
      password: "新密碼",
      update: "更新",
      download: "下載 PDF",
      noReadings: "未找到讀數。",
      reauthTitle: "安全驗證",
      reauthDesc: "請輸入您目前的密碼以繼續。",
      reauthButton: "驗證並繼續",
      successEmail: "電子郵件已成功更新。",
      successPassword: "密碼已成功更新。",
      errorReauth: "密碼錯誤或登入逾時。",
      readingsTitle: "讀數歷史",
      readingDate: "日期",
      readingCards: "卡片",
      cancel: "取消"
    },
    ko: {
      title: "내 계정",
      profile: "프로필",
      history: "내 리딩",
      email: "이메일",
      password: "새 비밀번호",
      update: "업데이트",
      download: "PDF 다운로드",
      noReadings: "리딩 기록이 없습니다.",
      reauthTitle: "보안 확인",
      reauthDesc: "계속하려면 현재 비밀번호를 입력하세요.",
      reauthButton: "확인 및 계속",
      successEmail: "이메일이 성공적으로 업데이트되었습니다.",
      successPassword: "비밀번호가 성공적으로 업데이트되었습니다.",
      errorReauth: "비밀번호가 틀렸거나 세션이 만료되었습니다.",
      readingsTitle: "리딩 내역",
      readingDate: "날짜",
      readingCards: "카드",
      cancel: "취소"
    }
  };

  const pt = (key: string) => {
    const l = (profileLocales as any)[language] || profileLocales.en;
    return l[key] || key;
  };

  useEffect(() => {
    if (activeTab === 'readings') {
      fetchReadings();
    }
  }, [activeTab]);

  const fetchReadings = async () => {
    setIsLoadingReadings(true);
    try {
      const q = query(
        collection(db, 'moon_transactions'),
        where('userId', '==', user.uid),
        where('type', '==', 'spend'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReadings(data);
    } catch (err) {
      console.error("Fetch readings error:", err);
    } finally {
      setIsLoadingReadings(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailInput || emailInput === user.email) return;
    setReauthAction('email');
    setShowReauth(true);
  };

  const handleUpdatePassword = async () => {
    if (!passwordInput || passwordInput.length < 6) {
      const errorMsg = {
        tr: "Şifre en az 6 karakter olmalıdır.",
        en: "Password must be at least 6 characters.",
        es: "La contraseña debe tener al menos 6 caracteres.",
        fr: "Le mot de passe doit contenir au moins 6 caractères.",
        zh: "密碼必須至少為 6 個字元。",
        ko: "비밀번호는 최소 6자 이상이어야 합니다."
      };
      setError((errorMsg as any)[language] || errorMsg.en);
      return;
    }
    setReauthAction('password');
    setShowReauth(true);
  };

  const processReauth = async () => {
    if (!reauthPassword) return;
    setIsUpdating(true);
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(user.email!, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      
      if (reauthAction === 'email') {
        await updateEmail(user, emailInput);
        setSuccess(pt('successEmail'));
      } else if (reauthAction === 'password') {
        await updatePassword(user, passwordInput);
        setSuccess(pt('successPassword'));
        setPasswordInput('');
      }
      
      setShowReauth(false);
      setReauthPassword('');
      setReauthAction(null);
    } catch (err: any) {
      console.error("Reauth error:", err);
      setError(pt('errorReauth'));
    } finally {
      setIsUpdating(false);
    }
  };

  const [isExportingPDF, setIsExportingPDF] = useState<string | null>(null);

  const downloadReadingPDF = async (reading: any) => {
    if (isExportingPDF) return;
    setIsExportingPDF(reading.id);

    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '0';
      container.style.width = '800px';
      container.style.zIndex = '-9999';
      
      const dateStr = reading.createdAt?.toDate().toLocaleDateString(
        language === 'en' ? 'en-US' : 
        language === 'tr' ? 'tr-TR' : 
        language === 'es' ? 'es-ES' :
        language === 'fr' ? 'fr-FR' :
        language === 'zh' ? 'zh-CN' :
        language === 'ko' ? 'ko-KR' : undefined
      );
      
      const pdfLabels = {
        tr: { preparedFor: "Hazırlanan:", date: "Tarih:", pastReading: "Geçmiş Fal", notFound: "Fal metni bulunamadı." },
        en: { preparedFor: "Prepared For:", date: "Date:", pastReading: "Past Reading", notFound: "Reading text not found." },
        es: { preparedFor: "Preparado para:", date: "Fecha:", pastReading: "Lectura Pasada", notFound: "Texto de la lectura no encontrado." },
        fr: { preparedFor: "Préparé pour:", date: "Date:", pastReading: "Lecture Passée", notFound: "Texte de lecture non trouvé." },
        zh: { preparedFor: "準備者：", date: "日期：", pastReading: "過去的讀數", notFound: "未找到讀數文本。" },
        ko: { preparedFor: "준비 대상:", date: "날짜:", pastReading: "지난 리딩", notFound: "리딩 텍스트를 찾을 수 없습니다." }
      };

      const labels = (pdfLabels as any)[language] || pdfLabels.en;

      const cardsHtml = `
        <div style="display: flex; justify-content: center; gap: 40px; margin: 50px 0 60px 0; position: relative;">
          ${(reading.cardIds || []).map((id: string, index: number) => `
            <div style="text-align: center; width: 160px; position: relative; z-index: 2;">
              <div style="border-radius: 12px; overflow: hidden; border: 2px solid rgba(236,216,166,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.8); background-color: #1a1025; height: 240px; display: flex; align-items: center; justify-content: center;">
                 <img src="${window.location.origin}/cards/${id}.png" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
              </div>
              <div style="margin-top: 16px; font-family: 'Playfair Display', serif; font-size: 14px; color: #ecd8a6; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                ${reading.selectedCards?.[index] || id}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      const formatReading = (text: string) => {
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="margin: 20px 0 10px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h2 style="margin: 25px 0 12px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gim, '<h1 style="margin: 30px 0 15px; color: #ecd8a6; font-family: \'Playfair Display\', serif;">$1</h1>');
        
        let paragraphs = formatted.split(/\n\s*\n/);
        return paragraphs.map(p => {
          if (p.trim().startsWith('<h')) return p;
          let pFormatted = p.split('\n').map(l => {
             if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
                 return `<div style="margin-left: 20px; display: block;">&bull; ${l.trim().substring(2)}</div>`;
             }
             return l;
          }).join(' ');
          return `<p style="margin: 0 0 15px 0; line-height: 1.6;">${pFormatted}</p>`;
        }).join('');
      };
      
      const cleanReading = formatReading(reading.readingText || labels.notFound);

      container.innerHTML = `
        <div style="padding: 20px; background-color: #05000a; min-height: 1000px; box-sizing: border-box;">
          <div style="border: 1px solid rgba(236,216,166,0.2); border-radius: 24px; padding: 60px 80px; background: radial-gradient(circle at top center, rgba(30,19,50,0.4) 0%, rgba(5,0,10,1) 50%); position: relative; overflow: hidden;">
            <div style="text-align: center; margin-bottom: 50px;">
              <h1 style="font-size: 48px; letter-spacing: 4px; margin: 0 0 10px 0; color: #ecd8a6; font-family: 'Playfair Display', serif; font-weight: bold;">MADAME SOUL</h1>
              <h2 style="font-size: 14px; letter-spacing: 6px; margin: 0; color: rgba(236,216,166,0.8); text-transform: uppercase;">${labels.pastReading}</h2>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(236,216,166,0.2); padding: 15px 0; margin-bottom: 30px; color: rgba(236,216,166,0.7); font-size: 14px;">
              <div>${labels.preparedFor} <strong style="color: #ecd8a6;">${reading.userName || user.displayName || 'User'}</strong></div>
              <div>${labels.date} <strong style="color: #ecd8a6;">${dateStr}</strong></div>
            </div>
            ${cardsHtml}
            <div style="font-size: 18px; line-height: 1.9; font-family: sans-serif; color: rgba(236, 216, 166, 0.95); text-align: justify;">
              ${cleanReading}
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#05000a', useCORS: true, logging: false });
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.setFillColor('#05000a');
      pdf.rect(0, 0, canvas.width, canvas.height, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`MadameSoul_Reading_${reading.id.substring(0, 5)}.pdf`);

      // Update doc if needed
      if (!reading.pdfDownloaded) {
        await updateDoc(doc(db, 'moon_transactions', reading.id), { pdfDownloaded: 1 });
      }
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExportingPDF(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0512] rounded-[32px] border border-[#ecd8a6]/30 overflow-hidden shadow-[0_0_80px_rgba(236,216,166,0.15)] flex flex-col max-h-[90vh] relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ecd8a6]/10 flex items-center justify-between bg-[#130b21]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ecd8a6]/10 flex items-center justify-center border border-[#ecd8a6]/20">
              <User className="w-5 h-5 text-[#ecd8a6]" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#ecd8a6] tracking-widest uppercase">{pt('title')}</h2>
              <p className="text-[10px] text-[#ecd8a6]/50 uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-black/50 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/70 hover:text-[#ecd8a6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ecd8a6]/10">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-xs font-serif tracking-widest uppercase transition-all relative ${activeTab === 'profile' ? 'text-[#ecd8a6]' : 'text-[#ecd8a6]/40 hover:text-[#ecd8a6]/70'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {pt('profile')}
            </span>
            {activeTab === 'profile' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ecd8a6]" />}
          </button>
          <button 
            onClick={() => setActiveTab('readings')}
            className={`flex-1 py-4 text-xs font-serif tracking-widest uppercase transition-all relative ${activeTab === 'readings' ? 'text-[#ecd8a6]' : 'text-[#ecd8a6]/40 hover:text-[#ecd8a6]/70'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              {pt('history')}
            </span>
            {activeTab === 'readings' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ecd8a6]" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div 
                key="profile-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ecd8a6]/70 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-serif tracking-widest uppercase">{pt('email')}</span>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 bg-[#130b21] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 placeholder:text-[#ecd8a6]/20"
                    />
                    <button 
                      onClick={handleUpdateEmail}
                      disabled={isUpdating || emailInput === user.email}
                      className="px-6 py-3 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-[#ecd8a6]/20 text-[#ecd8a6] text-xs font-serif uppercase tracking-widest transition-all"
                    >
                      {pt('update')}
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#ecd8a6]/70 mb-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-serif tracking-widest uppercase">{pt('password')}</span>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-[#130b21] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 placeholder:text-[#ecd8a6]/20"
                    />
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={isUpdating || !passwordInput}
                      className="px-6 py-3 bg-[#ecd8a6]/10 hover:bg-[#ecd8a6]/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-[#ecd8a6]/20 text-[#ecd8a6] text-xs font-serif uppercase tracking-widest transition-all"
                    >
                      {pt('update')}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center gap-3 text-red-200/80 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-950/20 border border-green-900/30 rounded-xl flex items-center gap-3 text-green-200/80 text-sm">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    {success}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="readings-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-serif tracking-widest uppercase text-[#ecd8a6]/70">{pt('readingsTitle')}</h3>
                  <button onClick={fetchReadings} className="p-1 hover:bg-[#ecd8a6]/10 rounded-full text-[#ecd8a6]/40 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {isLoadingReadings ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-[#ecd8a6]/30">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs uppercase tracking-widest font-serif">{t('loading')}</span>
                  </div>
                ) : readings.length === 0 ? (
                  <div className="py-20 text-center text-[#ecd8a6]/30 border border-dashed border-[#ecd8a6]/10 rounded-3xl">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p className="text-xs uppercase tracking-widest font-serif">{pt('noReadings')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {readings.map((reading) => (
                      <div 
                        key={reading.id}
                        className="bg-[#130b21] border border-[#ecd8a6]/10 rounded-2xl p-4 flex items-center justify-between hover:bg-[#1a102a] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-900/20 flex items-center justify-center border border-purple-500/20">
                            <Calendar className="w-5 h-5 text-purple-300" />
                          </div>
                          <div>
                            <div className="text-[#ecd8a6] text-sm font-medium">
                              {reading.createdAt?.toDate().toLocaleDateString(
                                language === 'en' ? 'en-US' : 
                                language === 'tr' ? 'tr-TR' : 
                                language === 'es' ? 'es-ES' :
                                language === 'fr' ? 'fr-FR' :
                                language === 'zh' ? 'zh-CN' :
                                language === 'ko' ? 'ko-KR' : undefined
                              )}
                            </div>
                            <div className="text-[#ecd8a6]/40 text-[10px] uppercase tracking-widest flex items-center gap-2">
                              {pt('readingCards')}: {reading.selectedCards?.join(', ')}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => downloadReadingPDF(reading)}
                          disabled={isExportingPDF === reading.id}
                          className="p-3 bg-[#ecd8a6]/5 hover:bg-[#ecd8a6]/10 rounded-xl text-[#ecd8a6] transition-all disabled:opacity-50"
                          title={pt('download')}
                        >
                          {isExportingPDF === reading.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#05000a]/50 text-center">
          <p className="text-[9px] text-[#ecd8a6]/30 uppercase tracking-[0.2em]">Madam Soul Studio &copy; 2026</p>
        </div>

        {/* Reauth Modal Overlay */}
        <AnimatePresence>
          {showReauth && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[120] bg-[#0a0512] flex items-center justify-center p-8"
            >
              <div className="w-full max-w-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto border border-amber-500/20">
                  <ShieldCheck className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#ecd8a6] tracking-widest uppercase mb-2">{pt('reauthTitle')}</h3>
                  <p className="text-xs text-[#ecd8a6]/50 uppercase tracking-widest leading-relaxed">{pt('reauthDesc')}</p>
                </div>
                <div className="space-y-4">
                  <input 
                    type="password" 
                    value={reauthPassword}
                    onChange={(e) => setReauthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#130b21] border border-[#ecd8a6]/20 rounded-xl px-4 py-3 text-sm text-[#ecd8a6] focus:outline-none focus:border-[#ecd8a6]/50 text-center"
                  />
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setShowReauth(false)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 text-[10px] font-serif uppercase tracking-widest transition-all"
                    >
                      {pt('cancel')}
                    </button>
                    <button 
                      onClick={processReauth}
                      disabled={isUpdating || !reauthPassword}
                      className="flex-2 py-3 bg-[#ecd8a6] hover:bg-[#ecd8a6]/90 disabled:opacity-50 rounded-xl text-[#0a0512] text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : pt('reauthButton')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
