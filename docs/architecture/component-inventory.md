# Bileşen Envanteri (Component Inventory)

Bu belgede, MadameSoul React uygulamasını oluşturan temel kullanıcı arayüzü (UI) bileşenleri, bu bileşenlerin durumları (states), üstlendikleri görevler ve prop yapıları detaylandırılmıştır.

---

## 1. `App.tsx` (Ana Konteyner ve İş Akışı Yöneticisi)
Uygulamanın merkezidir. Zustand store ile entegre çalışarak yönlendirme (routing), kart seçme ritüeli, asenkron API entegrasyonu ve modüler bileşenlerin yönetimini koordine eder.

- **Dosya Konumu:** `src/App.tsx`
- **Temel Görevleri:**
  - Zustand store üzerinden global uygulama durumunu (`user`, `userInfo`, `moonsCount`, `view`, `language`) yönetme.
  - Kart çekme ekranını yönetme (3 kart seçilmesi zorunluluğu).
  - Gemini API'sine asenkron tarot yorumu isteği atma ve transaction durumunu takip etme.
  - Okunan tarot yorumunu PDF formatına dönüştürüp yerel cihazına indirme (`jspdf` ve `html2canvas` ile).
- **Zustand Store Bağımlılıkları:**
  - `user`: Aktif oturum açmış kullanıcı (Firebase Auth nesnesi).
  - `userInfo`: Firestore'dan çekilen kullanıcı profili.
  - `moonsCount`: Kullanıcının sahip olduğu kredi bakiyesi.
  - `view`: Aktif görünüm (`'landing' | 'select' | 'reading' | 'history' | 'profile'`).
  - `language`: Seçili aktif arayüz dili (lokal depolama ile kalıcı).

---

## 2. `Login.tsx` (Giriş ve Kayıt Bileşeni)
Kullanıcıların sisteme dahil olmasını sağlayan kapıdır. Birçok giriş metodunu ve yeni kayıt bonuslarını yönetir.

- **Dosya Konumu:** `src/components/Login.tsx`
- **Temel Görevleri:**
  - **Çoklu Giriş Yöntemleri:** E-posta/Şifre, Google ile Giriş, Apple ile Giriş ve Telefon SMS ile Giriş.
  - **Meta Veri Toplama:** Kayıt esnasında kullanıcının tarayıcı, işletim sistemi, IP adresi ve konum bilgilerini `lib/metadata.ts` üzerinden toplar ve Firestore'a yazar.
  - **Bakiyelendirme:** Yeni kayıt olan kullanıcılara hoş geldin bonusu (kredi) tanımlar.
  - **ReCAPTCHA Verifier:** Telefon doğrulaması için güvenlik kontrolünü üstlenir.

---

## 3. `Onboarding.tsx` (Tanıtım Sihirbazı)
Uygulama hakkında genel bilgilendirme yapan, görsel açıdan zengin slayt geçiş ekranıdır.

- **Dosya Konumu:** `src/components/Onboarding.tsx`
- **Temel Görevleri:**
  - Uygulamayı ilk kez açan kullanıcılara 3 adımdan oluşan (Welcome, Discovery, Journey) interaktif slaytlar sunar.
  - Animasyonlu slayt geçişleri ve arka planda hafif yavaş kayan mistik arka plan resimleri.
- **Kullandığı Teknolojiler:** `motion` (`AnimatePresence` ve `layoutId` özellikleri), `lucide-react`.

---

## 4. `Profile.tsx` (Profil ve Ayarlar Bileşeni)
Kullanıcının geçmişini gördüğü, profil bilgilerini ve hesap ayarlarını güncellediği kontrol panelidir.

- **Dosya Konumu:** `src/components/Profile.tsx`
- **Temel Görevleri:**
  - **Sekmeli Yapı:** 'Overview' (Genel Bakış) ve 'Settings' (Ayarlar) sekmeleri.
  - **Profil Güncelleme:** Ad, Doğum Tarihi, Doğum Yeri ve İlişki Durumu bilgilerini Firestore üzerinde günceller.
  - **Şifre Değiştirme:** E-posta kullanıcıları için güvenli şifre güncelleme mantığı.
  - **Geçmiş Okumaları Listeleme:** Firestore'daki `moon_transactions` koleksiyonundan son 10 okumayı çeker.
  - **PDF Tekrar İndirme:** Geçmiş bir okumanın detayına giderek yorum metnini PDF olarak indirme tetikleyicisi sağlar.

---

## 5. `KatinaMoon.tsx` (Animasyonlu Göksel Efekt Süslemesi)
Uygulamanın mistik ve premium havasını pekiştiren estetik bir görsel bileşendir.

- **Dosya Konumu:** `src/components/KatinaMoon.tsx`
- **Temel Görevleri:**
  - SVG tabanlı hilal şeklinde bir ay çizer.
  - Ayın etrafında hafif parıltı (glow) katmanı ve yavaşça dönüp boyut değiştiren yıldız parçacıkları oluşturur.
- **Kullandığı Teknolojiler:** `motion` yardımıyla `infinite` loop içeren scale, rotate ve opacity animasyonları.

---

## 6. Modüler Bileşenler (Extracted Modal & Helper Components)

Uygulamanın büyümesini yönetmek ve kod kalitesini korumak için `App.tsx` içerisindeki modallar ve yardımcı arayüzler ayrı bileşenlere bölünmüştür:

- **`ContactModal.tsx`:** Kullanıcının destek veya geri bildirim mesajları göndermesini sağlayan iletişim formu.
- **`CookieBanner.tsx`:** KVKK / GDPR uyumluluğu için çerez politikası izinlerini toplayan alt banner arayüzü.
- **`ErrorBoundary.tsx`:** Çalışma zamanında arayüzde oluşabilecek çökmeleri yakalayan ve Firestore `error_logs` koleksiyonuna yazan hata koruma katmanı.
- **`LegalModal.tsx`:** Kullanıcı üyelik sözleşmesi ve gizlilik bildirimlerini barındıran yasal onay penceresi.
- **`StoreModal.tsx`:** Kullanıcıların bakiye ("Moon") paketi seçerek Stripe Checkout ödeme sayfasına yönlendirilmesini yöneten mağaza modalı.

---

## Bileşenler Arası Veri Akışı ve Entegrasyon
```mermaid
graph TD
    Store[src/store/useAppStore.ts] -->|Global Durum / Yönlendirme| App[src/App.tsx]
    App -->|Oturum / Giriş İşlemi| Login[components/Login.tsx]
    App -->|Sihirbaz Adımları| Onboarding[components/Onboarding.tsx]
    App -->|Profil ve Fal Günlüğü| Profile[components/Profile.tsx]
    App -->|Mağaza Paketi Seçimi| StoreModal[components/StoreModal.tsx]
    App -->|İletişim / Geri Bildirim| ContactModal[components/ContactModal.tsx]
    App -->|Yasal Sözleşmeler| LegalModal[components/LegalModal.tsx]
    App -->|Çerez İzinleri| CookieBanner[components/CookieBanner.tsx]
    Login -->|Süsleme| KatinaMoon[components/KatinaMoon.tsx]
    Onboarding -->|Süsleme| KatinaMoon
```
- **Durum Yönetimi:** Tüm durumlar ve yerelleştirme (YAML) verileri Zustand global deposundan yönetilir; bileşenler `useAppStore` kancası (hook) üzerinden durumları okur ve günceller.
- **Asenkron API Entegrasyonu:** Fal üretim talebi React Query yardımıyla sarmalanarak `App.tsx` ve `Profile.tsx` ekranlarındaki asenkron bakiye güncellemelerinin tutarlı şekilde yönetilmesini sağlar.
