# Geliştirme Kılavuzu (Development Guide)

Bu belgede, MadameSoul uygulamasını yerel bilgisayarınızda kurmak, çalıştırmak, derlemek ve yayına hazırlamak (deployment) için gereken adımlar ve teknik detaylar açıklanmıştır.

---

## 1. Ön Koşullar (Prerequisites)

Geliştirmeye başlamadan önce yerel ortamınızda aşağıdaki yazılımların kurulu olduğundan emin olun:
- **Node.js:** Sürüm 18 veya üzeri (npm sürümü v9+ önerilir).
- **Git:** Kod deposunu yönetmek için.
- **Firebase CLI:** Firestore güvenlik kurallarını deploy etmek için (Opsiyonel).
- **Gemini API Key:** Google AI Studio üzerinden alınmış aktif bir API anahtarı.

---

## 2. Ortam Değişkenleri (Environment Variables)

Projenin kök dizininde bir `.env` dosyası bulunmalıdır. Bu dosya backend sunucusunun Gemini API ile güvenli bağlantı kurmasını sağlar.

`.env` dosyanızı oluşturmak için `.env.example` dosyasını kopyalayabilirsiniz:
```bash
cp .env.example .env
```

`.env` dosyası içeriği:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> [!WARNING]
> `.env` dosyası API anahtarınızı içerdiğinden kesinlikle Git sürüm kontrol sistemine gönderilmemelidir. Bu dosya `.gitignore` içinde tanımlanmıştır.

---

## 3. Kurulum ve Çalıştırma (Installation & Running)

### Bağımlılıkları Yükleme
Proje kök dizininde terminali açın ve paketleri yükleyin:
```bash
npm install
```

### Yerel Sunucuyu Başlatma
Geliştirme sunucusunu ve Vite arayüzünü aynı anda çalıştırmak için:
```bash
npm run dev
```

Sunucu başarıyla ayağa kalktığında terminalde şu çıktıyı göreceksiniz:
```text
[Server] Starting MadameSoul server...
[Server] Development mode: loading Vite...
[Server] MadameSoul running at http://0.0.0.0:3000
```
Uygulamaya tarayıcınızdan `http://localhost:3000` adresinden erişebilirsiniz.

---

## 4. Yapı ve Derleme Betikleri (Build Scripts)

`package.json` dosyasında tanımlanan betikler (scripts) ve görevleri:

- **`npm run dev`**: Express sunucusunu `tsx` ile başlatır. Vite istemci tarafını ara katman (middleware) olarak sunucuya bağlar. Hızlı geliştirme ve Hot-Module-Replacement (HMR) sağlar.
- **`npm run build`**: Üretim (production) sürümünü hazırlar:
  1. Frontend kodunu Vite ile optimize ederek derler ve `dist/` klasörüne yazar.
  2. Backend sunucu kodunu (`server.ts`) `esbuild` aracılığıyla tek bir dosyada (`dist/server.cjs`) paketler.
- **`npm start`**: Derlenmiş üretim sunucusunu çalıştırır:
  ```bash
  node dist/server.cjs
  ```
- **`npm run clean`**: Derlenmiş `dist/` klasörünü temizler.
- **`npm run lint`**: TypeScript derleyicisi ile tip hatalarını kontrol eder.

---

## 5. Firebase Yapılandırması ve Kurallar (Firebase Configuration)

### Firebase Bağlantısı
İstemci tarafının Firebase ile iletişim kurabilmesi için gerekli yapılandırma `firebase-applet-config.json` dosyasında yer almaktadır. Yeni bir ortama taşınırken veya veritabanı değiştirilirken bu dosya güncellenmelidir.

### Firestore Güvenlik Kuralları
Veritabanı güvenliği kök dizindeki `firestore.rules` dosyası tarafından yönetilir. Kuralları veritabanına göndermek için Firebase CLI kullanabilirsiniz:
```bash
# İlk kez kullanıyorsanız giriş yapın
npx firebase login

# Kuralları yayınlayın
npx firebase deploy --only firestore:rules
```

---

## 6. Sık Yapılan Geliştirme Görevleri

### Yeni Dil Ekleme veya Çevirileri Düzenleme
Uygulama dil paketleri `src/locales/` dizinindedir. Mevcut bir çeviriyi düzeltmek veya yeni bir anahtar eklemek için dilin ilgili `.yaml` dosyasını (örn: `tr.yaml` veya `en.yaml`) düzenleyin.

### Reklamları Yapılandırma
Sponsorlu içerikler ve video reklamları dinamik olarak `public/ads/ads_config.json` üzerinden yönetilir. Reklam linklerini veya görsel/video yollarını değiştirmek için bu JSON dosyasını yerel olarak güncelleyebilirsiniz. Sunucu yeniden başlatılmadan değişiklikler anında yansır.

---

## 7. Git ve Sürüm Kontrol İş Akışı (Git Workflow)

Projede geliştirilen tüm biletler (tickets) ve özellikler (features) için aşağıdaki Git standartları uygulanmalıdır. Bu kurallara hem insan geliştiriciler hem de yapay zeka ajanları (Amelia, vb.) uymak zorundadır.

### Bilet Bazlı Dal (Branch) Oluşturma
Her Jira bileti için `main` dalından yeni bir dal oluşturulmalıdır:
- **Dal Adı Biçimi:** `ticket/MS-[ID]` (Örn: `ticket/MS-101`, `ticket/MS-124`)
- **Dal Oluşturma Komutu:**
  ```bash
  git checkout main
  git pull origin main
  git checkout -b ticket/MS-[ID]
  ```

### İşleme (Commit) Mesaj Standartları
Commit mesajları her zaman ilgili bilet ID'si ile başlamalı ve köşeli parantez içinde belirtilmelidir:
- **Biçim:** `[MS-[ID]] kısa_açıklama`
- **Örnekler:**
  - `[MS-101] Profil durum senkronizasyon hatası giderildi`
  - `[MS-124] user_moons koleksiyonu için firestore.rules yazma kısıtlaması getirildi`

### Kodu Push Etme
Geliştirme ve test adımları tamamlandıktan sonra, dalınızı uzaktaki depoya (origin) gönderin:
```bash
git push origin ticket/MS-[ID]
```
