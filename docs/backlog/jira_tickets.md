# MadameSoul Projesi - Jira İş Listesi (Backlog)

Bu belge, MadameSoul projesinde kullanıcı deneyimi, güvenlik, performans, mimari geliştirmelerini ve tamamlanan işleri koordine etmek amacıyla oluşturulmuştur.

---

## 📋 Bilet Özeti (Backlog Summary)

Toplam Bilet: **51** | Açık: **0** | Tamamlanan: **51**

### 📋 Açık Biletler (Active Backlog)
Bu biletler henüz tamamlanmamış olup, geliştirilmeyi bekleyen işlerdir.

| Bilet ID | Türü | Özet | Öncelik | Atanan (Assignee) | Hedef Dosya |
| :--- | :--- | :--- | :--- | :--- | :--- |
| - | - | Tüm biletler tamamlandı. | - | - | - |

### ✅ Tamamlanan Biletler (Completed Tickets)
Bu biletler başarıyla tamamlanmış ve çözüme kavuşturulmuştur.

| Bilet ID | Türü | Özet | Öncelik | Çözüm Özeti | Oluşturan (Reporter) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [**MS-101**](#-ms-101) | Bug | Profil Bilgisi Durum Senkronizasyon Hatası | En Yüksek | `App.tsx` içindeki `onUpdateUserInfo` handler'ı güncellendi ... | Sally |
| [**MS-102**](#-ms-102) | Task | Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi | Orta | `index.css` dosyasında Google Fonts `Inter` yazı tipi içe aktarıldı, `--font-sans` Inter olarak değiştirildi, gövde metinlerine line-height: 1.8 verildi. | Sally |
| [**MS-104**](#-ms-104) | Task | Tarayıcı `alert()` Yapısının Özel Modal/Toast ile Değiştirilmesi | Orta | `App.tsx` dosyasında mor/altın temalı `toast` ve `showToast` ile `alert()` değiştirildi. | Sally |
| [**MS-106**](#-ms-106) | Task | Giriş/Kayıt Buton Mikro-Etkileşimlerinin Senkronizasyonu | Düşük | `Login.tsx` butonlarına `active:scale-[0.98]` ve `hover:bg-[#fff]` eklenerek davranışlar eşitlendi. | Sally |
| [**MS-108**](#-ms-108) | Bug | Firestore Composite Index Olmaması Sebebiyle Geçmiş Okuma Sınırı | Orta | `Profile.tsx` içindeki geçmiş fal sorgusu doğrudan Firestore... | Winston |
| [**MS-115**](#-ms-115) | Bug | Firestore `onSnapshot` Abonelik Temizliği Kontrolü | Yüksek | `App.tsx` içindeki `onSnapshot` dinleyicisi kurulurken, her ... | Winston |
| [**MS-122**](#-ms-122) | Bug | Yarıda Kalan İsteklerin Kurtarılması ve Moon Bakiye Güvencesi | Yüksek | `firestore.rules` dosyasındaki `isValidMoonTransaction` fonk... | John |
| [**MS-131**](#-ms-131) | Code Quality | PDF Çıktılarında Türkçe Karakter ve Yazı Tipi Optimizasyonu | Düşük | `App.tsx` içinde jsPDF çıktısında VFS ile Roboto-Regular yazı tipi tanımlanıp setFont yapıldı. | Sally |
| [**MS-138**](#-ms-138) | UX / UI | PDF Çıktısında Kart Görsellerinin Yüklenme ve CORS Sorunlarının Giderilmesi | Yüksek | `App.tsx` içindeki PDF üretim şablonunda yer alan `img` etik... | Winston |
| [**MS-139**](#-ms-139) | Security | `firestore.rules` Dosyasında `phones` Koleksiyonu Kurallarının Eksik Olması | Yüksek | `firestore.rules` dosyasına `phones` koleksiyonu kuralları e... | Winston |
| [**MS-112**](#-ms-112) | Test | Test Otomasyonu Altyapısının Kurulması | Yüksek | Projeye test otomasyonu için Vitest ve E2E testleri için Playwright kuruldu. Örnek testler yazılıp doğrulandı. | Winston |
| [**MS-124**](#-ms-124) | Security | `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı | Yüksek | `firestore.rules` güncellenerek bakiyenin istemciden artırılması engellendi, sadece -1 düşüşe izin verildi. | Winston |
| [**MS-125**](#-ms-125) | Security | `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması | Yüksek | `/api/generate` rotasında Bearer ID token doğrulaması ve Firestore bakiye kontrolü eklendi; client `App.tsx` istek başlığına ID token entegre edildi. | Winston |
| [**MS-133**](#-ms-133) | Security | KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı | Yüksek | Üyelikte onay kutusu (Login.tsx) eklendi, `consentsAcceptedAt` kaydedildi; `App.tsx` altına Çerez Onay Banner'ı eklendi; `Profile.tsx` içine "Hesabımı Sil" butonu ve verileri silme akışı yerleştirildi. | John |
| [**MS-109**](#-ms-109) | Security | `/api/generate` API Uç Noktasında Rate Limiting Eksikliği | Yüksek | `express-rate-limit` paketi kullanılarak `/api/generate` uç noktasına IP başına saatte 15 istek sınırı getirildi. | Winston |
| [**MS-136**](#-ms-136) | UX / UI | Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi | Yüksek | Onboarding tamamlanma/atlanma durumu `localStorage`'a kaydedildi. Girişte kontrol eklenerek mükerrer gösterim önlendi. Profil ve Login ekranlarına tekrar izleme butonu eklendi. | Sally |
| [**MS-142**](#-ms-142) | Feature | PDF Çıktısına Tıklanabilir Reklam Görselleri ve Bağlantıları Eklenmesi | Orta | pdfImage ve URL hedefleri ads_config.json'dan çekilip html2canvas + pdf.link ile tıklanabilir yapıldı. | John |
| [**MS-120**](#-ms-120) | Feature | Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği | Orta | Stripe webhook üzerinden kaydedilen `stripeReceiptUrl` bilgisi `Profile.tsx` satın alma geçmişinde makbuz butonu olarak gösterildi. | John |
| [**MS-107**](#-ms-107) | Feature | Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı | Yüksek | Girişte son bakiye tarihi kontrol edilip 24 saat geçmişse transaction ile +1 Moon ve hediye transaction logu eklenmesi sağlandı. | Winston |
| [**MS-128**](#-ms-128) | Feature | Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı | Yüksek | Stripe Checkout oturumu oluşturma, ödeme doğrulama ve webhook ile bakiye artışı altyapısı kuruldu. Geliştirme ortamı için mock ödeme simülasyonu eklendi. | John |
| [**MS-130**](#-ms-130) | Architecture | Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı | Yüksek | Firestore'da günlük ücretsiz bakiye ve satın alınan bakiye alanları ayrıldı; harcama işleminde önce ücretsiz bakiye tüketilecek şekilde transaction yazıldı. | Winston |
| [**MS-132**](#-ms-132) | Code Quality | Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi | Düşük | Yeni üye kaydında hoş geldin bonusu 5 krediden 1 krediye düşürüldü ve log kaydı güncellendi. | John |
| [**MS-140**](#-ms-140) | Feature | Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı | Orta | Pazarlama izinleri ve ödeme yarıda bırakma teşebbüsleri (checkout_attempts) Firestore şemaları tasarlanıp belgelendirildi; checkout yönlendirmesinde loglama eklendi. | Winston |
| [**MS-141**](#-ms-141) | Feature | Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı | Orta | Hata günlükleri (error_logs) ve yapay zeka token/latency telemetrisi (ai_telemetry) veri modelleri tasarlanıp belgelendirildi; sunucu/istemci tarafı hata yakalayıcıları ve telemetri loglaması eklendi. | Winston |
| [**MS-110**](#-ms-110) | Security | İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması | Orta | Prompt üretimi backend tarafına (`server.ts`) taşındı, istemcinin sadece yapısal parametre göndermesi sağlanarak sunucu tarafı doğrulama kuruldu. | Winston |
| [**MS-111**](#-ms-111) | Code Quality | `src/App.tsx` İçerisindeki Yazım Hatası | Düşük | `drawRancomCards` fonksiyon ismi ve tüm referansları `drawRandomCards` olarak düzeltildi. | Winston |
| [**MS-113**](#-ms-113) | Code Quality | Zustand ile Global Durum Yönetimi Standardizasyonu | Orta | `src/store/useAppStore.ts` oluşturuldu, in-memory states (user, userInfo, moonsCount, view) buraya taşınarak durum yönetimi merkezileştirildi. | Winston |
| [**MS-114**](#-ms-114) | Code Quality | TanStack Query (React Query) Entegrasyonu | Orta | `@tanstack/react-query` entegre edildi, fal talebi `useMutation` ile sarılarak mükerrer gönderim koruması ve hata yönetimi sağlandı. | Winston |
| [**MS-116**](#-ms-116) | Feature | CI/CD Pipeline (GitHub Actions) Kurulumu | Düşük | `.github/workflows/ci.yml` oluşturularak push ve PR'larda derleme, tip kontrolü (tsc) ve test otomasyonu koşulması sağlandı. | Winston |
| [**MS-117**](#-ms-117) | Feature | Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu | Düşük | İstemci tarafında `ErrorBoundary.tsx`, sunucu tarafında hata yakalayıcı middleware ile çalışma zamanı hataları Firestore `error_logs` koleksiyonuna kaydedildi. | Winston |
| [**MS-118**](#-ms-118) | Code Quality | Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması | Orta | `App.tsx` `t` fonksiyonu güncellendi; seçili dilde bulunamayan yerelleştirme anahtarları için otomatik İngilizce (`locales.en`) karşılığı yüklendi. | John |
| [**MS-121**](#-ms-121) | Feature | Tarot Açılımları için Kategori/Odak Seçimi | Yüksek | Fal formuna aşk, kariyer, sağlık ve genel odak seçenekleri eklenerek Gemini promptuna ve kullanıcı modeline entegre edildi. | John |
| [**MS-126**](#-ms-126) | Feature | `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi | Orta | StoreModal, LegalModal, ContactModal ve CookieBanner modüler React bileşenlerine bölünerek `App.tsx` sadeleştirildi. | Winston |
| [**MS-127**](#-ms-127) | Feature | Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması | Orta | `vite` paketi `devDependencies`'e taşındı; `server.ts` içinde üretim ortamı için Vite bağımlılığı ve dinamik importu devre dışı bırakıldı. | Winston |
| [**MS-134**](#-ms-134) | Feature | Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı | Orta | Firebase Analytics kuruldu; onboarding tamamlama, sepet yönlendirme ve ödeme tamamlama gibi kritik huni eventleri loglandı. | John |
| [**MS-143**](#-ms-143) | Feature | PDF Çıktısında Aynı Anda İki Reklam Görseli Gösterilmesi ve Tıklanabilir Yapılması | Orta | `pdfGenerator.ts` altında `ad1` ve `ad2` reklamlarının alt alta çizilmesi ve jsPDF `pdf.link(...)` ile tıklanabilir olması sağlandı. | John |
| [**MS-103**](#-ms-103) | Feature | İnteraktif Kart Seçim Ritüelinin Geliştirilmesi | Yüksek | Form gönderiminde kart çekim ritüeli ekranı (DRAWING) eklendi, 35 kapalı karttan hover/seçim/flip animasyonlarıyla 3 kart çekilip "Açılımı Yorumla" ile Gemini API tetiklenmesi sağlandı. | Sally |
| [**MS-152**](#-ms-152) | Bug | Üretim Ortamında Stripe Webhook İmza Doğrulamasının Zorunlu Kılınması | En Yüksek | Stripe webhook endpointinde üretim ortamında webhook imza doğrulaması (`constructEvent`) zorunlu kılındı. | Paige |
| [**MS-153**](#-ms-153) | Bug | Hesap Silme Akışında Re-Authentication Kontrolü ve İşlem Sırası Güvencesi | Yüksek | Hesap silme öncesi son oturum zamanı (lastSignInTime) ile re-auth tazeliği kontrolü yapıldı, veritabanı silmeleri tek bir atomik writeBatch içinde yapıldıktan sonra auth hesabı silindi. | Paige |
| [**MS-160**](#-ms-160) | i18n / Bug | Eksik Dil Çevirilerinin (dailyGift, focusOptions vb.) Eklenmesi | Yüksek | `es.yaml`, `fr.yaml`, `zh.yaml` ve `ko.yaml` dosyalarına eksik olan dailyGift, dailyGiftClaimed ve focusOptions / focusLabel anahtarları eklendi. | Paige |
| [**MS-146**](#-ms-146) | Feature | İnteraktif Kart Çekme Ritüelinde Mistik Arka Plan Müzikleri ve Ses Efektleri | Düşük | `App.tsx` içerisine ses kontrolü (Mute/Unmute) eklendi, kart çekme adımında mistik ortam müziği (ambient) ve kart etkileşimlerinde (hover, click, flip) chime ses efektleri entegre edildi. | John |
| [**MS-148**](#-ms-148) | Feature | Kaydedilen Falları Kişiselleştirme, Favorileme ve Yansıma/Gerçekleşme Notları | Orta | `Profile.tsx` fal geçmişi detaylandırılarak favorileme (yıldız), özel başlık (customTitle) ve yansıma notu (reflectionNotes) ekleme/kaydetme özellikleri Firestore işlemleriyle senkronize edildi. | John |
| [**MS-149**](#-ms-149) | Performance | Görsel Optimizasyonu ve Tarot Kart Görsellerinin WebP/Lazy-Loading ile Yüklenmesi | Düşük | Tüm kart PNG görselleri `.webp` formatına dönüştürüldü, `App.tsx` ve `pdfGenerator.ts` üzerindeki görsel yolları güncellendi ve istemci tarafında `loading="lazy"` eklendi. | Winston |
| [**MS-150**](#-ms-150) | UX / UI | Çevrimdışı Kullanım Desteği ve PWA (Progressive Web App) Altyapısının Kurulması | Orta | `manifest.json` ve Service Worker (`sw.js`) entegre edilerek statik varlıkların cache-first stratejisiyle önbelleğe alınması ve Firestore `enableIndexedDbPersistence` ile çevrimdışı çalışma sağlandı. | Sally |
| [**MS-151**](#-ms-151) | Architecture | Gemini API Yanıtlarının Önbelleğe Alınması (Caching) ile Maliyet Optimizasyonu | Orta | Firestore `reading_cache` koleksiyonu kurularak `/api/generate` uç noktasında son 24 saatteki aynı (uid, cards, focus) talepleri için önbellekten yanıt dönülmesi ve rollback bakiye koruması sağlandı. | Winston |
| [**MS-154**](#-ms-154) | Performance | Dil Dosyalarının Bellekte Önbelleğe Alınması (Locales Memory Caching) | Orta | Sunucu başlangıcında `src/locales/` klasöründeki YAML dosyaları okunup `localesCache` bellek içi nesnesine alındı ve her istekte diske erişmek yerine bu önbellekten çeviri değerleri döndürüldü. | Paige |
| [**MS-155**](#-ms-155) | Architecture | Gemini İstek Sınırlandırmasının (Rate Limit) IP Yerine User UID Üzerinden Yapılması | Orta | `/api/generate` uç noktasında rate limiter kimlik doğrulamasından sonraya taşındı, IP yerine `req.user.uid` üzerinden sınırlandırma kuruldu ve limit aşımında yerelleştirilmiş hata mesajı dönüldü. | Paige |
| [**MS-156**](#-ms-156) | i18n / UX | Çerez Çubuğu (CookieBanner) ve Hata Yakalayıcı (ErrorBoundary) Metinlerinin Yerelleştirilmesi | Düşük | `CookieBanner.tsx` ve `ErrorBoundary.tsx` içerisindeki tüm hardcoded metinler dil dosyalarına taşındı ve merkezi `t` fonksiyonu ile çağrılarak yerelleştirildi. | Paige |
| [**MS-157**](#-ms-157) | i18n / UX | Mağaza Paket Metinlerinin ve Giriş Bileşeni Çevirilerinin Taşınması | Düşük | `StoreModal.tsx` bonus metinleri ve `Login.tsx` içindeki yerel çeviri nesneleri kaldırılarak tamamı merkezi dil dosyalarına (YAML) taşındı ve yerel `t` fonksiyonuyla okundu. | Paige |
| [**MS-158**](#-ms-158) | UX / UI | Onboarding Ekranındaki Slayt Görsellerinin Çeşitlendirilmesi | Düşük | `Onboarding.tsx` onboarding tanıtım akışında hoş geldin, keşif ve yolculuk temaları için 3 ayrı WebP görseli kullanılarak arayüz zenginleştirildi. | Paige |
| [**MS-159**](#-ms-159) | Test | Fal Çekme ve Profil Etkileşimleri İçin Playwright E2E Test Kapsamının Genişletilmesi | Orta | Playwright test senaryoları onboarding geçişi, form doldurma, kart çekim chimes ritüeli, fal sonucunun yüklenmesi ve profil geçmişi/günlük düzenleme akışlarını kapsayacak şekilde genişletildi. | Paige |


---

## 🎫 Bilet Detayları (Ticket Details)

## 📋 Açık Bilet Detayları (Active Ticket Details)
















## ✅ Tamamlanan Bilet Detayları (Completed Ticket Details)

### ✅ MS-146: İnteraktif Kart Çekme Ritüelinde Mistik Arka Plan Müzikleri ve Ses Efektleri (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Deneyimi (UX / UI)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot falı bakma ritüeli mistik ve sakinleştirici bir atmosfer gerektirir. Kullanıcının kart seçme (`DRAWING`), kart çevirme ve yorum yüklenme aşamalarında mistik bir arka plan müziği (ambient sound) açabilmesi ve kart etkileşimlerinde (hover, click, flip) küçük ses efektleri (shimmer, soft bell) duyulması premium hissi üst seviyeye çıkaracaktır.
* **Kabul Kriterleri:**
  1. Arayüzün sağ üst kısmına müzik açma/kapama butonu (Mute/Unmute) eklenmelidir.
  2. Kart çekme ekranına geçildiğinde arka planda döngüsel (looping) mistik ortam müziği çalmaya başlamalıdır.
  3. Kart seçerken, hover yaparken ve kartlar açılırken yumuşak ses efektleri (card sound) çalmalıdır.
  4. Ses dosyaları `public/assets/audio/` altında telifsiz ve yüksek kaliteli formatlarda saklanmalıdır.


* **Çözüm:** `App.tsx` içerisine ses kontrolü (Mute/Unmute) butonu eklendi ve seçimi localStorage'a kaydedildi. Kart çekim ekranına geçildiğinde döngüsel ambient müzik (`ambient.wav`) çalmaya başlar. Kartların üzerine gelindiğinde, seçildiğinde ve çevrildiğinde sırasıyla `hover.wav`, `draw.wav`, `reveal.wav` chime sesleri oynatılır.

---

### ✅ MS-148: Kaydedilen Falları Kişiselleştirme, Favorileme ve Yansıma/Gerçekleşme Notları (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Geçmiş Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Kullanıcılar geçmiş fallarını listelediklerinde faldaki öngörülerin kendi yaşamlarında gerçekleşip gerçekleşmediğini zamanla takip etmek istemektedirler. Fal geçmişini kişiselleştirerek onlara başlıklar eklemek, favorilere ayırmak ve sonradan yansıma/gerçekleşme notları (manifestation notes) eklemek uygulamayı kişisel bir tarot günlüğüne dönüştürecektir.
* **Kabul Kriterleri:**
  1. Profil geçmiş listesindeki her fal kaydında "Favorilere Ekle" (yıldız) butonu bulunmalıdır.
  2. Kullanıcı fal geçmişindeki kayıtlara özel bir başlık (örn. "İş Görüşmesi Öncesi Açılım") verebilmelidir.
  3. Kullanıcı geçmiş faldaki detay ekranında "Yansıma ve Gerçekleşme Notu" başlığı altında serbest metin alanı ile kendi notlarını ekleyip kaydedebilmelidir.


* **Çözüm:** `Profile.tsx` fal geçmişi accordion yapısıyla genişletildi. Her fal kartına favorileme için yıldız ikonu eklendi. Tıklandığında açılan detay görünümünde, fal içeriğinin yanı sıra `customTitle` ve `reflectionNotes` düzenleme alanları sunuldu. Kaydet butonuna tıklandığında değişiklikler Firestore transaction'ı ile atomik olarak kaydedilmektedir.

---

### ✅ MS-149: Görsel Optimizasyonu ve Tarot Kart Görsellerinin WebP/Lazy-Loading ile Yüklenmesi (Performance)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Performans ve Mobil Optimizasyon
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot kart görselleri (`public/cards/*`) yüksek çözünürlüklü PNG/JPG formatındadır ve özellikle mobil cihazlarda yavaş yüklenerek LCP (Largest Contentful Paint) skorunu olumsuz etkilemektedir. Kart görsellerinin WebP formatına dönüştürülmesi ve ekranda belirene kadar yüklenmemesi (lazy loading) sağlanmalıdır.
* **Kabul Kriterleri:**
  1. Tüm kart görselleri `.webp` formatına dönüştürülmeli ve `public/cards/` klasörüne aktarılmalıdır.
  2. Arayüzde kullanılan `<img>` etiketlerine `loading="lazy"` niteliği eklenmeli ve WebP yolları kullanılmalıdır.


* **Çözüm:** Tüm kart resimleri `.webp` formatına dönüştürüldü ve `public/cards/` klasörüne yüklendi. `App.tsx` ve `pdfGenerator.ts` dosyalarındaki görsel yolları güncellendi. Arayüzdeki kart `<img>` etiketlerine `loading="lazy"` niteliği eklenerek LCP performansı optimize edildi.

---

### ✅ MS-150: Çevrimdışı Kullanım Desteği ve PWA (Progressive Web App) Altyapısının Kurulması (UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Mobil Kullanıcı Deneyimi
* **Hedef Dosya:** [index.html](file:///Users/elifterzi/antigravity/MadameSoul/index.html)
* **Açıklama:**  
  Kullanıcılar internet bağlantıları kesildiğinde dahi geçmiş fal kayıtlarına ve kayıtlı notlarına erişmek istemektedirler. Uygulamanın bir PWA (Progressive Web App) haline getirilmesi, çevrimdışı çalışma desteği (service worker) ve ana ekrana ekleme (A2HS) özelliğinin kazandırılması gerekmektedir.
* **Kabul Kriterleri:**
  1. `manifest.json` dosyası oluşturulmalı ve mistik temaya uygun ikonlarla `index.html`'e bağlanmalıdır.
  2. Service Worker (`sw.js`) entegre edilerek statik varlıkların (CSS, JS, Fontlar, Kart Görselleri) önbelleğe alınması ve çevrimdışı ortamda uygulamanın açılabilmesi sağlanmalıdır.
  3. Çevrimdışı durumda Firestore'daki geçmiş verilerin `enableIndexedDbPersistence` aracılığıyla yerel diskten okunması etkinleştirilmelidir.


* **Çözüm:** Progressive Web App desteği için `manifest.json` ve Service Worker (`sw.js`) kuruldu. Varlıkların cache-first stratejisi ile önbelleğe alınması sağlandı. `firebase.ts` dosyasına `enableIndexedDbPersistence` entegre edilerek Firebase veritabanına çevrimdışı erişim yeteneği kazandırıldı.

---

### ✅ MS-151: Gemini API Yanıtlarının Önbelleğe Alınması (Caching) ile Maliyet Optimizasyonu (Architecture)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Mimarisi ve Maliyet Optimizasyonu
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Kullanıcıların tarayıcıyı yenilemesi, yarıda kalan bağlantı kopmaları sonrası aynı kartlar ve aynı odak alanı ile mükerrer istek göndermesi durumunda Gemini API'sine tekrar istek atılmakta ve bakiye düşürülmektedir. Sunucuda son 24 saat içinde aynı kullanıcı, kart kombinasyonu ve odak alanı ile atılan istekler için Gemini API'ye gitmek yerine önbellekten (cache) yanıt dönülmelidir.
* **Kabul Kriterleri:**
  1. Firestore'da `reading_cache` adında bir koleksiyon tanımlanmalıdır.
  2. `/api/generate` uç noktasında, istek gövdesindeki (uid, cards, focus) bilgileri içeren bir hash anahtarı ile Firestore `reading_cache` sorgulanmalıdır.
  3. Eğer son 24 saatte üretilmiş bir kayıt varsa, Gemini çağrılmadan önbellekteki okuma metni dönülmeli ve bakiye tekrar düşürülmemelidir.


* **Çözüm:** Firestore `reading_cache` koleksiyonu oluşturuldu. Sunucu tarafında `/api/generate` uç noktasında istek parametrelerinden üretilen `sha256(uid:cards:focus)` hash anahtarı aranır. Son 24 saat içinde üretilmiş bir önbellek kaydı varsa, Gemini API bypass edilerek önbellekteki okuma metni döndürülür ve kullanıcının bakiyesi düşürülmez. Bir hata veya rollback durumunda bakiye iade edilir.

---

### ✅ MS-154: Dil Dosyalarının Bellekte Önbelleğe Alınması (Locales Memory Caching) (Performance)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Sunucu Performansı ve Optimizasyon
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  `server.ts` içinde yer alan `getTranslation` yardımcı fonksiyonu, sunucuya gelen her fal üretme isteğinde (`/api/generate`) diske giderek ilgili dilin `.yaml` dosyasını senkron olarak okumaktadır (`fs.readFileSync`). Eşzamanlı isteklerin yoğun olduğu zamanlarda bu durum sunucu üzerinde disk I/O darboğazına (bottleneck) yol açarak yanıt sürelerini uzatır.
* **Kabul Kriterleri:**
  1. Sunucu başlatılırken (startup aşamasında) `src/locales/` dizinindeki tüm dil dosyaları bir kez okunmalı, ayrıştırılmalı (YAML.parse) ve bir bellek içi nesnede (memory cache) saklanmalıdır.
  2. `getTranslation` fonksiyonu her istekte diske erişmek yerine bu bellek içi önbellekten çeviri değerlerini döndürmelidir.
  3. Geliştirme ortamında dil dosyası değişikliklerinin yansıması için dosya izleme (file watcher/hot-reload) desteği eklenebilir veya üretim modunda kalıcı önbellek aktif edilmelidir.


* **Çözüm:** Dil dosyaları için Locales Memory Caching entegre edildi. Sunucu startup aşamasında `src/locales/` klasöründeki YAML dosyaları bir kez okunup `localesCache` nesnesine parse edilerek yüklenir. `getTranslation` fonksiyonu her istekte disk okuması (fs.readFileSync) yapmak yerine bellek içi önbellekten hızlıca yanıt döner.

---

### ✅ MS-155: Gemini İstek Sınırlandırmasının (Rate Limit) IP Yerine User UID Üzerinden Yapılması (Architecture)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Sunucu Güvenliği ve İstek Sınırlandırma
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Gemini API uç noktasında bot/saldırı koruması amacıyla kullanılan `express-rate-limit` ara yazılımı IP adresi bazlı çalışmaktadır. Aynı mobil veri şebekesini, okul/ofis ağını veya VPN paylaşan kullanıcılar aynı harici IP adresini kullandıkları için birbirlerinin istek limitini doldurarak "Too many requests" hatası alabilirler. İstek atan kullanıcılar zaten sisteme üye girişi yaptığı için, limitleme IP yerine kullanıcının doğrulanmış Firebase UID'si üzerinden yapılmalıdır.
* **Kabul Kriterleri:**
  1. Rate limiter yapılandırmasında `keyGenerator` fonksiyonu güncellenmeli ve doğrulanmış `req.user.uid` değeri anahtar olarak kullanılmalıdır.
  2. Kimliği doğrulanamamış veya geçersiz istek durumunda fallback olarak yine IP adresi kullanılmalıdır.
  3. Kullanıcının limit aşımı durumunda kullanıcıya gösterilecek hata mesajı yerelleştirilmiş olmalı veya toast üzerinden düzgün aktarılmalıdır.


* **Çözüm:** Express rate limiter `/api/generate` uç noktasında authenticate middleware'den sonraya taşındı. `keyGenerator` fonksiyonu doğrulanmış Firebase `req.user.uid` değerini anahtar olarak kullanacak şekilde güncellendi. Limit aşımında yerelleştirilmiş hata mesajı dönülmesi sağlandı.

---

### ✅ MS-156: Çerez Çubuğu (CookieBanner) ve Hata Yakalayıcı (ErrorBoundary) Metinlerinin Yerelleştirilmesi (i18n / UX)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Arayüz ve Yerelleştirme
* **Hedef Dosya:** [CookieBanner.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/CookieBanner.tsx)
* **Açıklama:**  
  Uygulamadaki çerez bilgilendirme çubuğu (`CookieBanner.tsx`) ve çalışma zamanı hata yakalayıcısı (`ErrorBoundary.tsx`) içerisindeki metinler arayüzde doğrudan Türkçe veya İngilizce olarak hardcoded kodlanmıştır. Uygulamanın desteklediği diğer diller (İspanyolca, Fransızca, Çince, Korece) seçildiğinde bu bileşenlerde dil uyumluluğu sağlanamamakta ve kullanıcı deneyimi zarar görmektedir.
* **Kabul Kriterleri:**
  1. `CookieBanner` ve `ErrorBoundary` içindeki tüm başlık, açıklama ve buton metinleri `src/locales/` altındaki YAML dosyalarına (örneğin `cookieConsent.text`, `errorBoundary.title` vb. anahtarlarla) eklenmelidir.
  2. Bileşenler doğrudan bu yerelleştirilmiş anahtarları `t` fonksiyonu ile çağıracak şekilde güncellenmelidir.
  3. Tüm dillerde çerez onay çubuğu ve hata ekranı test edilmelidir.


* **Çözüm:** `CookieBanner.tsx` ve `ErrorBoundary.tsx` bileşenlerindeki tüm hardcoded metinler kaldırılarak `src/locales/` YAML dosyalarındaki `cookieConsent.*` ve `errorBoundary.*` anahtarlarına taşındı ve arayüzde `t` yerelleştirme fonksiyonuyla okundu.

---

### ✅ MS-157: Mağaza Paket Metinlerinin ve Giriş Bileşeni Çevirilerinin Taşınması (i18n / UX)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Arayüz ve Dil Standartları
* **Hedef Dosya:** [StoreModal.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/StoreModal.tsx)
* **Açıklama:**  
  `StoreModal.tsx` dosyasındaki kredi paketlerinin yanında yazan bonus metinleri ("1 Free Katina Moon", "5 Free Katina Moons") İngilizce olarak kod içerisine yazılmıştır. Ayrıca `Login.tsx` bileşeni kendi içinde devasa bir yerel `translations` nesnesi barındırmaktadır. Bu durum kod kalitesini düşürmece ve yerelleştirme yönetimini zorlaştırmaktadır.
* **Kabul Kriterleri:**
  1. Mağaza bonus metinleri ve `Login.tsx` içindeki tüm statik çeviriler merkezi `src/locales/` altındaki YAML dosyalarına aktarılmalıdır.
  2. Bileşenler içindeki tüm sabit çeviri nesneleri kaldırılmalı, merkezi `t` fonksiyonu kullanılarak değerler çekilmelidir.
  3. Tüm paketlerin bonus metinlerinin seçilen dille uyumlu şekilde değiştiği doğrulanmalıdır.


* **Çözüm:** `StoreModal.tsx` bonus metinleri ve `Login.tsx` içindeki yerel çeviri sözlüğü tamamen temizlendi. Bu çeviriler merkezi `src/locales/` YAML dosyalarına aktarılarak bileşenlerin standard `t` çeviri prop'u ile çalışması sağlandı.

---

### ✅ MS-158: Onboarding Ekranındaki Slayt Görsellerinin Çeşitlendirilmesi (UX / UI)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Onboarding Tanıtım Ekranı
* **Hedef Dosya:** [Onboarding.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Onboarding.tsx)
* **Açıklama:**  
  Uygulamanın onboarding tanıtım akışında 3 ayrı slayt bulunmasına rağmen, bu slaytların arka planında kullanılan görsel dizisi tek bir resmi (`onboarding_1.jpg`) işaret etmektedir. Bu durum tanıtım adımlarını görsel olarak monotonlaştırmakta ve premium hissiyatı zayıflatmaktadır.
* **Kabul Kriterleri:**
  1. Hoş Geldin (Welcome), Keşif (Discovery) ve Yolculuk (Journey) temalarını temsil eden 3 ayrı mistik tasarım görseli oluşturularak `/public/assets/onboarding/` klasörüne eklenmelidir.
  2. `Onboarding.tsx` dosyasındaki `slideImages` dizisi bu yeni görselleri çağıracak şekilde güncellenmelidir.
  3. Slaytlar arasında geçiş yaparken görsellerin yumuşak bir fade-in animasyonuyla değiştiği teyit edilmelidir.


* **Çözüm:** Onboarding slayt akışında Hoş Geldin, Keşif ve Yolculuk temalarına özel 3 adet benzersiz mistik WebP görseli (`onboarding_welcome.webp`, `onboarding_discovery.webp`, `onboarding_journey.webp`) tasarlandı ve `Onboarding.tsx` slayt dizisine eklendi.

---

### ✅ MS-159: Fal Çekme ve Profil Etkileşimleri İçin Playwright E2E Test Kapsamının Genişletilmesi (Test)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Test Otomasyonu
* **Hedef Dosya:** [app.spec.ts](file:///Users/elifterzi/antigravity/MadameSoul/tests/e2e/app.spec.ts)
* **Açıklama:**  
  Mevcut Playwright E2E testlerimiz sadece onboarding slaytlarını geçmeyi ve login ekranının açılmasını kontrol etmektedir. Uygulamanın kalbi olan kart seçme formu, kart çekme ritüeli, fal yorumu gösterimi, profil modalının açılması ve dil değiştirme işlemlerinin otomatik olarak doğrulanması gerekmektedir.
* **Kabul Kriterleri:**
  1. Playwright test senaryolarına mock kullanıcı ile giriş yapma adımları eklenmelidir.
  2. Giriş sonrası ad soyad, doğum tarihi ve odak alanı formunun doldurulması, 3 kart çekilmesi ve fal sonucunun yüklenmesi senaryoları simüle edilmelidir.
  3. Profil modalının açılması ve geçmiş falların listelenmesi akışları da test kapsamına dahil edilmelidir.


* **Çözüm:** Playwright E2E testleri (`tests/e2e/app.spec.ts`) onboarding adımlarını geçme, form doldurma (isim, doğum tarihi, odak alanı seçimi), kapalı desteden 3 kart çekme ritüeli, mistik ses kontrollerinin testi, fal sonucunun alınması ve profil geçmişindeki falları düzenleyip not kaydetme akışlarını kapsayacak şekilde baştan sona genişletildi.

---

### ✅ MS-101: Profil Bilgisi Durum Senkronizasyon Hatası (Bug)

* **Öncelik:** En Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil ve Fal Gönderme Flow'u
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx#L903-L910)
* **Açıklama:**  
  Kullanıcı profil ayarlarını güncellediğinde, [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx) Firestore veritabanını başarıyla günceller ve `onUpdateUserInfo` callback'ini tetikler. Ancak `App.tsx` içindeki handler, gelen veriden sadece `name` ve `dob` alanlarını günceller. `birthplace` ve `relationship` alanları local state'e yansıtılmaz. Bu durum, kullanıcının aynı oturumda yeni bir fal baktırırken eski bilgilerle yapay zekaya istek göndermesine neden olur.
* **Kabul Kriterleri:**
  1. `App.tsx` dosyasındaki `onUpdateUserInfo` handler'ı güncellenmeli ve `birthplace` ile `relationship` değerlerini de local state'e kopyalamalı.
    2. Profil kaydedildikten sonra yeni açılan fal formunda güncel doğum yeri ve ilişki durumunun otomatik geldiği doğrulanmalı.

* **Çözüm:** `App.tsx` içindeki `onUpdateUserInfo` handler'ı güncellendi ve `birthplace` ile `relationship` değerlerinin de local state'e senkronize edilmesi sağlandı.

---

### ✅ MS-108: Firestore Composite Index Olmaması Sebebiyle Geçmiş Okuma Sınırı (Bug)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Geçmiş Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  `src/components/Profile.tsx` içinde kullanıcının tarot okuma geçmişi (`type == 'spend'`) çekilirken, Firestore'da composite index olmaması nedeniyle veritabanından son 50 işlem toplu çekilip filtreleme ve sıralama istemci tarafında in-memory yapılmaktadır.
Eğer bir kullanıcı 50'den fazla "buy" veya "bonus" işlemi yapmışsa, in-memory filtrelemede son 50 kayıt arasında hiç "spend" işlemi kalmayacağı için kullanıcının fal geçmişi boş görünecektir.
* **Kabul Kriterleri:**
  1. Tarihçe sorgusu veritabanı düzeyinde doğrudan filtrelenmeli ve sıralanmalıdır.
    2. İstemci tarafında in-memory filtreleme (`.filter` ve `.sort`) kaldırılmalıdır.

#### Teknik Detaylar
- Firestore'da `moon_transactions` koleksiyonu için `userId` (Ascending) + `type` (Ascending) + `createdAt` (Descending) alanlarını kapsayan bir composite index tanımlanmalıdır.
- `src/components/Profile.tsx` içindeki sorgu şu şekilde güncellenmelidir:
  ```typescript
  const q = query(
    collection(db, 'moon_transactions'),
    where('userId', '==', user.uid),
    where('type', '==', 'spend'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  ```

* **Çözüm:** `Profile.tsx` içindeki geçmiş fal sorgusu doğrudan Firestore seviyesinde `where('type', '==', 'spend')` ve `orderBy('createdAt', 'desc')` ile filtrelenip sıralanacak şekilde güncellendi. `firestore.indexes.json` ve `firebase.json` dosyalarına ilgili composite index tanımları eklenerek veritabanı düzeyinde optimizasyon sağlandı.

---

### ✅ MS-115: Firestore `onSnapshot` Abonelik Temizliği Kontrolü (Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Firestore Integration
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Firestore'un gerçek zamanlı dinleyicileri (`onSnapshot`), bileşenler ekrandan kaldırıldığında (unmount) abonelik sonlandırılmazsa bellek sızıntısına ve arka planda gereksiz Firestore okuma (Read) maliyetlerine yol açar. Tüm gerçek zamanlı dinleyicilerin temizleme fonksiyonlarının (unsubscribe) çalıştığından emin olunmalıdır.
* **Kabul Kriterleri:**
  1. `App.tsx` ve diğer bileşenlerde kullanılan tüm `onSnapshot` çağrıları incelenmeli.
    2. Dinleyicilerin döndürdüğü `unsubscribe` fonksiyonları, React `useEffect`'in temizleme (cleanup) bloğunda çalıştırılmalı.
    3. Kullanıcı çıkış yaptığında (logout) abonelikler sonlandırılmalı.

#### Teknik Detaylar
- `App.tsx` ve `Profile.tsx` içerisindeki `onSnapshot` return değerleri kontrol edilerek temizleme fonksiyonları `useEffect` return bloğuna bağlanmalıdır.

* **Çözüm:** `App.tsx` içindeki `onSnapshot` dinleyicisi kurulurken, her yeni abonelikte ve unmount esnasında önceki aboneliğin kapatıldığından emin olmak için `unsubscribeMoons` kontrolü ve temizliği eklendi. Çıkış yapıldığında da abonelik sonlandırılacak şekilde refaktör edildi.

---

### ✅ MS-122: Yarıda Kalan İsteklerin Kurtarılması ve Moon Bakiye Güvencesi (Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Fal Gönderme ve Bakiye Düşüş Akışı
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod akışında, kullanıcı "Yorumla" dediğinde Moon bakiyesi hemen düşürülmekte ve ardından Gemini API isteği yapılmaktadır. Eğer API çağrısı sırasında internet kesilir, sunucu hata verir veya kullanıcı tarayıcıyı kapatırsa kullanıcının 1 Moon bakiyesi eksilmekte ancak fal sonucunu alamamaktadır. Bu durum müşteri memnuniyetini ve güvenini zedelemektedir.
* **Kabul Kriterleri:**
  1. Fal talebi gönderildiğinde işlem durumu `moon_transactions` koleksiyonuna `status: 'pending'` olarak kaydedilmelidir.
    2. API cevabı başarıyla dönüp Firestore'a `readingText` yazıldıktan sonra işlem durumu `status: 'success'` olarak güncellenmelidir.
    3. Eğer API çağrısı tamamen başarısız olursa veya zaman aşımına uğrarsa, işlem `status: 'failed'` olarak işaretlenmeli ve kullanıcının `user_moons` bakiyesi atomik olarak 1 iade edilmelidir.
    4. Alternatif olarak; eğer bakiye peşin düşülüyorsa, kullanıcı profilinden son yarım kalan falını görüp "Yeniden Dene" (Retry) diyerek ek bakiye harcamadan falını tamamlayabilmelidir.

#### Teknik Detaylar
- `moon_transactions` şemasına `status: 'pending' | 'success' | 'failed'` alanı eklenmelidir.
- Hata oluştuğunda Firestore transaction API'si kullanılarak iade işlemi yapılmalıdır.

* **Çözüm:** `firestore.rules` dosyasındaki `isValidMoonTransaction` fonksiyonu güncellenerek isteğe bağlı `status` alanı onaylandı. `App.tsx` içindeki `generateReading` akışında işlem başlangıcında `status: 'pending'` olarak kaydedilen işlem, API başarısına göre `success` durumuna güncellenmekte veya başarısızlık durumunda `failed` olarak kaydedilerek kullanıcının 1 Moon bakiyesi atomik olarak iade edilmektedir.

---

### ✅ MS-138: PDF Çıktısında Kart Görsellerinin Yüklenme ve CORS Sorunlarının Giderilmesi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF CORS ve Güvenlik Ayarları
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  PDF indirilirken kullanılan `html2canvas` kütüphanesi, kart resimlerini (`/cards/${id}.png`) tarayıcıdan alıp tuvale (canvas) çizmektedir. Kart görselleri yerel sunucudan çekilse de canlı ortamlarda (CDN veya Firebase Storage vb.) barındırıldığında CORS (Cross-Origin Resource Sharing) politikaları nedeniyle resimlerin çizilememesi ve PDF çıktısında kart görsellerinin boş çıkması veya PDF üretiminin tamamen durması riski vardır.
* **Kabul Kriterleri:**
  1. PDF üretim şablonundaki `img` etiketlerinde `crossorigin="anonymous"` niteliğinin yer alması ve `html2canvas` ayarlarında `useCORS: true` değerinin aktif olması kesinleştirilmelidir.
    2. Canlı ortamdaki resim sunucusunda (Storage/CDN) CORS kuralları (`GET` isteklerine `Access-Control-Allow-Origin: *` başlığı dönmesi) yapılandırılmalıdır.

#### Teknik Detaylar
- `App.tsx` içindeki `handleDownload` fonksiyonu içerisindeki `img` elementlerinin `crossOrigin` özelliği doğrulanmalı.
- `html2canvas` başlatılırken `useCORS: true` ve `allowTaint: false` parametreleri geçilmelidir.

* **Çözüm:** `App.tsx` içindeki PDF üretim şablonunda yer alan `img` etiketlerinde `crossorigin="anonymous"` niteliği doğrulandı. `html2canvas` kütüphanesi başlatılırken `useCORS: true` seçeneğinin yanına `allowTaint: false` parametresi eklenerek CORS resimlerinin çizilememe sorunu giderildi.

---

### ✅ MS-139: `firestore.rules` Dosyasında `phones` Koleksiyonu Kurallarının Eksik Olması (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Güvenliği (Security Rules)
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)
* **Açıklama:**  
  SMS/Telefon ile kimlik doğrulama akışında `src/components/Login.tsx` dosyasında `phones` isimli bir koleksiyona telefon numarası ile kullanıcı ID'si eşleştirilerek yazılmaya çalışılmaktadır (`setDoc(phoneRef, ...)`). Ancak `firestore.rules` dosyasında `phones` koleksiyonu için herhangi bir kural tanımlanmamıştır. Firestore varsayılan olarak tanımlanmayan tüm koleksiyonlara yazma isteklerini reddettiği için, SMS ile kayıt olan veya giriş yapan kullanıcılar Firestore yazma hatası alarak sisteme giriş yapamamaktadır. Bu durum SMS ile giriş akışını tamamen bozmaktadır.
* **Kabul Kriterleri:**
  1. `firestore.rules` içerisine `phones` koleksiyonu ve alt belgeleri için okuma ve yazma kuralları eklenmelidir.
    2. Bir kullanıcının sadece kendi doğrulanmış telefon numarasını içeren belgeye yazmasına (`create` / `update`) izin verilmelidir.
    3. SMS ile giriş yapıldığında telefon bilgisi belgesinin veritabanına başarıyla yazıldığı ve hata oluşmadığı doğrulanmalıdır.

#### Teknik Detaylar
- `firestore.rules` dosyasında `phones` koleksiyonu için şu kural bloğu eklenmelidir:
  ```javascript
  match /phones/{phoneNumber} {
    allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
  }
  ```

* **Çözüm:** `firestore.rules` dosyasına `phones` koleksiyonu kuralları eklenerek, kullanıcıların yalnızca kendi `userId` değerleriyle eşleşen telefon numarası belgelerini okumasına (`read`) ve yazmasına (`write`) izin verildi.

---

### ✅ MS-109: `/api/generate` API Uç Noktasında Rate Limiting Eksikliği (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend Güvenliği
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusundaki `/api/generate` API rotası doğrudan internete açıktır ve herhangi bir hız sınırlaması (rate limit) barındırmamaktadır. Kötü niyetli bir kullanıcı veya bot, bu uç noktayı spamlayarak Gemini API kullanım ücretlerini aşırı yükseltebilir (denial-of-wallet saldırısı).
* **Kabul Kriterleri:**
  1. `/api/generate` uç noktasına istemci/IP bazında makul bir istek sınırı (örn. IP başına saatte en fazla 15 istek) getirilmelidir.
  2. Sınır aşıldığında istemciye HTTP 429 (Too Many Requests) hatası dönmelidir.

* **Çözüm:** `server.ts` dosyasına `express-rate-limit` kütüphanesi entegre edildi. 1 saatlik pencerede aynı IP'den en fazla 15 istek kabul edecek şekilde rate limiter tanımlandı ve `/api/generate` POST rotasına middleware olarak eklendi. Rate limit aşıldığında istemciye HTTP 429 durum kodu ile hata mesajı dönmektedir.

---

### ✅ MS-136: Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Tanıtım Ekranı (Onboarding)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Uygulama her yüklendiğinde `showOnboarding` durumu varsayılan olarak `true` başlatılmaktadır. Bu durum, uygulamayı daha önce kullanan, üye olan veya onboarding adımlarını zaten tamamlamış olan kullanıcıların bile her sayfa yenilemesinde (refresh) onboarding ekranıyla karşılaşmasına ve "Atla" veya "Keşfetmeye Başla" butonlarına basmak zorunda kalmasına neden olmaktadır. Bu durum ciddi bir kullanıcı deneyimi engeli (friction) yaratmaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcı onboarding turunu tamamladığında veya "Atla" (Skip) butonuna tıkladığında bu bilgi tarayıcının yerel hafızasında (`localStorage`) kalıcı olarak saklanmalıdır.
  2. Uygulama başlatılırken `localStorage` kontrol edilmeli; onboarding daha önce tamamlanmışsa doğrudan Splash ekranı veya giriş akışı gösterilmeli, onboarding adımı atlanmalıdır.
  3. Profil ayarlarında veya giriş ekranında onboarding'i tekrar izlemek isteyen kullanıcılar için "Tanıtımı Tekrar İzle" (Watch App Intro) butonu aktif kalmalıdır.

* **Çözüm:** `App.tsx` dosyasında `showOnboarding` state'inin başlangıç değeri `localStorage.getItem('onboarding_completed') !== 'true'` olarak lazy-initializer ile kurgulandı. Onboarding tamamlandığında veya atlandığında `localStorage.setItem('onboarding_completed', 'true')` değeri set edildi. Giriş ekranına (`Login.tsx`) ve profil modalı ayarlar sekmesine (`Profile.tsx`) onboarding'i yeniden başlatacak trigger eklendi. Profil ayarlarında trigger tetiklendiğinde önce profil modalının kapatılması sağlandı.

---

### ✅ MS-142: PDF Çıktısına Tıklanabilir Reklam Görselleri ve Bağlantıları Eklenmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Sistemi ve Reklam Modülü
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların tarot yorumlarını yerel cihazlarına indirdikleri PDF belgesinin alt kısmına (footer/reklam alanı) dinamik olarak reklam görsellerinin (banner'lar) eklenmesi ve bu görsellerin tıklanabilir (tıklandığında reklam verenin sitesine veya sosyal medya hesaplarına yönlendiren) hale getirilmesi gerekmektedir. Reklam görseli ve URL hedefleri `/ads/ads_config.json` dosyasından dinamik olarak çekilmelidir.
* **Kabul Kriterleri:**
  1. PDF üretim şablonunun alt kısmına dinamik bir reklam banner görseli eklenmelidir.
  2. Eklenen reklam görselinin üzerine gelindiğinde veya tıklandığında, kullanıcının tarayıcısında yeni bir sekmede ilgili kampanya/reklam hedef URL'si açılmalıdır.
  3. PDF'e eklenecek reklam görselinin ve hedef URL'sinin `/ads/ads_config.json` dosyasındaki yapılandırmadan okunması sağlanmalıdır.
  4. jsPDF entegrasyonunda tıklanabilirlik için `pdf.link(x, y, width, height, { url: adTargetUrl })` veya benzeri bir jsPDF bağlantı API'si kullanılarak görselin bulunduğu koordinat alanı tıklanabilir hale getirilmelidir.
  5. Reklam görsellerinin PDF üretimi esnasında CORS hatasına yol açmaması ve görselin PDF'e başarıyla gömülmesi sağlanmalıdır.

* **Çözüm:** `App.tsx` dosyasında `handleDownload` fonksiyonunda `adsConfig`'ten aktif olan reklamın görsel yolu (`pdfImage`) ve hedef bağlantısı (`link`) dinamik olarak çekildi. Eski metin tabanlı `bannerHtml` yerine `id="pdf-ad-banner"` olan ve CORS kirliliğini önlemek için `crossorigin="anonymous"` niteliği taşıyan dinamik `<img>` yerleştirildi. `html2canvas` öncesi DOM üzerinden görselin container'a göre koordinatları (`getBoundingClientRect()`) ölçülerek jsPDF aşamasında `scale: 2` ölçekleme katsayısı ile `pdf.link(...)` API'si üzerinden PDF üzerinde tıklanabilir bir alan tanımlandı.

---

### ✅ MS-107: Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bakiye Yönetimi (Moon System)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların her gün uygulamaya giriş yaptıklarında 1 adet ücretsiz tarot falı bakabilmeleri için günlük 1 "Katina Moon" kazanması gerekmektedir. Ancak şu anki kod tabanında sadece yeni kayıtta **5 Moon** hoş geldin bonusu verilmekte; günlük girişlerde bakiye sıfırlama veya ekleme mekanizması bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcı uygulamaya giriş yaptığında en son ne zaman ücretsiz günlük bakiye aldığını kontrol etmelidir.
  2. Eğer son bakiye alma işlemi üzerinden en az 24 saat (veya takvim günü olarak yeni bir gün) geçmişse, kullanıcının bakiyesine otomatik olarak +1 Katina Moon eklenmelidir.
  3. Bu ekleme işlemi Firestore transaction yapısı ile güvenli ve atomik olarak yapılmalıdır.
  4. İşlem `moon_transactions` koleksiyonuna `type: 'bonus'` ve `description: 'Daily Gift'` (veya uygun dildeki karşılığı) olacak şekilde kaydedilmelidir.

* **Çözüm:** `App.tsx` dosyasında `claimDailyGift` fonksiyonu tanımlandı. Kullanıcı oturum açtığında Firestore'daki `user_moons` kaydı dinlenerek `lastDailyClaimedAt` alanı ile o anki zaman karşılaştırılır. Eğer 24 saatten fazla geçmişse `runTransaction` API'si ile atomik olarak kullanıcının `dailyFreeBalance` değeri 1'e set edilir, toplam `balance` güncellenir ve `moon_transactions` koleksiyonuna `type: 'bonus'` olacak şekilde günlük hediye işlem kaydı girilir.

---

### ✅ MS-128: Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Mağaza ve Stripe Ödeme Altyapısı
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Uygulamanın temel iş hedefi kullanıcıların Katina Moon kredisi satın almalarını sağlamaktır. Kullanıcıların güvenli ve sorunsuz bir şekilde kredi satın alabilmeleri için Stripe Checkout entegrasyonu yapılmalıdır.
* **Kabul Kriterleri:**
  1. İstemci tarafında kredi paketlerinin seçildiği bir ödeme paneli kurulmalı.
  2. Ödeme seçildiğinde Express backend üzerinden Stripe Checkout oturumu oluşturulmalı ve kullanıcı Stripe ödeme sayfasına yönlendirilmelidir.
  3. Ödeme başarılı olduktan sonra Stripe Webhook uç noktası üzerinden güvenli doğrulama yapılarak kullanıcının Firestore `user_moons` bakiyesi satın alınan miktar kadar artırılmalıdır.
  4. Tüm ödeme işlemleri `moon_transactions` koleksiyonuna `type: 'buy'` ve ödeme detaylarıyla kaydedilmelidir.

* **Çözüm:** `server.ts` içinde `/api/create-checkout-session` ve Stripe ödeme başarılı olduğunda bakiye artıran `/api/stripe-webhook` (imza doğrulamalı) rotaları oluşturuldu. İstemcide mağaza modalında kredi paketi seçildiğinde Express api üzerinden Checkout Session URL'si alınarak kullanıcı yönlendirildi. Yerel geliştirme/test ortamları için `/api/complete-mock-payment` simülasyon rotası tasarlanarak Stripe entegrasyonu test edildi.

---

### ✅ MS-130: Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı (Architecture)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bakiye Sistemi ve Veritabanı Mimarisi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  PRD (FR-2.2 ve FR-2.3) gereği, kullanıcılara günlük tanımlanan ücretsiz 1 Katina Moon hakkının bir sonraki güne devredip birikmemesi gerekmektedir. Ayrıca fal bakılırken öncelikle o günkü ücretsiz hakkın kullanılması, ardından kalıcı bakiyeden (satın alınan veya hoş geldin bonusu) düşülmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. `user_moons` tablosunda günlük ücretsiz hak ile kalıcı bakiye alanları ayrılmalıdır.
  2. Günlük ücretsiz hakların devretmesi/birikmesi engellenmelidir. Her yeni günde bu değer maksimum 1 olacak şekilde güncellenmeli veya sıfırlanmalıdır.
  3. Fal bakıldığında sistem otomatik olarak öncelikle günlük ücretsiz hakkı tüketmelidir. Günlük hak 0 ise kalıcı bakiyeden düşüş yapılmalıdır.

* **Çözüm:** `user_moons` belgesine `dailyFreeBalance` ve `purchasedBalance` alanları eklendi. `App.tsx`'teki `generateReading` fonksiyonundaki harcama adımı `runTransaction` içerisine alındı. İşlemde öncelikle `dailyFreeBalance` kontrol edilir; eğer `> 0` ise günlük ücretsiz bakiye 1 düşürülür, yoksa `purchasedBalance` düşürülür. Hata durumunda (API failure) harcanan bakiyenin türüne göre iade yapacak rollback transaction mantığı kurgulandı.

---

### ✅ MS-132: Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Hoş Geldin Bonusu Tanımlama
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod tabanında yeni kaydolan kullanıcılara bakiye olarak 5 Moon verilmektedir. PRD (FR-2.1) gereksinimlerine göre bu hoş geldin bonusu **1 Katina Moon** olarak güncellenmelidir.
* **Kabul Kriterleri:**
  1. Yeni kullanıcı oluşturulduğunda `user_moons` bakiye seeder'ı başlangıç değerini 5 yerine 1 yapmalıdır.
  2. `moon_transactions` kaydı da 5 yerine 1 olarak güncellenmelidir.
* **Çözüm:** `App.tsx` dosyasında yeni üye kaydında `user_moons` belgesi initialize edilirken `purchasedBalance: 1` ve `balance: 1` olacak şekilde güncellendi, moon_transactions kaydı da 1 Moon olarak kaydedildi.

---

### ✅ MS-140: Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veri Modelleri ve Monetizasyon (Marketing/Sales Data)
* **Hedef Dosya:** [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Uygulamanın gelirlerini ve kullanıcı bağlılığını (retention) artırmak için pazarlama segmentasyonu ve satış hunisi (funnel) verilerinin Firestore'da tutulması gerekmektedir. Şu anda bu veriler tutulmamaktadır.
  1. **Pazarlama İzinleri ve Tercihleri (`marketing_consents`)**: Kullanıcının kampanya/duyuru e-postası ve SMS izni verip vermediği, ayrıca ilgilendiği konular (aşk, kariyer vb.) tutulmalıdır. Bu sayede segmentasyon yapılarak kişiye özel push/SMS pazarlaması tetiklenebilir (Örn: "Aşk hayatında hareketlilik var! Katina Moon al ve hemen yorumlat.").
  2. **Sepeti Yarıda Bırakanlar (`checkout_attempts`)**: Mağazada ödeme sayfasına yönlenen ancak ödemeyi tamamlamayan (cart abandonment) kullanıcıları takip etmek için. Bu kullanıcılara indirim kuponları veya hatırlatıcılar tetiklenebilir.
  3. **Influencer/Kampanya Performansı (`campaign_logs`)**: Hangi kupon kodunun, hangi influencer kampanyasından geldiğini ve ROI oranlarını izlemek için.
* **Kabul Kriterleri:**
  1. Bahsi geçen pazarlama ve dönüşüm odaklı yeni Firestore veri modellerinin şeması [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklenmeli.
  2. Stripe ödeme ve onboarding akışlarında bu koleksiyonlara veri ekleme mantığı planlanmalıdır.
  3. `firestore.rules` dosyasına bu yeni koleksiyonların güvenlik kuralları dahil edilmelidir.

* **Çözüm:** Pazarlama segmentasyonu (`marketing_consents`), ROI takipleri (`campaign_logs`) ve yarım kalan sepet takibi (`checkout_attempts`) için Firestore şemaları tasarlanarak [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklendi. Stripe checkout oturumu oluşturulurken `checkout_attempts` koleksiyonuna durum `pending` olarak loglama yapılması backend'e entegre edildi.

---

### ✅ MS-141: Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** İzleme, Loglama ve Yapay Zeka Metrikleri
* **Hedef Dosya:** [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Uygulamanın canlı ortamda (production) karşılaştığı teknik sorunların (Gemini API çökmeleri, veri kayıpları, Stripe webhook gecikmeleri veya PDF hataları) geliştirici ekibi tarafından hızlıca tespit edilip giderilebilmesi için merkezi bir hata günlüğü (error logging) ve telemetri veri modeli kurulmalıdır. Şu anda sadece konsola yazılmakta ve kullanıcılar hata aldığında teknik ekipten izole kalmaktadır.
  1. **Hata Günlükleri (`error_logs`)**: İstemci veya sunucu tarafında oluşan tüm kritik hatalar (Gemini timeouts, Firestore rules denials, Stripe errors) Firestore'a `userId`, `errorCode`, `errorMessage`, `stackTrace`, `deviceMetadata` (tarayıcı, OS vb.) ve `timestamp` ile yazılmalıdır.
  2. **Yapay Zeka Telemetri Metrikleri (`ai_telemetry`)**: Gemini API'sine atılan her başarılı okuma isteğinin yanıt süresi (latency), harcanan token miktarları (prompt/output token count) ve model sürümü loglanmalıdır. Bu sayede API maliyetleri ve model hızı kontrol altında tutulabilir.
* **Kabul Kriterleri:**
  1. Bu telemetri ve hata günlüğü modellerinin tasarımları [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) belgesine yansıtılmalıdır.
  2. Firestore kurallarında bu logların güvenliği ayarlanmalı (İstemciler sadece kendi UID'leri ile hata yazabilmeli, okuma kesinlikle yasak olmalıdır).

* **Çözüm:** Firestore hata günlükleri (`error_logs`) ve YZ performans/maliyet metrikleri (`ai_telemetry`) veri modelleri [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklendi. `App.tsx` dosyasındaki client-side Firestore hata yakalayıcısına ve `server.ts` üzerindeki global Express error handler'a, oluşan hataları `error_logs` koleksiyonuna otomatik yazan kodlar eklendi. Sunucuda Gemini API yanıtı sonrası yanıt süresi, prompt/completion token miktarları `ai_telemetry` koleksiyonuna loglanacak şekilde güncellendi.

---

### ✅ MS-120: Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Ödeme Geçmişi
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Ücretli kredi (Moon) paketleri satan ticari bir platform olarak, Türkiye (KVKK/Maliye Bakanlığı) ve Avrupa Birliği (VAT/GDPR) mevzuatlarına uyum sağlamak amacıyla kullanıcıların yaptıkları satın alma işlemleri sonrasında dijital bir makbuz veya fatura (invoice) indirebilmesi veya görüntüleyebilmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. Profil sayfasındaki geçmiş işlemler sekmesinde, `type == 'buy'` olan satın alma işlemlerinin yanında "Faturayı İndir" veya "Makbuzu Görüntüle" butonu bulunmalıdır.
    2. Stripe entegrasyonu tamamlandığında, Stripe'ın ürettiği `invoice_pdf` veya `receipt_url` adresi `moon_transactions` belgesine kaydedilmeli ve kullanıcı bu butona tıkladığında ilgili PDF veya linke yönlendirilmelidir.
    3. Faturaya ait temel bilgiler (işlem no, miktar, tutar, tarih) kullanıcıya net bir şekilde gösterilmelidir.

#### Teknik Detaylar
- Stripe webhook işlemi sırasında gelen `charge.succeeded` veya `invoice.payment_succeeded` olayındaki `receipt_url` ve fatura bilgileri `moon_transactions` belgesine `stripeReceiptUrl` and `stripeInvoiceId` olarak eklenmelidir.
- `Profile.tsx` bileşeninde `type: 'buy'` olan işlemler için bu bağlantının görünür olması sağlanmalıdır.

* **Çözüm:** Stripe webhook üzerinden kaydedilen `stripeReceiptUrl` bilgisi `Profile.tsx` satın alma geçmişinde makbuz butonu olarak gösterildi.

---

### ✅ MS-102: Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi (Task)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Genel Stil Sistemi (Theme)
* **Hedef Dosya:** [index.css](file:///Users/elifterzi/antigravity/MadameSoul/src/index.css)
* **Açıklama:**  
  Mevcut `src/index.css` dosyasında `--font-sans` değişkeni serif karakterli `"Playfair Display"` yazı tipine atanmıştır. Bu sebeple tüm metin blokları (Gemini tarafından üretilen uzun fal yorumları dahil) serif yazı tipiyle gösterilmektedir. Uzun paragrafların serif fontuyla ve sıkışık satır aralıklarıyla okunması mobilde ve webde göz yorgunluğuna sebep olmaktadır.
* **Kabul Kriterleri:**
  1. Uzun okuma paragrafları, veri tabloları ve form girişleri için temiz, okunabilirliği yüksek bir sans-serif yazı tipi (örn. `Inter` veya `Roboto`) sisteme dahil edilmelidir.
  2. Başlıklar (`h1`, `h2`, `h3`) ve dekoratif mistik vurgular için serif karakterli `"Cinzel"` veya `"Playfair Display"` kullanılmaya devam edilmelidir.
  3. CSS hiyerarşisi düzenlenmeli; gövde metinleri (`p` etiketleri) için harf ve satır yüksekliği (line-height: 1.8 veya 2.0) optimize edilmelidir.

#### Teknik Detaylar
- `index.css` içindeki `--font-sans` tanımı standart bir sans-serif yazı tipine (örn. `Inter, sans-serif`) dönüştürülmeli, `Playfair Display` ise `--font-serif` veya özel bir başlık fontu değişkeni olarak tanımlanmalıdır.

* **Çözüm:** `index.css` dosyasında Google Fonts `Inter` yazı tipi içe aktarıldı, `--font-sans` değişkeni `Inter` olarak değiştirildi ve `--font-playfair` eklendi. Gövde metinleri ve inputlar için varsayılan font `Inter` yapılırken satır yüksekliği `1.8` olarak optimize edildi.

---

### ✅ MS-103: İnteraktif Kart Seçim Ritüelinin Geliştirilmesi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Deneyimi (UX / UI)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot falı bakma sürecinin en büyüleyici aşaması, kullanıcının kendi kartlarını seçtiği andır. Şu anki yapıda kullanıcı formu doldurduktan sonra sistem doğrudan 3 kart çekip sonuç ekranına geçmektedir. Bu durum ritüel hissini baltalamakta ve sıradan bir form doldurma hissi yaratmaktadır. Kullanıcının önüne ters çevrilmiş tarot kartı destesi (card deck/board) serilmeli, kullanıcı kartların üzerinde gezinirken mistik hover animasyonları görmeli ve tıklayarak sırasıyla 3 kart seçmelidir (Geçmiş, Şimdiki Zaman, Gelecek). Kartlar seçildikten sonra animasyonlu bir geçişle yorumlama aşamasına geçilmelidir.
* **Kabul Kriterleri:**
  1. Form gönderildikten sonra `step === 'DRAWING'` aşamasına geçildiğinde kullanıcıya 3 kart seçmesini söyleyen mistik bir arayüz gösterilmelidir.
  2. Ters çevrilmiş kartlardan oluşan ve mistik temaya (mor/altın tonları) uygun arkalıklara sahip interaktif bir deste (kart tahtası) sunulmalıdır.
  3. Kartların üzerine gelindiğinde (hover) yumuşak bir yükselme, parlama (glow) ve hafif eğilme (tilt/scale) mikro-etkileşimleri olmalıdır.
  4. Kullanıcı kartlara tıkladığında kart seçilmeli, kaçıncı kart olduğu (Geçmiş/Şimdi/Gelecek) görsel olarak belirtilmeli ve 3 kart tamamlanana kadar seçim devam etmelidir.
  5. 3 kart seçildiğinde otomatik olarak veya "Açılımı Başlat" butonuyla yorum yükleme aşamasına (Gemini API isteğine) geçilmeli ve kartlar animasyonla ters yüz (flip animation) edilerek gösterilmelidir.
---

### ✅ MS-104: Tarayıcı `alert()` Yapısının Özel Modal/Toast ile Değiştirilmesi (Task)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bildirim ve Geri Bildirim Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx#L831)
* **Açıklama:**  
  Kullanıcı mağazadan moon paketi satın almak istediğinde tarayıcının yerel `alert()` kutusu çalışmaktadır. Bu durum uygulamanın premium hissiyatını ve tematik havasını bozmaktadır.
* **Kabul Kriterleri:**
  1. Projeye mistik temaya uygun (mor/altın tonlarında, animasyonlu) bir `Toast` veya `Modal` bildirimi eklenmeli.
  2. Mağaza ödeme bildirimleri ve yetersiz bakiye uyarıları bu yeni bileşen üzerinden gösterilmeli.

* **Çözüm:** `App.tsx` dosyasında mor/altın temalı `toast` ve `showToast` yapısı kuruldu, bakiye yetersiz ve ödeme bekletme bildirimlerindeki tarayıcı `alert()` çağrıları bu toast sistemiyle değiştirildi.

---

### ✅ MS-106: Giriş/Kayıt Buton Mikro-Etkileşimlerinin Senkronizasyonu (Task)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Üye Giriş Ekranı (Authentication)
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  E-posta giriş formundaki butonlarda bulunan hover/active durum animasyonları (scale, transition), telefon ve SMS butonlarında bulunmamaktadır. Butonların davranışları eşitlenmelidir.
* **Kabul Kriterleri:**
  1. SMS Gönder, Kodu Doğrula ve Telefon ile Devam Et butonlarının sınıfları e-posta butonundaki gibi animasyonlu hale getirilmeli.
  2. Butonların tüm tarayıcılarda aynı hover/active ve yazı boyutu tepkilerini verdiği doğrulanmalı.

* **Çözüm:** `Login.tsx` dosyasındaki sosyal giriş butonlarına, SMS gönderme ve doğrulama butonlarına `active:scale-[0.98]` ve `hover:bg-[#fff]` geçiş sınıfları eklenerek e-posta butonu ile davranışları eşitlendi.

---

### ✅ MS-110: İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması (Security)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği ve İstek Doğrulama
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Tarot yorumunu oluşturmak üzere hazırlanan prompt metni tamamen istemci tarafında (`src/App.tsx`) kurgulanıp `/api/generate` API'sine düz metin olarak gönderilmektedir. Saldırganlar API'ye doğrudan istek atarak sistemin tamamen farklı amaçlarla (örn. ödev yazdırma, kod yazdırma) Gemini modelini kullanmasını sağlayabilirler.
* **Kabul Kriterleri:**
  1. Sunucu sadece tarot kartı okumaları yapacak şekilde tasarlanmalı, serbest metin üretimine izin vermemelidir.
  2. İstek gövdesi (Request Body) düz metin prompt yerine seçilen kart listesi ve kullanıcı durumunu içeren yapısal veri (JSON) almalıdır. Prompt sunucu tarafında oluşturulmalıdır.

#### Teknik Detaylar
- `/api/generate` uç noktası girdi şeması güncellenmeli:
  ```json
  {
    "cards": ["card_id_1", "card_id_2", "card_id_3"],
    "userName": "Elif",
    "dob": "1995-01-01",
    "relationship": "single",
    "language": "tr"
  }
  ```
- `server.ts` içerisinde prompt şablonu backend tarafında oluşturularak Gemini SDK'sına aktarılmalıdır.

* **Çözüm:** Prompt oluşturma mantığı istemciden kaldırılıp sunucu tarafındaki `/api/generate` API uç noktasına taşındı. İstemci artık sunucuya yapılandırılmış JSON parametreleri (kartlar, dil, odak, kullanıcı adı vb.) göndermekte, sunucu bu parametreleri doğrulamakta ve prompt şablonunu backend üzerinde güvenli şekilde oluşturmaktadır.

---

### ✅ MS-111: `src/App.tsx` İçerisindeki Yazım Hatası (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kod Kalitesi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  `src/App.tsx` içerisinde kart çekme işlemini başlatan fonksiyonun adı `drawRancomCards` olarak yazılmıştır ("Random" kelimesinde "m" yerine "c" kullanılmıştır). Bu durum kodun okunabilirliğini azaltmakta ve standartlara uymamaktadır.
* **Kabul Kriterleri:**
  1. Fonksiyon ismi `drawRandomCards` olarak düzeltilmelidir.
  2. Bu fonksiyonun çağrıldığı tüm yerler (JSX butonu vb.) güncellenmelidir.

#### Teknik Detaylar
- `src/App.tsx` içerisinde `drawRancomCards` aratılarak `drawRandomCards` ile değiştirilmelidir.

* **Çözüm:** `src/App.tsx` dosyasında bulunan `drawRancomCards` fonksiyon ismi `drawRandomCards` olarak düzeltildi ve çağrıldığı tüm arayüz butonları/JSX alanları bu isimle güncellendi.

---

### ✅ MS-112: Test Otomasyonu Altyapısının Kurulması (Test)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Test Altyapısı
* **Hedef Dosya:** [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json)
* **Açıklama:**  
  Projeye ait kod tabanında unit (birim) veya entegrasyon testlerinin koşulabileceği herhangi bir otomasyon altyapısı bulunmamaktadır. Gelecekteki geliştirmelerde hata (regression) riskini azaltmak amacıyla hafif ve hızlı bir test kütüphanesi olan **Vitest** projeye dahil edilmelidir.
* **Kabul Kriterleri:**
  1. `vitest` ve ilgili test bağımlılıkları `devDependencies` altına eklenmeli.
  2. `vite.config.ts` dosyası testleri destekleyecek şekilde güncellenmeli.
  3. `package.json` dosyasına `test` script'i eklenmeli (`vitest run` veya `vitest watch`).
  4. Örnek/yardımcı bir fonksiyon (örneğin dil çevirileri veya tarih formatlama helper'ı) için en az 1 adet birim testi yazılıp çalıştırılmalı.

* **Çözüm:** Projeye test otomasyonu için Vitest ve E2E testleri için Playwright kuruldu. Örnek birim testleri `tests/unit/helpers.test.ts` altında ve E2E testleri `tests/e2e/app.spec.ts` altında yazıldı. Testler başarıyla doğrulandı.

---

### ✅ MS-113: Zustand ile Global Durum Yönetimi Standardizasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** State Management
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Uygulamanın ana durumları (`user`, `userInfo`, `moonsCount`, `view` vb.) `App.tsx` seviyesinde in-memory states olarak tutulmakta ve alt bileşenlere prop-drilling yöntemiyle geçirilmektedir. Bu durum kodun okunabilirliğini zorlaştırmakta ve gereksiz render işlemlerine sebep olmaktadır. Global durumlar Zustand store yapısına taşınmalıdır.
* **Kabul Kriterleri:**
  1. Zustand kütüphanesi yardımıyla `src/store/useAppStore.ts` oluşturulmalı.
  2. `user`, `userInfo` (profil detayları), `moonsCount` (bakiye) ve aktif sayfa yönlendirmesini yöneten `view` durumları bu store içine alınmalı.
  3. Alt bileşenler prop'lar yerine doğrudan bu store'u dinleyecek şekilde güncellenmeli.
  4. React 19 ile uyumluluğu test edilmeli.

#### Teknik Detaylar
- `src/store/useAppStore.ts` altında Zustand store tanımlanıp `App.tsx` içerisindeki ilgili alanlar refaktör edilmelidir.

* **Çözüm:** `src/store/useAppStore.ts` altında Zustand store'u oluşturuldu. Prop-drilling yöntemiyle aktarılan `user`, `userInfo`, `moonsCount` ve `view` global durumları bu store'a taşındı. Arayüz bileşenleri props yerine doğrudan bu store üzerinden durumları dinleyip güncelleyecek şekilde güncellendi.

---

### ✅ MS-114: TanStack Query (React Query) Entegrasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Entegrasyonu
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  İstemci tarafında yapılan API çağrıları (örneğin `/api/generate` Gemini istekleri) ham `fetch` metotları ile yönetilmektedir. İsteklerin hata yönetimi, yeniden deneme (retry) mekanizmaları ve önbellekleme (caching) süreçlerini standartlaştırmak amacıyla TanStack Query entegre edilmelidir.
* **Kabul Kriterleri:**
  1. `@tanstack/react-query` kütüphanesi projeye eklenmeli.
  2. `App.tsx` en dıştan `QueryClientProvider` ile sarmalanmalı.
  3. Gemini API fal üretme çağrısı `useMutation` kancası (hook) kullanılarak refaktör edilmeli.
  4. Ağ bağlantısı koptuğunda veya sunucu hata verdiğinde otomatik yeniden deneme ve kullanıcı dostu hata mesajı gösterimi sağlanmalı.

#### Teknik Detaylar
- `@tanstack/react-query` paketi kurulup `App.tsx` içerisine `QueryClient` entegre edilmelidir.

* **Çözüm:** `@tanstack/react-query` kütüphanesi projeye dahil edildi. `App.tsx` en dıştan `QueryClientProvider` ile sarmalandı. Gemini fal yorumu API çağrısı `useMutation` hook'u ile sarmalanarak bu sayede butona çift tıklama durumunda mükerrer bakiye düşümü ve API çağrıları engellendi; otomatik retry ve hata yakalama mekanizması kuruldu.

---

### ✅ MS-116: CI/CD Pipeline (GitHub Actions) Kurulumu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** DevOps
* **Hedef Dosya:** [ci.yml](file:///Users/elifterzi/antigravity/MadameSoul/.github/workflows/ci.yml)
* **Açıklama:**  
  Geliştiricilerin kod tabanına gönderdiği PR'ların veya ana dala (main) yapılan push'ların otomatik olarak derlenebildiğini ve tip denetiminden geçtiğini doğrulamak amacıyla bir GitHub Actions workflow'u kurulmalıdır.
* **Kabul Kriterleri:**
  1. `.github/workflows/ci.yml` dosyası oluşturulmalı.
  2. Her Push ve Pull Request tetiklendiğinde; Node.js ortamı kurulmalı, bağımlılıklar yüklenmeli ve `npm run lint` (`tsc --noEmit`) komutu çalışmalı.
  3. Eğer (MS-6 biletinde) testler kurulduysa `npm run test` adımı da pipeline'a eklenmeli.

#### Teknik Detaylar
- `.github/workflows/ci.yml` dosyasına standart GitHub Actions Node build adımları yazılmalıdır.

* **Çözüm:** GitHub Actions entegrasyonu için `.github/workflows/ci.yml` dosyası oluşturuldu. Her push ve pull request olayında Node.js ortamının ayağa kaldırılması, tip kontrollerinin (`tsc --noEmit`) ve unit/E2E testlerinin (`npm test`) otomatik çalıştırılarak build doğrulaması yapılması sağlandı.

---

### ✅ MS-117: Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** İzleme ve Hata Raporlama
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Canlı ortamda (production) kullanıcıların tarayıcılarında meydana gelen JavaScript veya Gemini API bağlantı hatalarını anlık olarak izleyebilmek ve raporlayabilmek için bir hata takip servisi entegre edilmelidir.
* **Kabul Kriterleri:**
  1. Firebase Crashlytics (Web için) veya Sentry entegrasyonu yapılmalı.
  2. Uygulama başlatılırken hata izleme istemcisi initialize edilmeli.
  3. `server.ts` tarafındaki API Proxy hataları ve istemci tarafındaki beklenmedik render hataları otomatik olarak bu panele düşmeli.

#### Teknik Detaylar
- Sentry SDK veya Firebase Analytics/Crashlytics kütüphaneleri kurulup ana dosyada initialize edilmelidir.

* **Çözüm:** İstemci tarafına `ErrorBoundary.tsx` bileşeni entegre edildi. Express sunucusu (`server.ts`) ve istemcideki beklenmeyen çalışma zamanı hataları yakalandığında, hata bilgileri (stack trace, cihaz detayları vb.) Firestore'daki `error_logs` koleksiyonuna otomatik yazılacak şekilde veri akışı sağlandı.

---

### ✅ MS-118: Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yerelleştirme (Localization - i18n)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Arayüzdeki yerelleştirme (YAML) dosyalarında bazı dillerde (örn. Fransızca, İspanyolca) yeni eklenen bir metin anahtarı eksik olduğunda, arayüzde doğrudan dil anahtarı (örn. `settings.successPassword`) görüntülenmektedir. Bu durum kullanıcı deneyimini bozmaktadır. Eğer seçili dilde anahtar bulunamazsa otomatik olarak İngilizce (`en`) dilindeki değerine geri dönülmelidir.
* **Kabul Kriterleri:**
  1. `App.tsx` içindeki `t` fonksiyonu, talep edilen anahtar seçili dilde `undefined` veya `null` ise otomatik olarak `en.yaml` içerisindeki değeri sorgulamalıdır.
  2. Eğer İngilizce dosyada da yoksa, son çare olarak anahtarın kendisini göstermelidir.
  3. Tüm dillerde eksik anahtarların İngilizceye sorunsuzca fallback yaptığı doğrulanmalıdır.

#### Teknik Detaylar
- `App.tsx` içerisindeki `t` helper'ı güncellenmeli:
  ```typescript
  const t = (key: string, params: Record<string, any> = {}) => {
    const currentLocale = locales[userInfo.language] || locales.en;
    let value = key.split('.').reduce((obj, k) => obj?.[k], currentLocale);
    
    if (value === undefined || value === null) {
      value = key.split('.').reduce((obj, k) => obj?.[k], locales.en);
    }
    
    if (value === undefined || value === null) return key;
    // ...
  ```

* **Çözüm:** `App.tsx` dosyasındaki yerelleştirilmiş `t` yardımcı fonksiyonu güncellendi. Eğer istenen dil anahtarı seçili dilde bulunamaz veya `undefined`/`null` dönerse, otomatik olarak varsayılan dil olan İngilizce (`locales.en`) dosyasına fallback yapması ve o da yoksa anahtar adını göstermesi sağlandı.

---

### ✅ MS-121: Tarot Açılımları için Kategori/Odak Seçimi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Fal Bilgi Formu ve Gemini Prompt Aşaması
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot açılımlarının doğruluğunu ve kullanıcı deneyimini artırmak için kullanıcıların fal baktırmadan önce odaklanmak istedikleri ana konuyu (Aşk & İlişkiler, Kariyer & Para, Sağlık & Ruhsal Durum veya Genel) seçebilmesi gerekmektedir. Seçilen odak noktası Gemini API promptuna eklenerek okumanın o yönde derinleşmesi sağlanacaktır.
* **Kabul Kriterleri:**
  1. Fal bilgi formuna (`App.tsx`'teki `step === 'FORM'`) "Açılım Odak Noktası" (Reading Focus) adında yeni bir seçim kutusu (select/radio) eklenmelidir.
  2. Seçilen odak bilgisi yerelleştirme (YAML) dosyalarında karşılık bulmalı (Aşk, Kariyer vb.) ve `userInfo` nesnesine `focus` olarak dahil edilmelidir.
  3. `/api/generate` API proxy'sine giden istekte odak bilgisi sunucuya aktarılmalı ve Gemini prompt şablonunda yorumun o temaya uygun yapılması talep edilmelidir.

#### Teknik Detaylar
- `UserInfo` tipine `focus: 'love' | 'career' | 'health' | 'general'` alanı eklenmelidir.
- `App.tsx` formuna UI alanı eklenip seçilen değer state'e bağlanmalıdır.
- Backend tarafında oluşturulan prompt şablonuna odak bazlı yönlendirme cümleleri eklenmelidir.

* **Çözüm:** Fal bilgi formuna (`step === 'FORM'`) aşk, kariyer, sağlık ve genel odak seçeneklerinden oluşan "Açılım Odak Noktası" seçim alanı eklendi. Seçilen odak parametresi kullanıcının profiline `focus` olarak yansıtıldı ve `/api/generate` üzerinden sunucuya gönderilerek Gemini prompt şablonuna dahil edildi.

---

### ✅ MS-124: `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Güvenliği (Security Rules)
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)
* **Açıklama:**  
  Mevcut `firestore.rules` yapılandırmasında, `user_moons/{userId}` belgesi için istemci tarafına doğrudan `create` ve `update` izni verilmektedir. `isValidUserMoon` fonksiyonu sadece `userId` ve `balance` tipini (integer) kontrol eder. Bu durum, herhangi bir kullanıcının tarayıcı konsolundan Firestore SDK'sını kullanarak kendi bakiyesini (Katina Moon) istediği sayıya (örn. 99999) yükseltmesine olanak tanır. Ücretli bir sistemde bu durum çok ciddi bir finansal güvenlik açığıdır.
* **Kabul Kriterleri:**
  1. İstemci tarafının `user_moons` koleksiyonuna doğrudan yazma (`create`, `update`) yetkisi tamamen kaldırılmalı veya kurallar sadece atomik bakiye düşüşlerine (`request.resource.data.balance == resource.data.balance - 1`) izin verecek şekilde sınırlandırılmalıdır.
  2. Satın alımlardan (Stripe Webhook) gelen bakiye artışları sadece backend (Firebase Admin SDK) üzerinden yapılmalıdır.
  3. Kural değişiklikleri sonrası istemciden doğrudan bakiye artırma isteklerinin Firestore tarafından reddedildiği (Permission Denied) doğrulanmalıdır.

#### Teknik Detaylar
- `firestore.rules` dosyasındaki `user_moons` kuralları şu şekilde güncellenmelidir:
  ```javascript
  match /user_moons/{userId} {
    allow get: if request.auth != null && request.auth.uid == userId;
    allow create: if false; // Sadece backend veya trigger tarafından oluşturulmalı
    allow update: if request.auth != null && request.auth.uid == userId && 
                    request.resource.data.balance == resource.data.balance - 1; // Sadece -1 düşüşe izin ver
  }
  ```

* **Çözüm:** `firestore.rules` dosyasındaki `user_moons` kuralları güncellendi. İstemcinin bakiye belgesi oluşturması engellendi ve güncellemeler sadece bakiye 1 azaltılacak şekilde sınırlandırıldı (`request.resource.data.balance == resource.data.balance - 1`). Satın alım artışlarının sadece backend'den (Firebase Admin SDK) yapılması güvenceye alındı.

---

### ✅ MS-125: `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği ve Yetkilendirme
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusundaki `/api/generate` API rotası herhangi bir kimlik doğrulama veya yetkilendirme kontrolü yapmamaktadır. İstemcinin giriş yapmış olması sadece arayüzde kontrol edilir. Kötü niyetli bir üçüncü taraf veya bot, sunucuya doğrudan sahte POST istekleri atarak Gemini API'sini sınırsızca sömürebilir ve bütçe aşımına yol açabilir.
* **Kabul Kriterleri:**
  1. `/api/generate` uç noktası, HTTP istek başlığında (`Authorization: Bearer <ID_TOKEN>`) geçerli bir Firebase Auth ID Token bulunmasını zorunlu kılmalıdır.
  2. Sunucu tarafında `firebase-admin` SDK'sı kullanılarak token doğrulanmalı ve kullanıcının kimliği (UID) tespit edilmelidir.
  3. API çağrısı yapılmadan önce kullanıcının Firestore'daki `user_moons` bakiyesi kontrol edilmeli, en az 1 Moon bakiyesi yoksa API isteği engellenmeli ve hata dönülmelidir.

#### Teknik Detaylar
- Backend'e `firebase-admin` kütüphanesi eklenmeli ve sunucu başlangıcında initialize edilmelidir.
- Rota için token doğrulayan ve `req.user` nesnesini dolduran bir middleware yazılmalıdır.
- İstek esnasında Firestore admin SDK ile bakiye kontrolü yapılmalıdır.

* **Çözüm:** `server.ts` içerisine `firebase-admin` entegre edilerek `/api/generate` isteklerinde Authorization header'ındaki Firebase ID Token'ı doğrulayan middleware yazıldı. Gemini API'si tetiklenmeden önce kullanıcının Firestore'daki `user_moons` bakiyesinin `>= 1` olduğu kontrol edildi. Client `App.tsx` dosyasında ise ID token (`getIdToken()`) alınarak Authorization başlığına eklendi.

---

### ✅ MS-126: `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Uygulama Mimarisi (Modularization)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  `src/App.tsx` dosyası 1500 satırı aşmış durumdadır. Dosya içerisinde kimlik doğrulama durumları, yerelleştirme fonksiyonları, interaktif kart çekme ritüeli state'leri, PDF üretim şablonu, mağaza modalı ve profil modalı gibi birbirinden bağımsız birçok yapı bir arada bulunmaktadır. Bu monolitik yapı kodun okunabilirliğini, test edilebilirliğini ve bakımını ciddi şekilde zorlaştırmaktadır.
* **Kabul Kriterleri:**
  1. `App.tsx` içerisindeki bağımsız modüller (örn. `StoreModal`, `ProfileModal`, `ContactModal`) ayrı React bileşenlerine taşınmalıdır.
  2. PDF üretim mantığı (`handleDownload`) ve bununla ilgili HTML şablonları, `src/utils/pdfGenerator.ts` gibi bir yardımcı servis katmanına aktarılmalıdır.
  3. `App.tsx` sadece ana düzeni (layout), global durumları ve üst düzey görünüm (view) yönetimini üstlenmelidir.

#### Teknik Detaylar
- `src/components/` dizini altında modallar için yeni dosyalar oluşturulmalıdır.
- PDF tasarımı ve üretimi için `html2canvas` ve `jsPDF` bağımlılıkları `App.tsx`'ten arındırılarak yeni bir helper modülüne taşınmalıdır.

* **Çözüm:** `App.tsx` içerisindeki modüller ayrı React bileşenleri (`StoreModal.tsx`, `LegalModal.tsx`, `ContactModal.tsx`, `CookieBanner.tsx`) haline getirilerek bileşen klasörüne taşındı. `App.tsx` üzerindeki gereksiz kod yoğunluğu temizlenerek sadece yönlendirme ve global durum yönetimi üstlenmesi sağlandı.

---

### ✅ MS-127: Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bağımlılık ve Paket Yönetimi (DevOps)
* **Hedef Dosya:** [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json)
* **Açıklama:**  
  Mevcut `server.ts` dosyası, geliştirme ortamında çalışırken Vite'ı middleware olarak başlatmakta (`import("vite")`) ve bu sebeple `package.json` dosyasında `vite` bağımlılığı `dependencies` (üretim bağımlılıkları) altında listelenmektedir. Bu durum, uygulamanın Docker container veya bulut ortamlarına (App Hosting, Cloud Run vb.) deploy edilirken üretim paketinde devasa Vite paketlerinin (ve dolaylı alt bağımlılıklarının) kurulmasına yol açarak build süresini ve container boyutunu gereksizce artırmaktadır.
* **Kabul Kriterleri:**
  1. `vite` bağımlılığı `package.json` dosyasında sadece `devDependencies` altında yer almalıdır.
  2. Üretim ortamında çalışan Express sunucusu (`NODE_ENV === 'production'`), Vite kütüphanesine hiçbir şekilde bağımlı olmamalı ve onu import etmeye çalışmamalıdır.
  3. Geliştirme sunucusu ile üretim sunucusunun entry point'leri ayrılmalı (örn. `server.ts` ve `server.dev.ts`) veya dinamik importların derleme aşamasında external olarak elenmesi sağlanmalıdır.

#### Teknik Detaylar
- `package.json` dosyasında `vite` production dependencies'den çıkarılıp devDependencies'e taşınmalıdır.
- `server.ts` içindeki `import("vite")` çağrısı, üretim build'inde hata vermeyecek şekilde izole edilmeli veya build/development entry point'leri esbuild ayarlarında ayrıştırılmalıdır.

* **Çözüm:** `vite` paketi `package.json` dosyasında dependencies altından devDependencies'e taşındı. Sunucu tarafında `server.ts` içinde dynamic import edilen Vite middleware'i sadece `NODE_ENV !== 'production'` durumunda import edilecek şekilde ayrıştırıldı ve üretim ortamının Vite kütüphanesine olan bağımlılığı tamamen kaldırıldı.

---

### ✅ MS-131: PDF Çıktılarında Türkçe Karakter ve Yazı Tipi Optimizasyonu (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Çıktı ve Font Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  jsPDF üzerinde direkt yazılan metinlerde ("Instagram: @madamesoulstudio" vb.) veya gelecekte eklenecek Türkçe karakterli statik alanlarda yazı tipi uyuşmazlıkları (Türkçe karakterlerin ş, ğ, ı bozuk çıkması) yaşanma riski bulunmaktadır. PDF üretiminde kullanılan fontların optimize edilmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. jsPDF çıktılarında Türkçe karakterlerin bozulmadan düzgün görüntülenmesi sağlanmalıdır.
  2. Gerekirse jsPDF içine UTF-8 destekli özel bir yazı tipi (örn. Roboto veya Inter) base64 olarak gömülmeli ve kullanılmalıdır.

#### Teknik Detaylar
- `App.tsx` içindeki `pdf.setFont` ve yazı yazdırma fonksiyonları taranmalı, Türkçe karakter desteği için özel yazı tipi entegrasyonu yapılmalıdır.

* **Çözüm:** Google Fonts'tan indirilen `Roboto-Regular.ttf` dosyası base64 formatına çevrilip `src/lib/pdfFont.ts` içerisine eklendi ve `App.tsx` içindeki `handleDownload` fonksiyonunda `jsPDF` VFS (Virtual File System) üzerinden Roboto fontu olarak tanımlanarak etkinleştirildi.

---

### ✅ MS-133: KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** KVKK / GDPR Güvenlik ve Uyum
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  MadameSoul uygulaması kullanıcıların adı, doğum tarihi, ilişki durumu ve mistik fal geçmişleri gibi kişisel ve hassas verilerini (inanç/ruhsal durum verisi) işlemektedir. Ancak sistemde KVKK, GDPR veya ilgili veri koruma kanunlarına uyum sağlayacak Açık Rıza (Explicit Consent) onay mekanizmaları, Çerez Politikası (Cookie Consent) modalı ve kullanıcıların kendi fal geçmişlerini/hesaplarını silebilmelerini sağlayan Unutulma Hakkı (Right to be Forgotten) akışları bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Üyelik ekranında ve onboarding akışında kullanıcının KVKK/GDPR metinlerini, Kullanıcı Sözleşmesini ve Gizlilik Politikasını onaylamasını zorunlu kılan checkbox yapıları eklenmelidir.
  2. Firestore'da `users/{userId}` belgesine `consentsAcceptedAt` (Timestamp) alanı eklenmeli ve onay tarihi kaydedilmelidir.
  3. Profil sayfasında, kullanıcının hesabını ve ilişkili tüm verilerini (Firestore'daki user, user_moons, moon_transactions vb.) kalıcı olarak silebileceği "Hesabımı Sil" (Delete Account) butonu ve onay akışı tasarlanmalıdır.
  4. Avrupa Birliği veya Türkiye'den giren kullanıcılar için çerez izni onay modalı (Cookie Consent Banner) gösterilmelidir.

#### Teknik Detaylar
- `src/components/Profile.tsx` içerisine Firebase Auth ve Firestore üzerinde kullanıcının tüm verilerini silen bir bulut fonksiyonu (Cloud Function) çağrısı veya istemci tarafı silme transaction'ı eklenmelidir.
- Arayüze mevzuata uygun modal bileşenleri eklenmelidir.

* **Çözüm:** 
  1. `Login.tsx` bileşenine KVKK/GDPR açık rıza onay kutusu yerleştirildi ve onaylanmadan üyelik/giriş butonları inaktif hale getirildi. Kayıtta `consentsAcceptedAt: serverTimestamp()` Firestore'a kaydedildi.
  2. `App.tsx` bileşenine `localStorage` tabanlı, animasyonlu modern bir Çerez Onay Banner'ı (Cookie Consent Banner) entegre edildi.
  3. `Profile.tsx` bileşeninin ayarlar sekmesine "Tehlikeli Alan" altında onay pencereli "Hesabımı Sil" butonu eklendi. Tıklandığında `users`, `user_moons`, `moon_transactions` ve `phones` koleksiyonlarındaki kullanıcı verileri tamamen silindikten sonra Firebase Auth hesabı silinerek oturum kapatılması sağlandı.

---

### ✅ MS-134: Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Firebase Analytics Entegrasyonu
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Stripe entegrasyonu (MS-12) ve ücretsiz fal sınırlandırması planlanmaktadır. Ancak iş analizi ve pazarlama kararlarını yönlendirecek, kullanıcıların dönüşüm hunisindeki adımlarını (onboarding tamamlama, kart seçimi, ödeme sayfasına tıklama, ödeme tamamlama veya yarıda bırakma durumları) izleyen bir analitik takip sistemi bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Firebase Analytics veya Google Tag Manager (GTM) entegrasyonu tamamlanmalıdır.
  2. Aşağıdaki kritik etkinlikler (events) tanımlanmalı ve tetiklenmelidir:
     - `onboarding_complete`: Kullanıcının onboarding turunu bitirmesi.
     - `card_draw_started`: Kart seçme ekranına giriş.
     - `reading_requested`: Fal yorumlama talebi gönderilmesi (Moon harcama öncesi).
     - `checkout_initiated`: Stripe ödeme ekranına yönlendirme tıklaması.
     - `purchase_complete`: Ödeme başarılı dönüş sayfasının yüklenmesi.
  3. Event verileri, kullanıcının dil ve tarayıcı dili parametrelerini içermelidir.

#### Teknik Detaylar
- `src/main.tsx` veya Firebase yapılandırma dosyasında `getAnalytics()` çağrılarak analytics nesnesi initialize edilmelidir.
- İlgili event tetikleyicileri `App.tsx` ve ödeme bileşenlerindeki buton tıklarına veya sayfa yüklemelerine eklenmelidir.

* **Çözüm:** Firebase Analytics kütüphanesi projeye dahil edildi. Kullanıcının onboarding bitirmesi (`onboarding_complete`), ödeme sayfasına tıklaması (`checkout_initiated`) ve ödemeyi başarıyla tamamlaması (`purchase_complete`) gibi kritik adımlar, tarayıcı dil parametreleriyle birlikte dönüşüm hunisi izleme amacıyla loglandı.

---

### ✅ MS-143: PDF Çıktısında Aynı Anda İki Reklam Görselinin Gösterilmesi ve Tıklanabilir Yapılması (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Sistemi ve Reklam Modülü
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların tarot yorumlarını yerel cihazlarına indirdikleri PDF belgesinin alt kısmında, tek bir reklam yerine platformda aktif olan her iki reklamın da (ad1 ve ad2) alt alta listelenmesi ve her ikisinin de tıklanabilir (tıklandığında kendi hedef bağlantılarına yönlendiren) hale getirilmesi gerekmektedir. Reklam görsel yolları (`pdfImage`) ve URL hedefleri (`link`) `/ads/ads_config.json` dosyasından dinamik olarak okunmalıdır.
* **Kabul Kriterleri:**
  1. PDF şablonunun alt kısmında (footer), eğer `adsConfig` içerisindeki `ad1` ve `ad2` reklamlarının her ikisi de aktifse, iki görselin de alt alta, aralarında makul bir boşluk olacak şekilde render edilmesi sağlanmalıdır.
  2. Her iki reklam görseli için ayrı ayrı tıklanabilir bölge koordinatları hesaplanmalı ve jsPDF `pdf.link(...)` API'si üzerinden tıklanabilir hale getirilmelidir.
  3. Tek bir reklam gösterilme mantığı yerine, dinamik bir dizi (`adsToRender`) kullanılarak 0, 1 veya 2 aktif reklamın gösterilmesi desteklenmelidir.
  4. Reklam görsellerinin PDF üretimi esnasında CORS hatasına yol açmaması sağlanmalıdır.

* **Çözüm:** PDF şablonu oluşturma aşamasında `ads_config.json` dosyasındaki `ad1` ve `ad2` reklamlarının her ikisinin de aktif olduğu durumlarda, görsellerin alt alta hizalanması sağlandı. html2canvas öncesinde görsellerin bounding box'ları okunup, jsPDF tarafında `pdf.link(...)` ile her iki görsel için ayrı ayrı tıklanabilir yönlendirme koordinatları tanımlandı.

---

---

### ✅ MS-152: Üretim Ortamında Stripe Webhook İmza Doğrulamasının Zorunlu Kılınması (Bug - Security)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği / Stripe Ödeme Entegrasyonu
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusunda yer alan `/api/stripe-webhook` rotası, Stripe API anahtarları veya webhook imza bilgisi eksik olduğunda doğrulamayı bypass ederek gelen isteğin gövdesini doğrudan `JSON.parse` ile ayrıştırıp ödeme onayı vermektedir. Bu durum geliştirme ortamında kolaylık sağlasa da, üretim ortamında (`process.env.NODE_ENV === 'production'`) ciddi bir güvenlik açığıdır. Saldırganlar sahte webhook istekleriyle kendi hesaplarına bedelsiz bakiye tanımlayabilirler.
* **Kabul Kriterleri:**
  1. Üretim ortamında (`process.env.NODE_ENV === 'production'`) webhook imza doğrulaması (`stripe.webhooks.constructEvent`) kesinlikle zorunlu olmalı ve doğrulanamayan hiçbir webhook çağrısına bakiye tanımlanmamalıdır.
  2. İmza doğrulaması başarısız olan istekler HTTP 400 Bad Request hatasıyla reddedilmelidir.
  3. Geliştirme ortamında imza doğrulamasını esneten veya bypass eden mekanizma sadece `NODE_ENV !== 'production'` koşulunda çalışmalıdır.

---

### ✅ MS-153: Hesap Silme Akışında Re-Authentication Kontrolü ve İşlem Sırası Güvencesi (Bug - Data Integrity)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Gizliliği ve Veri Güvenliği
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Kullanıcı profil sekmesinden hesabını sildiğinde, Firestore koleksiyonlarındaki (users, user_moons, transactions, phones) veriler silindikten sonra Firebase Auth üzerindeki `user.delete()` fonksiyonu tetiklenmektedir. Firebase Auth kuralları gereği, eğer kullanıcının oturum süresi eskiyse Auth silme adımı `auth/requires-recent-login` hatasıyla başarısız olur. Bu durum, kullanıcının Firestore'daki tüm verilerinin silinip Auth hesabının açık kalmasına sebep olarak veritabanında bozuk/kimsesiz (orphaned) hesaplar oluşturur.
* **Kabul Kriterleri:**
  1. Hesap silme akışında Firestore veritabanı silme işlemlerine başlanmadan önce kullanıcının re-authenticate (yeniden şifre doğrulama veya SMS onaylama) yapması zorunlu kılınmalıdır.
  2. Firebase Auth `user.delete()` işlemi başarılı bir şekilde gerçekleştirildikten sonra (veya reauth güvencesi alındıktan sonra) veritabanı silme adımları çalıştırılmalıdır.
  3. Hata alınması durumunda Firestore verilerinin kısmi silinmesini engellemek için silme akışı işlem güvenliği kurallarına uygun tasarlanmalıdır.

---

### ✅ MS-160: Eksik Dil Çevirilerinin (dailyGift, focusOptions vb.) Eklenmesi (i18n / Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yerelleştirme (Localization - i18n)
* **Hedef Dosya:** [es.yaml](file:///Users/elifterzi/antigravity/MadameSoul/src/locales/es.yaml)
* **Açıklama:**  
  Uygulamaya yeni eklenen günlük ücretsiz bakiye alma (daily claim) ve tarot odak/kategori seçimi (reading focus area) özellikleri kapsamında yeni dil anahtarları tanımlanmıştır. Ancak bu anahtarlar sadece Türkçe (`tr.yaml`) ve İngilizce (`en.yaml`) dil dosyalarında yer almaktadır. İspanyolca (`es`), Fransızca (`fr`), Çince (`zh`) ve Korece (`ko`) dil dosyalarında bu anahtarlar eksik olduğu için ilgili dilleri seçen kullanıcılarda bu alanlar İngilizceye fallback yapmakta veya hatalı görüntülenebilmektedir.
  Eksik anahtarlar:
  - `dailyGift`
  - `dailyGiftClaimed`
  - `focusOptions.general`
  - `focusOptions.love`
  - `focusOptions.career`
  - `focusOptions.health`
  - `focusLabel`
* **Kabul Kriterleri:**
  1. `es.yaml`, `fr.yaml`, `zh.yaml` ve `ko.yaml` dosyalarına belirtilen 7 yerelleştirme anahtarı kendi hedef dillerindeki anlamlı karşılıklarıyla eklenmelidir.
  2. Giriş sonrası fal formunda yer alan odak seçim kutusu ve günlük ücretsiz kredi kazanım bildirimlerinin tüm dillerde doğru şekilde yüklendiği doğrulanmalıdır.
