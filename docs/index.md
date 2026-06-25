# MadameSoul Dokümantasyon İndeksi (Documentation Index)

**Tür:** Monolith (Tek parçalı yapı)  
**Ana Dil:** TypeScript  
**Mimari Desen:** Layered / Component-Based (React Frontend + Express API Backend)  
**Son Güncelleme:** 2026-06-10  

---

## Proje Genel Bakışı (Project Overview)

MadameSoul, kullanıcılarına mistik tarot kartı açılımları (özellikle Katina kartları) ve ruhsal rehberlik sunan premium, çok dilli bir web uygulamasıdır. Kullanıcılar, ilişkisel durumları ve kişisel bilgilerine göre kart seçip özelleştirilmiş yorumlar alabilirler. Yorumlar, Google Gemini API (`gemini-3-flash-preview` modeli) kullanılarak dinamik şekilde oluşturulur. Sistem, Firebase Authentication ile güvenli giriş, Cloud Firestore ile bakiye (Moon) takibi ve geçmiş okumaları PDF olarak indirme özellikleri sunmaktadır.

---

## Hızlı Referans (Quick Reference)

- **Teknoloji Yığını:** React 19, Tailwind CSS v4, Express 4, Firebase Client SDK, Google GenAI Node SDK
- **Giriş Noktası (Entry Point):** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
- **Mimari Yapı:** Monolith (İstemci ve sunucu tek bir kod deposunda birleşiktir)
- **Veritabanı:** Cloud Firestore (Firebase)
- **Dağıtım / Çalıştırma Platformu:** Node.js (Express sunucusu derlenmiş statik React dosyalarını sunar)

---

## Üretilen Dokümantasyonlar (Generated Documentation)

### Çekirdek Belgeler
- [Proje Genel Bakışı](./project-overview.md) - Proje amacı, temel özellikleri ve genel yapısı.
- [Teknik Mimari Dokümanı](./architecture/architecture.md) - Teknik mimari detayları, veri akışları ve güvenlik yapılandırması.
- [Kaynak Kod Yapısı Analizi](./architecture/source-tree-analysis.md) - Dizin ağacı, kritik klasörler ve giriş noktaları.
- [Bileşen Envanteri](./architecture/component-inventory.md) - Kullanıcı arayüzünü (UI) oluşturan ana React bileşenleri.
- [Geliştirme Kılavuzu](./development-guide.md) - Yerel kurulum adımları, geliştirme ve derleme komutları.
- [Canlıya Geçiş ve Dağıtım Kılavuzu](./production-deployment-guide.md) - Üretim ortamına kurulum, Stripe webhook ve Firebase canlı kurulum adımları.
- [API Sözleşmeleri](./architecture/api-contracts.md) - API uç noktaları, istek/yanıt yapıları ve entegrasyonlar.
- [Veri Modelleri](./architecture/data-models.md) - Firestore koleksiyon şemaları ve güvenlik kuralları.
- [Test Rehberi](./testing.md) - Birim ve uçtan uca testlerin çalıştırılması ve izlenmesi.

---

## Mevcut Dokümantasyonlar & İş Listeleri (Existing Documentation & Backlog)

- [README.md](../README.md) - Projenin temel geliştirici tanıtımı ve gereksinimleri.
- [jira_tickets.md](./backlog/jira_tickets.md) - Tespit edilen eksikler, hatalar ve güvenlik biletleri listesi (Jira Backlog).
- [admin_tickets.md](./backlog/admin_tickets.md) - Projeden kaldırılan admin paneli geliştirmelerine ait geçmiş biletler listesi (Admin Backlog).

---

## Başlangıç (Getting Started)

### Ön Koşullar
- Node.js (v18+) ve npm yüklü olmalıdır.
- Google AI Studio üzerinden bir Gemini API anahtarı alınmış olmalıdır.
- Firebase Console üzerinde Firestore ve Authentication servisleri yapılandırılmış olmalıdır.

### Kurulum
```bash
# Bağımlılıkları yükleyin
npm install
```

### Ortam Değişkenleri
Proje kök dizininde bir `.env` dosyası oluşturun ve Gemini API anahtarınızı ekleyin:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Yerel Olarak Çalıştırma
```bash
# Geliştirme sunucusunu ve Vite arayüzünü başlatın
npm run dev
```

### Derleme (Build)
```bash
# Üretim (production) sürümünü hazırlayın
npm run build
```

---

## Yapay Zeka Destekli Geliştirme İçin (For AI-Assisted Development)

Bu dokümantasyon, AI ajanlarının kod tabanını hızla anlaması ve güvenli bir şekilde yeni özellikler eklemesi için hazırlanmıştır.

### Yeni Özellik Planlarken:

- **Sadece UI/Arayüz Değişiklikleri:**  
  → Referans belgeleri: [architecture.md](./architecture/architecture.md) ve [component-inventory.md](./architecture/component-inventory.md)
- **Sadece API/Backend Değişiklikleri:**  
  → Referans belgeleri: [architecture.md](./architecture/architecture.md), [api-contracts.md](./architecture/api-contracts.md) ve [data-models.md](./architecture/data-models.md)
- **Full-Stack (Uçtan Uca) Değişiklikler:**  
  → Referans belgeleri: Yukarıdaki tüm dokümantasyonlar.

---

_Dokümantasyon, BMAD `document-project` iş akışı kullanılarak üretilmiştir._
