# Veri Modelleri (Data Models)

Bu belgede, MadameSoul uygulamasının Cloud Firestore veri yapısı, koleksiyonları, alan tanımları, tipleri, veri doğrulama kuralları ve güvenlik kuralları (`firestore.rules`) kapsamında uygulanan kısıtlamalar detaylandırılmıştır.

## Genel Veritabanı Yapısı
MadameSoul veritabanı şeması **NoSQL Cloud Firestore** kullanılarak tasarlanmıştır. Veriler koleksiyonlar (collections) ve belgeler (documents) halinde tutulmaktadır.

Koleksiyon listesi:
1. `users` - Kullanıcı profili ve hesap detayları.
2. `user_moons` - Kullanıcıların kredi/coin (Moon) bakiyeleri.
3. `moon_transactions` - Harcama (okumalar) ve satın alım işlemleri.
4. `phones` - Pazarlama ve SMS takibi için telefon numarası kayıtları.
5. `messages_{lang}` - İletişim formu mesajları (Dile özgü koleksiyonlar: `messages_en`, `messages_tr` vb.).
6. `marketing_consents` - Pazarlama onayları ve ilgi alanları.
7. `checkout_attempts` - Ödeme hunisi başlatma ve terk etme kayıtları.
8. `error_logs` - Sunucu/istemci çalışma zamanı hataları.
9. `ai_telemetry` - Yapay zeka token/latency maliyet analizi.
10. `config_logs` - [PASİF / DECOMMISSIONED] Sistem ve reklam yapılandırma değişikliklerinin takibi (MS-242 ile kaldırıldı).
11. `admin_audit_logs` - [PASİF / DECOMMISSIONED] Yönetim paneli denetim ve izlenebilirlik günlükleri (MS-242 ile kaldırıldı).

---

## 1. `users` Koleksiyonu

Kullanıcıların temel hesap bilgileri, kabul edilen yasal sözleşmeler ve cihaz/oturum meta verilerini içerir.

- **Belge ID (Document ID):** Kullanıcının Firebase Auth benzersiz ID'si (`userId` veya `uid`).
- **Güvenlik Kuralları:** Yalnızca kimliği doğrulanmış kullanıcı kendi belgesini okuyabilir, oluşturabilir veya güncelleyebilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `userId` | String | Evet | Firebase Auth UID ile eşleşmelidir. |
| `lastLogin` | Timestamp | Evet | Kullanıcının son giriş yaptığı zaman damgası. |
| `password` | String | Hayır | Maksimum 256 karakter (eğer e-posta ile kayıt yapılmışsa şifrelenmiş değer). |
| `hasAcceptedLegal` | Integer | Hayır | `0` (Kabul edilmedi) veya `1` (Kabul edildi) değerini alabilir. |
| `legalAcceptedAt` | Timestamp | Hayır | Kullanıcının yasal sözleşmeyi kabul ettiği tarih. |
| `metadata` | Map | Hayır | Tarayıcı, işletim sistemi, IP adresi ve lokasyon gibi meta veriler. |
| `providerId` | String / null | Hayır | Kimlik sağlayıcı adı (örn: `google.com`, `apple.com`, `password`, `phone`). |
| `emailVerified` | Boolean | Hayır | E-posta adresinin doğrulanıp doğrulanmadığı bilgisi. |
| `isAnonymous` | Boolean | Hayır | Kullanıcının misafir (anonim) olup olmadığı. |
| `profile` | Map | Hayır | Kullanıcının adı, soyadı, dili, cinsiyeti gibi ek profil bilgileri. |

---

## 2. `user_moons` Koleksiyonu

Kullanıcının tarot okumaları yapmak için kullanacağı sanal bakiye ("Moon") miktarını tutar.

- **Belge ID (Document ID):** Kullanıcının Firebase Auth benzersiz ID'si (`userId`).
- **Güvenlik Kuralları:** Yalnızca kimliği doğrulanmış kullanıcı kendi bakiyesini görebilir ve güncelleyebilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `userId` | String | Evet | Firebase Auth UID ile eşleşmelidir. |
| `balance` | Integer | Evet | Kullanıcının güncel kredi bakiyesi. |

---

## 3. `moon_transactions` Koleksiyonu

Kullanıcının yaptığı tüm bakiye işlemlerini (satın alma, harcama, hoş geldin bonusu) ve gerçekleştirilen tarot okumalarını (seçilen kartlar ve Gemini tarafından oluşturulan metin dahil) saklar.

- **Belge ID (Document ID):** Rastgele oluşturulan benzersiz işlem ID'si.
- **Güvenlik Kuralları:** Kullanıcılar yalnızca kendi `userId` değerleriyle eşleşen işlem belgelerini okuyabilir, oluşturabilir ve güncelleyebilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `userId` | String | Evet | Firebase Auth UID ile eşleşmelidir. |
| `transactionId` | String | Hayır | İşlem belgesinin kendi benzersiz ID'si ile eşleşen alan (izlenebilirlik için). |
| `amount` | Integer | Evet | Bakiyedeki değişim miktarı (Negatif veya pozitif tam sayı). |
| `type` | String | Evet | Alabileceği değerler: `spend` (harcama), `buy` (satın alım), `bonus`, `refund` (iade). |
| `description` | String | Evet | İşlemin açıklaması. |
| `pdfDownloaded` | Integer | Evet | Okuma PDF'inin indirilip indirilmediği: `0` veya `1`. |
| `userName` | String | Hayır | Maksimum 500 karakter. |
| `userDob` | String | Hayır | Doğum tarihi (Maksimum 100 karakter). |
| `userBirthplace` | String | Hayır | Doğum yeri (Maksimum 200 karakter). |
| `userRelationship` | String | Hayır | İlişki durumu (Maksimum 100 karakter). |
| `userLanguage` | String | Hayır | Okuma dili (Maksimum 10 karakter). |
| `selectedCards` | List | Hayır | Seçilen kartların listesi (Maksimum 10 kart). |
| `readingText` | String | Hayır | Gemini tarafından üretilen tarot okuma yorumu metni. |
| `performedBy` | String | Hayır | İşlemi gerçekleştiren çalışanın e-postası/ID'si (Yönetim paneli işlemleri için). |
| `targetUser` | String | Hayır | İşlemin uygulandığı kullanıcının adı ve e-postası. |
| `paymentProvider` | String | Evet | Ödeme/kazanım kaynağı (`stripe`, `app_store`, `google_play`, `daily_gift`, `welcome_bonus`, `admin_dusting`). |
| `idempotencyKey` | String | Evet | Mükerrer işlemleri önlemek için benzersiz anahtar. |
| `clientMetadata` | Map | Evet | İstemci cihaz/tarayıcı bilgileri (`userAgent`, `os`, `appVersion`). |
| `createdAt` | Timestamp | Evet | İşlemin oluşturulduğu zaman damgası. |

---

## 4. `phones` Koleksiyonu

SMS pazarlaması, kampanya takibi veya telefon numarası doğrulamaları için telefon bilgilerini tutar.

- **Belge ID (Document ID):** Kullanıcının telefon numarası (örn: `+90555...`).
- **Güvenlik Kuralları:** Kimliği doğrulanmış kullanıcılar tarafından güncellenebilir/yazılabilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `phoneNumber` | String | Evet | Eşsiz telefon numarası (Belge ID'si ile aynı). |
| `userId` | String | Evet | Telefon numarasının bağlı olduğu kullanıcının UID'si. |
| `lastActive` | Timestamp | Evet | Son aktiflik zaman damgası. |
| `source` | String | Evet | Kayıt kaynağı (örn: `login`). |

---

## 5. `messages_{lang}` Koleksiyonları

Uygulamadaki iletişim formu üzerinden gönderilen destek veya geri bildirim mesajlarını tutar. Dile göre ayrı koleksiyonlarda saklanır (`messages_en`, `messages_tr`, `messages_es`, `messages_fr`, `messages_zh`, `messages_ko`).

- **Belge ID (Document ID):** Rastgele oluşturulan belge ID'si.
- **Güvenlik Kuralları:** Herkes (misafirler dahil) yeni belge oluşturabilir (`create`), ancak kimsenin okumasına (`read`), güncellemesine (`update`) veya silmesine (`delete`) izin verilmez (`if false`).

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `fullName` | String | Evet | Gönderenin adı soyadı (Maksimum 100 karakter). |
| `email` | String | Evet | Gönderenin e-posta adresi (Maksimum 200 karakter). |
| `subject` | String | Evet | Mesaj konusu (Maksimum 150 karakter). |
| `message` | String | Evet | İletişim mesajı (Maksimum 2000 karakter). |
| `createdAt` | Timestamp | Evet | Mesajın oluşturulma zaman damgası (Sunucu saati ile eşleşmelidir). |

---

## 6. `marketing_consents` Koleksiyonu (Yeni - Monetizasyon & Segmentasyon)

Kullanıcıların e-posta veya SMS yoluyla pazarlama ve kampanya içerikleri alma onay durumunu ve ilgi duydukları mistik alanları saklar. Bu veri, push bildirimleri ve hedefli e-posta kampanyaları göndererek satış dönüşümlerini artırmak (para kazanmak) için kullanılır.

- **Belge ID (Document ID):** Kullanıcının Firebase Auth ID'si (`userId`).
- **Güvenlik Kuralları:** Sadece oturum açmış kullanıcı kendi belgesine erişebilir ve güncelleyebilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `userId` | String | Evet | Firebase Auth UID ile eşleşmelidir. |
| `emailConsent` | Boolean | Evet | E-posta pazarlama onay durumu (`true` veya `false`). |
| `smsConsent` | Boolean | Evet | SMS pazarlama onay durumu (`true` veya `false`). |
| `interests` | List | Hayır | İlgilendiği fal konuları listesi (örn: `['love', 'career']`). |
| `lastPromoSentAt` | Timestamp | Hayır | Son pazarlama içeriğinin gönderildiği tarih. |
| `updatedAt` | Timestamp | Evet | Güncelleme zaman damgası. |

---

## 7. `checkout_attempts` Koleksiyonu (Yeni - Ödeme Hunisi Dönüşümü)

Kullanıcıların ödeme sayfasına (Stripe Checkout) tıkladığı ancak işlemi tamamlamadığı ("cart abandonment" / ödemeden vazgeçme) durumları tespit etmek ve onlara otomatik indirim kodları göndererek satışları kurtarmak amacıyla kullanılır.

- **Belge ID (Document ID):** Stripe Checkout Session ID veya benzersiz işlem ID'si.
- **Güvenlik Kuralları:** Sadece ilgili kullanıcı ve backend yazabilir/okuyabilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `sessionId` | String | Evet | Stripe ödeme oturum ID'si (Belge ID ile aynı). |
| `userId` | String | Evet | Satın almaya çalışan kullanıcının UID'si. |
| `packAmount` | Integer | Evet | Satın alınmaya çalışılan Moon miktarı. |
| `price` | Double | Evet | Paketin fiyatı (örn: `8.99`). |
| `status` | String | Evet | Alabileceği değerler: `pending` (beklemede), `completed` (tamamlandı), `abandoned` (yarıda bırakıldı). |
| `couponOffered` | String / null | Hayır | Terk edilen ödeme sonrası sunulan kurtarma kuponu kodu. |
| `createdAt` | Timestamp | Evet | İşlemin başladığı zaman damgası. |
| `updatedAt` | Timestamp | Evet | Durumun güncellendiği zaman damgası. |

---

## 8. `error_logs` Koleksiyonu (Yeni - Sistem Sorun Giderme)

Uygulamanın hem istemci (React) hem de sunucu (Express) tarafında karşılaştığı teknik hataları (Gemini API çökmeleri, veri yazma hataları, Stripe webhook gecikmeleri) merkezi olarak saklar.

- **Belge ID (Document ID):** Rastgele oluşturulan benzersiz hata ID'si.
- **Güvenlik Kuralları:** İstemciler sadece yazabilir (`create`), okuma ve güncelleme kesinlikle engellenmiştir (`if false`).

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `userId` | String / null | Hayır | Hata anında oturum açmış kullanıcının UID'si. |
| `source` | String | Evet | Hatanın kaynağı: `client` veya `server`. |
| `errorCode` | String | Evet | Hata kodu veya hata türü (örn: `auth/popup-blocked`, `gemini/api-timeout`). |
| `errorMessage` | String | Evet | Hatanın açık mesajı. |
| `stackTrace` | String | Hayır | Hata yığını (stack trace) detayı. |
| `deviceMetadata` | Map | Hayır | Kullanıcının tarayıcı, işletim sistemi ve cihaz bilgileri. |
| `createdAt` | Timestamp | Evet | Hatanın oluştuğu zaman damgası. |

---

## 9. `ai_telemetry` Koleksiyonu (Yeni - Yapay Zeka Performans & Maliyet Takibi)

Gemini API'sine yapılan içerik üretme isteklerinin maliyetlerini kontrol etmek ve performans gecikmelerini izlemek amacıyla kullanılır.

- **Belge ID (Document ID):** Yapılan fal işleminin transaction ID'si ile eşleşen ID.
- **Güvenlik Kuralları:** Yalnızca backend (sunucu tarafı) yazabilir. İstemciler sadece okuyabilir.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `transactionId` | String | Evet | Bağlı olduğu bakiye işleminin ID'si. |
| `userId` | String | Evet | Talebi gönderen kullanıcının UID'si. |
| `modelName` | String | Evet | Kullanılan model (örn: `gemini-3-flash-preview`). |
| `promptTokens` | Integer | Evet | Girdi için harcanan token sayısı. |
| `candidatesTokens` | Integer | Evet | Gemini tarafından üretilen çıktı token sayısı. |
| `latencyMs` | Integer | Evet | API yanıt süresi (milisaniye cinsinden). |
| `createdAt` | Timestamp | Evet | Talebin işlendiği tarih. |

---

## 10. `config_logs` Koleksiyonu [PASİF / DECOMMISSIONED] (MS-242 ile kaldırıldı)

Yönetim panelinin kaldırılmasıyla birlikte bu koleksiyon kullanımdan kaldırılmıştır. Eski sistemde sistem veya arayüz konfigürasyonlarının ne zaman, kimin tarafından ve ne şekilde değiştirildiğini takip etmekteydi.

- **Belge ID (Document ID):** Rastgele oluşturulan benzersiz log ID'si.
- **Güvenlik Kuralları:** Deaktif.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `performedBy` | String | Evet | Değişikliği gerçekleştiren çalışanın e-posta adresi. |
| `changedSetting` | String | Evet | Güncellenen ayarın adı. |
| `oldValue` | String | Evet | Ayarın güncelleme öncesindeki eski değeri (JSON formatında dizge). |
| `newValue` | String | Evet | Ayarın güncelleme sonrasındaki yeni değeri (JSON formatında dizge). |
| `createdAt` | Timestamp | Evet | Güncellemenin yapıldığı zaman damgası. |

---

## 11. `admin_audit_logs` Koleksiyonu [PASİF / DECOMMISSIONED] (MS-242 ile kaldırıldı)

Yönetim panelinin kaldırılmasıyla birlikte bu koleksiyon kullanımdan kaldırılmıştır. Eski sistemde bakiye düzenlemeleri, rol atamaları ve konfigürasyon güncellemeleri gibi kritik işlemleri denetim (audit) amacıyla saklamaktı.

- **Belge ID (Document ID):** Rastgele oluşturulan benzersiz log ID'si.
- **Güvenlik Kuralları:** Deaktif.

### Şema (Schema)

| Alan Adı (Field) | Tip (Type) | Zorunlu (Req) | Açıklama / Kısıtlama |
| :--- | :--- | :--- | :--- |
| `operatorUid` | String | Evet | İşlemi yapan çalışanın Firebase Auth UID'si. |
| `operatorEmail` | String | Evet | İşlemi yapan çalışanın e-posta adresi. |
| `targetUid` | String / null | Hayır | İşlemden etkilenen kullanıcının UID'si (örn. bakiye düzenlenen kullanıcı). |
| `actionType` | String | Evet | İşlem türü: `credit_dusting`, `role_change`, `system_config_update`, `ui_config_update`. |
| `details` | Map | Evet | İşleme dair detaylar (örn. miktar, eski ve yeni rol, eski/yeni ayarlar). |
| `timestamp` | Timestamp | Evet | İşlemin gerçekleştirildiği sunucu zaman damgası. |





