# Canlıya Geçiş ve Dağıtım Kılavuzu (Production Deployment & Go-Live Guide)

Bu kılavuz, MadameSoul projesinin yerel ortamdan üretim (production) ortamına taşınması, sunucu üzerinde ayağa kaldırılması, alan adı yönlendirmesi, Stripe entegrasyonlarının canlıya geçirilmesi ve genel canlıya geçiş kontrol listesini içerir.

---

## 1. Sunucu Altyapısı ve Gereksinimler

MadameSoul, Express.js backend ve React SPA frontend yapılarından oluşan tek parçalı (monolith) bir mimariye sahiptir. Canlı sunucu olarak Node.js (v18+) çalıştırabilen her türlü altyapı kullanılabilir:
- **Bulut Sanal Sunucuları (VPS):** AWS EC2, DigitalOcean Droplet, Google Compute Engine vb.
- **PaaS Altyapıları:** Heroku, Render, Railway, Google App Engine vb.

---

## 2. Üretim Ortam Değişkenleri (Environment Variables)

Canlı ortamda uygulamanın sağlıklı çalışması için sunucu işletim sistemine veya PaaS paneline aşağıdaki ortam değişkenlerinin girilmesi zorunludur:

| Değişken Adı | Değer / Tip | Açıklama |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Uygulamanın üretim modunda çalışmasını tetikler. |
| `PORT` | `3000` (veya sunucu portu) | Express sunucusunun dinleyeceği port. |
| `GEMINI_API_KEY` | `AIzaSy...` | Canlı kullanım limitlerine sahip resmi Google Gemini API anahtarı. |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard'dan alınan canlı gizli API anahtarı (Müşterilerden gerçek ödeme almak için). |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe canlı webhook endpoint'inin imza doğrulama anahtarı. |

---

## 3. Adım Adım Dağıtım ve Yayınlama Süreci

### Adım 1: Projenin Üretim Sürümünü Derleme
Proje kök dizininde üretim sürümü oluşturulur:
```bash
# Bağımlılıkları yükleyin
npm install --omit=dev

# Frontend ve Backend kodunu derleyin
npm run build
```
Bu işlem sonucunda:
- `dist/` klasöründe optimize edilmiş, küçültülmüş statik React frontend dosyaları oluşur.
- `dist/server.cjs` adında tek bir dosya halinde backend sunucu kodu derlenir.

### Adım 2: Firestore Güvenlik Kurallarını Deploy Etme
Güvenlik kurallarının canlı Firebase veritabanına yüklenmesi kritik bir adımdır:
```bash
npx firebase login
npx firebase deploy --only firestore:rules
```

### Adım 3: Stripe Canlı Webhook Ayarları
1. **Stripe Dashboard** (Dashboard -> Developers -> Webhooks) alanına gidin.
2. **Add Endpoint** butonuna tıklayın.
3. Canlı sunucu adresinizi ekleyin: `https://www.madamesoul.com/api/stripe-webhook`
4. Gönderilecek olayları (Events to send) seçin:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Oluşan imza doğrulama kodunu (`whsec_...`) kopyalayarak sunucudaki `STRIPE_WEBHOOK_SECRET` ortam değişkenine ekleyin.

### Adım 4: Sunucuyu PM2 veya Sistem Servisi Olarak Başlatma
Sanal sunucu üzerinde sunucunun arka planda sürekli çalışması ve hata durumunda otomatik yeniden başlaması için **PM2** kullanılması önerilir:
```bash
# PM2 global olarak yükleyin
npm install -g pm2

# Sunucuyu PM2 ile başlatın
pm2 start dist/server.cjs --name "madamesoul"

# Sunucunun sistem başlangıcında otomatik çalışmasını sağlayın
pm2 startup
pm2 save
```

---

## 4. SSL ve Alan Adı (Domain) Yönlendirme

1. **DNS Ayarları:** Alan adınızın (örn: `madamesoul.com`) A kaydını canlı sunucunuzun IP adresine yönlendirin.
2. **Nginx Reverse Proxy:** Express sunucusu doğrudan 80/443 portlarından açılmak yerine, Nginx arkasında bir ters vekil sunucu olarak çalıştırılmalıdır:
   ```nginx
   server {
       listen 80;
       server_name madamesoul.com www.madamesoul.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name madamesoul.com www.madamesoul.com;

       ssl_certificate /etc/letsencrypt/live/madamesoul.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/madamesoul.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. **SSL Sertifikası:** `certbot` kullanarak ücretsiz Let's Encrypt SSL sertifikası tanımlayın:
   ```bash
   sudo certbot --nginx -d madamesoul.com -d www.madamesoul.com
   ```

---

## 5. Canlıya Geçiş Kontrol Listesi (Go-Live Checklist)

- [ ] **Firestore Güvenlik Kuralları:** `firestore.rules` başarıyla deploy edildi mi ve kurallarda test (bypass) modları kapatıldı mı?
- [ ] **API Anahtarları:** `GEMINI_API_KEY` ve `STRIPE_SECRET_KEY` canlı (live) anahtarlarla değiştirildi mi?
- [ ] **Stripe Webhook:** Canlı webhook endpoint'i tanımlandı mı ve imza doğrulaması çalışıyor mu?
- [ ] **Dil Desteği:** `src/locales/` altındaki dil dosyaları ve çeviriler tam mı?
- [ ] **Hata Loglama:** Sunucu `/api/logs` endpoint'i üzerinden istemci ve sunucu hatalarını veritabanına sorunsuz yazabiliyor mu?
- [ ] **Otomatik Temizlik (Timeout Task):** Sunucu üzerinde bekleyen ve 10 dakikayı aşan ödemeleri iptal eden arka plan mekanizması çalışıyor mu?
- [ ] **Günlük Kredi Dağıtımı (Daily Free Claims):** Kullanıcılara her 24 saatte bir +1 Moon hediye kredi yükleyen cron görevi sorunsuz çalışıyor mu?
- [ ] **Veri Kayıpları Önlemleri:** Firebase veritabanının otomatik yedekleme (backup) planı oluşturuldu mu?
