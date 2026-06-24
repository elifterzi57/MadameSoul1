# MadameSoul - Proje Genel Bakışı (Project Overview)

**Tarih:** 2026-06-05  
**Proje Tipi:** Web Uygulaması (web)  
**Mimari Yapı:** Monolith (React + Express)  

---

## Yönetici Özeti (Executive Summary)
MadameSoul, kullanıcılarına mistik tarot kartı açılımları (özellikle Katina kartları) ve ruhsal rehberlik sunan premium, çok dilli bir web uygulamasıdır. Kullanıcılar, ilişkisel durumları ve kişisel bilgilerine göre kart seçip özelleştirilmiş yorumlar alabilirler. Yorumlar, Google Gemini API (`gemini-3-flash-preview` modeli) kullanılarak dinamik şekilde oluşturulur. Sistem, Firebase Authentication ile güvenli giriş, Cloud Firestore ile bakiye (Moon) takibi ve geçmiş okumaları PDF olarak indirme özellikleri sunmaktadır.

---

## Proje Sınıflandırması (Project Classification)

- **Depo Türü (Repository Type):** Monolith (Tek parça kod tabanı)
- **Proje Türü:** Web Uygulaması / Full-Stack
- **Ana Dil:** TypeScript / JavaScript
- **Mimari Desen:** Layered / Component-Based (React Frontend + Express API Middleware Backend)

---

## Teknoloji Yığını Özeti (Technology Stack Summary)

| Kategori | Teknoloji | Sürüm | Kullanım Amacı / Gerekçe |
| :--- | :--- | :--- | :--- |
| **Arayüz (Frontend)** | React | `^19.0.1` | Modern, bileşen tabanlı kullanıcı arayüzü oluşturma. |
| **Durum Yönetimi** | Zustand | `^5.0.14` | Global uygulama durumu ve dil seçimi önbellek yönetimi. |
| **Sunucu Durumu / API**| TanStack Query | `^5.100.14` | API istekleri yönetimi, fal gönderme mutasyonları ve mükerrer istek koruması. |
| **Sunucu (Backend)** | Express | `^4.21.2` | API isteklerini yönetme ve istemciye proxy sağlama. |
| **Yapay Zeka (AI)** | Google GenAI SDK | `^1.29.0` | Gemini API ile yedekli model geçişli (fallback) fal üretimi. |
| **Veritabanı** | Cloud Firestore (Firebase) | `^12.13.0` | Kullanıcı profili, bakiye ve işlem kayıtlarını saklama. |
| **Kimlik Doğrulama** | Firebase Authentication | `^12.13.0` | Google, E-posta ve SMS ile giriş desteği. |
| **Stil / Tasarım** | Tailwind CSS / Motion | `^4.1.14` / `^12.23.24` | Modern stil ve akıcı mikro-animasyonlar. |
| **PDF Dışa Aktarma** | html2canvas + jsPDF | `^1.4.1` / `^4.2.1` | Tarot okumalarını yerel olarak PDF formatına dönüştürme. |
| **Derleme Araçları** | Vite + esbuild | `^6.2.3` / `^0.28.0` | Hızlı geliştirme ve sunucu kodunu paketleme. |

---

## Temel Özellikler (Key Features)

1. **Çok Dilli Altyapı:** Türkçe, İngilizce, İspanyolca, Fransızca, Korece ve Çince (TR, EN, ES, FR, KO, ZH) dillerini YAML yerelleştirme dosyaları üzerinden destekler.
2. **Giriş ve Kimlik Doğrulama:** E-posta/Şifre, Google Pop-up ve SMS Telefon doğrulama yöntemleriyle zenginleştirilmiş güvenli kimlik doğrulama ekranı.
3. **Mistik Bakiye Sistemi (Moon):** Tarot okumaları yapabilmek için "Moon" kredileri kullanılır. Hoş geldin bonusu, harcamalar ve satın alımlar Firestore üzerinde transaction bazlı olarak yönetilir.
4. **Onboarding Tanıtım Ekranı:** Uygulamayı ilk kez kullananlara yönelik premium, akıcı ve görsellerle zenginleştirilmiş tanıtım adımları.
5. **Geçmiş Okumalar ve PDF:** Kullanıcılar daha önceki tarot yorumlarını profillerinden listeleyebilir, favorileyebilir ve bunları cihazlarına PDF olarak indirebilirler.
6. **Dinamik Reklam Yönetimi:** `/ads/ads_config.json` dosyası üzerinden harici video veya görsel reklam bileşenlerini yönetme imkanı.
7. **Asenkron Fal Yorumlama ve FCM:** Gemini API istekleri asenkron olarak arka planda çalıştırılır; fal hazır olduğunda Firestore `moon_transactions` kaydı güncellenir ve Firebase Cloud Messaging (FCM) ile bildirim gönderilir.
8. **Zustand & React Query Entegrasyonu:** Performanslı durum yönetimi ve mükerrer istek koruması için modern kütüphanelerle entegre arayüz.

---

## Mimari Önemli Noktalar (Architecture Highlights)
- **API Proxy Güvenliği:** Google Gemini API anahtarının tarayıcı tarafında sızmasını önlemek amacıyla API istekleri Express backend sunucusu üzerinden proxilenir.
- **Hafif ve Performanslı Geçmiş Listeleme:** Firestore composite index oluşturma zorunluluğundan kaçınmak ve performansı artırmak adına, geçmiş işlemler istemci tarafında in-memory filtreleme ve sıralama işlemine tabi tutulur.
- **Dekoratif Katina Süslemeleri:** KatinaMoon bileşeni, SVG tabanlı göksel efektler ve özel `motion` animasyonları ile premium bir his sağlar.

---

## Geliştirici ve Çalıştırma Kılavuzu (Development Overview)

### Ön Koşullar (Prerequisites)
- **Node.js:** v18 veya üzeri sürüm.
- **Firebase Projesi:** Firestore ve Authentication servisleri aktif edilmiş bir Firebase projesi.
- **Gemini API Anahtarı:** Google AI Studio üzerinden alınmış geçerli bir API Key.

### Başlangıç (Getting Started)
1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. `.env` dosyasını oluşturun ve gerekli değerleri girin:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Uygulamayı geliştirme modunda çalıştırın:
   ```bash
   npm run dev
   ```

### Temel Komutlar (Key Commands)
- **Geliştirme Sunucusu (Dev):** `npm run dev` (sunucuyu `server.ts` üzerinden başlatır)
- **Derleme (Build):** `npm run build` (istemciyi Vite ile, backend kodunu esbuild ile derler)
- **Çalıştırma (Start):** `npm start` (derlenmiş Node sunucusunu ayağa kaldırır)

---

## Belgeler Haritası (Documentation Map)

Daha detaylı bilgi için aşağıdaki belgelere göz atabilirsiniz:
- [index.md](./index.md) - Ana dokümantasyon indeksi
- [architecture.md](./architecture.md) - Teknik mimari detayları
- [source-tree-analysis.md](./source-tree-analysis.md) - Kaynak kod klasör yapısı
- [development-guide.md](./development-guide.md) - Yerel kurulum ve geliştirme rehberi
- [api-contracts.md](./api-contracts.md) - API uç noktaları sözleşmeleri
- [data-models.md](./data-models.md) - Cloud Firestore veri modeli şeması
- [component-inventory.md](./component-inventory.md) - UI bileşenleri envanteri

---

_BMAD `document-project` iş akışı kullanılarak üretilmiştir._
