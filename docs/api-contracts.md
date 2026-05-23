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

Kullanıcının seçtiği Katina kartları ve kişisel bilgilerine göre Gemini AI kullanarak tarot okuması (yorum) oluşturur. Bu uç nokta backend üzerinden Google Gemini API (`gemini-3-flash-preview` modeli) ile güvenli bir şekilde iletişim kurar.

- **URL:** `/api/generate`
- **Yöntem (Method):** `POST`
- **Kimlik Doğrulama (Auth):** Gerekmiyor (ancak istemci tarafında Firebase Auth üzerinden giriş yapılmış olması ve işlemlerin Firestore tarafında doğrulanması gerekir. Doğrudan API çağrısı API anahtarının gizliliği için backend üzerinden proxilenmiştir).
- **İstek Gövdesi (Request Body):**
```json
{
  "prompt": "Örnek prompt metni. Seçilen kartlar, kullanıcının bilgileri ve ilişki durumu gibi detayları içerir."
}
```

### Yanıtlar (Responses)

- **Başarı Durumu (200 OK):**
```json
{
  "text": "Gemini tarafından üretilen tarot yorumu metni..."
}
```

- **Hata Durumu (400 Bad Request) - Prompt Eksik:**
```json
{
  "error": "Prompt is required"
}
```

- **Hata Durumu (500 Internal Server Error) - API Anahtarı Yok veya API Hatası:**
```json
{
  "error": "Gemini API key is not configured. Please set it in the Secrets panel."
}
```
veya:
```json
{
  "error": "Hata mesajı detayları..."
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

## İstemci Entegrasyonu ve Hata Yönetimi

İstemci (`src/App.tsx`), yorum oluşturulurken sunucudan gelen yanıtı bekler:
1. **İşlem Başlatma:** İstemci, Firestore'da yeni bir `moon_transactions` kaydı oluşturur ve bu kaydın ID'sini (`txRef.id`) alır.
2. **API Çağrısı:** `/api/generate` uç noktasına oluşturulan prompt metnini gönderir.
3. **Kaydetme ve Güncelleme:** Sunucudan başarılı yanıt (`data.text`) geldiğinde, istemci bu yorumu ilgili `moon_transactions` belgesine `readingText` alanı olarak kaydeder.
4. **Hata Yakalama:** API isteği başarısız olursa veya sunucudan hata dönerse, istemci kullanıcıya hata mesajı (`t('errorInterrupted')`) gösterir ve işlemi sonlandırır.
