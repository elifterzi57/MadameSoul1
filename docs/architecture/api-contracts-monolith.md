# API Sözleşmeleri (API Contracts)

Bu belgede, MadameSoul uygulamasının Express tabanlı backend sunucusu tarafından sunulan API uç noktaları (endpoints), veri yapıları, istemci (client) tarafındaki entegrasyonlar ve hata yönetim süreçleri detaylandırılmıştır.

## Genel Bilgiler
- **Sunucu Teknolojisi:** Node.js (Express 4)
- **Temel URL:** `http://localhost:3000` (Geliştirme aşamasında) veya üretim ortamı adresi.
- **İçerik Tipi (Content-Type):** API istekleri ve yanıtları için varsayılan olarak `application/json` kullanılır.

---

## 1. Sağlık Kontrolü Uç Noktası (Health Check)

Sunucunun ayakta olup olmadığını ve istekleri kabul edip etmediğini hızlıca doğrulamak için kullanılır. Herhangi bir kimlik doğrulama gerektirmez.

- **URL:** `/api/health`
- **Yöntem (Method):** `GET`
- **Kimlik Doğrulama (Auth):** Gerekmiyor.
- **İstek (Request):** Boş.

### Yanıt (Response)

- **Başarı Durumu (200 OK):**
```json
{
  "status": "ok"
}
```

---

## 2. Gemini İçerik Üretim Uç Noktası (Gemini Content Generation)

Kullanıcının seçtiği Katina kartları ve kişisel bilgilerine göre Gemini AI kullanarak asenkron olarak tarot okuması (yorum) oluşturur. Bu uç nokta backend üzerinden Google Gemini API ile güvenli bir şekilde iletişim kurar.

- **URL:** `/api/generate`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Zorunlu. Firebase Auth ID Token istek başlığında gönderilmelidir: `Authorization: Bearer <ID_TOKEN>`.
- **Hız Sınırı (Rate Limit):** Kullanıcı (UID) başına saatte 15 istek.
- **İstek Gövdesi (Request Body):**
```json
{
  "transactionId": "tx_xyz123",
  "cards": ["mira", "valide", "deste"],
  "userName": "Elif",
  "dob": "1990-01-01",
  "birthplace": "Istanbul",
  "relationship": "single",
  "language": "tr",
  "focus": "love"
}
```

### Yanıtlar (Responses)

- **Başarı Durumu (200 OK) - Üretim Başlatıldı (Firebase Admin Aktif):**
  İstek hemen yanıtlanır ve arka planda Gemini yorum üretimi süreci başlar.
```json
{
  "status": "pending",
  "transactionId": "tx_xyz123"
}
```

- **Başarı Durumu (200 OK) - Senkron Üretim (Yerel Geliştirme/Bypass Modu):**
```json
{
  "text": "Gemini tarafından üretilen fal yorumu metni..."
}
```

- **Hata Durumu (400 Bad Request) - Eksik Parametre veya Hatalı Kart Sayısı:**
```json
{
  "error": "Exactly 3 cards must be drawn"
}
```
veya:
```json
{
  "error": "Missing required reading details"
}
```

- **Hata Durumu (403 Forbidden) - Yetersiz Bakiye veya Kimlik Doğrulama Hatası:**
```json
{
  "error": "Not enough Katina Moons! Please purchase more."
}
```

- **Hata Durumu (500 Internal Server Error) - API Hatası:**
```json
{
  "error": "All model generation attempts failed"
}
```

---

## 3. Statik ve Yapılandırma Dosyaları (İstemci Tarafı İstekleri)

Uygulamanın statik reklam konfigürasyonunu dinamik olarak güncellemek için istemci tarafında yerel bir JSON dosyasına istek atılır.

- **URL:** `/ads/ads_config.json`
- **Yöntem (Method):** `GET`
- **Açıklama:** Uygulamadaki reklamların (reklam linkleri, görselleri, metinleri vb.) yapılandırmasını getirmek için kullanılır.
- **İstek (Request):** Boş.
- **Yanıt (Response):**
```json
{
  "ad1": {
    "enabled": true,
    "mediaType": "image",
    "mediaSrc": "/ads/reklam1.png",
    "link": "https://...",
    "sponsored": { "en": "Sponsored", "tr": "Sponsorlu" },
    "title": { "en": "Title", "tr": "Başlık" },
    "text": { "en": "Text", "tr": "Açıklama" },
    "buttonText": { "en": "Button", "tr": "Buton" }
  },
  "ad2": {
    "enabled": true,
    "mediaType": "video",
    "mediaSrc": "/ads/Govde.mp4",
    "link": "https://www.etsy.com/shop/MadameSoulStudio",
    "sponsored": { "en": "Sponsored", "tr": "Sponsorlu", "es": "Patrocinado", "fr": "Sponsorisé", "zh": "赞助", "ko": "스폰서" },
    "title": { "en": "Live Session", "tr": "Canlı Seans" },
    "text": { "en": "Visit our Etsy shop...", "tr": "Etsy mağazamızı ziyaret edin..." },
    "buttonText": { "en": "Shop on Etsy", "tr": "Etsy Mağazası" }
  }
}
```

---

## 4. Log Buffer Uç Noktası (Log Buffer Endpoint)

İstemci ve sunucu hatalarının toplu şekildeFirestore'a yazılması amacıyla tampon loglama yapar.

- **URL:** `/api/logs`
- **Yöntem (Method):** `POST`
- **İstek Gövdesi (Request Body):**
```json
{
  "logs": [
    {
      "source": "client",
      "errorCode": "auth/popup-blocked",
      "errorMessage": "Popup blocked by browser",
      "stackTrace": "...",
      "deviceMetadata": { "userAgent": "...", "os": "...", "appVersion": "..." }
    }
  ]
}
```

---

## 5. Stripe Ödeme Oturumu Uç Noktası (Stripe Checkout Session)

Kullanıcıların Katina Moon kredisi satın almak üzere Stripe Checkout sayfası yönlendirme oturumu oluşturur.

- **URL:** `/api/create-checkout-session`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Zorunlu.
- **İstek Gövdesi (Request Body):**
```json
{
  "priceId": "price_1XYZ...",
  "packAmount": 10
}
```

---

## 6. Ödeme Doğrulama Uç Noktası (Payment Verification & Fallback)

Webhook gecikmeleri durumunda istemci tarafının Stripe Checkout oturumunun başarı durumunu sorgulamasını ve bakiye yüklemesini sağlar.

- **URL:** `/api/verify-checkout-session`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Zorunlu.
- **İstek Gövdesi (Request Body):**
```json
{
  "sessionId": "cs_test_abc123"
}
```

---

## 7. Fatura & Makbuz Uç Noktaları (Stripe Receipts)

Oturum veya ödeme niyet kimliğine göre Stripe üzerinden dinamik fatura makbuzu URL'lerini döndürür.

- **URL:** `/api/payments/receipt/:sessionId` ve `/api/payments/receipt-by-intent/:paymentIntentId`
- **Yöntem (Method):** `GET`
- **Yanıt (Response):**
```json
{
  "receiptUrl": "https://stripe.com/receipt/acct_..."
}
```

---

## 8. Yönetici / Çalışan Özel İşlemleri (Admin Panel Endpoints)

Admin panelindeki sekmelerden tetiklenen özel yönetim uç noktaları.

### 📋 Manuel Ödeme Onaylama
Fiziki veya webhook dışı bekleyen Stripe oturumlarını manuel olarak onaylar, bakiyeyi ve `isPremium` statüsünü günceller.
- **URL:** `/api/admin/complete-payment`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Zorunlu (Rol: `employee` veya `admin`).
- **İstek Gövdesi (Request Body):**
```json
{
  "sessionId": "cs_test_abc123",
  "reason": "Kullanıcı dekont ibraz etti."
}
```

### 📋 Stripe Webhook Dinleyicisi Tetikleme
Geliştirme veya test ortamlarında Stripe CLI webhook dinleyicisini uzaktan başlatır/durdurur.
- **URL:** `/api/admin/stripe-listener/toggle`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Zorunlu (Rol: `admin`).
- **İstek Gövdesi (Request Body):**
```json
{
  "action": "start" // veya "stop"
}
```

---

## İstemci Entegrasyonu ve Hata Yönetimi

İstemci (`src/App.tsx`), yorum oluşturulurken sunucudan gelen yanıtı bekler:
1. **İşlem Başlatma:** İstemci, Firestore'da yeni bir `moon_transactions` kaydı oluşturur ve bu kaydın ID'sini (`txRef.id`) alır.
2. **API Çağrısı:** `/api/generate` veya `/api/generate/stream` (SSE) uç noktasına bilgileri gönderir.
3. **Kaydetme ve Güncelleme:** Akış tamamlandığında veya sunucudan başarılı yanıt geldiğinde yorum ilgili belgeye `readingText` alanı olarak kaydedilir.
4. **Hata Yakalama:** İstek başarısız olursa veya sunucudan hata dönerse, istemci hata mesajı gösterir, hata günlüğü logBuffer'a yazılır ve bakiye koruması sağlanır.
