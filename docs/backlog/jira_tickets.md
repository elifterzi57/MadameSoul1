# MadameSoul Projesi - Jira İş Listesi (Backlog)

Bu belge, MadameSoul projesinde kullanıcı deneyimi, güvenlik, performans, mimari geliştirmelerini ve tamamlanan işleri koordine etmek amacıyla oluşturulmuştur.

---

## 📋 Bilet Özeti (Backlog Summary)

Toplam Bilet: **41** | Açık: **31** | Tamamlanan: **10**

### 📋 Açık Biletler (Active Backlog)
Bu biletler henüz tamamlanmamış olup, geliştirilmeyi bekleyen işlerdir.

| Bilet ID | Türü | Özet | Öncelik | Oluşturan (Reporter) | Atanan (Assignee) | Hedef Dosya |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [**MS-103**](#-ms-103) | Story | Kart Seçim Ritüelinin İnteraktif Hale Getirilmesi | En Yüksek | Sally | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-105**](#-ms-105) | Task | Onboarding Tanıtım Ekranı Slayt Görsellerinin Benzersizleştirilmesi | Düşük | Sally | Amelia | [Onboarding.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Onboarding.tsx) |
| [**MS-107**](#-ms-107) | Feature | Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı | Yüksek | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-109**](#-ms-109) | Security | `/api/generate` API Uç Noktasında Rate Limiting Eksikliği | Yüksek | Winston | Amelia | [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts) |
| [**MS-110**](#-ms-110) | Security | İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması | Orta | Winston | Amelia | [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts) |
| [**MS-111**](#-ms-111) | Code Quality | `src/App.tsx` İçerisindeki Yazım Hatası | Düşük | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-112**](#-ms-112) | Test | Test Otomasyonu Altyapısının Kurulması | Yüksek | Winston | Amelia | [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json) |
| [**MS-113**](#-ms-113) | Code Quality | Zustand ile Global Durum Yönetimi Standardizasyonu | Orta | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-114**](#-ms-114) | Code Quality | TanStack Query (React Query) Entegrasyonu | Orta | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-116**](#-ms-116) | Feature | CI/CD Pipeline (GitHub Actions) Kurulumu | Düşük | Winston | Amelia | [ci.yml](file:///Users/elifterzi/antigravity/MadameSoul/.github/workflows/ci.yml) |
| [**MS-117**](#-ms-117) | Feature | Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu | Düşük | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-118**](#-ms-118) | Code Quality | Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması | Orta | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-119**](#-ms-119) | Feature | Kampanya ve Influencer Odaklı Promosyon Kodu / Kupon Tanımlama Altyapısı | Orta | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-120**](#-ms-120) | Feature | Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği | Orta | John | Amelia | [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx) |
| [**MS-121**](#-ms-121) | Feature | Tarot Açılımları için Kategori/Odak Seçimi | Yüksek | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-123**](#-ms-123) | Feature | Tamamlanan Fal Yorumlarının E-posta ile Gönderilmesi Entegrasyonu | Düşük | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-124**](#-ms-124) | Security | `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı | Yüksek | Winston | Amelia | [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules) |
| [**MS-125**](#-ms-125) | Security | `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması | Yüksek | Winston | Amelia | [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts) |
| [**MS-126**](#-ms-126) | Feature | `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi | Orta | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-127**](#-ms-127) | Feature | Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması | Orta | Winston | Amelia | [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json) |
| [**MS-128**](#-ms-128) | Feature | Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı | Yüksek | John | Amelia | [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts) |
| [**MS-129**](#-ms-129) | Feature | Misafir (Anonim) Girişi ve Hesap Dönüşümü Altyapısı | Yüksek | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-130**](#-ms-130) | Architecture | Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı | Yüksek | Winston | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-132**](#-ms-132) | Code Quality | Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi | Düşük | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-133**](#-ms-133) | Security | KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı | Yüksek | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-134**](#-ms-134) | Feature | Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı | Orta | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-135**](#-ms-135) | Feature | Ödüllü Reklam İzleme (Rewarded Ads) ile Ücretsiz Kredi Kazanma Alternatif Gelir Modeli | Orta | John | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-136**](#-ms-136) | UX / UI | Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi | Yüksek | Sally | Amelia | [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx) |
| [**MS-137**](#-ms-137) | UX / UI | Giriş Ekranında Dil Seçimi Bileşeninin Sağ Üst Köşeye Taşınması | Orta | Sally | Amelia | [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx) |
| [**MS-140**](#-ms-140) | Feature | Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı | Orta | Winston | Amelia | [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) |
| [**MS-141**](#-ms-141) | Feature | Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı | Orta | Winston | Amelia | [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) |

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

---

## 🎫 Bilet Detayları (Ticket Details)

## 📋 Açık Bilet Detayları (Active Ticket Details)

### 🟡 MS-102: Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi (Task)

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

### 🔴 MS-103: Kart Seçim Ritüelinin İnteraktif Hale Getirilmesi (Story)

* **Öncelik:** En Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Fal Çekim Aşaması
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod tabanında, kullanıcı form bilgilerini girdikten sonra kart çekme aşaması (`DRAWING`) tamamen otomatik ve rastgele gerçekleşmekte, arka planda 3 kart seçilip doğrudan sonuç ekranına geçilmektedir. Tarot okumalarının özündeki "kartlara odaklanarak kendi kaderini seçme ritüeli" atlanmaktadır. Bu durum uygulamanın mistik, etkileşimli ve premium havasını olumsuz etkilemektedir.
* **Kabul Kriterleri:**
  1. Form gönderildikten sonra kullanıcıya kapalı duran kart destesi dairesel veya yatay bir yelpaze (spread) şeklinde sunulmalıdır.
    2. Deste üzerinde gezinildiğinde (hover) kartlar yumuşak bir yükselme ve göksel bir parlama (glow) efektiyle tepki vermelidir.
    3. Kullanıcı sırayla 3 kart seçebilmelidir. Kart seçimi yapılırken kartlar sırayla Geçmiş (1. Kart), Şimdi (2. Kart) ve Gelecek (3. Kart) yuvalarına yerleşmeli ve arkaları dönük durmalıdır.
    4. 3 kartın tamamı seçildikten sonra, mistik bir "kart açma" (flip) animasyonu tetiklenmeli ve ardından yumuşak bir sayfa geçişi ile sonuç ekranına yönlendirilmelidir.
    5. Seçim adımları boyunca kullanıcının odaklanmasını kolaylaştıracak mistik mikro-yönlendirmeler gösterilmelidir (Örn: "Geçmişin için bir kart seç...").

#### Teknik Detaylar
- `src/App.tsx` içindeki `step === 'DRAWING'` durumunda, kartların yer aldığı kapalı arkalıklı bir deste düzeni oluşturulmalıdır.
- `motion/react` kütüphanesinin layout ve exit animasyonları kullanılarak kartların seçilme ve yuvalara yerleşme hareketleri kurgulanmalıdır.
- Kullanıcı desteden kart seçtikçe `drawnCards` dizisine ilgili kartlar eklenmeli ve 3 kart tamamlandığında okuma API'sine istek gönderilmelidir.

---

### 🟡 MS-104: Tarayıcı `alert()` Yapısının Özel Modal/Toast ile Değiştirilmesi (Task)

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

### 🟢 MS-105: Onboarding Tanıtım Ekranı Slayt Görsellerinin Benzersizleştirilmesi (Task)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Tanıtım Ekranı (Intro Flow)
* **Hedef Dosya:** [Onboarding.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Onboarding.tsx)
* **Açıklama:**  
  `src/components/Onboarding.tsx` bileşeninde yer alan onboarding slayt görselleri (`slideImages` dizisi) her üç slayt için de aynı resim olan `/assets/onboarding/onboarding_1.jpg` değerini taşımaktadır. Kod tabanında dosya uzantısı `.jpg` olarak tanımlanmışken, `public/assets/onboarding` klasöründe sadece `onboarding_1.png` adında 1.7MB boyutunda tek bir resim bulunmaktadır. Bu durum hem resmin yüklenememesi (veya yanlış uzantı kullanımı) riskine yol açmakta hem de slayt geçişlerinde arka planın değişmeyerek görsel tekrara sebep olmasına neden olmaktadır.
* **Kabul Kriterleri:**
  1. Her bir onboarding slaydı için (Welcome, Discovery, Journey) mistik temaya uygun, benzersiz ve yüksek kaliteli görseller tanımlanmalıdır.
    2. Slayt geçişleri sırasında arka plan resimleri `AnimatePresence` ile yumuşakça (cross-fade) değişmelidir.
    3. Performans ve hızlı yükleme amacıyla görseller optimize edilmeli (WebP veya sıkıştırılmış JPG formatında) ve dosya boyutları makul bir seviyeye (~200-300KB) çekilmelidir.
    4. Kod içerisindeki uzantılar ile klasördeki gerçek resim uzantıları uyumlu hale getirilmelidir.

#### Teknik Detaylar
- `public/assets/onboarding/` klasörüne `onboarding_1.webp`, `onboarding_2.webp`, `onboarding_3.webp` görselleri eklenmelidir.
- `Onboarding.tsx` bileşenindeki `slideImages` dizisi bu yeni ve optimize edilmiş webp uzantılı görselleri referans alacak şekilde güncellenmelidir.

---

### 🟢 MS-106: Giriş/Kayıt Buton Mikro-Etkileşimlerinin Senkronizasyonu (Task)

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

### 🔴 MS-107: Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

#### Teknik Detaylar
- `users/{userId}` belgesine `lastDailyClaimedAt` (Timestamp) alanı eklenmelidir.
- Giriş esnasında (`App.tsx` içindeki `onAuthStateChanged` veya kullanıcı veri yükleme akışı) bu alan kontrol edilmeli ve gün farkı varsa Firestore Transaction API (`runTransaction`) kullanılarak bakiye arttırılıp tarih güncellenmelidir.

---

### 🔴 MS-109: `/api/generate` API Uç Noktasında Rate Limiting Eksikliği (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend Güvenliği
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusundaki `/api/generate` API rotası doğrudan internete açıktır ve herhangi bir hız sınırlaması (rate limit) barındırmamaktadır. Kötü niyetli bir kullanıcı veya bot, bu uç noktayı spamlayarak Gemini API kullanım ücretlerini aşırı yükseltebilir (denial-of-wallet saldırısı).
* **Kabul Kriterleri:**
  1. `/api/generate` uç noktasına istemci/IP bazında makul bir istek sınırı (örn. IP başına saatte en fazla 15 istek) getirilmelidir.
    2. Sınır aşıldığında istemciye HTTP 429 (Too Many Requests) hatası dönmelidir.

#### Teknik Detaylar
- Backend tarafına `express-rate-limit` paketi kurulmalı ve `server.ts` içerisine entegre edilmelidir.
- `/api/generate` rotasına özel rate-limiter middleware'i eklenmelidir.

---

### 🟡 MS-110: İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması (Security)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟢 MS-111: `src/App.tsx` İçerisindeki Yazım Hatası (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🔴 MS-112: Test Otomasyonu Altyapısının Kurulması (Test)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

#### Teknik Detaylar
- `npm install -D vitest` komutu çalıştırılmalıdır.
- `vite.config.ts` dosyası testleri destekleyecek şekilde güncellenmelidir.

---

### 🟡 MS-113: Zustand ile Global Durum Yönetimi Standardizasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-114: TanStack Query (React Query) Entegrasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟢 MS-116: CI/CD Pipeline (GitHub Actions) Kurulumu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟢 MS-117: Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-118: Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-119: Kampanya ve Influencer Odaklı Promosyon Kodu / Kupon Tanımlama Altyapısı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Mağaza / Bakiye Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Pazarlama kampanyaları, sosyal medya tanıtımları veya kullanıcı kazanımı hedefleri doğrultusunda, kullanıcıların mağaza panelinde promosyon kodlarını girerek ücretsiz "Katina Moon" kazanmalarını veya indirimler elde etmelerini sağlayacak bir kupon doğrulama ve bakiye ekleme altyapısına ihtiyaç vardır.
* **Kabul Kriterleri:**
  1. Mağaza modalında (`App.tsx`'deki Store Modal) veya Profil sayfasında promosyon kodu giriş alanı ve "Uygula" (Redeem) butonu bulunmalıdır.
    2. Gönderilen promosyon kodları Firestore'da `promo_codes` koleksiyonu üzerinden doğrulanmalıdır. Kodların son kullanma tarihi, kullanım limiti (maxClaims) ve her kullanıcının tek bir kodu en fazla bir kez kullanma sınırı (claimedBy) kontrol edilmelidir.
    3. Geçerli bir kod kullanıldığında, kullanıcının `user_moons` bakiyesine tanımlanan kredi eklenmeli ve `moon_transactions` tablosuna `type: 'bonus'` ve `description: 'Promo Code: [CODE_NAME]'` formatında kaydedilmelidir.

#### Teknik Detaylar
- Firestore'da `promo_codes/{codeId}` şeması tasarlanmalıdır: `{ code: string, reward: number, active: boolean, expiresAt: Timestamp, maxClaims: number, claimCount: number, claimedUsers: string[] }`.
- Kod doğrulama ve bakiye aktarımı, yarış koşulu (race conditions) ve mükerrer kullanım (double claim) risklerini önlemek için Firestore transaction yapısı ile yönetilmelidir.

---

### 🟡 MS-120: Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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
- Stripe webhook işlemi sırasında gelen `charge.succeeded` veya `invoice.payment_succeeded` olayındaki `receipt_url` ve fatura bilgileri `moon_transactions` belgesine `stripeReceiptUrl` ve `stripeInvoiceId` olarak eklenmelidir.
- `Profile.tsx` bileşeninde `type: 'buy'` olan işlemler için bu bağlantının görünür olması sağlanmalıdır.

---

### 🔴 MS-121: Tarot Açılımları için Kategori/Odak Seçimi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟢 MS-123: Tamamlanan Fal Yorumlarının E-posta ile Gönderilmesi Entegrasyonu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bildirim / E-posta Gönderim Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların tarot yorumlarını kaybetmemesi ve uygulamaya geri dönmelerini (retention) teşvik etmek amacıyla, fal yorumu başarıyla tamamlandığında kullanıcının kayıtlı e-posta adresine falın metin ve PDF halinin otomatik olarak gönderilmesi seçeneği sunulmalıdır.
* **Kabul Kriterleri:**
  1. Fal bilgi formunda veya Sonuç ekranında "Falımı e-posta ile de gönder" checkbox seçeneği sunulmalıdır.
    2. Firestore `moon_transactions` belgesinde `sendEmail: true` olan kayıtlar için arka planda bir Cloud Function veya sunucu tarafı tetikleyicisi çalışarak e-posta gönderimi yapmalıdır.
    3. Gönderilen e-posta şık ve temaya uygun (MadameSoul markalı, mor/altın renklerinde) olmalı ve ekinde falın PDF belgesini içermelidir.

#### Teknik Detaylar
- Firebase Cloud Functions altında `triggerEmail` veya Node.js tarafında `nodemailer` / SendGrid entegrasyonu kurulmalıdır.
- `App.tsx` sonuç sayfasında e-posta onay durumu kontrol edilmelidir.

---

### 🔴 MS-124: `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🔴 MS-125: `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-126: `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-127: Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🔴 MS-128: Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

#### Teknik Detaylar
- Sunucu tarafında `stripe` paketi kurulmalı ve `.env` dosyasına Stripe Secret Key ile Webhook Secret eklenmelidir.
- `server.ts` içinde `/api/create-checkout-session` ve `/api/stripe-webhook` rotaları oluşturulmalıdır. Webhook isteği Stripe imzası doğrulanarak (signature verification) işlenmelidir.

---

### 🔴 MS-129: Misafir (Anonim) Girişi ve Hesap Dönüşümü Altyapısı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş ve Auth Sistemi (Anonim Oturum)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların üye olmadan da uygulamayı gezebilmesi ve 3 kart seçebilmesi, ancak falı yorumlatmak istediklerinde kayıt olmaya yönlendirilmesi gerekmektedir. Anonim oturum sırasında seçilen kartların ve girilen bilgilerin, kayıt sonrasında yeni hesaba başarıyla aktarılması gerekmektedir (PRD FR-1.2).
* **Kabul Kriterleri:**
  1. Giriş yapılmamışsa, kullanıcı kart çekme ve bilgi formu doldurma adımlarını tamamlayabilmeli.
    2. "Yorumla" butonuna basıldığında bir üyelik/giriş modalı açılmalı ve kullanıcı kayıt olmaya yönlendirilmeli.
    3. Kayıt (Google veya E-posta) sonrasında, kullanıcının anonim oturumundaki seçili kartları ve form verileri kaybolmamalı, yeni oluşturulan kullanıcı oturumuna aktarılarak otomatik olarak fal yorumu başlatılmalıdır.

#### Teknik Detaylar
- Firebase Auth `signInAnonymously` metodu kullanılarak anonim oturum başlatılabilir.
- Kullanıcı Google veya E-posta ile kayıt olduğunda Firebase `linkWithCredential` veya istemci tarafındaki state aktarım mekanizmaları ile veriler birleştirilmelidir.

---

### 🔴 MS-130: Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı (Architecture)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

#### Teknik Detaylar
- `user_moons` koleksiyonu şemasına `dailyFreeBalance` (Integer), `lastDailyClaimedAt` (Timestamp) ve `purchasedBalance` (Integer) alanları eklenmelidir.
- Bakiye sorgulamaları ve `App.tsx` üzerindeki harcama fonksiyonu bu iki alanı ayrı ayrı denetleyecek şekilde güncellenmelidir.

---

### 🟢 MS-131: PDF Çıktılarında Türkçe Karakter ve Yazı Tipi Optimizasyonu (Code Quality)

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

### 🟢 MS-132: Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Hoş Geldin Bonusu Tanımlama
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod tabanında yeni kaydolan kullanıcılara bakiye olarak 5 Moon verilmektedir. PRD (FR-2.1) gereksinimlerine göre bu hoş geldin bonusu **1 Katina Moon** olarak güncellenmelidir.
* **Kabul Kriterleri:**
  1. Yeni kullanıcı oluşturulduğunda `user_moons` bakiye seeder'ı başlangıç değerini 5 yerine 1 yapmalıdır.
    2. `moon_transactions` kaydı da 5 yerine 1 olarak güncellenmelidir.

#### Teknik Detaylar
- `src/App.tsx` dosyasında `balance: 5` ve `amount: 5` değerleri taranıp `1` olarak güncellenmelidir.

---

### 🔴 MS-133: KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-134: Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-135: Ödüllü Reklam İzleme (Rewarded Ads) ile Ücretsiz Kredi Kazanma Alternatif Gelir Modeli (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Reklam Entegrasyonu / Alternatif Gelir
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Hiçbir şekilde ödeme yapmayan (non-paying) kullanıcı tabanından reklam geliri elde etmek ve kullanıcı bağlılığını (retention) artırmak için alternatif bir gelir modeli tasarlanmalıdır. Kullanıcılar, ödüllü bir video reklam izleyerek günlük ücretsiz haklarına ek olarak +1 Katina Moon kredisi kazanabilmelidir.
* **Kabul Kriterleri:**
  1. Bakiye yetersiz olduğunda kullanıcıya Stripe ile satın almanın yanı sıra "Reklam İzleyerek Kredi Kazan" seçeneği sunulmalıdır.
    2. Reklam başarıyla ve tamamen izlendiğinde, sunucu/istemci tarafı doğrulama ile kullanıcının bakiyesine +1 Moon eklenmelidir.
    3. Bu işlem `moon_transactions` koleksiyonuna `type: 'bonus'` ve `description: 'Rewarded Ad Reward'` açıklamasıyla kaydedilmelidir.
    4. Günlük ödüllü reklam izleme sınırı (örneğin günde en fazla 2 reklam) getirilerek suistimaller önlenmelidir.

#### Teknik Detaylar
- Google AdMob veya Unity Ads gibi web tabanlı reklam SDK entegrasyonu yapılmalıdır.
- Kullanıcının günlük reklam izleme sayısını takip etmek üzere `users/{userId}` belgesinde `dailyAdsWatchedCount` ve `lastAdWatchedAt` alanları güncellenmelidir.

---

### 🔴 MS-136: Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** 📋 Yapılacak (To Do)
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

#### Teknik Detaylar
- `src/App.tsx` içerisindeki `showOnboarding` state'inin başlangıç değeri `localStorage.getItem('onboarding_completed') !== 'true'` şeklinde kurgulanmalıdır.
- `Onboarding` bileşeninin `onComplete` prop'u tetiklendiğinde `localStorage.setItem('onboarding_completed', 'true')` değeri yazılmalıdır.

---

### 🟡 MS-137: Giriş Ekranında Dil Seçimi Bileşeninin Sağ Üst Köşeye Taşınması (UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Dil Seçimi Arayüzü
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  `src/components/Login.tsx` dosyasında dil seçim butonu tüm giriş formunun ve sosyal giriş butonlarının altında, sayfanın en altında konumlandırılmıştır. Farklı bir dil kullanan (örn. İngilizce, Fransızca, İspanyolca vb.) bir kullanıcı, uygulamayı kendi diline çevirmek için öncelikle sayfanın en altına kaydırmalı ve butonu aramalıdır. Dil seçimi gibi temel bir ayarın giriş yapmadan önce en görünür yerde (örn. sağ üst köşe) olması gerekmektedir.
* **Kabul Kriterleri:**
  1. Dil seçici bileşeni, giriş ekranının sağ üst köşesine (Floating Header tarzında) taşınmalıdır.
    2. Açılır menü (dropdown) yukarı doğru değil, aşağı doğru açılacak şekilde yeniden konumlandırılmalıdır.
    3. Dil seçimi yapıldığında arayüzdeki tüm form etiketleri ve placeholder metinleri anında güncellenmelidir.

#### Teknik Detaylar
- `Login.tsx` içerisindeki dil seçici buton ve açılır menü div yapısı, ekranın üst köşesine `absolute top-4 right-4` olacak şekilde yerleştirilmelidir.

---

### 🟡 MS-140: Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

### 🟡 MS-141: Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** 📋 Yapılacak (To Do)
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

---

## ✅ Tamamlanan Bilet Detayları (Completed Ticket Details)

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
