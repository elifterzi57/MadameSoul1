# Teknik Mimari Dokümanı (Technical Architecture)

Bu belgede, MadameSoul uygulamasının istemci (frontend) ve sunucu (backend) mimarisi, veri akışları, güvenlik katmanları ve bileşenlerin etkileşimi detaylandırılmıştır.

---

## 1. Genel Mimari Yapı (High-Level Architecture)

MadameSoul, **tek parçalı (monolith)** bir mimariye sahiptir. Sistem, istemci tarafı (Single Page Application - SPA) ve sunucu tarafı (API & Proxy) olmak üzere iki ana katmandan oluşur.

```mermaid
graph TD
    Client[React SPA Frontend] <-->|HTTPS / JSON / WSS| Express[Express Node.js Server]
    Client <-->|Firebase Client SDK| Auth[Firebase Authentication]
    Client <-->|Firebase Client SDK| Firestore[Cloud Firestore Database]
    Express <-->|Secure API Calls| Gemini[Google Gemini AI API]
```

- **İstemci (React SPA):** Kullanıcı arayüzünü sunar, yerel durum yönetimini kontrol eder ve Firebase Client SDK ile doğrudan kimlik doğrulama ile veritabanı işlemlerini gerçekleştirir.
- **Sunucu (Express Node.js):** Geliştirme modunda Vite'ı bir middleware olarak çalıştırır, üretim modunda statik dosyaları sunar ve Gemini API anahtarını güvenli tutmak için bir API Proxy görevi görür.

---

## 2. İstemci Mimarisi (Frontend Architecture)

İstemci mimarisi, modern web standartları ve mistik bir kullanıcı deneyimi göz önünde bulundurularak React 19 ve TypeScript kullanılarak yapılandırılmıştır.

### 2.1 Durum Yönetimi (State Management)
Uygulamanın durum yönetimi, modern standartlara uygun olarak **Zustand** store yapısı ve **TanStack Query (React Query)** entegrasyonu ile merkezileştirilmiştir:
- **Zustand Store (`src/store/useAppStore.ts`):** Global durumları (aktif kullanıcı `user`, profil detayı `userInfo`, bakiye miktarı `moonsCount`, dil seçimi `language` ve sayfa görünümü `view` gibi) yönetir. Dil seçimi yerel tarayıcı önbelleğinde (`localStorage`) saklanarak kalıcı hale getirilir.
- **TanStack Query (`@tanstack/react-query`):** API isteklerini (özellikle tarot okuma mutasyonlarını) sarmalayarak veri getirme, mutasyon durumları (yükleniyor, hata, başarı) ve mükerrer isteklerin önlenmesi korumasını optimize eder.

### 2.2 Yerelleştirme (Localization - i18n)
Uygulama 6 dili destekler: Türkçe (`tr`), İngilizce (`en`), İspanyolca (`es`), Fransızca (`fr`), Korece (`ko`), Çince (`zh`).
- Dil dosyaları `src/locales/` klasörü altında **YAML** formatında saklanır.
- Tarayıcı dili otomatik olarak algılanır, kullanıcı dilerse manuel olarak değiştirebilir. Dil değiştiğinde YAML içeriği dinamik olarak yüklenir ve arayüz güncellenir.

### 2.3 PDF Üretim ve İndirme
Kullanıcılar tarot yorumlarını yerel cihazlarına indirebilirler:
- `html2canvas` kütüphanesi ile tarot okuma ekranının anlık görüntüsü (DOM ekran görüntüsü) yakalanır.
- `jsPDF` aracılığıyla bu görsel içerik bir PDF belgesi haline getirilerek kullanıcının cihazına indirilir. Bu işlem tamamen istemci tarafında gerçekleştiği için sunucuya ek yük bindirmez.

---

## 3. Sunucu Mimarisi (Backend Architecture)

Express 4 tabanlı sunucu, uygulamanın çalıştırılması ve harici servislerle güvenli entegrasyonu için kritik rol oynar.

### 3.1 Gemini API Proxy
En kritik sunucu görevi, Google Gemini API anahtarının güvenliğini sağlamaktır. API anahtarı istemciye gönderilmez; bunun yerine istemci backend üzerindeki `/api/generate` uç noktasına istek atar.
- Sunucu, `@google/genai` resmi Node.js SDK'sını kullanır.
- İstekler `gemini-3-flash-preview` modeline yönlendirilir.
- Sunucu tarafında hata yönetimi yapılarak istemciye temiz hata mesajları döner.

### 3.2 Geliştirme ve Üretim Modları (Vite Integration)
- **Geliştirme (Development):** Sunucu, Vite'ın `createServer` API'sini kullanarak Vite'ı bir Express middleware olarak yükler. Bu sayede frontend için ek bir geliştirme sunucusuna gerek kalmaz ve HMR (Hot Module Replacement) sunucu üzerinden çalışır.
- **Üretim (Production):** Sunucu, `dist/` dizinindeki derlenmiş statik dosyaları (`express.static`) sunar. Tüm tanımlanmayan rotalar (`*`) istemci tarafındaki yönlendirmenin çalışabilmesi için `index.html` dosyasına yönlendirilir.

---

## 4. Veri ve Güvenlik Mimarisi (Data & Security)

### 4.1 Cloud Firestore Veri Modeli
Firestore üzerinde 9 temel aktif koleksiyon bulunur:
1. **`users`:** Kullanıcının temel profili, yasal sözleşme onay durumu ve cihaz bilgisi.
2. **`user_moons`:** Kullanıcının ücretsiz ve satın alınmış sanal bakiye ("Moon") değerleri.
3. **`moon_transactions`:** Okumalar (kart seçimleri, Gemini yorumları ve transactionId dahil) ve bakiye hareketleri (refund/bonus dahil).
4. **`phones`:** SMS pazarlama ve telefon kayıtları.
5. **`messages_{lang}`:** Dile özgü iletişim formu mesajları.
6. **`marketing_consents`:** Kullanıcının pazarlama izinleri ve iletişim onayları.
7. **`checkout_attempts`:** Ödeme hunisi başlatma ve terk etme log kayıtları.
8. **`error_logs`:** Çalışma zamanında karşılaşılan sistem ve istemci hataları.
9. **`ai_telemetry`:** Gemini API istekleri için token tüketimi ve latency analiz verileri.

### 4.2 Güvenlik Kuralları (`firestore.rules`)
Veritabanı güvenliği, Firestore Security Rules aracılığıyla sunucu tarafında sıkı bir şekilde denetlenir:
- **Kullanıcı Verileri:** Bir kullanıcı yalnızca kendi `userId`'si ile eşleşen `users` ve `user_moons` belgelerini okuyabilir veya güncelleyebilir.
- **İşlemler (Transactions):** Kullanıcılar yalnızca kendi `userId`'lerine ait `moon_transactions` belgelerini okuyabilir ve oluşturabilir. `amount` ve `type` alanları gibi kritik alanlar kurallarda sıkı doğrulamalardan geçer.
- **Destek Mesajları:** Herhangi bir misafir kullanıcı `messages_{lang}` koleksiyonlarına yazma yetkisine sahiptir, ancak hiçbir kullanıcının bu mesajları okuma veya silme yetkisi yoktur (`allow read, update, delete: if false`).

### 4.3 Kimlik Doğrulama (Authentication)
Firebase Authentication üzerinden çoklu giriş yöntemleri desteklenir:
- **OAuth Sağlayıcıları:** Google Pop-up ve Apple Sign-In.
- **Klasik Yöntem:** E-posta ve şifre ile giriş.
- **SMS Kimlik Doğrulama:** ReCAPTCHA Verifier ile telefon numarası doğrulama ve SMS kodu ile giriş.

---

## 5. Paketleme ve Dağıtım Yapısı (Build & Deployment)

Uygulamanın paketlenme adımları Vite ve esbuild entegrasyonu ile otomatikleştirilmiştir.

- **Frontend Paketleme:** Vite kullanılarak frontend kodları küçültülür, optimize edilir ve `dist/` klasörüne statik varlıklar olarak çıkarılır.
- **Backend Paketleme:** `server.ts` dosyası ve bağımlılıkları `esbuild` aracılığıyla derlenerek tek bir CommonJS dosyası olan `dist/server.cjs` haline getirilir.
- **Çalıştırma:** Üretim ortamında sadece `node dist/server.cjs` komutunu çalıştırmak yeterlidir. Bu dosya hem API isteklerini karşılar hem de `dist/` altındaki frontend dosyalarını sunar.
