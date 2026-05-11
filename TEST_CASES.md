# MadameSoul Test Senaryoları

Bu belge, MadameSoul uygulamasının temel özelliklerini test etmek için hazırlanan senaryoları içerir.

## 1. Kimlik Doğrulama (Authentication)

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS1.1** | Email ve Şifre ile Kayıt | Kullanıcı başarılı bir şekilde kayıt olur ve Onboarding ekranına yönlendirilir. |
| **TS1.2** | Email ve Şifre ile Giriş | Kayıtlı kullanıcı sisteme giriş yapar. |
| **TS1.3** | Google ile Giriş | Google hesabı ile hızlıca oturum açılır. |
| **TS1.4** | Şifremi Unuttum | Kullanıcının e-postasına şifre sıfırlama bağlantısı gönderilir. |
| **TS1.5** | Çıkış Yapma | Kullanıcı oturumu güvenli bir şekilde sonlandırılır ve giriş ekranına dönülür. |
| **TS1.6** | Yanlış Şifre Denemesi | "Hatalı şifre" uyarısı kullanıcı dostu bir şekilde gösterilir. |
| **TS1.7** | Geçersiz Email Formatı | E-posta formatı yanlışsa (örn: @ yoksa) sistem hata verir ve ilerlemez. |

## 2. Kullanıcı Tanıma (Onboarding)

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS2.1** | Bilgi Formu Doldurma | Ad, Doğum Tarihi, Yer ve İlişki durumu doğru bir şekilde Firestore'a kaydedilir. |
| **TS2.2** | Dil Seçimi | Seçilen dil (TR, EN, ES, FR, ZH, KO) tüm uygulama arayüzüne anında uygulanır. |
| **TS2.3** | Eksik Bilgi Kontrolü | Formdaki zorunlu alanlar boş bırakıldığında kullanıcı uyarılır. |
| **TS2.4** | Gelecek Tarihli Doğum Günü | Doğum tarihi bugünden ileri bir tarih seçilememelidir (Validasyon). |

## 3. Fal ve AI Deneyimi

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS3.1** | Günlük Ay Claim Etme | Kullanıcı her 24 saatte bir 1 "Ay" kredisi alabilir. |
| **TS3.2** | Kart Seçimi | Kullanıcı desteden tam 3 kart seçer; 3'ten az veya çok seçime izin verilmez. |
| **TS3.3** | Fal Üretimi (Gemini) | Seçilen kartlar ve kullanıcı bilgileri kullanılarak AI tarafından mistik bir yorum üretilir. |
| **TS3.4** | Kredi Düşümü | Fal bakıldığında kullanıcının "Ay" bakiyesi 1 azalır ve işlem geçmişe kaydedilir. |
| **TS3.5** | Yetersiz Kredi Uyarısı | 0 Ay kredisi olan kullanıcı fal bakmaya çalıştığında "Ay al" uyarısı alır. |
| **TS3.6** | AI Sunucu Hatası | AI yanıt vermezse kullanıcıya "Mistik enerjiler karıştı, tekrar dene" uyarısı verilir. |

## 4. Profil ve Geçmiş Yönetimi

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS4.1** | E-posta Güncelleme | Kullanıcı e-postasını değiştirirken re-authentication (tekrar şifre sorma) adımı çalışır. |
| **TS4.2** | Şifre Değiştirme | Yeni şifre başarıyla güncellenir. |
| **TS4.3** | Geçmiş Falları Görüntüleme | Kullanıcının daha önce baktırdığı fallar tarih sırasına göre listelenir. |
| **TS4.4** | PDF İndirme | Seçilen eski fal, kart görselleri ve yorum metni ile birlikte profesyonel bir PDF olarak indirilir. |
| **TS4.5** | Kart Görsellerinin PDF'deki Kontrolü | PDF içerisinde seçilen kartların doğru resimleri (png) yüklenmiş olmalıdır. |

## 5. Paylaşım ve Sosyal

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS5.1** | Fal Metnini Kopyalama | "Kopyala" butonuna basıldığında yorum metni panoya kaydedilir. |
| **TS5.2** | Web Share API (Mobil) | Paylaş butonuna basıldığında mobil cihazda WhatsApp/Instagram paylaşım menüsü açılır. |

## 6. Uygulama Güvenliği (Firestore Rules)

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS6.1** | Başkasının Falına Erişim | Bir kullanıcı, başka bir kullanıcının `moon_transactions` verisine erişmeye çalıştığında "Permission Denied" hatası alır. |
| **TS6.2** | Kredi Hilesi (Update) | Kullanıcı kendi kredisini artırmak için doğrudan Firestore manipülasyonu yapamaz. |
| **TS6.3** | Schema Güvenliği | Firestore'a belirtilenden daha büyük (örn: 1MB metin) veri gönderilmesi kurallar gereği reddedilir. |

## 7. Duyarlılık (Responsiveness)

| Test No | Senaryo | Beklenen Sonuç |
| :--- | :--- | :--- |
| **TS7.1** | Yatay Ekran Modu (Mobil) | Telefon yatay çevrildiğinde kartlar ve butonlar erişilebilir kalır. |
| **TS7.2** | Karanlık Mod Uyumu | Uygulama gece temasında (dark-themed by default) tüm metinlerin okunabilirliğini korur. |
| **TS7.3** | Animasyon Akıcılığı | Kartların açılma ve modal pencerelerin giriş animasyonları takılmadan (smooth) çalışır. |
