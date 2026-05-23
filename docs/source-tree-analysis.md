# MadameSoul - Kaynak Kod Yapısı Analizi (Source Tree Analysis)

**Tarih:** 2026-05-22  

---

## Genel Bakış
MadameSoul projesi, tek parçadan oluşan (monolith) bir kod yapısına sahiptir. Frontend uygulaması React tabanlıdır ve Vite ile geliştirilmiştir. Backend sunucusu ise Node.js + Express kullanmaktadır ve istemci tarafının proxy ve statik sunum ihtiyaçlarını karşılar.

---

## Tüm Dizin Yapısı (Complete Directory Structure)

```text
MadameSoul/
├── .vscode/                     # VSCode editör yapılandırmaları
├── _bmad/                       # BMAD araçları, scriptleri ve konfigürasyonları
├── docs/                        # Proje dokümantasyonu (Bu klasör)
├── public/                      # Statik varlıklar (resimler, videolar, logolar)
│   └── ads/                     # Sunucu üzerinden sunulan statik reklam materyalleri
├── src/                         # React Frontend kaynak dosyaları
│   ├── components/              # Yeniden kullanılabilir React UI bileşenleri
│   │   ├── KatinaMoon.tsx       # Animasyonlu SVG ay süslemesi
│   │   ├── Login.tsx            # Çoklu giriş ekranı bileşeni
│   │   ├── Onboarding.tsx       # Hoş geldin ve tanıtım sihirbazı
│   │   └── Profile.tsx          # Profil bilgileri ve geçmiş okumalar
│   ├── data/                    # Kart desteleri, yasal metinler vb. statik veriler
│   │   ├── deck_info.json       # Deste bilgileri
│   │   ├── katina_cards.json    # Katina kartlarının mistik anlamları ve detayları
│   │   ├── legal.ts             # Yasal sözleşme metinleri
│   │   └── legal2.txt           # Yasal ek metinler
│   ├── lib/                     # Kütüphane ve SDK konfigürasyonları
│   │   ├── firebase.ts          # Firebase İstemci SDK başlatıcı (Firestore, Auth, Analytics)
│   │   └── metadata.ts          # Cihaz, tarayıcı ve IP/Lokasyon bilgilerini toplama aracı
│   ├── locales/                 # Dil çeviri YAML dosyaları
│   │   ├── en.yaml              # İngilizce dil paketleri
│   │   ├── es.yaml              # İspanyolca dil paketleri
│   │   ├── fr.yaml              # Fransızca dil paketleri
│   │   ├── ko.yaml              # Korece dil paketleri
│   │   ├── tr.yaml              # Türkçe dil paketleri
│   │   └── zh.yaml              # Çince dil paketleri
│   ├── App.tsx                  # Ana React bileşeni (Uygulama durumları, kart seçimi, API bağlantıları)
│   ├── index.css                # Küresel CSS ve Tailwind ayarları
│   ├── main.tsx                 # İstemci tarafı giriş noktası (React bağlama)
│   └── yaml.d.ts                # YAML modülü için TypeScript tip bildirimi
├── .env                         # Geliştirme ortamı değişkenleri (API anahtarları vb.)
├── .env.example                 # Ortam değişkenleri için şablon dosya
├── .gitignore                   # Git tarafından yoksayılacak dosyalar
├── firebase-applet-config.json  # Firebase İstemci yapılandırma parametreleri
├── firebase-blueprint.json      # Firebase proje şablonu/taslağı
├── firebase.json                # Firebase barındırma ve servis ayarları
├── firestore.rules              # Cloud Firestore güvenlik ve doğrulama kuralları
├── package.json                 # Bağımlılıklar, kütüphaneler ve npm betikleri
├── package-lock.json            # npm paket kilit dosyası
├── README.md                    # Proje temel tanıtım belgesi
├── server.ts                    # Backend sunucusu giriş dosyası (Express sunucu ve Gemini API proxy)
├── tsconfig.json                # TypeScript derleme ayarları
└── vite.config.ts               # Vite yapılandırması
```

---

## Kritik Dizinler ve Açıklamaları (Critical Directories)

### `server.ts` (Dosya - Ana Giriş Noktası)
Backend uygulamasının giriş noktasıdır.
- **Amacı:** Geliştirme modunda Vite sunucusunu middleware olarak çalıştırır, üretim modunda ise derlenmiş statik dosyaları sunar.
- **Kritik Uç Nokta:** `/api/generate` rotası üzerinden Google Gemini API ile güvenli bağlantı sağlar.

### `src/` (Klasör)
Frontend uygulamasının tüm arayüz kodunu ve mantıksal katmanlarını içerir.
- **`src/App.tsx`:** Uygulamanın merkezi durum yöneticisidir (State Management). Dil seçimi, kart açılım adımları, bakiye doğrulama, API çağırma ve okumayı PDF olarak paketleme (`jspdf` + `html2canvas` ile) burada yapılır.
- **`src/components/`:** Uygulamayı oluşturan ana ekran bileşenleridir. `Login.tsx` tüm Auth (Google, Apple, Phone, Email) akışını yönetirken, `Profile.tsx` kullanıcı bilgilerinin güncellenmesini ve geçmiş okumaların Firestore'dan çekilip gösterilmesini üstlenir.
- **`src/locales/`:** Uygulamanın 6 farklı dilde çalışmasını sağlayan YAML yerelleştirme verilerini barındırır. Dil değişiklikleri dinamik olarak algılanır.
- **`src/lib/`:** Harici API'lerle (Firebase, ipapi.co) iletişim kuran altyapı araçlarını barındırır.

---

## Geliştirme Notları (Development Notes)
- Sunucu ve istemci kodlarının derlenmesi sırasıyla Vite ve esbuild tarafından yapılır. Üretim paketi oluşturulurken backend `dist/server.cjs` dosyasına paketlenir.
- Statik reklam tanımları `public/ads/ads_config.json` adresindedir ve istemci tarafından çalışma zamanında dinamik olarak çekilir.

---

_BMAD `document-project` iş akışı kullanılarak üretilmiştir._
