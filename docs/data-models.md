# Veri Modelleri (Data Models)

Bu belgede, MadameSoul uygulamasının Cloud Firestore veri yapısı, koleksiyonları, alan tanımları, tipleri, veri doğrulama kuralları ve güvenlik kuralları (`firestore.rules`) kapsamında uygulanan kısıtlamalar detaylandırılmıştır.

## Genel Veritabanı Yapısı
MadameSoul veritabanı şeması **NoSQL Cloud Firestore** kullanılarak tasarlanmıştır. Veriler koleksiyonlar (collections) ve belgeler (documents) halinde tutulmaktadır.

Koleksiyon listesi:
1. `users` - Kullanıcı profili ve hesap detayları.
2. `user_moons` - Kullanıcıların kredi/coin (Moon) bakiyeleri.
3. `moon_transactions` - Harcama (okumalar) ve satın alım işlemleri.
4. `phones` - Pazarlama ve SMS takibi için telefon numarası kayıtları.
5. `messages_{lang}` - İletişim formu mesajları (Dile özgü koleksiyonlar: `messages_en`, `messages_tr` vb.)

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
| `amount` | Integer | Evet | Bakiyedeki değişim miktarı (Negatif veya pozitif tam sayı). |
| `type` | String | Evet | Alabileceği değerler: `spend` (harcama), `buy` (satın alım), `bonus`. |
| `description` | String | Evet | İşlemin açıklaması. |
| `pdfDownloaded` | Integer | Evet | Okuma PDF'inin indirilip indirilmediği: `0` veya `1`. |
| `userName` | String | Hayır | Maksimum 500 karakter. |
| `userDob` | String | Hayır | Doğum tarihi (Maksimum 100 karakter). |
| `userBirthplace` | String | Hayır | Doğum yeri (Maksimum 200 karakter). |
| `userRelationship` | String | Hayır | İlişki durumu (Maksimum 100 karakter). |
| `userLanguage` | String | Hayır | Okuma dili (Maksimum 10 karakter). |
| `selectedCards` | List | Hayır | Seçilen kartların listesi (Maksimum 10 kart). |
| `readingText` | String | Hayır | Gemini tarafından üretilen tarot okuma yorumu metni. |
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
