# MadameSoul Projesi - Jira İş Listesi (Backlog)

Bu belge, MadameSoul projesinde kullanıcı deneyimi, güvenlik, performans, mimari geliştirmelerini ve tamamlanan işleri koordine etmek amacıyla oluşturulmuştur.

---

Toplam Bilet: **156** | Açık: **0** | Tamamlanan: **152** | İptal Edilen: **4**

### 📋 Açık Biletler (Active Backlog)
Bu biletler henüz tamamlanmamış olup, geliştirilmeyi bekleyen işlerdir.

*Şu anda açık bilet bulunmamaktadır.*

### 🚫 İptal Edilen Biletler (Cancelled Tickets)
Bu biletler geliştirilmesinden veya takibinden vazgeçilerek iptal edilmiştir.

| Bilet ID | Türü | Özet | Öncelik | Durum | Oluşturan (Reporter) |
| [**MS-288**](#-ms-288) | Feature / Dev | Yerel Geliştirme (Bypass) Modunda AI Token Kullanımlarının Kaydedilmesi | Yüksek | Cancelled | Elif |
| [**MS-261**](#-ms-261) | Bug / Dev | E-posta Bildirim Gönderim Hatalarının Düzeltilmesi | Yüksek | Cancelled | Elif |
| [**MS-260**](#-ms-260) | Feature / UX / UI | Premium Mistik Şarj ve Göksel Yükleme Ritüeli Ekranı | Yüksek | Cancelled | Elif |
| [**MS-259**](#-ms-259) | Bug / Dev | FCM Push Bildirim Altyapısı Hatalarının Düzeltilmesi | Yüksek | Cancelled | Elif |
| :--- | :--- | :--- | :--- | :--- | :--- |

### ✅ Tamamlanan Biletler (Completed Tickets)
Bu biletler başarıyla tamamlanmış ve çözüme kavuşturulmuştur.

| Bilet ID | Türü | Özet | Öncelik | Çözüm Özeti | Oluşturan (Reporter) |
| [**MS-324**](#-ms-324) | Feature / UX / UI | Veritabanı Koleksiyon Sayfaları Tarih Filtrelerinin Optimizasyonu | Orta | Tarih periyot filtreleri sayfa başlığına taşındı, kaba alt kontrol barı kaldırıldı. | Elif |
| [**MS-323**](#-ms-323) | Feature / UX / UI | Veritabanı Koleksiyon Sayfalarına Dinamik Özet Gösterge Kartları ve Filtrelerin Eklenmesi | Orta | Koleksiyonların türüne göre dinamik özet veri kartları eklendi. | Elif |
| [**MS-322**](#-ms-322) | Feature / UX / UI | Admin Dashboard'dan Kurtarılan Sepet Metriğinin Kaldırılması | Orta | Kurtarılan Sepet kartı, açıklama bloğu ve ilişkili kodlar panelden temizlendi. | Elif |
| [**MS-321**](#-ms-321) | Bug / Dev | Firestore Bağlantı Sorunları İçin Long Polling Desteği | Yüksek | `src/lib/firebase.ts` long-polling otomatik algılamalı yapılandırmayla güncellendi. | Elif |
| [**MS-320**](#-ms-320) | Bug / Security / Dev | Firestore Phones Koleksiyonu Yetkilendirme ve İstemci Hata Toleransı | Yüksek | Rules yetkilendirmesi güncellendi, admin panel eşleştirme fonksiyonu hata toleranslı hale getirildi. | Elif |
| [**MS-319**](#-ms-319) | Feature / UX / UI | Admin Dashboard Panelinde Premium Kullanıcı Oranı Göstergesi | Orta | Premium oranı / sayısı gösterge kartı eklendi ve Basic Metrics Grid 4 sütuna çıkarıldı. | Elif |
| [**MS-318**](#-ms-318) | Feature / Dev / DB | Bekleyen Ödemeler İçin 10 Dakikalık Otomatik Zaman Aşımı ve Temizlik | Yüksek | 10 dakikadan eski pending durumundaki checkout_attempts otomatik olarak cancelled durumuna güncellenerek pending listesi temizlendi. | Elif |
| [**MS-317**](#-ms-317) | Bug / Analytics / Dev | Manuel İptal Edilen Ödemelerin Dashboard Metriklerine Dahil Edilmesi | Yüksek | Durumu cancelled olan ödeme talepleri de sepet terk (abandoned) ve dönüşüm oranları hesaplamalarına dahil edildi. | Elif |
| [**MS-316**](#-ms-316) | Bug / Dev / i18n | Satın Alım Geçmişi Dil Seçeneğine Göre Çeviri Düzeltmesi | Orta | Stripe satın alım açıklamaları locales altındaki transactionBuyReal anahtarı kullanılarak çok dilli hale getirildi. | Elif |
| [**MS-315**](#-ms-315) | Task / Admin / DB | CqVzXTTMcqQYUnpuszvBpETWbJ32 Kullanıcısına Admin Yetkisi Tanımlanması | Yüksek | set_admin scripti aracılığıyla UID custom claims üzerine admin rolü tanımlandı. | Elif |
| [**MS-314**](#-ms-314) | Feature / UX / UI / Dev | Admin Paneli AI Maliyet Göstergelerinin Kaldırılması | Orta | Genel Bakış (Overview) sekmesindeki AI maliyet analiz göstergeleri arayüzden tamamen temizlendi. | Elif |
| [**MS-313**](#-ms-313) | Feature / Dev / DB | Yansıma ve Gerçekleşme Notlarının user_reflections Koleksiyonuna Taşınması ve Güvenlik Kuralları | Yüksek | Günlük fal yansıma ve gerçekleşme notları user_reflections koleksiyonuna izole edildi, firestore.rules ve Profile.tsx güncellendi. | Elif |
| [**MS-312**](#-ms-312) | Bug / Dev | Admin Paneli Edinim Kanalları ve Tarih Filtresi Senkronizasyonu | Yüksek | Edinim kanalları verileri üst tarih filtreleri (günlük/haftalık/aylık/tümü) ile senkronize çalışacak şekilde dinamik hale getirildi. | Elif |
| [**MS-311**](#-ms-311) | Feature / UX / UI | Admin Overview Sekmesine Temel Metrikler ve Tarih Filtresi Entegrasyonu | Yüksek | Kullanıcı sayısı, fal sayısı ve Katina Moon sayısı göstergeleri eklendi ve tümü tarih filtrelerine bağlandı. | Elif |
| [**MS-310**](#-ms-310) | Feature / UX / UI | Son Yorum Değerlendirmelerinde Kullanıcı İletişim Bilgisi Gösterimi | Yüksek | Son yorum değerlendirmeleri tablosunda kullanıcı adı yerine e-posta veya telefon numarası gösterilmesi sağlandı. | Elif |
| [**MS-309**](#-ms-309) | Feature / UX / UI / Dev | Fal Formu Girdi Alanlarının Büyük Harf (Uppercase) Yapılması | Yüksek | Form girdi alanlarına ve seçim kutularına uppercase Tailwind sınıfı eklenerek tüm girdiler arayüzde büyük harf yapıldı. | Elif |
| [**MS-308**](#-ms-308) | Feature / UX / UI / Dev | Stripe Bekleyen Ödeme Talepleri İptal Etme Butonu ve Akışı | Yüksek | Bekleyen ödemeler listesine "İptal Et" butonu, rose renkli glassmorphic onay/yükleme/başarı modalları ve iptal endpoint'i eklenerek ödemesiz talepler temizlendi. | Elif |
| [**MS-307**](#-ms-307) | Bug / Security / Dev | Stripe Manuel Ödeme Onayına Ödeme Durumu Doğrulama Koruması | Yüksek | `/api/admin/complete-payment` endpoint'ine Stripe API'den payment_status'ün "paid" olduğunu doğrulayan güvenlik kontrolü eklendi. | Elif |
| [**MS-306**](#-ms-306) | Bug / Dev | Stripe Webhook Gecikmesi & Fallback Çakışması (Race Condition) Bug Düzeltmesi | Yüksek | Ödeme tamamlama akışı Firestore runTransaction bloğuna alınarak, webhook ve fallback isteklerinin mükerrer moon yüklemesi yapması engellendi. | Elif |
| [**MS-305**](#-ms-305) | Feature / Dev / UX | Login Ekranından Apple Giriş Seçeneğinin Kaldırılması | Orta | Giriş ekranındaki Apple Giriş butonları, handleAppleLogin fonksiyonu ve Apple ikon importu tamamen temizlenerek Apple girişi iptal edildi. | Elif |
| [**MS-304**](#-ms-304) | Documentation | Bütün Dokümanların Güncel Uygulamaya Göre Güncellenmesi | Orta | data-models.md, data-models-monolith.md, api-contracts.md, api-contracts-monolith.md ve development-guide.md dosyaları son premium özellikleri, yeni API endpoint'leri ve Stripe CLI entegrasyonuna göre güncellendi. | Paige |
| [**MS-303**](#-ms-303) | Task / Infra | Stripe CLI ve Webhook Entegrasyonu ile Otomatik Webhook Akışının Kurulması | Yüksek | stripe-cli devDependency olarak kuruldu, login tamamlandı ve stripe listen arka planda başlatılarak elde edilen signing secret .env dosyasına yazıldı. | Elif |
| [**MS-302**](#-ms-302) | Feature / UX / UI | Admin Manuel Onaylama Pop-up Pencerelerinde Kullanıcı İletişim Bilgisi ve Tam Session ID Gösterimi | Yüksek | Onaylama ve başarı modal pencerelerinde UID yerine mail/telefon bilgisi getirildi. Session ID'nin sonunun kesilmemesi için break-all kelime kaydırmalı tam genişlikte blok tasarımı entegre edildi. | Elif |
| [**MS-301**](#-ms-301) | Feature / Dev / DB | Stripe Ödemelerinde Otomatik Webhook ve Manuel Admin Onay Geçişlerinin Ayırt Edilmesi | Yüksek | checkout_attempts koleksiyonuna completedMethod (webhook/manual) ve onaylayan approvedBy alanları eklendi. "Son Stripe İşlemleri" tablosunun statü sütunu bu duruma göre Auto (Webhook) veya Manual (Admin) rozetlerini gösterecek şekilde uyarlandı. | Elif |
| [**MS-300**](#-ms-300) | Feature / UX / UI | Stripe Manuel Ödeme Onaylama Pencereleri İçin Özel Glassmorphic Pop-up Tasarımı | Yüksek | Manuel onaylama akışında kullanılan yerel prompt/alert pencereleri tamamen kaldırılarak yerine Sally'nin göz alıcı mor-altın cam-efektli (glassmorphism) onaylama, yükleniyor, başarılı ve başarısız durum modalları eklendi. | Elif |
| [**MS-299**](#-ms-299) | Feature / UX / UI / Dev | Admin Paneli Stripe Ekranı Bekleyen İşlemler ve Manuel Onaylama Butonu | Yüksek | Admin panelinde Stripe Finans sekmesine bekleyen (pending) ödemelerin listelenmesi ve bu ödemeleri manuel olarak onaylayıp bakiyeyi yükleyen "Manuel Onayla" butonu eklendi. | Elif |
| [**MS-298**](#-ms-298) | Feature / Dev | Stripe Webhook Gecikmeleri İçin İstemci Tarafı Doğrulama ve Fallback Altyapısı | Yüksek | Stripe ödemesi sonrası webhook gecikirse veya başarısız olursa, kullanıcının mağdur olmaması için geri dönüş sayfasında (/api/verify-checkout-session) fallback doğrulama ve bakiye yükleme mekanizması kuruldu. | Elif |
| [**MS-297**](#-ms-297) | Feature / UX / UI / Dev | Admin Paneli AI Telemetri İyileştirmeleri | Orta | E-posta bulunmayan kullanıcılarda telefon numarası fallback desteği sağlandı. Telemetri listesinin üstüne ortalama prompt, completion ve total token gösterge kartları eklendi. Toplam sütunu TOTALTOKENS olarak isimlendirilip CREATEDAT sütunu MAIL'in yanına taşındı. | Elif |
| [**MS-296**](#-ms-296) | Feature / Dev | Admin Paneli AI Telemetri Koleksiyonunun Eklenmesi ve Yetkilendirme Düzeltmesi | Yüksek | Admin panelinde AI Telemetri koleksiyonu listelendi, completionTokens+promptTokens sütunu eklendi ve Firestore rules yetki hatası giderildi. | Elif |
| [**MS-295**](#-ms-295) | Feature / UX / UI | Mağaza Ekranında Premium Avantajların Gösterilmesi ve Günlük Fallarda Günlük Kilidi | Yüksek | Mağaza modalına premium moon avantajları eklendi. Günlük fallarda özel başlık ve yansıma notları yazma alanı asma kilit kartıyla kilitlendi. | Elif |
| [**MS-294**](#-ms-294) | Feature / UX / UI | Premium ve Günlük Açılımların Ayrıştırılması ve PDF İndirme Kısıtlaması | Yüksek | Günlük fallarda PDF indirme kısıtlandı, geçmişte premium fallar için altın parıltı (Sparkles) simgesi eklendi. | Elif |
| [**MS-293**](#-ms-293) | Feature / UX / UI | Mağaza Paketlerinin Yeniden Yapılandırılması ve Birim İndirimlerin Gösterilmesi | Orta | Paket isimleri mistikleştirildi, hediye moon ibareleri kaldırıldı, birim tasarruf rozetleri eklendi. | Elif |
| [**MS-292**](#-ms-292) | Bug / Dev | Son 1 Katina Moon Kaldığında Fal Yorumu Gelmeme Hatası | Yüksek | Done | Elif |
| [**MS-291**](#-ms-291) | Feature / Dev | Admin Paneli Genel Bakış (Overview) Göstergelerinin Filtrelenmesi ve AI Geri Bildirimlerinde E-posta Çözümlemesi | Yüksek | Done | Elif |
| [**MS-289**](#-ms-289) | Feature / Dev | Firebase Admin Kimlik Bilgilerinin Local Dosyadan Yüklenmesi ve ES Modül __dirname Çakışmasının Giderilmesi | Yüksek | Done | Elif |
| [**MS-290**](#-ms-290) | Feature / Dev | Çalışan Yetkileri Ekranından Şifre Güncelleme/Sıfırlama Desteği | Yüksek | Süper adminlerin çalışan şifrelerini arayüzden güncelleyebilmesi için set-role endpoint'ine ve PermissionsTab bileşenine şifre güncelleme desteği eklendi. | Elif |
| [**MS-287**](#-ms-287) | Feature / Dev | Admin Paneli Altyapısı, Monorepo Dizin Kurulumu ve Firebase Client Entegrasyonu | Yüksek | Done | Elif |
| [**MS-286**](#-ms-286) | Feature / Dev | Sözleşme Onay Modalı, Kart Seçim Ritüeli, Bildirimler ve Login Ekranı Yerelleştirilmesi | Yüksek | Done | Elif |
| [**MS-285**](#-ms-285) | Feature / Dev | Admin Paneli Sol Menü Hizalama ve Moon Harcamaları Tablosu Geliştirmesi | Yüksek | Done | Elif |
| [**MS-284**](#-ms-284) | Feature / Dev | Backlog Biletlerinin GitHub Kanban Panosuna Taşınması | Yüksek | Done | Elif |
| [**MS-283**](#-ms-283) | Feature / Dev | Profil Bilgisi Durum Senkronizasyon Hatası | Yüksek | Done | Elif |
| [**MS-282**](#-ms-282) | Feature / Dev | Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi | Yüksek | Done | Elif |
| [**MS-281**](#-ms-281) | Feature / Dev | İnteraktif Kart Seçim Ritüelinin Geliştirilmesi | Yüksek | Done | Elif |
| [**MS-280**](#-ms-280) | Feature / Dev | Express Log Buffer (Toplu Hata Yazma) Mimarisi | Yüksek | Sunucu/istemci hatalarını bellekte tamponlayıp (batch) toplu olarak yazan LogBuffer ve API endpoint'i kuruldu. | Elif |
| [**MS-279**](#-ms-279) | Feature / Dev / Test | Firestore Güvenlik Kuralları Birim Test Altyapısının Kurulması | Yüksek | `@firebase/rules-unit-testing` ile Firestore kurallarını emülatör üzerinde test eden Vitest entegrasyonu tamamlandı. | Elif |
| [**MS-278**](#-ms-278) | Feature / UX / UI / Dev | Admin Paneli Sol Menü Hizalama ve Moon Harcamaları Tablosu Geliştirmesi | Yüksek | Sol menü butonları sola hizalandı, moon_transactions tablosu sütunları özelleştirildi ve sütunlara göre A-Z sıralama özelliği eklendi. | Elif |
| [**MS-277**](#-ms-277) | Feature / UX / UI / Dev | Sözleşme Onay Modalı, Kart Seçim Ritüeli, Bildirimler ve Login Ekranı Yerelleştirilmesi | Yüksek | GDPR sözleşme onay modalı, kart çekme ritüeli, push izinleri, profil ayarları, toast bildirimleri ve Giriş (Login) ekranı (şifremi unuttum, açık rıza metni) 6 dilde yerelleştirildi. Giriş ekranından tanıtım sihirbazı butonu kaldırıldı. | Elif |
| [**MS-276**](#-ms-276) | Documentation | Veritabanı Modelleri Dokümantasyonunun Güncellenmesi | Orta | Görüntüleyici (viewer) rolü yetkileri ve güncellenen firestore.rules kuralları doğrultusunda data-models.md and data-models-monolith.md güncellendi. | Paige |
| [**MS-271**](#-ms-271) | Feature / Dev | Admin Paneli Altyapısı, Monorepo Dizin Kurulumu ve Firebase Entegrasyonu | En Yüksek | Vite+React projesi `/admin` dizininde kurularak Firebase Auth claim'lerine göre ProtectedRoute yönlendirmeleri tamamlandı. | Elif |
| [**MS-272**](#-ms-272) | Feature / Dev | İlk Admin Seed Script'inin Yazılması ve Custom Claims Yetkilendirmesi | En Yüksek | CLI token'ı dinamik olarak okuyarak ilk admin kullanıcısını yetkilendiren seed-admin.ts scripti başarıyla çalıştırıldı. | Elif |
| [**MS-273**](#-ms-273) | Feature / UX / UI / Dev | Firestore Koleksiyon Görselleştirme ve Bakiye Yönetimi (Sekme 1 & 2) | Yüksek | Koleksiyon listeleme arayüzü ile çift onaylı ve gerekçe bildirimli Moon bakiye güncelleme arayüzü `admin_audit_logs` entegrasyonuyla geliştirildi. | Elif |
| [**MS-274**](#-ms-274) | Feature / UX / UI / Dev | Stripe Ödeme Takibi, Finansal Tablolar ve Sistem Logları Ekranı (Sekme 3 & 4) | Orta | Stripe satış istatistikleri, trend grafikleri ile `error_logs` Canlı İzleme terminal arayüzü tamamlandı. | Elif |
| [**MS-275**](#-ms-275) | Feature / UX / UI / Dev | Çalışan Rolleri ve Yetki Yönetim Ekranı (Sekme 5) | Düşük | Admin, Çalışan ve Görüntüleyen rollerinin yetki matrisi arayüzde ve rules kurallarında sınırlandırılarak tamamlandı. | Elif |
| [**MS-270**](#-ms-270) | Bug / Security | Firestore Kuralları ve İstemci Yetki Hatalarının Düzeltilmesi | Yüksek | Firestore test modu erişim uyarısını gidermek amacıyla firestore.rules güvenlik kuralları Firebase sunucusuna yüklendi. App.tsx üzerindeki setDoc/updateDoc işlemlerine rules ile uyumlu olacak şekilde lastLogin alanı eklenerek yetki hataları (permission denied) düzeltildi. | Elif |
| [**MS-269**](#-ms-269) | Documentation | Veritabanı Modelleri Dokümantasyonunun Güncellenmesi | Orta | `data-models.md` ve `data-models-monolith.md` dosyaları yeni eklenen `ai_feedback`, `user_push_tokens`, `ui_configs` vb. koleksiyonları ve kullanıcı/bakiye şemalarındaki yeni alanları içerecek şekilde güncellendi. | Paige |
| [**MS-268**](#-ms-268) | Documentation | Test Rehberi Dokümantasyonunun Güncellenmesi | Orta | Mevcut birim testleri (RBAC, Transactions) ve E2E testleri (Admin Panel) eklenerek testing.md güncel uygulamaya göre revize edildi. | Paige |
| [**MS-267**](#-ms-267) | Feature / Dev | Fal Yorumları Sistem Promptu Optimizasyonu | Yüksek | Yerel yapay zeka sistem promptu veri sadakati, kartlar arası bağlam ve bütünlük, mistik tonlama ve gereksiz token kısıtlaması gibi optimizasyonlarla güncellendi. | Elif |
| [**MS-266**](#-ms-266) | Feature / UX / UI | Bildirimlerin Sağ Üstte Gösterilmesi ve Ses Efekti Eklenmesi | Yüksek | Tüm Toast bildirimleri ekranın sağ üst köşesine konumlandırıldı ve her bildirim tetiklendiğinde çalmak üzere mistik bir chime ses efekti (reveal.wav) entegre edildi. | Elif |
| [**MS-265**](#-ms-265) | Bug / Dev / UX | Fal Tamamlandığında Ekrana Bildirim Gönderilmesi | Yüksek | Fal başarıyla tamamlandığında ekranda Toast bildirim gösterimi ve tarayıcı izin verdiyse yerel tarayıcı bildirim gönderimi entegre edildi. | Elif |
| [**MS-264**](#-ms-264) | Feature / Dev | Local LLM Tutarlı Yorumlar İçin System Prompt Hazırlanması | Yüksek | Yerel yapay zeka (LM Studio) istek gövdesine, kartları YAML dosyalarındaki resmi tanımlara göre yorumlamasını zorunlu kılan 'system' mesajı başarıyla eklendi. | Elif |
| [**MS-263**](#-ms-263) | Bug / Dev | Web Push Bildirim Ayarları Hatalarının Düzeltilmesi | Yüksek | Localhost üzerinde service worker unregister mantığı kaldırılarak FCM ve Web Push bildirim desteği localhost ve production ortamlarında sorunsuz hale getirildi. | Elif |
| [**MS-262**](#-ms-262) | Revert / Cleanup | MS-245 Sonrası Tüm Geliştirmelerin Geri Alınması ve Kod Temizliği | En Yüksek | Git deposu MS-244 sürümüne (71df6d3) geri döndürüldü; MS-246 ile MS-261 arasındaki tüm biletlerin geliştirmeleri silindi ve kod temizlendi. | Elif |
| [**MS-257**](#-ms-257) | Feature / Dev | Onboarding Giriş Akışının Düzenlenmesi | Yüksek | İlk açılışta doğrudan login ekranı, giriş sonrasında onboarding ve ardından sözleşme modalı gösterimi sağlandı. Sonraki girişler için atlama eklendi. | Elif |
| [**MS-256**](#-ms-256) | Feature / Dev | E-posta Giriş Ekranı Şifre Sıfırlama (Forgot Password) Desteği | Yüksek | Firebase sendPasswordResetEmail API entegrasyonu tamamlandı, hata ve başarı durum göstergeleriyle arayüze buton eklendi. | Elif |
| [**MS-255**](#-ms-255) | Feature / Dev | Fal Yorumları İçin Dinamik Çok Dilli System Prompt ve Kart Çeviri Entegrasyonu | Yüksek | Lokasyon YAML dosyalarındaki resmi kart isim ve açıklamalarına sadık kalarak 5 farklı dilde dinamik prompt oluşturma desteği sağlandı. | Paige |
| [**MS-254**](#-ms-254) | Feature / Dev | Asenkron Fal Yorumları İçin Push Bildirim Altyapısı | Yüksek | FCM Push entegrasyonunda başlık/gövde şablonları güncellendi, fal tamamlandığında mistik push bildirimi tetiklenmesi sağlandı. | Sally |
| [**MS-253**](#-ms-253) | Feature / Dev | Asenkron Fal Yorumları İçin E-posta Bildirim Altyapısı | Orta | Nodemailer SMTP modülü entegre edildi; fal tamamlandığında mor/altın temalı şık HTML e-postası otomatik olarak gönderilmektedir. | Sally |
| [**MS-252**](#-ms-252) | Feature / Dev | Local LLM Entegrasyonu Response Validation ve Sanitization | Orta | HTML script/event temizliği ve başlık hiyerarşisi (# -> ##) doğrulaması yapan `sanitizeAndValidateReading` fonksiyonu eklendi. | Amelia |
| [**MS-251**](#-ms-251) | Feature / Dev | Local LLM Entegrasyonu Error Handling ve Fallback Mekanizması | Yüksek | Local LLM koptuğunda veya hata verdiğinde Gemini API modellerine otomatik fallback geçişi ve bakiye iadesi entegre edildi. | Amelia |
| [**MS-250**](#-ms-250) | Code Quality / Dev | Local LLM Entegrasyonu Mock ve Entegrasyon Test Kapsamı | Orta | Vitest test ortamında local AI fetch bağlantıları mocklanarak testlerin dış bağımlılıksız koşulması sağlandı. | Amelia |
| [**MS-249**](#-ms-249) | Feature / Dev | Fal Yorumlama Süreci Streaming (Akış) Entegrasyonu | Yüksek | Server-Sent Events (SSE) ile token akışı sağlayan `/api/generate/stream` backend ucu yazıldı, frontend daktilo efekti ile entegre edildi. Disconnect durumunda arka plan tamamlama desteği eklendi. | John |
| [**MS-248**](#-ms-248) | Architecture / Dev | Asenkron & Event-Driven Fal Yorumlama Backend Altyapısı | Yüksek | Arka planda asenkron fal yorumlama altyapısı ve Firestore snapshot dinleyicisi üzerinden gerçek zamanlı durum izleme tamamlandı. | Winston |
| [**MS-247**](#-ms-247) | UX / UI | Mistik Bekleme Ekranı ve Yükleme Animasyonları | Orta | Aşamalı mistik yükleme metinleri (loadingStep) ve parıldayan kart outline animasyonu eklendi, beklemeden çıkma butonu arayüze entegre edildi. | Sally |
| [**MS-246**](#-ms-246) | Feature / Dev | Fal Yorumları İçin System Prompt Tasarımı ve Token Sınırlandırması | Yüksek | Local AI max_tokens ve Gemini maxOutputTokens limitleri 500 olarak sınırlandırıldı. System Prompt güncellendi. | John |
| [**MS-245**](#-ms-245) | Feature / Dev | LM Studio Yerel LLM Yanıt Süresi (Latency) Ölçüm Testi | Yüksek | Test scriptiyle local Gemma 4 12B yanıt süresi ölçüldü. 1329 token için 49.37 saniye latency tespit edildi (26.92 t/s). | Elif |
| [**MS-244**](#-ms-244) | Feature / Dev | LM Studio Yetkilendirme Desteği (Bearer Token Entegrasyonu) | Yüksek | Local AI inference isteklerine `LOCAL_AI_API_KEY` ve `LM_API_TOKEN` bearer authorization header desteği eklendi. | Elif |
| [**MS-243**](#-ms-243) | Code Quality / Dev | Firestore Cache Deprecation Güncellemesi | Orta | `enableIndexedDbPersistence` çağrısı kaldırılarak `initializeFirestore` ve `persistentLocalCache` API'sine geçildi. | Elif |
| [**MS-230**](#-ms-230) | Feature / Dev | FCM Push Notification Entegrasyonu | Yüksek | FCM push bildirim altyapısı sunucu tarafında bildirim gönderecek şekilde entegre edilerek tamamlandı. | Amelia |
| [**MS-209**](#-ms-209) | Task / Infra | Backlog Biletlerinin GitHub Kanban Panosuna Taşınması | Yüksek | Tüm geçmiş backlog biletleri parse edilerek GitHub'daki MadameSoulKanban projesine otomatik aktarıldı ve geçiş tamamlandı. | Amelia |
| [**MS-208**](#-ms-208) | Bug / UX | PDF Tek Sayfa Formatına Geri Dönüş Çalışmasının Yenilenmesi ve Düzeltilmesi | Yüksek | Tek sayfa PDF çıktısında reklam ve footer linklerinin tıklanabilir alan koordinatları (pdf.link) tek sayfa yapısına göre dinamik hesaplanacak şekilde düzeltildi. | Sally |
| [**MS-206**](#-ms-206) | UX / UI | Giriş Ekranı Dil Seçimi ve Uygulama Tanıtımı Butonlarının Konum ve Biçim Değişimi | Düşük | Hem E-posta hem de Telefon formunda Dil Seçimi ve Tanıtım butonlarının konumları ve stilleri yer değiştirildi. | Sally |
| [**MS-205**](#-ms-205) | Feature / Dev | Giriş Sonrası KVKK/Sözleşme Onayı Wrapper ve Firestore Entegrasyonu | Yüksek | Girişteki checkbox mantığı kaldırıldı; global Zustand store ve `App.tsx` entegrasyonu ile eksik onay durumunda `TermsModal` gösterilerek onay alındığında Firestore'a güncellenmesi sağlandı. | Amelia |
| [**MS-204**](#-ms-204) | Architecture / DB | KVKK/Sözleşme Onay Durumu Firestore Veri Şeması ve Güvenlik Kuralları Güncellemesi | Yüksek | `users` belgesinde yasal onay alanları tanımlandı; `firestore.rules` kuralları güncellenerek bu alanların güvenli şekilde güncellenebilmesi sağlandı. | Winston |
| [**MS-203**](#-ms-203) | UX / UI | Giriş Sonrası KVKK/Sözleşme Onay Modalı Tasarımı ve Örtük Onay Altbilgisi | Yüksek | Giriş ekranı butonlarının altına örtük onay metni eklendi; başarılı giriş sonrasında gösterilen mor-siyah glassmorphic, kaydırılabilir ve animasyonlu sözleşme onay modalı tasarlandı. | Sally |
| [**MS-202**](#-ms-202) | Legal / PM | Giriş Sonrası KVKK/Sözleşme Onayı - Yasal ve Ürün Gereksinimleri | Yüksek | Girişteki zorunlu onay kutusu kaldırıldı, oturum açtıktan sonra ilk girişte onay modalı üzerinden yasal onay alınacak şekilde akış güncellendi. | John |
| [**MS-201**](#-ms-201) | Bug / Security | Sosyal Girişlerde unverified E-posta/Şifre Sağlayıcısının Silinmesi ve Şifre Kaybı Hatası | Yüksek | Firebase Auth'un unverified e-posta üzerine sosyal giriş yapıldığında şifre sağlayıcısının silinmesini önlemek için auto-restore esnasında oluşabilecek linking çakışma hataları (email-already-in-use/credential-already-in-use) ele alındı ve loglama yapılarak sürecin takibi sağlandı. | Elif |
| [**MS-200**](#-ms-200) | Bug / UX | Hesap Birleştirme (Account Linking) Esnasında 2 Saniyelik Sayfa Parlaması / Yönlendirme Hatası | Yüksek | Geçici oturum açma ve silme sırasında kullanıcının 2 saniyeliğine uygulamayı görüp ardından çıkış yapmasını engellemek amacıyla `isSocialLoginInProgress` global durum kontrolü eklendi. | Elif |
| [**MS-199**](#-ms-199) | Feature / UX / UI | Notification Settings Bildirimleri Kapatabilme Desteği | Yüksek | Bildirimleri kapatabilmek için çift yönlü toggle yapısı eklendi, disablePushNotifications metodunda FCM token ve Firestore silme işlemleri sağlamlaştırıldı. | Elif |
| [**MS-198**](#-ms-198) | Feature / UX / UI | Geçmiş Açılımlar (Past Readings) Hata Gösterim ve Detay Entegrasyonu | Orta | Başarısız fallara 'Sistem Hatası' rozeti eklendi, genişletildiğinde hatayı açıklayan detay metni gösterildi. | Elif |
| [**MS-197**](#-ms-197) | Feature / UX / UI | Satın Alım Geçmişi Bakiye İade ve Chevron Temizliği | Orta | Satın alım geçmişinde bakiye iade miktarı dinamik hale getirildi, işlevsiz chevron ok işareti kaldırıldı. | Elif |
| [**MS-196**](#-ms-196) | Feature / Security | Google ve E-posta Giriş Yöntemlerinin Aynı E-posta İçin Bağlanması (Account Linking) | Yüksek | E-posta çakışması durumunda Firebase Auth hatası yakalanarak şifre doğrulama modalı sunuldu, `linkWithCredential` ile hesaplar birleştirildi. Firestore çakışmaları için yedek (fallback) kontrolü ve geçici sosyal kullanıcı silinmesi sağlandı. | Elif |
| [**MS-192**](#-ms-192) | Security / Analytics | `moon_transactions` Koleksiyonu İçin Güvenlik ve İşlem Takibi Alanlarının Eklenmesi | Orta | `moon_transactions` koleksiyonuna `paymentProvider`, `idempotencyKey` ve `clientMetadata` alanları eklenip, `firestore.rules` kuralları ve backend/frontend entegrasyonu tamamlandı. | Winston |
| [**MS-191**](#-ms-191) | UX / UI / Bug | PDF Çoklu Sayfa Sayfalandırma (Pagination) Geliştirmesinin Geri Alınması | Yüksek | PDF üretimindeki element ölçümleme ve çoklu sayfa sayfalandırma mantığı kaldırılarak dikeyde tek ve kesintisiz uzun sayfa formatına geçildi. | Sally |
| [**MS-187**](#-ms-187) | Feature / AI Quality | Tarot Yorumları İçin Kullanıcı Değerlendirme (Feedback) ve Prompt Memnuniyet Ölçümü Modülü | Orta | Tarot yorum sonucunun altına ve profil geçmişi detaylarına mor/altın temalı 5 yıldızlı derecelendirme ve yorum widget'ları eklendi. Feedback verileri `ai_feedback` koleksiyonuna yazıldı. | Winston |
| [**MS-186**](#-ms-186) | Analytics / CRM | Kullanıcı Dil Seçimi, Saat Dilimi, Cihaz Bilgisi ve Yaşam Boyu Değer (LTV) Takip Entegrasyonu | Orta | Kullanıcı belgesine giriş, uygulama başlangıcı ve profil güncellemesinde timezone, deviceInfo, appVersion verileri yazıldı. Stripe ve mock ödemelerde LTV değeri yapılan harcama miktarı oranında kümülatif olarak artırıldı. | Winston |
| [**MS-185**](#-ms-185) | Security / Refactor | `moon_transactions` Koleksiyonuna `transactionId` Eklenmesi ve Güvenlik Kuralları Güncellemesi | Yüksek | İşlem güvenliğini artırmak için transactionId eklendi ve firestore kuralları güncellendi. | Winston |
| [**MS-184**](#-ms-184) | Refactor / Cleanup | `promo_codes` ve `reading_cache` Firestore Koleksiyonlarının/Alanlarının Temizlenmesi | Orta | Artık kullanılmayan `promo_codes` ve `reading_cache` Firestore koleksiyonları veri modelleri dokümantasyonundan ve sunucudaki ilgili kod bloklarından temizlendi. | John |
| [**MS-183**](#-ms-183) | Refactor | Sistem İadeleri İşlem Tipinin 'refund' Olarak Güncellenmesi | Orta | Sistem hatalarından kaynaklı kredi iadelerinin tipi 'bonus' yerine 'refund' olarak değiştirildi, firestore.rules güncellendi, Profil ekranı her iki tipi de destekleyecek şekilde uyumlu hale getirildi. | Sally |
| [**MS-182**](#-ms-182) | Feature | Sistem Hataları Kredi İadelerinin Satın Alım Geçmişinde Gösterilmesi | Yüksek | Sunucu ve istemci taraflı fal yorumlama hataları sonucu iade edilen krediler için 'type: bonus' türünde 'Sistem İadesi' işlem kaydı oluşturuldu, Profil ekranında yeşil iade rozetiyle listelendi. | Sally |
| [**MS-181**](#-ms-181) | Bug | Pending Durumunda Kalan ve Bakiye Düşüren İşlemlerin Otomatik İadesi | En Yüksek | Girişte son 2 dakikadır pending kalan işlemler tespit edilip bakiye otomatik iade edilir ve işlem failed yapılır. | Sally |
| [**MS-180**](#-ms-180) | Bug | PDF Promosyon Kodu Dikey Hizalama Optimizasyonu | Orta | PDF çıktısında promosyon kodu metninin dikey hizalaması line-height: 1 verilerek ortalandı. | Sally |
| [**MS-176**](#-ms-176) | Feature | Kullanıcı Dil Seçiminin Kalıcı Hale Getirilmesi | Orta | Zustand `useAppStore` başlatılırken önbellekten dil bilgisi okunması ve güncellemelerde `localStorage`'a yazılması sağlandı. | Sally |
| [**MS-160**](#-ms-160) | i18n / Bug | Eksik Dil Çevirilerinin (dailyGift, focusOptions vb.) Eklenmesi | Yüksek | `es.yaml`, `fr.yaml`, `zh.yaml` ve `ko.yaml` dosyalarına eksik olan dailyGift, dailyGiftClaimed ve focusOptions / focusLabel anahtarları eklendi. | Paige |
| [**MS-159**](#-ms-159) | Test | Fal Çekme ve Profil Etkileşimleri İçin Playwright E2E Test Kapsamının Genişletilmesi | Orta | Playwright test senaryoları onboarding geçişi, form doldurma, kart çekim chimes ritüeli, fal sonucunun yüklenmesi ve profil geçmişi/günlük düzenleme akışlarını kapsayacak şekilde genişletildi. | Paige |
| [**MS-158**](#-ms-158) | UX / UI | Onboarding Ekranındaki Slayt Görsellerinin Çeşitlendirilmesi | Düşük | `Onboarding.tsx` onboarding tanıtım akışında hoş geldin, keşif ve yolculuk temaları için 3 ayrı WebP görseli kullanılarak arayüz zenginleştirildi. | Paige |
| [**MS-157**](#-ms-157) | i18n / UX | Mağaza Paket Metinlerinin ve Giriş Bileşeni Çevirilerinin Taşınması | Düşük | `StoreModal.tsx` bonus metinleri ve `Login.tsx` içindeki yerel çeviri nesneleri kaldırılarak tamamı merkezi dil dosyalarına (YAML) taşındı ve yerel `t` fonksiyonuyla okundu. | Paige |
| [**MS-156**](#-ms-156) | i18n / UX | Çerez Çubuğu (CookieBanner) ve Hata Yakalayıcı (ErrorBoundary) Metinlerinin Yerelleştirilmesi | Düşük | `CookieBanner.tsx` ve `ErrorBoundary.tsx` içerisindeki tüm hardcoded metinler dil dosyalarına taşındı ve merkezi `t` fonksiyonu ile çağrılarak yerelleştirildi. | Paige |
| [**MS-155**](#-ms-155) | Architecture | Gemini İstek Sınırlandırmasının (Rate Limit) IP Yerine User UID Üzerinden Yapılması | Orta | `/api/generate` uç noktasında rate limiter kimlik doğrulamasından sonraya taşındı, IP yerine `req.user.uid` üzerinden sınırlandırma kuruldu ve limit aşımında yerelleştirilmiş hata mesajı dönüldü. | Paige |
| [**MS-154**](#-ms-154) | Performance | Dil Dosyalarının Bellekte Önbelleğe Alınması (Locales Memory Caching) | Orta | Sunucu başlangıcında `src/locales/` klasöründeki YAML dosyaları okunup `localesCache` bellek içi nesnesine alındı ve her istekte diske erişmek yerine bu önbellekten çeviri değerleri döndürüldü. | Paige |
| [**MS-153**](#-ms-153) | Bug | Hesap Silme Akışında Re-Authentication Kontrolü ve İşlem Sırası Güvencesi | Yüksek | Hesap silme öncesi son oturum zamanı (lastSignInTime) ile re-auth tazeliği kontrolü yapıldı, veritabanı silmeleri tek bir atomik writeBatch içinde yapıldıktan sonra auth hesabı silindi. | Paige |
| [**MS-152**](#-ms-152) | Bug | Üretim Ortamında Stripe Webhook İmza Doğrulamasının Zorunlu Kılınması | En Yüksek | Stripe webhook endpointinde üretim ortamında webhook imza doğrulaması (`constructEvent`) zorunlu kılındı. | Paige |
| [**MS-151**](#-ms-151) | Architecture | Gemini API Yanıtlarının Önbelleğe Alınması (Caching) ile Maliyet Optimizasyonu | Orta | Firestore `reading_cache` koleksiyonu kurularak `/api/generate` uç noktasında son 24 saatteki aynı (uid, cards, focus) talepleri için önbellekten yanıt dönülmesi ve rollback bakiye koruması sağlandı. | Winston |
| [**MS-150**](#-ms-150) | UX / UI | Çevrimdışı Kullanım Desteği ve PWA (Progressive Web App) Altyapısının Kurulması | Orta | `manifest.json` ve Service Worker (`sw.js`) entegre edilerek statik varlıkların cache-first stratejisiyle önbelleğe alınması ve Firestore `enableIndexedDbPersistence` ile çevrimdışı çalışma sağlandı. | Sally |
| [**MS-149**](#-ms-149) | Performance | Görsel Optimizasyonu ve Tarot Kart Görsellerinin WebP/Lazy-Loading ile Yüklenmesi | Düşük | Tüm kart PNG görselleri `.webp` formatına dönüştürüldü, `App.tsx` ve `pdfGenerator.ts` üzerindeki görsel yolları güncellendi ve istemci tarafında `loading="lazy"` eklendi. | Winston |
| [**MS-148**](#-ms-148) | Feature | Kaydedilen Falları Kişiselleştirme, Favorileme ve Yansıma/Gerçekleşme Notları | Orta | `Profile.tsx` fal geçmişi detaylandırılarak favorileme (yıldız), özel başlık (customTitle) ve yansıma notu (reflectionNotes) ekleme/kaydetme özellikleri Firestore işlemleriyle senkronize edildi. | John |
| [**MS-146**](#-ms-146) | Feature | İnteraktif Kart Çekme Ritüelinde Mistik Arka Plan Müzikleri ve Ses Efektleri | Düşük | `App.tsx` içerisine ses kontrolü (Mute/Unmute) eklendi, kart çekme adımında mistik ortam müziği (ambient) ve kart etkileşimlerinde (hover, click, flip) chime ses efektleri entegre edildi. | John |
| [**MS-143**](#-ms-143) | Feature | PDF Çıktısında Aynı Anda İki Reklam Görseli Gösterilmesi ve Tıklanabilir Yapılması | Orta | `pdfGenerator.ts` altında `ad1` ve `ad2` reklamlarının alt alta çizilmesi ve jsPDF `pdf.link(...)` ile tıklanabilir olması sağlandı. | John |
| [**MS-142**](#-ms-142) | Feature | PDF Çıktısına Tıklanabilir Reklam Görselleri ve Bağlantıları Eklenmesi | Orta | pdfImage ve URL hedefleri ads_config.json'dan çekilip html2canvas + pdf.link ile tıklanabilir yapıldı. | John |
| [**MS-141**](#-ms-141) | Feature | Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı | Orta | Hata günlükleri (error_logs) ve yapay zeka token/latency telemetrisi (ai_telemetry) veri modelleri tasarlanıp belgelendirildi; sunucu/istemci tarafı hata yakalayıcıları ve telemetri loglaması eklendi. | Winston |
| [**MS-140**](#-ms-140) | Feature | Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı | Orta | Pazarlama izinleri ve ödeme yarıda bırakma teşebbüsleri (checkout_attempts) Firestore şemaları tasarlanıp belgelendirildi; checkout yönlendirmesinde loglama eklendi. | Winston |
| [**MS-139**](#-ms-139) | Security | `firestore.rules` Dosyasında `phones` Koleksiyonu Kurallarının Eksik Olması | Yüksek | `firestore.rules` dosyasına `phones` koleksiyonu kuralları e... | Winston |
| [**MS-138**](#-ms-138) | UX / UI | PDF Çıktısında Kart Görsellerinin Yüklenme ve CORS Sorunlarının Giderilmesi | Yüksek | `App.tsx` içindeki PDF üretim şablonunda yer alan `img` etik... | Winston |
| [**MS-136**](#-ms-136) | UX / UI | Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi | Yüksek | Onboarding tamamlanma/atlanma durumu `localStorage`'a kaydedildi. Girişte kontrol eklenerek mükerrer gösterim önlendi. Profil ve Login ekranlarına tekrar izleme butonu eklendi. | Sally |
| [**MS-134**](#-ms-134) | Feature | Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı | Orta | Firebase Analytics kuruldu; onboarding tamamlama, sepet yönlendirme ve ödeme tamamlama gibi kritik huni eventleri loglandı. | John |
| [**MS-133**](#-ms-133) | Security | KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı | Yüksek | Üyelikte onay kutusu (Login.tsx) eklendi, `consentsAcceptedAt` kaydedildi; `App.tsx` altına Çerez Onay Banner'ı eklendi; `Profile.tsx` içine "Hesabımı Sil" butonu ve verileri silme akışı yerleştirildi. | John |
| [**MS-132**](#-ms-132) | Code Quality | Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi | Düşük | Yeni üye kaydında hoş geldin bonusu 5 krediden 1 krediye düşürüldü ve log kaydı güncellendi. | John |
| [**MS-131**](#-ms-131) | Code Quality | PDF Çıktılarında Türkçe Karakter ve Yazı Tipi Optimizasyonu | Düşük | `App.tsx` içinde jsPDF çıktısında VFS ile Roboto-Regular yazı tipi tanımlanıp setFont yapıldı. | Sally |
| [**MS-130**](#-ms-130) | Architecture | Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı | Yüksek | Firestore'da günlük ücretsiz bakiye ve satın alınan bakiye alanları ayrıldı; harcama işleminde önce ücretsiz bakiye tüketilecek şekilde transaction yazıldı. | Winston |
| [**MS-128**](#-ms-128) | Feature | Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı | Yüksek | Stripe Checkout oturumu oluşturma, ödeme doğrulama ve webhook ile bakiye artışı altyapısı kuruldu. Geliştirme ortamı için mock ödeme simülasyonu eklendi. | John |
| [**MS-127**](#-ms-127) | Feature | Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması | Orta | `vite` paketi `devDependencies`'e taşındı; `server.ts` içinde üretim ortamı için Vite bağımlılığı ve dinamik importu devre dışı bırakıldı. | Winston |
| [**MS-126**](#-ms-126) | Feature | `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi | Orta | StoreModal, LegalModal, ContactModal ve CookieBanner modüler React bileşenlerine bölünerek `App.tsx` sadeleştirildi. | Winston |
| [**MS-125**](#-ms-125) | Security | `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması | Yüksek | `/api/generate` rotasında Bearer ID token doğrulaması ve Firestore bakiye kontrolü eklendi; client `App.tsx` istek başlığına ID token entegre edildi. | Winston |
| [**MS-124**](#-ms-124) | Security | `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı | Yüksek | `firestore.rules` güncellenerek bakiyenin istemciden artırılması engellendi, sadece -1 düşüşe izin verildi. | Winston |
| [**MS-122**](#-ms-122) | Bug | Yarıda Kalan İsteklerin Kurtarılması ve Moon Bakiye Güvencesi | Yüksek | `firestore.rules` dosyasındaki `isValidMoonTransaction` fonk... | John |
| [**MS-121**](#-ms-121) | Feature | Tarot Açılımları için Kategori/Odak Seçimi | Yüksek | Fal formuna aşk, kariyer, sağlık ve genel odak seçenekleri eklenerek Gemini promptuna ve kullanıcı modeline entegre edildi. | John |
| [**MS-120**](#-ms-120) | Feature | Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği | Orta | Stripe webhook üzerinden kaydedilen `stripeReceiptUrl` bilgisi `Profile.tsx` satın alma geçmişinde makbuz butonu olarak gösterildi. | John |
| [**MS-118**](#-ms-118) | Code Quality | Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması | Orta | `App.tsx` `t` fonksiyonu güncellendi; seçili dilde bulunamayan yerelleştirme anahtarları için otomatik İngilizce (`locales.en`) karşılığı yüklendi. | John |
| [**MS-117**](#-ms-117) | Feature | Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu | Düşük | İstemci tarafında `ErrorBoundary.tsx`, sunucu tarafında hata yakalayıcı middleware ile çalışma zamanı hataları Firestore `error_logs` koleksiyonuna kaydedildi. | Winston |
| [**MS-116**](#-ms-116) | Feature | CI/CD Pipeline (GitHub Actions) Kurulumu | Düşük | `.github/workflows/ci.yml` oluşturularak push ve PR'larda derleme, tip kontrolü (tsc) ve test otomasyonu koşulması sağlandı. | Winston |
| [**MS-115**](#-ms-115) | Bug | Firestore `onSnapshot` Abonelik Temizliği Kontrolü | Yüksek | `App.tsx` içindeki `onSnapshot` dinleyicisi kurulurken, her ... | Winston |
| [**MS-114**](#-ms-114) | Code Quality | TanStack Query (React Query) Entegrasyonu | Orta | `@tanstack/react-query` entegre edildi, fal talebi `useMutation` ile sarılarak mükerrer gönderim koruması ve hata yönetimi sağlandı. | Winston |
| [**MS-113**](#-ms-113) | Code Quality | Zustand ile Global Durum Yönetimi Standardizasyonu | Orta | `src/store/useAppStore.ts` oluşturuldu, in-memory states (user, userInfo, moonsCount, view) buraya taşınarak durum yönetimi merkezileştirildi. | Winston |
| [**MS-112**](#-ms-112) | Test | Test Otomasyonu Altyapısının Kurulması | Yüksek | Projeye test otomasyonu için Vitest ve E2E testleri için Playwright kuruldu. Örnek testler yazılıp doğrulandı. | Winston |
| [**MS-111**](#-ms-111) | Code Quality | `src/App.tsx` İçerisindeki Yazım Hatası | Düşük | `drawRancomCards` fonksiyon ismi ve tüm referansları `drawRandomCards` olarak düzeltildi. | Winston |
| [**MS-110**](#-ms-110) | Security | İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması | Orta | Prompt üretimi backend tarafına (`server.ts`) taşındı, istemcinin sadece yapısal parametre göndermesi sağlanarak sunucu tarafı doğrulama kuruldu. | Winston |
| [**MS-109**](#-ms-109) | Security | `/api/generate` API Uç Noktasında Rate Limiting Eksikliği | Yüksek | `express-rate-limit` paketi kullanılarak `/api/generate` uç noktasına IP başına saatte 15 istek sınırı getirildi. | Winston |
| [**MS-108**](#-ms-108) | Bug | Firestore Composite Index Olmaması Sebebiyle Geçmiş Okuma Sınırı | Orta | `Profile.tsx` içindeki geçmiş fal sorgusu doğrudan Firestore... | Winston |
| [**MS-107**](#-ms-107) | Feature | Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı | Yüksek | Girişte son bakiye tarihi kontrol edilip 24 saat geçmişse transaction ile +1 Moon ve hediye transaction logu eklenmesi sağlandı. | Winston |
| [**MS-106**](#-ms-106) | Task | Giriş/Kayıt Buton Mikro-Etkileşimlerinin Senkronizasyonu | Düşük | `Login.tsx` butonlarına `active:scale-[0.98]` ve `hover:bg-[#fff]` eklenerek davranışlar eşitlendi. | Sally |
| [**MS-104**](#-ms-104) | Task | Tarayıcı `alert()` Yapısının Özel Modal/Toast ile Değiştirilmesi | Orta | `App.tsx` dosyasında mor/altın temalı `toast` ve `showToast` ile `alert()` değiştirildi. | Sally |
| [**MS-103**](#-ms-103) | Feature | İnteraktif Kart Seçim Ritüelinin Geliştirilmesi | Yüksek | Form gönderiminde kart çekim ritüeli ekranı (DRAWING) eklendi, 35 kapalı karttan hover/seçim/flip animasyonlarıyla 3 kart çekilip "Açılımı Yorumla" ile Gemini API tetiklenmesi sağlandı. | Sally |
| [**MS-102**](#-ms-102) | Task | Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi | Orta | `index.css` dosyasında Google Fonts `Inter` yazı tipi içe aktarıldı, `--font-sans` Inter olarak değiştirildi, gövde metinlerine line-height: 1.8 verildi. | Sally |
| [**MS-101**](#-ms-101) | Bug | Profil Bilgisi Durum Senkronizasyon Hatası | En Yüksek | `App.tsx` içindeki `onUpdateUserInfo` handler'ı güncellendi ... | Sally |
| :--- | :--- | :--- | :--- | :--- | :--- |

## 📋 Tamamlanan Bilet Detayları (Completed Ticket Details)

### 📋 MS-324: Veritabanı Koleksiyon Sayfaları Tarih Filtrelerinin Optimizasyonu (Feature / UX / UI)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / CollectionsTab
* **Açıklama:**  
  Koleksiyon görselleştirme sayfalarındaki tarih periyot filtrelerinin sayfanın alt kısmında çok geniş yer kaplamasını önlemek ve tasarımı sadeleştirmek amacıyla periyot butonları sağ üst köşedeki başlık kontrol alanına (Excel İndir ve Yenile butonlarının yanına) taşındı. Eski kalın gri alt kontrol barı tamamen kaldırıldı.
* **Kabul Kriterleri:**
  1. `CollectionsTab.tsx` üzerinde alt kısımdaki `Control Bar` bileşeni kaldırılmalıdır.
  2. Periyot filtre butonları üst sağ taraftaki eylem butonlarının soluna eklenmeli ve segmented picker görünümünde olmalıdır.
  3. Değişiklik sonrasında arayüz derleme hatası vermemelidir.

---

### 📋 MS-323: Veritabanı Koleksiyon Sayfalarına Dinamik Özet Gösterge Kartları ve Filtrelerin Eklenmesi (Feature / UX / UI)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / CollectionsTab
* **Açıklama:**  
  Yönetici panelindeki "Veritabanı Koleksiyonları" ekranında listelenen verilerin daha okunabilir olması için dinamik özet gösterge (stats) kartları eklendi. Ayrıca kullanıcı listesine "PHONE NUMBER" sütunundan sonra "PREMIUM" sütunu eklendi, onboarding tamamlama göstergesi kaldırıldı, ve koleksiyon sayfalarındaki tarih aralığı filtreleri yerine genel bakış sekmesindeki gibi period filtreleri ("Bugün", "Son 7 Gün", "Son 30 Gün", "Tümü") entegre edildi. Göstergeler ve tablo satırları bu filtrelere göre dinamik olarak filtrelenmektedir.
* **Kabul Kriterleri:**
  1. `users` için: Toplam Kullanıcı, Premium Sayısı, Premium Oranı gösterge kartları (Onboarding kaldırıldı).
  2. `users` tablosunda `PHONE NUMBER` sütunundan sonra `PREMIUM` sütununun eklenmesi.
  3. `user_moons` için: Toplam Kullanıcı, Toplam Bakiye, Satın Alınan Bakiye, Ortalama Bakiye.
  4. `moon_transactions` için: Toplam İşlem, Harcama, Satın Alma, Diğer İşlemler.
  5. `ai_feedback` için: Toplam Geri Bildirim, Ortalama Puan.
  6. `contact_us` için: Toplam Mesaj, Dil Dağılımı (TR, EN, Diğer).
  7. `user_reflections` için: Toplam Yansıma Notu, Yansıma Yazan Eşsiz Kullanıcı Sayısı.
  8. Koleksiyon sayfalarında tarih aralığı input'ları yerine period selector butonlarının eklenmesi ve filtrelerin dinamik çalışması.

---

### 📋 MS-322: Admin Dashboard'dan Kurtarılan Sepet Metriğinin Kaldırılması (Feature / UX / UI)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Uygulamanın mevcut ödeme akışında yarım bırakılan ödemelere tekrar dönülemediği için "Kurtarılan Sepet" (Abandoned Cart Recovery) metriği anlamsız kalmaktaydı. Bu nedenle, genel bakış sekmesindeki bu gösterge kartı, altındaki açıklama yazısı ve ilişkili tüm hesaplama kodları panelden tamamen kaldırılmıştır.
* **Kabul Kriterleri:**
  1. `OverviewTab.tsx` içerisindeki "Kurtarılan Sepet" bilgi kutusu kaldırılmalıdır.
  2. "Doğal Satın Alım Kurtarma Analizi" açıklama satırı kaldırılmalıdır.
  3. `computeNaturalRecovery` fonksiyonu ve `naturalRecoveryRate` değişkenleri kullanılmadığı için temizlenmelidir.

---

### 📋 MS-321: Firestore Bağlantı Sorunları İçin Long Polling Desteği (Bug / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Client App / Firebase
* **Açıklama:**  
  Kullanıcıların kısıtlı ağlarda (güvenlik duvarı, VPN vb.) karşılaştığı Firestore bağlantı zaman aşımı hatalarını çözmek üzere istemci tarafında `experimentalAutoDetectLongPolling` özelliği devreye alındı.
* **Kabul Kriterleri:**
  1. `src/lib/firebase.ts` üzerinde default `getFirestore` yerine `initializeFirestore` kullanılarak `experimentalAutoDetectLongPolling` konfigürasyonu tanımlanmalıdır.

---

### 📋 MS-320: Firestore Phones Koleksiyonu Yetkilendirme ve İstemci Hata Toleransı (Bug / Security / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / Firestore Rules
* **Açıklama:**  
  Admin panelinde veritabanı koleksiyon listelerinde `mail` ve `name` alanlarının `-` gelmesine neden olan `phones` okuma yetki hatası düzeltildi ve istemci tarafındaki veri çekme süreci hata toleranslı hale getirildi.
* **Kabul Kriterleri:**
  1. `firestore.rules` dosyasında `phones` okuma yetkisi çalışan/admin rolüne (`isEmployee()`) açılmalıdır.
  2. `CollectionsTab.tsx` içindeki `fetchUsersMap` veri çekme akışı `Promise.all` yerine bağımsız `try-catch` blokları ile hata toleranslı hale getirilmelidir.

---

### 📋 MS-319: Admin Dashboard Panelinde Premium Kullanıcı Oranı Göstergesi (Feature / UX / UI)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin paneli genel bakış sekmesindeki temel metrikler arasına, sistemdeki aktif premium kullanıcıların sayısını ve tüm kullanıcılara oranını gösteren mor renkli, parıltı (Sparkles) ikonlu gösterge kartı eklenmiş ve ızgara düzeni 4 sütuna genişletilmiştir.
* **Kabul Kriterleri:**
  1. Toplam kullanıcılar arasından `isPremium === true` olan kullanıcılar filtre edilerek premium kullanıcı oranı ve sayısı hesaplanmalıdır.
  2. Arayüzde (OverviewTab) bu oran ve sayıyı gösteren yeni bir bilgi kartı yer almalıdır.

---

### 📋 MS-318: Bekleyen Ödemeler İçin 10 Dakikalık Otomatik Zaman Aşımı ve Temizlik (Feature / Dev / DB)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / FinanceTab / OverviewTab
* **Açıklama:**  
  Ödeme adımı başlatıldıktan sonra yarıda bırakılan veya tarayıcı sekmesi kapatılan işlemlerin admin panelindeki "Bekleyen Ödemeler" listesinde kalıcı olarak birikmesini önlemek amacıyla, 10 dakikadan daha eski olan `pending` durumundaki ödeme taleplerini otomatik olarak `cancelled` durumuna güncelleyen zaman aşımı temizlik mekanizması kurulmuştur.
* **Kabul Kriterleri:**
  1. Finans sekmesi veya Genel bakış sekmesi yüklendiğinde, oluşturulma zamanı üzerinden 10 dakikadan fazla geçmiş ve durumu `pending` olan checkout_attempts belgeleri saptanmalıdır.
  2. Bu belgelerin durumu veritabanında otomatik olarak `cancelled` (`completedMethod: "auto_timeout"`) şeklinde güncellenmeli ve listeden kaldırılmalıdır.

---

### 📋 MS-317: Manuel İptal Edilen Ödemelerin Dashboard Metriklerine Dahil Edilmesi (Bug / Analytics / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin tarafından finans ekranında "İptal Et" butonuyla veya zaman aşımıyla durumu `cancelled` durumuna getirilen ödeme taleplerinin dashboarddaki dönüşüm hunisi ve "Yarıda Bırakanlar" (Abandoned) göstergesinden eksilmesi hatası giderilmiş, `cancelled` durumundakiler de bu metriklere dahil edilmiştir.
* **Kabul Kriterleri:**
  1. `OverviewTab.tsx` dönüşüm hunisi ve sepet terk oranları hesaplanırken status değeri `cancelled` olan ödeme denemeleri de terkedilen işlemler (abandonedCheckouts) içinde sayılmalıdır.
  2. Doğal kurtarma yield hesaplamalarında `cancelled` statüsü göz önüne alınmalıdır.

---

### 📋 MS-316: Satın Alım Geçmişi Dil Seçeneğine Göre Çeviri Düzeltmesi (Bug / Dev / i18n)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Paige (📚 Tech Writer) / Amelia (💻 Developer)
* **Bileşen:** Client App / Profile / Locales
* **Açıklama:**  
  Profil sayfasındaki satın alım geçmişi listesinde, Stripe ödemeleri sonucu oluşan gerçek ödemelerin açıklamalarının hardcoded İngilizce ("Purchase of X Katina Moons") olarak kalma sorunu giderilmiş, tüm diller için `transactionBuyReal` anahtarıyla yerelleştirme desteği eklenmiştir.
* **Kabul Kriterleri:**
  1. `en.yaml`, `tr.yaml`, `es.yaml`, `fr.yaml`, `ko.yaml` ve `zh.yaml` dosyalarına `transactionBuyReal` yerelleştirme şablonları eklenmelidir.
  2. `Profile.tsx` satın alım açıklamalarını formatlarken bu anahtarları kullanmalı ve seçilen dile uygun çevirmelidir.

---

### 📋 MS-315: CqVzXTTMcqQYUnpuszvBpETWbJ32 Kullanıcısına Admin Yetkisi Tanımlanması (Task / Admin / DB)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Backend / Firebase Admin
* **Açıklama:**  
  CqVzXTTMcqQYUnpuszvBpETWbJ32 UID'li kullanıcının admin paneline erişebilmesi amacıyla Firebase Auth Custom Claims yetkilendirmesi `set_admin` scripti ile `role: "admin"` olarak tanımlanmış ve oturumu doğrulanmıştır.
* **Kabul Kriterleri:**
  1. Belirtilen kullanıcı kimliğine (UID) ait hesaba custom claims ile admin rolü başarıyla tanımlanmalıdır.
  2. Kullanıcı admin paneline giriş yapabilmelidir.

---

### 📋 MS-314: Admin Paneli AI Maliyet Göstergelerinin Kaldırılması (Feature / UX / UI / Dev)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin paneli genel bakış sayfasındaki AI (Gemini) maliyet göstergeleri, token maliyet tahminleri ve getiri analizi kartları kullanıcı talebi doğrultusunda arayüzden kaldırılmış, tasarımsal bütünlük yeniden kurulmuştur.
* **Kabul Kriterleri:**
  1. `OverviewTab.tsx` içerisindeki yapay zeka maliyet hesaplama fonksiyonları ve görsel maliyet kartları tasarımdan çıkarılmalıdır.
  2. Arayüzün kalan bileşenleri düzgün hizalanmalı ve görsel bir hata oluşmamalıdır.

---

### 📋 MS-313: Yansıma ve Gerçekleşme Notlarının user_reflections Koleksiyonuna Taşınması ve Güvenlik Kuralları (Feature / Dev / DB)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Winston (📐 Architect) / Amelia (💻 Developer)
* **Bileşen:** Client App / Profile / Firestore Rules
* **Açıklama:**  
  Kullanıcıların geçmiş falları için yazdıkları yansıma ve gerçekleşme notları, veri yalıtımı ve performans amacıyla `moon_transactions` koleksiyonu yerine müstakil `user_reflections` koleksiyonuna taşınmış, `firestore.rules` güvenlik kuralları güncellenmiş ve `Profile.tsx` entegrasyonu buna göre uyarlanmıştır.
* **Kabul Kriterleri:**
  1. Fal yansıma notu kaydetme işlemi `user_reflections` koleksiyonuna `setDoc` ile yapılmalıdır.
  2. Firestore kurallarında `user_reflections` koleksiyonuna sadece ilgili kullanıcının yazma ve okuma izni olmalıdır.
  3. Geçmiş falları listelerken yansıma notları dinamik olarak `user_reflections` üzerinden birleştirilerek (merge) gösterilmelidir.

---

### 📋 MS-312: Admin Paneli Edinim Kanalları ve Tarih Filtresi Senkronizasyonu (Bug / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin paneli genel bakış sekmesindeki "Edinim Kanalları" ve kayıt yöntemleri dağılımının üst kısımda yer alan tarih filtreleri (Bugün, Haftalık, Aylık, Tümü) ile senkronize çalışmama hatası giderilmiş ve tarih aralığına göre dinamik filtrelenmesi sağlanmıştır.
* **Kabul Kriterleri:**
  1. Edinim kanalları ve kayıt yöntemleri listelenirken seçilen tarih aralığı filtre parametreleri (`startDate`, `endDate`) Firestore sorgu sonuçlarında istemci tarafında süzülmelidir.
  2. Filtre değiştiğinde edinim kanalları listesi de anında güncellenmelidir.

---

### 📋 MS-311: Admin Overview Sekmesine Temel Metrikler ve Tarih Filtresi Entegrasyonu (Feature / UX / UI)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin Genel Bakış tablosuna "Kullanıcı Sayısı", "Bakılan Fal Sayısı" ve "Alınan Katina Moon Sayısı" gibi temel performans göstergeleri (KPI) eklenmiş ve bu verilerin tamamı tarih filtreleriyle uyumlu hale getirilmiştir.
* **Kabul Kriterleri:**
  1. Genel bakış sekmesinin üstünde kullanıcı sayısı, fal sayısı ve satılan/alınan Katina Moon adetlerini gösteren kartlar yer almalıdır.
  2. Bu kartlardaki değerler, tarih filtreleri (Bugün, Haftalık, Aylık, Tümü) değiştiğinde dinamik olarak güncellenmelidir.

---

### 📋 MS-310: Son Yorum Değerlendirmelerinde Kullanıcı İletişim Bilgisi Gösterimi (Feature / UX / UI)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Yapay zeka tarot yorum değerlendirmelerinin (ai_feedback) listelendiği "Son Yorum Değerlendirmeleri" tablosunda, anonim veya karmaşık kullanıcı ID'si (UID) yerine kullanıcının e-posta adresi (e-posta yoksa telefon numarası) gösterilerek okunabilirlik artırılmıştır.
* **Kabul Kriterleri:**
  1. Son Yorum Değerlendirmeleri bölümünde kullanıcıyı belirtmek için UID yerine e-posta adresi getirilmelidir.
  2. Eğer kullanıcının kayıtlı e-postası bulunmuyorsa, fallback olarak telefon numarası görüntülenmelidir.

---

### 📋 MS-309: Fal Formu Girdi Alanlarının Büyük Harf (Uppercase) Yapılması (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Client App / FortuneForm
* **Açıklama:**  
  Kullanıcıların fal bakmak için form doldururken girdikleri veya seçtikleri tüm alanların arayüzde tamamen büyük harf (uppercase) olarak gösterilmesi sağlanmıştır.
* **Kabul Kriterleri:**
  1. Ad-Soyadı, Doğum Tarihi ve Doğum Yeri input alanlarına `uppercase` stili verilerek tüm karakterler büyük harf yapılmalıdır.
  2. İlişki Durumu ve Odak Alanı select/option alanlarına `uppercase` stili verilerek gösterim büyük harfe dönüştürülmelidir.

---

### 📋 MS-308: Stripe Bekleyen Ödeme Talepleri İptal Etme Butonu ve Akışı (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Admin Panel / FinanceTab / Backend / Admin API
* **Açıklama:**  
  Kullanıcıların satın alımı tamamlamayıp yarıda bıraktığı ve admin panelinde "pending" olarak biriken ödeme taleplerini listeden temizlemek için iptal akışı eklenmiştir.
* **Kabul Kriterleri:**
  1. Bekleyen işlemler tablosunda "Manuel Onayla" butonunun yanına rose/kırmızı tonlarında "İptal Et" butonu eklenmelidir.
  2. Butona basıldığında Sally'nin glassmorphic tasarım diline uygun rose renkli "Ödeme Talebi İptali" onay penceresi açılmalıdır.
  3. Arka planda `/api/admin/reject-payment` endpoint'i tetiklenerek ilgili `checkout_attempts` durumu `cancelled` yapılmalı ve loglanmalıdır.

---

### 📋 MS-307: Stripe Manuel Ödeme Onayına Ödeme Durumu Doğrulama Koruması (Bug / Security / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Backend / Admin API / Complete Payment
* **Açıklama:**  
  Kullanıcının aslında ödemediği ancak beklemede kalan Stripe oturumlarının admin panelinden manuel olarak onaylanıp haksız moon bakiyesi elde edilmesini önlemek için doğrulama koruması eklenmiştir.
* **Kabul Kriterleri:**
  1. Admin manuel onay endpoint'i (`/api/admin/complete-payment`), onaylanmaya çalışılan Stripe oturumunun durumunu Stripe API üzerinden sorgulamalıdır.
  2. Eğer Stripe üzerinde ödeme durumu `paid` değilse, onaylama işlemi engellenmeli ve hata dönülmelidir.

---

### 📋 MS-306: Stripe Webhook Gecikmesi & Fallback Çakışması (Race Condition) Bug Düzeltmesi (Bug / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Backend / Stripe Webhook / Fallback API
* **Açıklama:**  
  Stripe ödeme webhook'unun geciktiği durumlarda istemcinin fallback API (`/api/verify-checkout-session`) ile webhook'un aynı anda tetiklenmesi durumunda oluşan race condition engellenmiştir.
* **Kabul Kriterleri:**
  1. Ödeme tamamlama ve bakiye yükleme mantığı Firestore `runTransaction` bloğuna alınarak atomik hale getirilmelidir.
  2. Bir istek işlemi tamamlayıp statüyü `completed` yaptığında, diğer eşzamanlı istek bu durumu görüp işlemi tekrarlamamalı ve mükerrer bakiye yüklenmesi engellenmelidir.

---

### 📋 MS-305: Login Ekranından Apple Giriş Seçeneğinin Kaldırılması (Feature / Dev / UX)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Web Client / Authentication / UI
* **Açıklama:**  
  Apple geliştirici hesabı ücretli olduğu için giriş ekranından Apple Giriş Yap (Apple Sign-In) butonunu ve ilgili kod bloklarını kaldırdık.
* **Kabul Kriterleri:**
  1. `src/components/Login.tsx` dosyasındaki Apple Giriş butonları (hem E-posta hem de Telefon formlarında) kaldırıldı.
  2. `handleAppleLogin` fonksiyonu temizlendi.
  3. `Apple` ikonu importu temizlendi.
  4. Uygulama hatasız derlendi ve çalıştı.

---



### 📋 MS-304: Bütün Dokümanların Güncel Uygulamaya Göre Güncellenmesi (Documentation)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Paige (📚 Technical Writer / `bmad-agent-tech-writer`)
* **Bileşen:** Database / API / Documentation
* **Açıklama:**  
  Son eklenen Premium Üyelik (`isPremium`) flag ve yetki açılımları, manuel ödeme onaylama alanları, API uç noktaları (Stripe ödeme doğrulamaları, tampon loglama, fatura makbuzları vb.) ve Stripe CLI entegrasyonu rehberi doğrultusunda tüm mimari ve geliştirme kılavuzlarının güncellenmesi.
* **Kabul Kriterleri:**
  1. `data-models.md` ve `data-models-monolith.md` şemaları güncellenmeli.
  2. `api-contracts.md` ve `api-contracts-monolith.md` yeni API uç noktalarını içerecek şekilde güncellenmeli.
  3. `development-guide.md` yerel Stripe CLI webhook dinleme adımlarını barındırmalı.

---

### ✅ MS-290: Çalışan Yetkileri Ekranından Şifre Güncelleme/Sıfırlama Desteği (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend / Security
* **Açıklama:**  
  Süper Adminlerin, Çalışan Yetkileri sekmesi üzerinden mevcut çalışan veya yöneticilerin şifrelerini (örneğin unuttuklarında) doğrudan güncelleyebilmesini/sıfırlayabilmesini sağlamak amacıyla `/api/admin/set-role` endpoint'ine ve PermissionsTab arayüzüne şifre güncelleme desteği eklenmiştir.
* **Kabul Kriterleri:**
  1. Mevcut bir kullanıcının e-posta adresi yazılıp şifre girildiğinde sunucu bu şifreyi Firebase Auth üzerinde güncellemelidir (`updateUser`).
  2. Başarılı güncelleme durumunda arayüzde şifrenin güncellendiğine dair başarılı bildirim mesajı gösterilmelidir.
  3. Proje hatasız derlenmeli ve test edilmelidir.

---

### ✅ MS-287: Admin Paneli Altyapısı, Monorepo Dizin Kurulumu ve Firebase Client Entegrasyonu (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Elif (USER)
* **Kabul Kriterleri:**
  1. Admin Paneli Altyapısı, Monorepo Dizin Kurulumu ve Firebase Client Entegrasyonu gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-286: Sözleşme Onay Modalı, Kart Seçim Ritüeli, Bildirimler ve Login Ekranı Yerelleştirilmesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Elif (USER)
* **Kabul Kriterleri:**
  1. Sözleşme Onay Modalı, Kart Seçim Ritüeli, Bildirimler ve Login Ekranı Yerelleştirilmesi gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-285: Admin Paneli Sol Menü Hizalama ve Moon Harcamaları Tablosu Geliştirmesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Elif (USER)
* **Kabul Kriterleri:**
  1. Admin Paneli Sol Menü Hizalama ve Moon Harcamaları Tablosu Geliştirmesi gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-284: Backlog Biletlerinin GitHub Kanban Panosuna Taşınması (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Kabul Kriterleri:**
  1. Backlog Biletlerinin GitHub Kanban Panosuna Taşınması gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-283: Profil Bilgisi Durum Senkronizasyon Hatası (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Kabul Kriterleri:**
  1. Profil Bilgisi Durum Senkronizasyon Hatası gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-282: Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Kabul Kriterleri:**
  1. Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-281: İnteraktif Kart Seçim Ritüelinin Geliştirilmesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend
* **Açıklama:**  
  * **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Kabul Kriterleri:**
  1. İnteraktif Kart Seçim Ritüelinin Geliştirilmesi gerçekleştirildi.
  2. Proje hatasız derlendi.

---

### ✅ MS-280: Express Log Buffer (Toplu Hata Yazma) Mimarisi (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Winston (🏗️ System Architect) & Amelia (💻 Dev)
* **Bileşen:** Backend / API / Error Logging / Buffer
* **Açıklama:**  
  Firestore write (yazma) maliyetlerini ve veritabanı üzerindeki anlık yazma baskısını azaltmak amacıyla hem sunucu hem de istemci taraflı hatalar için bellek içi bir tamponlama (`LogBuffer`) ve toplu yazma mimarisi kuruldu.
* **Kabul Kriterleri:**
  1. Hataları in-memory buffer'layan ve limit (10) veya süre (5 sn) dolduğunda `writeBatch` ile toplu yazan `LogBuffer` sınıfı oluşturuldu.
  2. İstemci loglarının post edilmesi için `/api/logs` endpoint'i yazıldı.
  3. Frontend tarafındaki `addDoc(collection(db, 'error_logs'))` doğrudan yazma çağrıları kaldırıldı ve `/api/logs` endpoint'ine yönlendirildi.
  4. Sunucu kapanış sinyallerinde (`exit`, `SIGINT`, `SIGTERM`) tamponda kalan logların diske güvenle yazılması sağlandı.

---

### ✅ MS-279: Firestore Güvenlik Kuralları Birim Test Altyapısının Kurulması (Feature / Dev / Test)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Security / Database / Unit Testing / Rules
* **Açıklama:**  
  `firestore.rules` güvenlik kurallarını Firestore emülatörü üzerinde test eden, Vitest tabanlı bir birim test altyapısı ve senaryoları entegre edildi.
* **Kabul Kriterleri:**
  1. `@firebase/rules-unit-testing` ve `firebase-tools` bağımlılıkları yüklendi.
  2. `/users`, `/user_moons`, `/error_logs` ve `/admin_audit_logs` gibi kritik yolları kapsayan test paketi (`tests/unit/firestore-rules.test.ts`) oluşturuldu.
  3. `package.json` dosyasına emülatörü kaldırıp kuralları test eden `test:rules` script'i eklendi.

---

### ✅ MS-278: Admin Paneli Sol Menü Hizalama ve Moon Harcamaları Tablosu Geliştirmesi (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Navigation / Collections Tab
* **Açıklama:**  
  Admin paneli sol menü butonlarının hizalaması düzenlendi, moon_transactions koleksiyonu listelendiğinde gösterilecek sütunlar özelleştirildi ve sütunlar için A-Z sıralama yeteneği eklendi.
* **Kabul Kriterleri:**
  1. Admin paneli sol menüdeki yönlendirme butonları sola hizalı hale getirildi (`justify-start`).
  2. Moon transaction listesinde (moon_transactions koleksiyonu) sütunlar sırasıyla şunlar oldu: ID, Username, createdat, Description, Cards, status, type, userbrithplace, userbirhthdate, userlanguage, userrelationship, pdfdowlanded.
  3. Her bir sütun başlığına tıklandığında ilgili sütuna göre A-Z / Z-A sıralama yapabilen sütun bazlı sıralama mekanizması eklendi.
  4. Proje hatasız derlendi.

---

### ✅ MS-277: Sözleşme Onay Modalı, Kart Seçim Ritüeli, Bildirimler ve Login Ekranı Yerelleştirilmesi (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Legal Consent / Drawing / Soft Prompt / Locales / Login
* **Açıklama:**  
  GDPR sözleşme onay modalı, interaktif kart çekme ritüeli, web push izin penceresi, tüm toast bildirimleri, profil sayfası ayarları ve Giriş (Login) ekranı (şifremi unuttum butonu, açık rıza metni) 6 dilde yerelleştirildi. Giriş ekranından tanıtım sihirbazı butonu kaldırıldı.
* **Kabul Kriterleri:**
  1. GDPR sözleşme onay modalındaki başlıklar, butonlar ve alt başlıklar yerelleştirildi.
  2. Kart çekme ritüeli başlığı, alt başlığı, çekilen kart sayısı ve interprets spread butonu yerelleştirildi.
  3. Web push izin modalı, toast bildirimleri ve profil ayarları yerelleştirildi.
  4. Giriş (Login) ekranındaki şifre sıfırlama (şifremi unuttum) butonu ve alttaki açık rıza onay metni yerelleştirildi.
  5. Giriş (Login) ekranından uygulama tanıtımını izle/gör butonu kaldırıldı.
  6. Proje hatasız derlendi.

---

### 📋 MS-276: Veritabanı Modelleri Dokümantasyonunun Güncellenmesi (Documentation)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Paige (📚 Technical Writer / `bmad-agent-tech-writer`)
* **Bileşen:** Database / Documentation
* **Açıklama:**  
  Görüntüleyici (`viewer`) rolü yetkileri ve güncellenen `firestore.rules` kuralları doğrultusunda veritabanı şema dokümantasyonunun (`data-models.md` ve `data-models-monolith.md`) güncellenmesi.
* **Kabul Kriterleri:**
  1. `viewer` rolü yetkileri ilgili tüm koleksiyon açıklamalarına eklenmelidir.
  2. `admin_users` şemasında deaktif olan yazma yetkisi `admin` rolü için güncellenmelidir.
  3. `config_logs` ve `admin_audit_logs` gibi decommissioned logların `viewer` okuma izinleri eklenmelidir.

---

### ✅ MS-271: Admin Paneli Altyapısı, Monorepo Dizin Kurulumu ve Firebase Client Entegrasyonu (Feature / Dev)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / React / Vite / Routing
* **Açıklama:**  
  MadameSoul ana deposu altında bağımsız çalışan bir admin paneli uygulaması oluşturulması. `/admin` dizininde React v19, Vite ve Tailwind CSS v4 tabanlı bir mimari kurulacaktır. Firebase Client SDK kurulacak ve `/admin/login` ile `/admin/dashboard` arası `ProtectedRoute` yetki kontrolleri (admin/employee) eklenecektir.
* **Kabul Kriterleri:**
  1. `/admin` dizini altında Vite+React projesi kurulup `npm run dev` ile `3001` portunda sorunsuz çalışmalı.
  2. Firebase Client SDK entegrasyonu tamamlanıp `/admin/login` sayfasında giriş yapabilmeli.
  3. Kullanıcının Custom Claims rol bilgisine göre (`role === 'admin'` veya `'employee'`) admin sayfalarına erişim izinleri ve `ProtectedRoute` kontrol edilmeli.

---

### ✅ MS-272: İlk Admin Seed Script'inin Yazılması ve Custom Claims Yetkilendirmesi (Feature / Dev)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Security / Firebase Auth / DB Seed
* **Açıklama:**  
  İlk admin kullanıcısı `elifterzi@yandex.com` (şifre: `613415`) için Firebase Auth üzerinde kayıt oluşturulması, `admin` yetki Custom Claims kaydının Firebase Admin SDK aracılığıyla atanması ve `admin_users` koleksiyonuna yazılması için `scripts/seed-admin.ts` script'inin kodlanması ve çalıştırılması.
* **Kabul Kriterleri:**
  1. `seed-admin.ts` scripti `ts-node` or `tsx` ile çalıştırılabilir olmalı.
  2. Belirtilen e-posta ve şifreye sahip kullanıcı Firebase Auth'a eklenmeli.
  3. Kullanıcıya `admin` custom claim'i atanmalı ve `admin_users` koleksiyonunda doğru yetki (role: 'admin') ve id ile kayıt oluşturulmalı.

---

### ✅ MS-273: Firestore Koleksiyon Görselleştirme ve Bakiye Yönetimi (Sekme 1 & 2) (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / UX / UI / Firestore / Moon Balance
* **Açıklama:**  
  Admin Panelinin 1. ve 2. sekmelerinin geliştirilmesi. 
  - **Sekme 1 (Firestore Görselleştirme):** Veritabanındaki koleksiyonları listeleyen, günlük/aylık/yıllık filtreleyebilen ve A-Z sıralayabilen bir arayüz tasarlanması.
  - **Sekme 2 (Moon Bakiye Yönetimi):** Kullanıcı arama, mevcut bakiye listeleme ve manuel olarak bakiye artırma/azaltma işlemlerini gerçekleştiren, çift onaylı güvenlik modalına sahip ekran. Her bakiye değişikliği `admin_audit_logs` koleksiyonuna loglanacaktır.
* **Kabul Kriterleri:**
  1. Sekme 1'de veritabanı koleksiyonları tarihe göre filtreli ve A-Z sıralı listelenebilmeli.
  2. Sekme 2'de kullanıcıların Moon bakiyeleri manuel artırılıp azaltılabilmeli.
  3. Bakiye değişikliklerinde "Neden" bilgisi zorunlu kılınmalı ve bu işlem `admin_audit_logs` koleksiyonuna kaydedilmeli.

---

### ✅ MS-274: Stripe Ödeme Takibi, Finansal Tablolar ve Sistem Logları Ekranı (Sekme 3 & 4) (Feature / UX / UI / Dev)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Stripe / Financial Reports / System Logs
* **Açıklama:**  
  Admin Panelinin 3. ve 4. sekmelerinin geliştirilmesi.
  - **Sekme 3 (Stripe & Finans):** Stripe satın almalarını listeleyen, aylık/yıllık gelir grafiklerini ve metrikleri gösteren finansal tablolar arayüzü.
  - **Sekme 4 (Sistem Logları):** Uygulamadaki api veya ekran hatalarının (error_logs koleksiyonunun) günlük/aylık/yıllık filtreleme ve A-Z sıralama ile listelendiği, Canlı İzle modu içeren konsol ekranı.
* **Kabul Kriterleri:**
  1. Sekme 3'te Stripe ciro ve ödeme durumu bilgileri grafikler ve metrik kartları ile sunulmalı.
  2. Sekme 4'te `error_logs` koleksiyonundaki sistem hataları günlük/aylık/yıllık filtrelenebilmeli, arama yapılabilmeli.

---

### ✅ MS-275: Çalışan Rolleri ve Yetki Yönetim Ekranı (Sekme 5) (Feature / UX / UI / Dev)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Security / Permissions / RBAC
* **Açıklama:**  
  Admin Panelinin 5. sekmesi. Çalışanların listelenmesi ve onlara 3 farklı rolden (Admin, Çalışan, Görüntüleyen) birinin atanması. Yetki seviyelerine göre ekranlardaki işlevlerin kısıtlanması (Örn: Çalışan değişiklik yapabilir ama silemez ve her değişikliği loglanır. Görüntüleyen hiçbir değişiklik yapamaz, salt okunurdur).
* **Kabul Kriterleri:**
  1. Sekme 5 üzerinden çalışanların rolleri değiştirilebilmeli.
  2. Rol değişiklikleri Firebase Custom Claims ve `admin_users` belgesi üzerinde güncellenmeli.
  3. Arayüz yetki sınırlarına göre dinamik olarak butonları/ekranları gizlemeli veya kısıtlamalı.

---

## 🚫 İptal Edilen Bilet Detayları (Cancelled Ticket Details)

### 📋 MS-288: Yerel Geliştirme (Bypass) Modunda AI Token Kullanımlarının Kaydedilmesi (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** 🚫 İptal Edildi (Cancelled)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / Backend / Telemetry
* **Açıklama:**  
  Yerel geliştirme ve bypass modunda (`useFirebaseAdmin = false`) fal bakıldığında, harcanan prompt/completion/total token verilerinin Firestore'daki `ai_usage_logs` ve `ai_telemetry` koleksiyonlarına düzgünce kaydedilmesi sağlandı. (Kullanıcı talebi doğrultusunda tüm token geliştirmeleri geri alınarak bu bilet iptal edilmiştir).
* **Kabul Kriterleri:**
  1. Sunucu local bypass modundayken de token verileri yakalandı.
  2. `ai_telemetry` ve `ai_usage_logs` koleksiyonlarına yerel emülatör üzerinde başarıyla yazıldı.
  3. Proje hatasız derlendi.

---

### 📋 MS-261: Bug / Dev | E-posta Bildirim Gönderim Hatalarının Düzeltilmesi (Bug / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** 🚫 İptal Edildi (Cancelled)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend / E-posta Gönderimi / SMTP
* **Açıklama:**  
  Asenkron olarak fal yorumlama bittiğinde tetiklenmesi gereken mor-altın temalı e-posta bildirim gönderimindeki hatalar giderilmeli, kullanıcının gelen kutusuna e-postanın sorunsuz düşmesi sağlanmalıdır.
* **Kabul Kriterleri:**
  1. Nodemailer SMTP bağlantı hataları giderilmeli ve sunucu loglarında doğrulanmalıdır.
  2. Fal tamamlandığında e-posta gönderim fonksiyonu asenkron olarak güvenle tetiklenmelidir.
  3. HTML şablonundaki dinamik alanların (Kullanıcı Adı, Çekilen Kartlar) doğru doldurulduğu doğrulanmalıdır.

---

### 📋 MS-260: Premium Mistik Şarj ve Göksel Yükleme Ritüeli Ekranı (Feature / UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** 🚫 İptal Edildi (Cancelled)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) & Amelia (💻 Developer Agent)
* **Bileşen:** Frontend Arayüzü / Yükleme Deneyimi
* **Açıklama:**  
  Kullanıcının fal bekleme süresindeki deneyimi premium hissettirecek şekilde güncellenmelidir. Basit bir bekleme yazısı yerine, ekranı kaplayan, mor-siyah glassmorphism efektli, parıldayan göksel ay fazlarının yavaşça döndüğü, mistik ses efektleri ve kullanıcının parmağıyla basılı tutarak kartları "şarj" edebileceği interaktif bir ritüel ekranı geliştirilmelidir.
* **Kabul Kriterleri:**
  1. Yükleme ekranı tam sayfa, derin mor-siyah mistik temalı olmalıdır.
  2. Kullanıcının basılı tutarak kartların mistik gücünü şarj edebileceği bir interaktif alan (Touchstone / Kristal Küre) bulunmalıdır. Basılı tutulduğunda göksel parçacık efektleri yayılmalıdır.
  3. Aşamalı olarak değişen ay fazları animasyonu bulunmalıdır.
  4. Mistik ses efektleri (arka plan ambient ve chime sesleri) entegre edilmelidir.

---

### 📋 MS-259: FCM Push Bildirim Altyapısı Hatalarının Düzeltilmesi (Bug / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** 🚫 İptal Edildi (Cancelled)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Web Push Bildirimleri / FCM / Service Worker
* **Açıklama:**  
  Uygulamadaki push bildirim kaydı (`user_push_tokens`) ve fal tamamlandığında sunucudan atılan tetikleme mekanizması çalışmamaktadır. FCM konfigürasyonu ve service worker entegrasyonu hata vermeden çalışacak şekilde düzeltilmelidir.
* **Kabul Kriterleri:**
  1. İstemci tarafında FCM push izni istendiğinde ve token alındığında Firestore'a güncel şekilde yazılması sağlanmalıdır.
  2. `/sw.js` (veya `firebase-messaging-sw.js` entegrasyonu) arka plan bildirimlerini sorunsuz yakalamalıdır.
  3. Sunucu tarafında fal bittiğinde Firebase Admin SDK üzerinden push bildirimi başarıyla tetiklenmelidir.

---

---

## ✅ Tamamlanan Bilet Detayları (Completed Ticket Details)

### 📋 MS-270: Firestore Kuralları ve İstemci Yetki Hatalarının Düzeltilmesi (Bug / Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Database / Security / Firebase Firestore
* **Açıklama:**  
  Firestore veritabanı istemci erişiminin test modu süresinin dolması sebebiyle oluşan erişim kesintisi uyarısı ve kullanıcı dokümanlarına yazma/güncelleme esnasında oluşan yetki hataları (permission denied) çözülmüştür.
* **Kabul Kriterleri:**
  1. Yerel `firestore.rules` kuralları Firebase sunucusuna başarıyla deploy edilmelidir.
  2. Kullanıcıların giriş akışında ve onboarding sürecinde aldıkları yetki (Missing or insufficient permissions) hataları giderilmelidir.
  3. `users` koleksiyonu veri şeması kurallarına (lastLogin alanı kontrolü) uygun olarak istemci tarafındaki `setDoc` ve `updateDoc` çağrıları düzenlenmelidir.

---

### 📋 MS-267: Fal Yorumları Sistem Promptu Optimizasyonu (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend / Local LLM / System Prompt
* **Açıklama:**  
  Yerel yapay zeka (LM Studio) Katina Tarot yorumlama performansını, veri sadaketini ve mistik ton bütünlüğünü artırmak için sistem promptunun optimize edilmesi başarıyla sağlandı.
* **Kabul Kriterleri:**
  1. `server.ts` içerisindeki yerel LLM sistem promptu güncellenmelidir.
  2. Yeni prompt, resmi tanımlara bağlılığı ("veri sadakati"), kartlar arası ilişkilendirmeyi ("bağlam ve bütünlük"), mistik dili ve gereksiz token tasarrufunu içermelidir.
  3. Güvenlik sınırı kuralı kaldırılmalıdır.

---

### 📋 MS-266: Bildirimlerin Sağ Üstte Gösterilmesi ve Ses Efekti Eklenmesi (Feature / UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Frontend Arayüzü / Toast Bildirimleri / Ses Efektleri
* **Açıklama:**  
  Uygulamadaki tüm Toast bildirimlerinin ekranın sağ üst köşesinde gösterilmesi ve her bildirim tetiklendiğinde mistik bir chime ses efektinin (`reveal.wav`) çalınması başarıyla sağlandı.
* **Kabul Kriterleri:**
  1. Toast bildirim bileşeni (Toast container) konumlandırması ekranın sağ üst köşesine (`fixed top-6 left-6 right-6 md:left-auto md:right-6`) alınmalıdır.
  2. Sağ üst konumlandırmaya uygun olarak giriş/çıkış animasyonları (motion) yukarıdan aşağıya doğru süzülecek şekilde (`y: -50`) güncellenmelidir.
  3. `showToast` fonksiyonu tetiklendiğinde `/assets/audio/reveal.wav` ses dosyası çalınmalıdır.

---

### 📋 MS-265: Fal Tamamlandığında Ekrana Bildirim Gönderilmesi (Bug / Dev / UX)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Frontend Arayüzü / Yükleme Deneyimi / Toast Bildirimleri
* **Açıklama:**  
  Fal başarıyla tamamlandığında ekranda Toast bildirim gösterimi ve tarayıcı izin verdiyse yerel tarayıcı bildirim gönderimi entegre edildi.
* **Kabul Kriterleri:**
  1. Fal yorumu başarıyla üretilip tamamlandığında ekranda Türkçe "Falınız hazır!" veya İngilizce "Your reading is ready!" Toast bildirimi gösterilmelidir.
  2. Kullanıcı tarayıcı bildirimlerine izin verdiyse, fal hazır olduğunda bir native Notification tetiklenmelidir.

---

### 📋 MS-264: Local LLM Tutarlı Yorumlar İçin System Prompt Hazırlanması (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend / Local LLM / LM Studio
* **Açıklama:**  
  Yerel yapay zeka (LM Studio) istek gövdesine, kartları YAML dosyalarındaki resmi tanımlara göre yorumlamasını zorunlu kılan 'system' mesajı başarıyla eklendi.
* **Kabul Kriterleri:**
  1. `server.ts` içerisindeki yerel LLM istek gövdesine `role: "system"` içeren mesaj eklenmelidir.
  2. Sistem mesajı, modelin kartları YAML dosyalarındaki resmi tanımlara göre yorumlamasını zorunlu kılmalıdır.
  3. Yapılan değişikliklerin sistem çalışmasını bozmadığı doğrulanmalıdır.

---

### 📋 MS-263: Web Push Bildirim Ayarları Hatalarının Düzeltilmesi (Bug / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Web Push Bildirimleri / FCM / Service Worker
* **Açıklama:**  
  Web push bildirim ayarlarında hata alınması sorununun çözülmesi ve FCM/Service worker entegrasyonunun düzeltilmesi.
* **Kabul Kriterleri:**
  1. İstemci tarafında FCM push izni istendiğinde ve token alındığında Firestore'a güncel şekilde yazılması sağlanmalıdır.
  2. `/sw.js` (veya `firebase-messaging-sw.js` entegrasyonu) hem localhost'ta hem de production'da arka plan bildirimlerini sorunsuz yakalamalıdır.
  3. Sunucu tarafında fal bittiğinde Firebase Admin SDK üzerinden push bildirimi başarıyla tetiklenmelidir.

---

### 📋 MS-262: MS-245 Sonrası Tüm Geliştirmelerin Geri Alınması ve Kod Temizliği (Revert / Cleanup)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Tüm Sistem / Git Deposu
* **Açıklama:**  
  Kullanıcının talebi üzerine, MS-245 biletinden sonra yapılan tüm biletlerin (MS-246'dan MS-261'e kadar) geliştirmeleri tamamen silinmiş, kod tabanı temizlenmiş ve git deposu MS-244 sürümüne (`71df6d3`) resetlenmiştir. Ayrıca yerel yapay zeka sunucusu (LM Studio) için `sk-lm-SpHxEapY:mZe0d09rsmfDiJV5IL9x` token'ı tanımlanmış ve `server.ts` içerisindeki 45 saniyelik zaman aşımı (timeout) sınırı kaldırılmıştır.
* **Kabul Kriterleri:**
  1. MS-246 ile MS-261 arasındaki tüm bilet geliştirmeleri (kod değişiklikleri) silinmiş olmalıdır.
  2. Git deposu `71df6d3` (MS-244) durumuna getirilmiş olmalıdır.
  3. Yerel AI token bilgisi `.env` dosyasında güncellenmiş olmalıdır.
  4. `server.ts` içerisindeki 45 saniyelik timeout kaldırılmış olmalıdır.
* **Geri Alınan Biletler:**
  - **MS-261:** E-posta Bildirim Gönderim Hatalarının Düzeltilmesi (Geliştirme aşamasındayken geri alındı)
  - **MS-260:** Premium Mistik Şarj ve Göksel Yükleme Ritüeli Ekranı (Geliştirme aşamasındayken geri alındı)
  - **MS-259:** FCM Push Bildirim Altyapısı Hatalarının Düzeltilmesi (Geliştirme aşamasındayken geri alındı)
  - **MS-257:** Onboarding Giriş Akışının Düzenlenmesi
  - **MS-256:** E-posta Giriş Ekranı Şifre Sıfırlama (Forgot Password) Desteği
  - **MS-255:** Fal Yorumları İçin Dinamik Çok Dilli System Prompt ve Kart Çeviri Entegrasyonu
  - **MS-254:** Asenkron Fal Yorumları İçin Push Bildirim Altyapısı
  - **MS-253:** Asenkron Fal Yorumları İçin E-posta Bildirim Altyapısı
  - **MS-252:** Local LLM Entegrasyonu Response Validation ve Sanitization
  - **MS-251:** Local LLM Entegrasyonu Error Handling ve Fallback Mekanizması
  - **MS-250:** Local LLM Entegrasyonu Mock ve Entegrasyon Test Kapsamı
  - **MS-249:** Fal Yorumlama Süreci Streaming (Akış) Entegrasyonu
  - **MS-248:** Asenkron & Event-Driven Fal Yorumlama Backend Altyapısı
  - **MS-247:** Mistik Bekleme Ekranı ve Yükleme Animasyonları
  - **MS-246:** Fal Yorumları İçin System Prompt Tasarımı ve Token Sınırlandırması
* **Çözüm:**
  Kod tabanı başarıyla MS-244/245 sürümüne sıfırlandı, belirtilen tüm biletlerin geliştirmeleri kaldırıldı, `.env` token tanımlandı, API zaman aşımı sınırı kaldırıldı ve sistemin sorunsuz çalıştığı doğrulandı.


---

### 📋 MS-257: Onboarding Giriş Akışının Düzenlenmesi (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Onboarding / Arayüz
* **Açıklama:**  
  Uygulamanın onboarding tanıtım ekranının ilk açılışta değil, kullanıcının sisteme ilk kez giriş yaptıktan sonra, sözleşme onay modalından hemen önce gösterilmesi, sonraki girişlerde ise gösterilmemesi sağlanmalıdır.
* **Kabul Kriterleri:**
  1. Login ekranı ilk açılışta doğrudan görüntülenmelidir.
  2. Başarılı login/register sonrasında eğer kullanıcı onboarding tamamlamamışsa, onboarding gösterilmelidir.
  3. Onboarding tamamlandıktan/atlandıktan sonra sözleşme/onay modalı (TermsModal) gelmelidir.
  4. Sonraki girişlerde onboarding gösterilmemelidir.
* **Çözüm:**
  Uygulama açılışında direkt login ekranına yönlendirme sağlandı. Giriş sonrası onboarding durumu localStorage ve Firestore üzerinden kontrol edilerek ilk girişte gösterildi, sonrasında atlandı.

---

---

### 📋 MS-256: E-posta Giriş Ekranı Şifre Sıfırlama (Forgot Password) Desteği (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Kimlik Doğrulama / Arayüz
* **Açıklama:**  
  Kullanıcıların şifrelerini unuttuklarında Firebase Authentication üzerinden şifre sıfırlama e-postası gönderebilmeleri için giriş ekranına "Şifremi Unuttum" butonu eklenmeli ve fonksiyonu kurulmalıdır.
* **Kabul Kriterleri:**
  1. Giriş yapma ekranındaki şifre alanının hemen altında "Şifremi Unuttum" / "Forgot Password?" butonu olmalı.
  2. Butona tıklandığında `sendPasswordResetEmail(auth, email)` API'si çalıştırılmalı ve kullanıcıya başarı veya hata durumları bildirilmelidir.
  3. Başarı durumunda mor-altın temaya uygun yeşil başarı mesajı gösterilmeli.
* **Çözüm:**
  Firebase `sendPasswordResetEmail` entegrasyonu tamamlandı, hata ve başarı durum göstergeleriyle arayüze buton eklendi.

---

---

### 📋 MS-255: Fal Yorumları İçin Dinamik Çok Dilli System Prompt ve Kart Çeviri Entegrasyonu (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Technical Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yapay Zeka Entegrasyonu / Çoklu Dil Desteği
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Uygulamanın 5 dil desteğine (Türkçe, İngilizce, İspanyolca, Fransızca, Korece, Çince) uyumlu şekilde, local LLM isteklerinde dinamik olarak kullanıcının login dilinde system prompt ve fal yorumu üretilmesi sağlanmalıdır. Ayrıca kart isimleri ve yorumlarının serbest/kafaya göre değil, locales klasöründeki YAML dosyalarında (`en.yaml`, `es.yaml` vb.) tanımlı resmi kart isim ve açıklamalarını kullanması zorunlu kılınmalıdır.
* **Kabul Kriterleri:**
  1. Sunucu tarafında `server.ts` içinde `matchedCards` oluşturulurken, kart isim ve açıklamaları `getTranslation(language, ...)` fonksiyonuyla kullanıcının seçtiği dildeki YAML dosyasından dinamik olarak çekilmelidir (Varsayılan dil İngilizce).
  2. Local LLM'e (Gemma 4 12B) gönderilen System Prompt'ta modelin sadece talep edilen dilde ({LANGUAGE}) yanıt vermesi kesin olarak zorunlu kılınmalıdır.
  3. System Prompt talimatlarında, modelin kartları yorumlarken sadece girdide sağlanan resmi ad ve açıklama metinlerine sadık kalması, kendi kafasından anlam uydurmaması ("strictly grounded") emredilmelidir.
* **Çözüm:**
  Lokasyon YAML dosyalarındaki resmi kart isim ve açıklamalarına sadık kalarak 5 farklı dilde dinamik prompt oluşturma desteği sağlandı.

---

---

### 📋 MS-254: Asenkron Fal Yorumları İçin Push Bildirim Altyapısı (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bildirimler / Web Push
* **Açıklama:**  
  Fal tamamlandığında kullanıcının tarayıcısına/cihazına kilit ekranında merak uyandıracak mistik dilde bir push bildirim gönderilmesi sağlanmalıdır.
* **Kabul Kriterleri:**
  1. FCM (Firebase Cloud Messaging) aracılığıyla "Katina senin için fısıldamayı bitirdi..." temalı push notification tetiklenmelidir.
  2. Bildirime tıklandığında kullanıcının doğrudan fal sonuç sayfasına yönlendirilmesi sağlanmalıdır.
* **Çözüm:**
  FCM Push entegrasyonunda başlık/gövde şablonları güncellendi, fal tamamlandığında mistik push bildirimi tetiklenmesi sağlandı.

---

---

### 📋 MS-253: Asenkron Fal Yorumları İçin E-posta Bildirim Altyapısı (Feature / Dev)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bildirimler / E-posta Modülü
* **Açıklama:**  
  Fal yorumunu beklemeden uygulamadan çıkan kullanıcılar için fal hazır olduğunda mistik ve premium tasarımlı bir zarf görünümünde e-posta bildirimi gönderilmelidir.
* **Kabul Kriterleri:**
  1. Koyu mor/altın temalı, kart görsellerini öne çıkaran şık bir HTML e-posta şablonu tasarlanmalı.
  2. Nodemailer veya entegre bir e-posta API'si ile fal tamamlandığında otomatik gönderim tetiklenmelidir.
* **Çözüm:**
  Nodemailer SMTP modülü entegre edildi; fal tamamlandığında mor/altın temalı şık HTML e-postası otomatik olarak gönderilmektedir.

---

---

### 📋 MS-252: Local LLM Entegrasyonu Response Validation ve Sanitization (Feature / Dev)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Güvenlik / Veri Doğrulama
* **Açıklama:**  
  Yapay zekadan gelen ham yanıtların beklenmedik karakterler veya bozuk yapılar içermesi durumunda frontend'in patlamasını önlemek için schema doğrulaması ve HTML/Markdown sanitization süreçleri eklenmelidir.
* **Kabul Kriterleri:**
  1. Gelen metin render edilmeden önce tehlikeli script/etiketlerden arındırılmalı (sanitize).
  2. Başlık yapılarının (Markdown) frontend hiyerarşisine uygunluğu doğrulanmalı.
* **Çözüm:**
  HTML script/event temizliği ve başlık hiyerarşisi (# -> ##) doğrulaması yapan `sanitizeAndValidateReading` fonksiyonu eklendi.

---

---

### 📋 MS-251: Local LLM Entegrasyonu Error Handling ve Fallback Mekanizması (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend / Hata Yönetimi
* **Açıklama:**  
  Local LM Studio API'sine erişilemediğinde (servis kapalı, model yüklü değil veya timeout durumlarında) sistemin kilitlenmesini önleyecek hata yakalama ve yedek fallback mekanizmaları kurulmalıdır.
* **Kabul Kriterleri:**
  1. İstek zaman aşımı (timeout) süreleri tanımlanmalı, LM Studio servis hataları yakalanmalıdır.
  2. Hata durumunda kullanıcıya mistik dilde uyarı gösterilmeli ve duruma göre yedek modele (Gemini API fallback) geçiş veya bakiye iadesi tetiklenmelidir.
* **Çözüm:**
  Local LLM koptuğunda veya hata verdiğinde Gemini API modellerine otomatik fallback geçişi ve bakiye iadesi entegre edildi.

---

---

### 📋 MS-250: Local LLM Entegrasyonu Mock ve Entegrasyon Test Kapsamı (Code Quality / Dev)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Test Otomasyonu
* **Açıklama:**  
  CI/CD ve yerel test süreçlerinin local LLM sunucusunun aktifliğine bağımlı kalmadan stabil çalışabilmesi için Vitest ve Playwright testlerinde API mock yapısı kurulmalıdır.
* **Kabul Kriterleri:**
  1. LM Studio API uç noktalarına giden isteklerin test ortamında `msw` veya yerel mock mekanizmalarıyla taklit edilmesi doğrulanmalı.
  2. Test suite'leri local LLM ayakta olmasa bile başarıyla (`green`) tamamlanabilmelidir.
* **Çözüm:**
  Vitest test ortamında local AI fetch bağlantıları `NODE_ENV === 'test'` kontrolüyle mocklanarak testlerin dış bağımlılıksız ve stabil çalışması sağlandı.

---

---

### 📋 MS-249: Fal Yorumlama Süreci Streaming (Akış) Entegrasyonu (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 Product Manager / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yapay Zeka Entegrasyonu / Frontend Streaming
* **Açıklama:**  
  Kullanıcının toplam bekleme süresini (perceived latency) azaltmak için, yerel modelden üretilen kelimelerin daktilo efektiyle ekrana canlı olarak akması (streaming) sağlanmalıdır.
* **Kabul Kriterleri:**
  1. `/api/generate` veya yeni bir `/api/generate/stream` uç noktası Server-Sent Events (SSE) destekleyecek şekilde güncellenmelidir.
  2. Frontend, ReadableStream kullanarak gelen token'ları yakalamalı ve Zustand store/UI üzerinde anlık güncelleyerek ekrana dökmelidir.
* **Çözüm:**
  Server-Sent Events (SSE) ile token akışı sağlayan `/api/generate/stream` backend ucu yazıldı, frontend daktilo efekti ile entegre edildi. Disconnect durumunda arka plan tamamlama desteği eklendi.

---

---

### 📋 MS-248: Asenkron & Event-Driven Fal Yorumlama Backend Altyapısı (Architecture / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Bileşen:** Backend / Mimari / Veritabanı
* **Açıklama:**  
  Kullanıcının fal yorumunu senkron beklerken HTTP timeout limitlerine takılmaması için asenkron fal yorumlama mimarisine (HTTP 202 Accepted, veritabanı dinleyicisi veya asenkron işlem sırası) geçilmelidir.
* **Kabul Kriterleri:**
  1. İstemci fal isteği gönderdiğinde sunucu hemen bir işlem ID'si dönmeli ve istemci bağlantısını sonlandırmalıdır.
  2. Sunucu arka planda fal yorumunu üreterek Firestore'a yazmalıdır.
  3. İstemci, Firestore snapshot dinleyicisi kullanarak falın durumunu (`pending` -> `success` / `failed`) izlemeli ve hazır olduğunda yorumu ekrana yansıtmalıdır.
* **Çözüm:**
  Arka planda asenkron fal yorumlama altyapısı ve Firestore snapshot dinleyicisi üzerinden gerçek zamanlı durum izleme tamamlandı.

---

---

### 📋 MS-247: Mistik Bekleme Ekranı ve Yükleme Animasyonları (UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Bileşen:** Frontend Arayüzü / Yükleme Deneyimi
* **Açıklama:**  
  Fal yorumunun asenkron hazırlanma sürecinde veya ilk token beklenirken kullanıcının uygulamadan kopmaması için mistik yükleme animasyonları tasarlanmalıdır.
* **Kabul Kriterleri:**
  1. Dönen soğuk bir spinner yerine, Katina kart sembollerinin parıldadığı, mistik ara metinlerin ("Ruhlar fısıldıyor...", "Deste karıştırılıyor...") belirli aralıklarla değiştiği büyüleyici bir bekleme ekranı tasarlanmalı.
  2. Kullanıcıya uygulamada kalarak bekleme veya sayfayı kapatıp bildirim/e-posta alma seçeneği sunan şık bir UI yerleşimi yapılmalı.
* **Çözüm:**
  Aşamalı mistik yükleme metinleri (loadingStep) ve parıldayan kart outline animasyonu eklendi, beklemeden çıkma butonu arayüze entegre edildi.

---

---

### 📋 MS-246: Fal Yorumları İçin System Prompt Tasarımı ve Token Sınırlandırması (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 Product Manager / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yapay Zeka / Prompt Yönetimi
* **Açıklama:**  
  Yerel modelin mistik Katina tonundan sapmaması, format dışına çıkmaması ve lafı gereksiz uzatıp yanıt süresini (latency) artırmaması için sıkı bir System Prompt tasarlanmalı ve `max_tokens` değeri sınırlandırılmalıdır.
* **Kabul Kriterleri:**
  1. Modelin Katina falcısı personasını kilit altında tutan ve yapısal formatı (3 ana başlık ve Guidance) garanti eden System Prompt'u yazılmalı.
  2. API isteğinde `max_tokens` (veya `max_completion_tokens`) parametresi 400-500 token aralığına sınırlandırılarak yanıt süresi azaltılmalı.
* **Çözüm:**
  Local AI max_tokens ve Gemini maxOutputTokens limitleri 500 olarak sınırlandırıldı. System Prompt güncellenerek Katina falı tonu kilitlendi.

---

---

### ✅ MS-245: LM Studio Yerel LLM Yanıt Süresi (Latency) Ölçüm Testi (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yapay Zeka Entegrasyonu / Performans Testleri
* **Açıklama:**  
  Yerel LM Studio entegrasyonunun (Gemma 4 12B) yanıt üretme süresini (latency) ve hızını (tokens/sec) ölçmek amacıyla bir test çalıştırılmalıdır.
* **Kabul Kriterleri:**
  1. Local AI API'ye tarot açılımı promptu gönderilerek toplam round-trip süresi ölçülmeli.
  2. Prompt ve completion token sayıları ile saniye başına üretilen token (tokens/sec) değeri hesaplanmalı.
* **Çözüm:**  
  `scratch/test_latency.js` betiği oluşturulup çalıştırıldı. Local LM Studio üzerindeki `google/gemma-4-12b` modeliyle yapılan testte, 95 prompt token ve 1329 completion token çıktısı için toplam **49.37 saniye** (49368 ms) yanıt süresi ölçüldü. Ortalama hız **26.92 tokens/sec** olarak hesaplandı.

---

---

### ✅ MS-244: LM Studio Yetkilendirme Desteği (Bearer Token Entegrasyonu) (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend Server
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts), [.env.example](file:///Users/elifterzi/antigravity/MadameSoul/.env.example)
* **Açıklama:**  
  Lokal AI API isteklerinde LM Studio'nun token kimlik doğrulama gereksinimini desteklemek amacıyla server istek başlığına (Authorization: Bearer <token>) Bearer token eklenmeli, bu değer environment'dan okunmalıdır.
* **Kabul Kriterleri:**
  1. LM Studio çağrılarında eğer `LOCAL_AI_API_KEY` veya `LM_API_TOKEN` tanımlıysa headers alanına Authorization başlığı eklenmelidir.
  2. `.env.example` dosyasına bu değişkenlerin açıklaması eklenmelidir.
  3. Uygulama lokal geliştirme modunda (LM Studio bağlıyken) 401 hatası vermeden fal üretebilmelidir.
* **Çözüm:**  
  `server.ts` içerisindeki LM Studio istek fetch yapısına, `LOCAL_AI_API_KEY` ya da `LM_API_TOKEN` değişkenleri varsa Bearer token içeren `Authorization` header'ı eklendi. `.env.example` dosyasına ilgili yapılandırma satırı belgelendi.

---

---

### ✅ MS-243: Firestore Cache Deprecation Güncellemesi (Code Quality / Dev)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Frontend (Firebase Configuration)
* **Hedef Dosya:** [firebase.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/lib/firebase.ts)
* **Açıklama:**  
  Firestore SDK (v12.13.0) sürümünde `enableIndexedDbPersistence()` kullanımı ileriki sürümlerde kaldırılacaktır. Deprecation uyarısını çözmek için modern `initializeFirestore` ve `persistentLocalCache` API'sine geçiş yapılmalıdır.
* **Kabul Kriterleri:**
  1. Firestore `enableIndexedDbPersistence` çağrısı kaldırılmalı ve yerine `initializeFirestore` ile modern cache yapılandırması kurulmalıdır.
  2. Multi-tab desteği için `persistentMultipleTabManager` kullanılmalıdır.
  3. SSR/Node.js ortamlarında (örneğin test ortamı) cache initialization hata vermeyecek şekilde conditionally `window` kontrolü yapılmalıdır.
  4. Uygulama hatasız derlenmeli ve tüm testleri başarıyla geçmelidir.
* **Çözüm:**  
  `enableIndexedDbPersistence` çağrısı ve importu kaldırıldı. `initializeFirestore` ile `persistentLocalCache` ve `persistentMultipleTabManager` kullanılarak modern yerel önbellek ve çoklu sekme yönetimi yapılandırıldı. SSR uyumluluğu için `window` kontrolü eklendi.

---

---

### ✅ MS-209: Backlog Biletlerinin GitHub Kanban Panosuna Taşınması (Task / Infra)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Altyapı ve Proje Yönetimi
* **Hedef Dosya:** [jira_tickets.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/backlog/jira_tickets.md), [sync_backlog.js](file:///Users/elifterzi/antigravity/MadameSoul/scripts/sync_backlog.js)
* **Açıklama:**  
  MadameSoul projesinde yer alan tüm geçmiş backlog biletlerinin GitHub Kanban projesi (`MadameSoulKanban`) üzerine aktarılması ve bundan sonraki süreçlerin GitHub Projects üzerinden yürütülmesi amacıyla bu geçiş görevinin yerine getirilmesi.
* **Çözüm Özeti:**  
  `docs/backlog/jira_tickets.md` dosyasındaki tüm geçmiş biletleri okuyup parse eden bir Node.js betiği yazıldı. Classic PAT kullanılarak GitHub GraphQL API üzerinden projenin ID'si tespit edildi. Her bir bilet, `elifterzi57/MadameSoulStudio` deposunda gerçek bir Issue olarak açıldı ve ardından `MadameSoulKanban` projesine otomatik olarak bağlandı. Son olarak, bu taşıma görevi için de otomatik bir kart oluşturulup geçiş tamamlandıktan sonra kapatıldı.
* **Kabul Kriterleri:**
  1. `docs/backlog/jira_tickets.md` üzerindeki tüm tamamlanmış ve açık biletler (toplam 85 adet) parse edilmelidir.
  2. Her bilet için `elifterzi57/MadameSoulStudio` üzerinde bir GitHub Issue açılmalıdır.
  3. Açılan tüm Issues'lar GitHub GraphQL API kullanılarak `MadameSoulKanban` projesine otomatik olarak eklenmeli/bağlanmalıdır.
  4. Geçişin kendisi için de bir bilet oluşturulup, geçiş bittiğinde bu bilet otomatik olarak "Closed" yapılmalıdır.

---

---

### ✅ MS-208: PDF Tek Sayfa Formatına Geri Dönüş Çalışmasının Yenilenmesi ve Düzeltilmesi (Bug / UX)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Modülü
* **Hedef Dosya:** [pdfGenerator.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/utils/pdfGenerator.ts)
* **Açıklama:**  
  Tarot okuma sonuçlarını PDF olarak indiren modüldeki çoklu sayfa sayfalandırma (pagination) yapısının kaldırılıp tek bir uzun sayfa (continuous single-page canvas) formatına geri döndürülmesi çalışması (MS-191) başarısız olmuştur. PDF indirme fonksiyonunun hatasız bir şekilde tek bir uzun sayfa olacak şekilde yeniden düzenlenmesi ve link koordinatlarının bu yapıya göre düzeltilmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. `src/utils/pdfGenerator.ts` dosyasında yer alan element ölçme (`measureElementHeight`), sayfalandırma hesaplamaları (`pages.push`) ve birden fazla sayfa oluşturma (`pdf.addPage`) mantığı tamamen kaldırılmalıdır.
  2. PDF çıktısı, tek bir geniş ve dinamik uzunluğa sahip canvas üzerinden tek sayfa olarak çizilmelidir. Canvas'ın yüksekliği, içeriklerin (Header, Kartlar, Yorum Metni, Reklamlar ve Footer) toplam yüksekliğine göre dinamik olarak hesaplanmalıdır.
  3. Tıklanabilir reklam ve footer linklerinin koordinatları, tek sayfa yapısına uygun olacak şekilde dinamik olarak ayarlanmalı ve jsPDF `pdf.link(...)` ile doğru yerlere yerleştirilmelidir.
  4. PDF çıktısının dikeyde tek ve kesintisiz bir akış sunduğu, taşma veya dikey hizalama boşlukları içermediği, tarayıcılarda ve mobil cihazlarda sorunsuz indirildiği doğrulanmalıdır.
* **Çözüm:** Tek sayfalık canvas'ın toplam yüksekliği (`totalHeight`) dinamik olarak ölçüldükten sonra jsPDF belgesi [800, totalHeight] formatında kurulup html2canvas çıktısı tek sayfaya çizilecek şekilde güncellendi. Reklam ve footer linklerinin tıklanabilir koordinatları (pdf.link) bu tek sayfanın dinamik koordinat yapısına uyacak şekilde düzeltildi.

---

## ✅ Tamamlanan Bilet Detayları (Completed Ticket Details)

---

### ✅ MS-206: Giriş Ekranı Dil Seçimi ve Uygulama Tanıtımı Butonlarının Konum ve Biçim Değişimi (UX / UI)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş Ekranı Arayüzü (Login UI)
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  Giriş ekranında yer alan "Dil Seçimi" (Language Selector) butonu ile "Uygulama Tanıtımını Gör" (Show Onboarding) butonunun hem konumları hem de görsel biçimleri (tasarımları) yer değiştirilecektir.
  - Yeni düzende "Dil Seçimi" butonu, eskiden onboarding butonunun olduğu üst sırada yer alacak ve onun gibi geniş (`w-full`), kenarlıklı (`border border-transparent hover:border-[#ecd8a6]/10 rounded-xl`) ve dolgulu (`py-3.5`) bir blok buton görünümünde olacaktır.
  - "Uygulama Tanıtımını Gör" butonu ise eski dil seçim butonunun olduğu en alt satırda yer alacak ve onun gibi ortalanmış, daha küçük ve sade bir tasarımda (`px-4 py-2 text-[10px] sm:text-xs font-serif uppercase tracking-widest`) olacaktır.
* **Kabul Kriterleri:**
  1. Hem E-posta ile Giriş formunda hem de Telefon ile Giriş formunda ilgili iki butonun konumları yer değiştirmelidir.
  2. Dil Seçimi butonu, eskiden onboarding butonunun sahip olduğu sınıf tanımlarına (`w-full text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 py-3.5 text-[10px] sm:text-xs font-serif uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-[#ecd8a6]/10 rounded-xl`) sahip olmalı ve Globe ikonunu içermelidir. Açılır dil menüsü (dropdown) bu butona tıklandığında yine düzgün bir şekilde hizalanıp açılmalıdır.
  3. Uygulama Tanıtımını Gör butonu, eskiden dil seçimi butonunun sahip olduğu sınıf tanımlarına (`flex items-center gap-2 text-[#ecd8a6]/40 hover:text-[#ecd8a6]/80 transition-colors group px-4 py-2 text-[10px] sm:text-xs font-serif uppercase tracking-widest`) sahip olmalı ve RefreshCw ikonunu (hover edildiğinde dönme animasyonuyla birlikte) içermelidir.
  4. Değişiklikler sonrası her iki butonun da işlevselliği (dil değiştirme ve onboarding ekranını açma) eksiksiz çalışmalıdır.
* **Çözüm:** E-posta ve Telefon ile giriş ekranlarındaki Dil Seçici ve Uygulama Tanıtımı (onboarding) butonlarının konumları ve tasarımsal sınıfları (w-full border'lı block butonu ile küçük alt link görünümü) yer değiştirilerek kabul kriterlerine uygun şekilde güncellendi.

---

---

### ✅ MS-205: Giriş Sonrası KVKK/Sözleşme Onayı Wrapper ve Firestore Entegrasyonu (Feature / Dev)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Kullanıcı Akış Mantığı
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [useAppStore.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/store/useAppStore.ts)
* **Açıklama:**  
  Tasarım ve mimari gereksinimleri bir araya getirerek, giriş sayfasındaki mantıksal engelleri kaldırmak, oturum açtıktan sonra veritabanı sorgusuna göre modalı tetiklemek ve onay durumunu Firestore'a yazmak üzere kodlama yapılmalıdır.
* **Çözüm Özeti:**  
  `Login.tsx` dosyasındaki explicit onay kutuları ve buton engellemeleri kaldırılmıştır. `App.tsx`'te kullanıcı Firestore belgesindeki `termsAccepted` ve `termsVersion` verilerini global Zustand store'a eşitleyecek mantık kurulmuştur. Eğer bu alanlar eksikse veya versiyon "1.0.0" değilse modal ekranda kilitlenmekte, modal onaylandığında Firestore'a güncel veriler yazılıp store güncellenerek modal akıcı şekilde kapatılmaktadır.
* **Kabul Kriterleri:**
  1. `src/components/Login.tsx` dosyasında butondaki `!consentAccepted` bağımlılıkları temizlenmeli, Google/Apple login fonksiyonlarındaki checkbox kontrolü kaldırılmalıdır.
  2. `App.tsx` veya ilgili dashboard katmanında, oturum açmış kullanıcının `termsAccepted` durumunu kontrol eden ve eksikse Sally'nin tasarladığı onay modalını ekranda kilitleyen bir sarmalayıcı (wrapper) entegre edilmelidir.
  3. Modal onaylandığında, Firestore'daki kullanıcı belgesine `termsAccepted: true`, `termsAcceptedAt: serverTimestamp()` ve `termsVersion: "1.0.0"` verileri `updateDoc` ile atomik olarak yazılmalıdır.
  4. Başarılı yazma işleminden sonra global Zustand state güncellenmeli ve modal anında, akıcı bir animasyonla kaybolmalıdır.

---

---

### ✅ MS-204: KVKK/Sözleşme Onay Durumu Firestore Veri Şeması ve Güvenlik Kuralları Güncellemesi (Architecture / DB)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Bileşen:** Veritabanı ve Güvenlik Altyapısı
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Onay durumunun veri tabanında tutarlı saklanması, yetkisiz yazma işlemlerine karşı korunması ve gelecekteki olası sözleşme güncellemeleri için versiyonlama altyapısının kurulması gerekmektedir.
* **Çözüm Özeti:**  
  Firestore `users` belgesinde `termsAccepted: boolean`, `termsAcceptedAt: Timestamp` ve `termsVersion: string` veri alanları tanımlanmış; `firestore.rules` güncellenerek kullanıcıların bu alanları sadece kendileri için ve geçerli tiplerle/koşullarla yazabileceği güvenlik kuralları eklenmiştir.
* **Kabul Kriterleri:**
  1. Firestore `users` belgesinde `termsAccepted: boolean`, `termsAcceptedAt: Timestamp` ve `termsVersion: string` alanlarının şeması tanımlanmalı ve belgelenmelidir.
  2. `firestore.rules` güncellenerek kullanıcıların bu alanları sadece kendi belgelerinde ve geçerli verilerle güncelleyebilmesi güvenceye alınmalıdır.
  3. Gelecekte sözleşme güncellendiğinde tüm kullanıcılara tekrar onay modalı göstermeyi sağlayacak versiyon kontrol mekanizması (Örn: "1.0.0") veri şemasına dahil edilmelidir.

---

---

### ✅ MS-203: Giriş Sonrası KVKK/Sözleşme Onay Modalı Tasarımı ve Örtük Onay Altbilgisi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Bileşen:** Kullanıcı Deneyimi ve Arayüz Tasarımı
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Giriş sayfasındaki estetik dışı checkbox'ın kaldırılmasının ardından, ilk girişte tetiklenecek mistik, premium ve estetik standartlarımıza uygun bir sözleşme onay modalı tasarlanmalı ve giriş ekranı altbilgisi düzenlenmelidir.
* **Çözüm Özeti:**  
  Giriş butonlarının altına MadameSoul tasarım diline uygun, parıldayan ince yasal örtük onay metni eklenmiştir. Giriş sonrası görüntülenecek altın varaklı, koyu mor/siyah degrade arka planlı, cam efektli (glassmorphic), kaydırılabilir yasal metinli ve animasyonlu "Onayla ve Devam Et" butonuna sahip TermsModal bileşeni tasarlanıp hayata geçirilmiştir.
* **Kabul Kriterleri:**
  1. Giriş ekranı altına, MadameSoul tasarım diliyle uyumlu, parlayan ince font ile *"Giriş yaparak Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı kabul etmiş olursunuz"* ibaresi eklenmelidir.
  2. Başarılı giriş sonrasında görüntülenecek altın varak kenarlıklı, koyu mor ve siyah geçişli, yarı saydam (glassmorphic) bir "KVKK Açık Rıza ve Kullanıcı Sözleşmesi" modalı tasarlanmalıdır.
  3. Modal içerisinde sözleşme metinleri kolayca kaydırılabilir (scrollable) ve okunabilir bir yapıda sunulmalıdır.
  4. "Onayla ve Devam Et" butonu belirgin, mistik ve animasyonlu (hover/active micro-interactions) olmalıdır.

---

---

### ✅ MS-202: Giriş Sonrası KVKK/Sözleşme Onayı - Yasal ve Ürün Gereksinimleri (Legal / PM)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 Product Manager / `bmad-agent-pm`)
* **Atanan (Assignee):** John (📋 Product Manager / `bmad-agent-pm`)
* **Bileşen:** Yasal Uyum ve Ürün Akış Yönetimi
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların giriş/kayıt süreci öncesinde yasal metin onay kutusunu işaretlemek zorunda kalmasının yarattığı sürtünmeyi ortadan kaldırmak için, bu onayın oturum açıldıktan sonra ilk girişte alınması sağlanmalıdır. KVKK/GDPR uyumluluğu açısından, kullanıcının bu izni verdiği zaman damgasıyla birlikte loglanmalıdır.
* **Çözüm Özeti:**  
  Girişteki zorunlu yasal onay kutusu kaldırılarak giriş butonları doğrudan etkinleştirilmiştir. Kullanıcı başarılı bir şekilde giriş yaptıktan sonra veritabanı kontrolüyle yasal izni yoksa TermsModal üzerinden engelleyici yasal onay alınarak zaman damgasıyla kaydedilmektedir.
* **Kabul Kriterleri:**
  1. Giriş ekranında explicit (açık) checkbox zorunluluğu kaldırılarak giriş butonları doğrudan aktif hale getirilmelidir.
  2. Giriş/kayıt butonlarının altına implicit (örtük) onay metni eklenmeli ve ilgili yasal metin linkleri verilmelidir.
  3. Kullanıcı giriş yaptıktan sonra eğer ilk girişi ise veya daha önce onay vermediyse, yasal metinleri onaylamadan uygulamayı kullanması engellenmelidir.
  4. Onay loglama yapısının yasal gerekliliklere (KVKK/GDPR) uygunluğu denetlenmelidir.

---

---

### ✅ MS-201: Sosyal Girişlerde unverified E-posta/Şifre Sağlayıcısının Silinmesi ve Şifre Kaybı Hatası (Bug / Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Hesap Birleştirme Modülü
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  Unverified e-posta hesabı üzerine aynı e-posta ile doğrulanmış sosyal giriş yapıldığında şifre sağlayıcısının silinmesi önlenmeli, kullanıcının hem Google hem de e-posta ile giriş yapabilme yeteneği korunmalıdır.
* **Kabul Kriterleri:**
  1. Sosyal girişlerde (şifresiz girişlerde) Firestore'daki mevcut kullanıcı şifresinin `null` ile ezilmesi önlenmeli, korunmalıdır.
  2. Kullanıcı sosyal giriş yaptığında eğer hesapta `password` sağlayıcısı silinmişse, Firestore'da korunan şifre kullanılarak `linkWithCredential` ile sağlayıcı otomatik olarak geri bağlanmalıdır (auto-restore).

* **Çözüm:** `saveUserToFirestore` içinde, şifresiz girişlerde önce veritabanındaki şifre okunarak korundu. Eğer hesaptaki `password` sağlayıcısı silinmişse, korunan bu şifre değeriyle arka planda `linkWithCredential` üzerinden e-posta/şifre sağlayıcısı otomatik olarak geri bağlanmaya çalışılır. Bu esnada ortaya çıkabilecek `auth/email-already-in-use` ve `auth/credential-already-in-use` çakışma hataları yakalanarak temiz ve bilgilendirici bir şekilde loglandı, böylece hata üretilmesi önlendi ve akışın sürekliliği sağlandı.



---

### ✅ MS-200: Hesap Birleştirme (Account Linking) Esnasında 2 Saniyelik Sayfa Parlaması / Yönlendirme Hatası (Bug / UX)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Yönlendirme Modülü
* **Hedef Dosyalar:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [useAppStore.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/store/useAppStore.ts)
* **Açıklama:**  
  Sosyal giriş esnasında çakışma tespiti ve geçici hesap silme süreçleri devam ederken kullanıcının 2 saniyeliğine uygulamayı görüp ardından tekrar giriş sayfasına atılması engellenmelidir.
* **Kabul Kriterleri:**
  1. Sosyal giriş (Google/Apple) başladığında bir `isSocialLoginInProgress` bayrağı aktif edilmelidir.
  2. Bu bayrak aktif olduğu sürece `App.tsx` bileşeni yönlendirme yapmayıp `Login` ekranını sabit tutmalıdır.
  3. Çakışma tespiti ve geçici hesap silme süreçleri bitince bayrak pasif edilerek pürüzsüz geçiş sağlanmalıdır.

* **Çözüm:** Zustand global state deposuna `isSocialLoginInProgress` eklendi. Sosyal giriş süresince aktif edilerek `App.tsx`'in Giriş ekranını ekranda sabit tutması sağlandı. Çakışma tespiti ve geçici hesap silme/temizleme bittikten sonra pasif edilerek pürüzsüz geçiş sağlandı.

---

---

### ✅ MS-199: Notification Settings Bildirimleri Kapatabilme Desteği (Feature / UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Ayarlar Modülü
* **Hedef Dosyalar:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [firebase.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/lib/firebase.ts)
* **Açıklama:**  
  Kullanıcıların Notification Settings alanında web push bildirimlerini diledikleri zaman kapatabilmeleri (disable/unenable) sağlanmalıdır. Ayrıca bu işlem esnasında oluşan uyarı bildirimlerinin (Toast) görünür olması ve buton durumunun net bir şekilde arayüzde yansıtılması gerekmektedir.
* **Kabul Kriterleri:**
  1. Profile Ayarlar sekmesindeki Web Push Notification seçeneğinde bildirimler açık olduğunda kapatılmasına, kapalı olduğunda ise açılmasına izin veren çift yönlü bir geçiş/anahtar (toggle/switch) yapısı kurulmalıdır.
  2. Kullanıcı bildirimleri kapattığında Firestore `user_push_tokens` koleksiyonundaki ilgili FCM token belgesi silinmeli ve FCM SDK'sından token temizlenmelidir.
  3. Bildirim açma/kapatma esnasında fırlatılan toast uyarı pencerelerinin Profil Modalı üzerinde (`z-[200]`) görünebilmesi için toast z-index değeri yükseltilmelidir.
  4. Toggle switch butonunun hemen yanına, kullanıcının durumu net olarak görebilmesi için dil duyarlı dinamik durum metni ("Açık"/"Kapalı" veya "Enabled"/"Disabled") eklenmelidir.

* **Çözüm:** 
  1. `src/lib/firebase.ts` dosyasında yer alan `disablePushNotifications` metodu güncellenerek FCM `deleteToken` çağrısı izole bir try-catch bloğuna alındı. Firestore `user_push_tokens` belgesinin silinmesi garanti altına alındı.
  2. `src/App.tsx` dosyasındaki custom toast bildirim sarmalayıcı sınıfındaki `z-50` değeri `z-[200]`'e yükseltilerek, modal arkasında kalması ve görünmemesi engellendi.
  3. `src/components/Profile.tsx` dosyasında, push notification toggle switch alanına `pushEnabled` değerine göre dinamik olarak renk değiştiren dil duyarlı "Açık"/"Kapalı" ("Enabled"/"Disabled") durum etiketleri eklenerek görsel netlik ve geribildirim sağlandı.
  4. **Tek Servis İşçisi (Single Service Worker) Entegrasyonu:** İzin sıfırlama senaryolarında oluşan kapsam (scope) çakışmasını önlemek için `/firebase-messaging-sw.js` silindi. FCM SDK'sının arka plan işlemleri, kütüphane yüklemeleri ve `notificationclick` olayı doğrudan ana `/sw.js` servis işçisinin en üstüne entegre edildi. `src/lib/firebase.ts` dosyasındaki `getToken` çağrısı `serviceWorkerRegistration: registration` parametresi ile bu aktif servis işçisine bağlandı.

---

---

### ✅ MS-198: Geçmiş Açılımlar (Past Readings) Hata Gösterim ve Detay Entegrasyonu (Feature / UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Geçmiş Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Geçmiş açılımlar listesinde fail olmuş falların yanına kırmızı bir "Sistem Hatası" bildirim rozeti yerleştirilmeli ve bu fallar genişletildiğinde bilgilendirici hata açıklaması gösterilmelidir.
* **Kabul Kriterleri:**
  1. Hatalı fal satırlarının yanında kırmızı "Sistem Hatası" / "System Error" rozeti gösterilmelidir.
  2. Genişletilen detay alanında boş kutu yerine açıklayıcı hata ve iade bildirim metni yer almalıdır.

* **Çözüm:** `Profile.tsx` dosyasında `item.status === 'failed'` olan geçmiş açılımlar için "Sistem Hatası" / "System Error" rozeti (AlertCircle ikonlu) eklendi. Also genişletilen detay alanındaki `readingText` boş olduğunda iade ve hata açıklama mesajı gösterilmesi sağlandı.

---

---

### ✅ MS-197: Satın Alım Geçmişi Bakiye İade ve Chevron Temizliği (Feature / UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Satın Alım Geçmişi Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Profil satın alım geçmişinde iade rozetinde statik +1 yerine dinamik bakiye değişim miktarının yazdırılması ve tıklama işlevi olmayan satırlardaki ok işaretinin kaldırılması gerekmektedir.
* **Kabul Kriterleri:**
  1. Bakiye iadelerinde static +1 yerine `item.amount` değeri (örneğin +5 veya -2) gösterilmelidir.
  2. Satın alım geçmişi satırlarındaki işlevsiz chevron ok işareti kaldırılmalıdır.

* **Çözüm:** `Profile.tsx` satın alım geçmişi listesinde, iade rozetindeki statik +1 ibaresi `item.amount !== undefined ? (item.amount > 0 ? \`+\${item.amount}\` : item.amount) : '+1'` ifadesiyle güncellendi. Ayrıca tıklama işlevi olmayan satırlardaki `ChevronRight` ok işareti temizlendi.

---

---

### ✅ MS-196: Google ve E-posta Giriş Yöntemlerinin Aynı E-posta İçin Bağlanması (Account Linking) (Feature / Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Giriş / Güvenlik Modülü
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  Kullanıcıların aynı e-posta adresiyle hem e-posta/şifre yöntemiyle hem de Google ile giriş yapması durumunda çakışan veya mükerrer hesapların (farklı UIDs) oluşması engellenmeli ve bu giriş yöntemleri aynı hesap altında birleştirilmelidir (Account Linking).
* **Kabul Kriterleri:**
  1. `src/components/Login.tsx` dosyasında `handleGoogleLogin` ve `handleAppleLogin` fonksiyonları, e-posta çakışması durumunda Firebase Auth tarafından fırlatılan `auth/account-exists-with-different-credential` hatasını yakalayacaktır.
  2. Hata yakalandığında kullanıcıya şık, mistik tasarımlı bir şifre giriş modalı sunulacaktır. Kullanıcı şifresini girdiğinde, mevcut şifreli hesaba giriş yapılarak Google/Apple kimlik bilgisi (credential) bu hesaba `linkWithCredential` fonksiyonu ile bağlanacaktır.
  3. Firebase Console'da çoklu hesaba izin verilmiş olma ihtimaline karşı, başarılı sosyal oturum açma sonrasında Firestore'da aynı e-posta ile kayıtlı başka bir UID olup olmadığı denetlenecek; varsa şifreyle doğrulama yapılıp hesaplar birleştirilecek ve geçici yeni sosyal UID silinecektir.
  4. Hesaplar birleştirildikten sonra kullanıcının hem şifreyle hem de Google/Apple ile giriş yaptığında aynı UID (aynı bakiye ve geçmiş verileri) ile bağlandığı doğrulanacaktır.

* **Çözüm:** E-posta çakışması durumunda Firebase Auth hatası yakalanarak şık ve animasyonlu (Framer Motion) şifre doğrulama modalı sunuldu. Girilen şifre doğrulanarak `linkWithCredential` ile Google/Apple hesapları mevcut şifreli hesaba bağlandı. Ayrıca çoklu hesaba izin verilen durumlar için Firestore e-posta çakışması taranıp aynı birleştirme tetiklendi ve geçici sosyal kullanıcının UID'si veritabanını temiz tutmak ve kimlik bilgisini serbest bırakmak amacıyla `delete()` metodu ile silindi. Ek olarak, geçici oturum açma/silme sürecinde kullanıcının kısa süreliğine ana sayfaya yönlendirilip 2 saniye sonra tekrar giriş ekranına atılması (flash/redirect) sorununu çözmek amacıyla Zustand tabanlı `isSocialLoginInProgress` global durumu eklendi. Bu sayede, çakışma tespiti ve geçici hesap silme/temizleme işlemleri tamamlanana kadar Login bileşeni ekranda sabit tutulur, geçici Firestore belgesi de anında silinerek kusursuz bir geçiş sağlanır. 

  **Şifre Silinmesi (Overwriting) ve Otomatik Kurtarma Çözümü:** 
  Firebase Auth, unverified e-posta/şifre hesaplarının üzerine aynı e-posta ile doğrulanmış sosyal (Google/Apple) oturum açıldığında şifre sağlayıcısını ("password" provider) otomatik olarak kaldırmaktadır (overwriting). Bu durumu çözmek için:
  1. `saveUserToFirestore` içinde, şifresiz girişlerde (Google/Apple) Firestore'daki mevcut şifre değerinin `null` ile ezilmesini önlemek amacıyla önce veritabanındaki mevcut şifreyi sorgulayıp koruyan mekanizma kuruldu.
  2. Kullanıcı sosyal giriş yaptığında eğer hesaptaki "password" sağlayıcısı silinmişse, Firestore'da korunan şifre değeriyle arka planda `linkWithCredential` üzerinden e-posta/şifre sağlayıcısı hesaba otomatik olarak geri bağlanır (auto-restore). Böylece kullanıcı hem Google hem de e-posta/şifre ile oturum açma yeteneğini kaybetmez.

---

---

### ✅ MS-192: `moon_transactions` Koleksiyonu İçin Güvenlik ve İşlem Takibi Alanlarının Eklenmesi (Security / Analytics)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Mimarisi ve İşlem Takibi
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts), [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Finansal mutabakatın kolaylaştırılması, mükerrer işlemlerin (çift harcama) önlenmesi ve işlemlerin yapıldığı tarayıcı/cihaz kaynaklı sorunların analiz edilebilmesi amacıyla `moon_transactions` koleksiyonuna yeni takip alanları eklenmeli ve güvenlik kuralları bu yeni alanları doğrulayacak şekilde güncellenmelidir.
* **Çözüm Özeti:**  
  `moon_transactions` şemasına `paymentProvider`, `idempotencyKey` ve `clientMetadata` alanları eklenerek, `firestore.rules` güvenlik kurallarında ve sunucu/istemci kodlarında (Stripe webhook'ları, günlük kredi, karşılama bonusları ve tarot harcama akışları) entegrasyonu tamamlanmıştır. Mükerrer istekleri engellemek için `/api/generate` uç noktasında 5 saniye bekleme ve önbellek iade mekanizması entegre edilmiştir.
* **Kabul Kriterleri:**
  1. `moon_transactions` koleksiyonundaki her yeni belgeye şu alanlar eklenmelidir:
     - `paymentProvider`: Kredinin kazanım kaynağını belirtir (`stripe`, `app_store`, `google_play`, `daily_gift`, `welcome_bonus` veya `admin_dusting`).
     - `idempotencyKey`: Mükerrer istekleri engellemek için istemci veya API tarafından üretilen benzersiz işlem anahtarı.
     - `clientMetadata`: İşlemin yapıldığı istemciye ait cihaz/tarayıcı bilgileri (`userAgent`, `os`, `appVersion`).
  2. `firestore.rules` dosyasındaki `isValidMoonTransaction` fonksiyonu bu yeni alanların tiplerini (string, opsiyonel/zorunlu vb.) doğrulayacak şekilde güncellenmelidir.
  3. `docs/architecture/data-models.md` dosyasındaki `moon_transactions` veri modeli şeması bu alanları içerecek şekilde güncellenmelidir.

---

---

### ✅ MS-191: PDF Çoklu Sayfa Sayfalandırma (Pagination) Geliştirmesinin Geri Alınması (UX / UI / Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Modülü
* **Hedef Dosya:** [pdfGenerator.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/utils/pdfGenerator.ts)
* **Açıklama:**  
  Kullanıcıların tarot okuma sonuçlarını PDF olarak indirmesini sağlayan modülde yapılan son çoklu sayfa sayfalandırma (pagination) geliştirilmesi beğenilmemiştir. Sayfa sınırlarının hesaplanması, başlıkların bölünmesi ve reklamların sayfalara dağıtılması yerine, PDF çıktısının eskisi gibi tek bir uzun sayfa (continuous single-page canvas) formatına geri döndürülmesi istenmektedir.
* **Kabul Kriterleri:**
  1. `src/utils/pdfGenerator.ts` dosyasında yer alan element ölçme (`measureElementHeight`), sayfalandırma hesaplamaları (`pages.push`, `look-ahead for orphan headings`) ve birden fazla sayfa oluşturma (`pdf.addPage`) mantığı kaldırılmalıdır.
  2. PDF çıktısı, tek bir geniş ve dinamik uzunluğa sahip canvas üzerinden tek sayfa olarak çizilmelidir. Canvas'ın yüksekliği, içeriklerin (Header, Kartlar, Yorum Metni, Reklamlar ve Footer) toplam yüksekliğine göre dinamik olarak hesaplanmalıdır.
  3. Tıklanabilir reklam ve footer linklerinin koordinatları, tek sayfa yapısına uygun olacak şekilde dinamik olarak ayarlanmalı ve jsPDF `pdf.link(...)` ile doğru yerlere yerleştirilmelidir.
  4. PDF çıktısının dikeyde tek ve kesintisiz bir akış sunduğu, taşma veya dikey hizalama boşlukları içermediği doğrulanmalıdır.
* **Çözüm:** `src/utils/pdfGenerator.ts` dosyasında çoklu sayfaya bölme ve sayfa ölçümleme mantığı tamamen kaldırılarak tüm içeriklerin sığacağı dikeyde tek ve kesintisiz uzun sayfa (continuous single-page canvas) formatına dönüldü.

---

---

### ✅ MS-187: Tarot Yorumları İçin Kullanıcı Değerlendirme (Feedback) ve Prompt Memnuniyet Ölçümü Modülü (Feature / AI Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Deneyimi ve YZ Kalite Kontrolü
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx), [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)
* **Açıklama:**  
  Yapay zeka tarafından üretilen tarot yorumlarının kalitesini ve kullanıcı memnuniyetini ölçmek amacıyla, fal sonucunun altında mini bir değerlendirme (Thumbs Up / Thumbs Down veya 5 yıldız) arayüzü kurulmalı ve bu geri bildirimler Firestore'da analiz edilmek üzere kaydedilmelidir.
* **Kabul Kriterleri:**
  1. Fal sonucu gösterildiğinde ve profil sayfasındaki eski fal detaylarında, kullanıcının bu yorumu puanlayabilmesi için tıklanabilir butonlar eklenmelidir.
  2. Geri bildirimler `ai_feedback` adında yeni bir Firestore koleksiyonunda saklanmalı; `transactionId`, `userId`, `rating` (puan/beğeni), `comment` (varsa kullanıcının yazdığı not) ve `createdAt` alanları bulunmalıdır.
  3. Güvenlik kuralları (`firestore.rules`) kullanıcının sadece kendi işlemlerine ait puanlama yapabilmesini sağlayacak şekilde düzenlenmelidir.
* **Çözüm:** Tarot yorum sonucunun altına (App.tsx) ve profil geçmişi detaylarına (Profile.tsx) mor/altın temalı 5 yıldızlı derecelendirme ve yorum widget'ları eklendi. Feedback verileri `ai_feedback` koleksiyonuna yazıldı ve `firestore.rules` güncellenerek güvenlik sağlandı.

---

---

### ✅ MS-186: Kullanıcı Dil Seçimi, Saat Dilimi, Cihaz Bilgisi ve Yaşam Boyu Değer (LTV) Takip Entegrasyonu (Analytics / CRM)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı İlişkileri Yönetimi (CRM) ve Analitik
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Uygulamanın pazarlama, bildirim gönderme ve kullanıcı segmentasyonu çalışmalarında elimizi güçlendirmek amacıyla; kullanıcıların saat dilimleri, tarayıcı/cihaz bilgileri, uygulama sürümleri ve o güne kadarki satın alımlarının toplamı (LTV) Firestore'daki kullanıcı belgesinde tutulmalıdır.
* **Kabul Kriterleri:**
  1. Kullanıcı kaydolurken veya profil güncellediğinde, tarayıcının saat dilimi (`Intl.DateTimeFormat().resolvedOptions().timeZone`) ve işletim sistemi bilgileri `users` belgesinde `timezone` ve `deviceInfo` (cihaz markası/işletim sistemi) alanlarında güncellenmelidir.
  2. Stripe ödemesi başarıyla tamamlandığında (`server.ts` webhook veya completed payment adımı), kullanıcının `users` belgesinde `lifetimeValue` (toplam harcama tutarı) alanı güncellenerek kümülatif olarak artırılmalıdır.
  3. Uygulama açılışında kullanıcının kullandığı güncel uygulama versiyonu (`appVersion`) `users` belgesine yazılarak eski sürüm kullanan istemcilerin tespiti kolaylaştırılmalıdır.
* **Çözüm:** Kullanıcı belgesine signup (Login.tsx), app open (App.tsx) ve profil güncellemesinde (Profile.tsx) `timezone`, `deviceInfo` ve `appVersion` verileri yazıldı. Stripe ve mock ödemelerde (server.ts completePayment) `lifetimeValue` değeri yapılan harcama miktarı oranında kümülatif olarak artırıldı.

---

---

### ✅ MS-185: `moon_transactions` Koleksiyonuna `transactionId` Eklenmesi ve Güvenlik Kuralları Güncellemesi (Security / Refactor)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (🏗️ System Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Güvenliği ve İşlem İzlenebilirliği
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [AdminPanel.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/AdminPanel.tsx)
* **Açıklama:**  
  İşlem güvenliğini ve izlenebilirliğini artırmak için, Firestore `moon_transactions` koleksiyonuna yazılan her yeni belgenin içine Document ID ile eşleşen bir `transactionId` alanı eklenmelidir. Ayrıca, çalışanların (employee) admin panelinden credit dusting işlemleri yapabilmesini sağlamak amacıyla güvenlik kurallarındaki `userId` kısıtlaması, `isEmployee()` kontrolü eklenerek güncellenmelidir.
* **Kabul Kriterleri:**
  1. `firestore.rules` dosyasındaki `isValidMoonTransaction` fonksiyonu güncellenmeli; `data.userId == request.auth.uid` kontrolü `(data.userId == request.auth.uid || isEmployee())` olacak şekilde güncellenmeli ve opsiyonel `transactionId` alanı için `data.transactionId == transactionId` doğrulaması eklenmelidir.
  2. `src/App.tsx` içerisindeki tüm `moon_transactions` yazma alanlarına (günlük bakiye alımı, hoş geldin bonusu, fal harcaması, sistem iadeleri) `transactionId` alanı Document ID ile aynı olacak şekilde eklenmelidir. Hoş geldin bonusu için `addDoc` yerine `doc()` ve `setDoc` kullanılarak ID önceden elde edilmelidir.
  3. `src/components/AdminPanel.tsx` içerisindeki bakiye düzenleme (`handleAdjustMoons`) yazımına `transactionId: txRef.id` alanı eklenmelidir.
  4. `server.ts` içerisindeki Stripe ödeme webhook'u, günlük otomatik kredi yenileme cron-like kodları ve API iade loglarındaki işlem kayıtlarına `transactionId: txRef.id` eklenmelidir.
  5. `docs/architecture/data-models.md` altındaki şema dokümantasyonu `transactionId` alanını içerecek şekilde güncellenmelidir.

* **Çözüm:** `transactionId` alanı tüm veritabanı yazımlarına eklendi, `firestore.rules` ve `data-models.md` güncellenerek güvenli işlemler ve izlenebilirlik sağlandı.

---

---

### ✅ MS-184: `promo_codes` ve `reading_cache` Firestore Koleksiyonlarının/Alanlarının Temizlenmesi (Refactor / Cleanup)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Sunucu Uç Noktaları ve Veri Yapısı Dokümantasyonu
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts), [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Uygulamada artık ihtiyaç duyulmayan ve kullanılmayan `promo_codes` (kampanya kuponları altyapısı) ve `reading_cache` (çift istek önleme önbelleği) Firestore koleksiyon tanımları ile `/api/generate` uç noktasındaki cache sorgulama ve cache yazma kodları temizlenmelidir.
* **Kabul Kriterleri:**
  1. `docs/architecture/data-models.md` dosyasından `promo_codes` ve `reading_cache` koleksiyonlarının tanımları (bölüm 10 ve 11) kaldırılmalıdır.
  2. `server.ts` içerisindeki `/api/generate` rotasında bulunan `reading_cache` collection okuma ve yazma işlemleri kaldırılacaktır.
  3. Proje derleme (`npm run build`) ve testlerin (`npm run test` ve `npm run test:e2e`) hatasız çalıştığı doğrulanmalıdır.

* **Çözüm:** `docs/architecture/data-models.md` dosyasından `promo_codes` ve `reading_cache` koleksiyon tanımları kaldırıldı. Express sunucusundaki `/api/generate` rotasından önbellek okuma/yazma işlemleri temizlendi.

## ✅ Tamamlanan Bilet Detayları (Completed Ticket Details)

---

### ✅ MS-183: Sistem İadeleri İşlem Tipinin 'refund' Olarak Güncellenmesi (Refactor)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Mimarisi & Profil Satın Alım Geçmişi
* **Hedef Dosyalar:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules), [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Sistem hatalarından dolayı yapılan kredi iade işlemleri `type: 'bonus'` olarak kaydedildiğinde, günlük hediyeler (daily gifts) veya hoş geldin bonusu (welcome bonus) gibi diğer promosyonel bakiyelerle veri tabanında aynı kategoriye girmekte ve raporlamada/takipte karışıklık yaratmaktadır. İade işlemlerinin türü `type: 'refund'` olarak güncellenmelidir.
* **Kabul Kriterleri:**
  1. `firestore.rules` dosyasındaki `isValidMoonTransaction` kuralında geçerli işlem tiplerine `'refund'` eklenmelidir (`['spend', 'buy', 'bonus', 'refund']`).
  2. İstemci tarafında (`App.tsx` hata kurtarma ve API hata iadesi) ve sunucu tarafında (`server.ts` arka plan fal yorumlama hatası) yazılan iade işlemleri `type: 'refund'` olarak kaydedilmelidir.
  3. Profil satın alma geçmişi sekmesinde (`Profile.tsx`), sorgulama ve filtreleme mantığı yeni `'refund'` tipini de kapsayacak şekilde güncellenmeli ve eski `'bonus'` tipindeki iade kayıtlarını da desteklemeye devam edecek şekilde backward-compatible (geriye dönük uyumlu) olmalıdır.

* **Çözüm:** `firestore.rules` dosyasına `'refund'` tipi eklendi. İstemcideki (`App.tsx`) ve sunucudaki (`server.ts`) tüm sistem iadesi log yazımları `type: 'refund'` olarak değiştirildi. `Profile.tsx` içerisinde satın alım geçmişi sorgusu `buy`, `bonus` ve `refund` tiplerini çekecek şekilde güncellendi. Arayüzde listeleme ve `isRefund` koşulu hem yeni `'refund'` tipini hem de geriye dönük olarak eski `'bonus'` iadelerini ("İade" ve "Refund" açıklamaları üzerinden) tanıyacak şekilde ayarlandı.

---

---

### ✅ MS-182: Sistem Hataları Kredi İadelerinin Satın Alım Geçmişinde Gösterilmesi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Satın Alım Geçmişi & Hata Yönetimi
* **Hedef Dosyalar:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx), [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx), [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Sistem hataları nedeniyle yarıda kalan veya iptal olan tarot falı açılımlarının iade edilen kredileri, kullanıcının profili altında yer alan Satın Alım Geçmişi (Purchase History) sekmesinde gösterilmelidir. Böylece kullanıcılar sistem tarafından yapılan bakiye iadelerini şeffaf bir şekilde takip edebilirler.
* **Kabul Kriterleri:**
  1. Hem sunucu tarafında (`server.ts` background error flow) hem de istemci tarafında (`App.tsx` error flow & auto-recovery) bakiye iade edilirken `moon_transactions` koleksiyonuna `type: 'bonus'` olan yeni bir iade işlem belgesi eklenmelidir.
  2. İade işlemi açıklaması (description) Türkçe için "İadesi (Sistem İadesi)", İngilizce için "Refund (System Refund)" ifadelerini barındırmalıdır.
  3. `Profile.tsx` satın alım geçmişi sekmesinde, `buy` işlemlerinin yanında `bonus` türündeki iade işlemleri de getirilmelidir. Standart günlük ücretsiz hak alımları (Daily Free Gift) filtrelenerek gizlenmeli, sadece gerçek satın almalar ve sistem iadeleri listelenmelidir.
  4. Sistem iadeleri listede farklı bir görsel tasarımla gösterilmeli; mor satın alım ikonu yerine yeşil renkli dairesel `RotateCcw` iade ikonu kullanılmalı ve yanında yeşil renkli "+1 İade" / "+1 Refund" rozeti yer almalıdır.

* **Çözüm:** İstemci tarafı `App.tsx` hata kurtarma (recovery) ve istek başarısızlığı (onError) bloklarında bakiye iade edilirken, veritabanına `type: 'bonus'` ve "Sistem İadesi" açıklamalı transaction belgesi yazılması sağlandı. Sunucu tarafı `server.ts` arka plan fal üretim hata yakalama bloğunda da Firestore transaction'ı içerisine aynı iade transaction logunun yazılması eklendi. `Profile.tsx` bileşeninde `fetchPurchases` sorgusu `buy` ve `bonus` tiplerini kapsayacak şekilde güncellendi, günlük ücretsiz haklar in-memory filtrelenerek gizlendi. Rozet ve ikon tasarımı `RotateCcw` ile yeşil temaya güncellendi.

---

---

### ✅ MS-181: Pending Durumunda Kalan ve Bakiye Düşüren İşlemlerin Otomatik İadesi (Bug)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veri Tutarlılığı ve Kredi İşlemleri
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Fal yorumlama esnasında sunucu çökmesi, yeniden başlatılması veya ağ kesintisi gibi durumlarda `moon_transactions` altındaki işlem pending durumunda kalmakta, kullanıcı bakiyesi düşürülmüş olmasına rağmen fal yorumu üretilememektedir. Bu durum kullanıcı mağduriyetine yol açmaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcı giriş yaptığında kendi adına olan `pending` durumundaki işlemler sorgulanmalıdır.
  2. Eğer işlemin `createdAt` oluşturulma zamanından bu yana 2 dakikadan fazla geçmişse, işlem kilitlenmiş (stuck) kabul edilmelidir.
  3. Kilitlenmiş işlemler için bir Firestore Transaction yürütülerek:
     - İşlemin harcandığı bakiye türüne (`dailyFreeBalance` veya `purchasedBalance`) göre kullanıcının `user_moons` bakiyesi atomik olarak 1 artırılmalıdır.
     - İşlem durumu `failed` olarak güncellenmeli ve hata açıklaması eklenmelidir.
  4. İade işlemi sonrasında kullanıcının güncel bakiyesi ekranda anlık olarak yenilenmelidir.

* **Çözüm:** `App.tsx` dosyasında `onAuthStateChanged` kancası içine otomatik kontrol eklendi. Kullanıcı giriş yaptığında `status == 'pending'` olan son 2 dakikadan eski işlemleri sorgular. Bulunan işlemler için Firestore `runTransaction` tetiklenerek bakiye harcandığı kaynağa (`deductedFrom`) göre 1 Moon iade edilir, işlemin durumu `failed` olarak işaretlenir ve arayüz bakiyesi güncellenir.

---

---

### ✅ MS-180: PDF Çıktısında Promosyon Kodu Kutucuğunun Dikey Hizalama ve Dolgu (Padding) Optimizasyonu (Bug / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Modülü
* **Hedef Dosya:** [pdfGenerator.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/utils/pdfGenerator.ts)
* **Açıklama:**  
  PDF çıktısında yer alan promosyon kodu (kupon kodu) kutucuğunun tasarımı incelendiğinde, kod metninin ("MADAMESOUL10") kutu içinde dikey olarak ortalanmadığı, üst kısımda gereğinden fazla boşluk (padding-top) kalırken alt sınırla metin arasında çok az pay olduğu tespit edilmiştir. Bu durum kutunun asimetrik görünmesine ve kalitesiz bir izlenim bırakmasına sebep olmaktadır. Metnin kutucuk içerisinde mükemmel bir şekilde dikey ve yatay olarak ortalanması gerekmektedir.
* **Kabul Kriterleri:**
  1. `pdfGenerator.ts` dosyasında yer alan kupon kodu çizim koordinatları ve dolgu (padding) parametreleri güncellenmelidir.
  2. Kupon kodu metni, arka plandaki koyu renkli yuvarlatılmış köşeli kutunun (filled rounded rectangle) dikey and yatay eksenlerinde tam olarak ortalanmalıdır.
  3. Metin yüksekliği (`text height`) ile kutu yüksekliği arasındaki oran dengelenmeli; üst ve alt boşluklar birbirine eşitlenmelidir.
  4. PDF çıktısı üretildiğinde kupon kodunun görsel olarak kusursuz, dengeli ve simetrik durduğu doğrulanmalıdır.

* **Çözüm:** `pdfGenerator.ts` dosyasında ad1 promosyon kodu (`promoCode`) kapsayıcı kutusu CSS özelliklerine `line-height: 1;` eklenerek metnin konteynerin varsayılan 1.9 satır yüksekliğini devralması önlendi. Böylece kupon kodu kutusu dikey ve yatay eksende tam olarak ortalandı ve simetrik duruş sağlandı.

---

---

### ✅ MS-176: Kullanıcı Dil Seçiminin Kalıcı Hale Getirilmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yerelleştirme / Durum Yönetimi
* **Hedef Dosya:** [useAppStore.ts](file:///Users/elifterzi/antigravity/MadameSoul/src/store/useAppStore.ts)
* **Açıklama:**  
  Kullanıcı uygulamada dili değiştirdiğinde bu seçim tarayıcı hafızasında tutulmalı, sayfa yenilendiğinde ya da çıkış yapıp tekrar girildiğinde varsayılan İngilizce yerine kullanıcının son seçtiği dil ile açılmalıdır.
* **Kabul Kriterleri:**
  1. Kullanıcının dil seçimi `localStorage` üzerinde `madamesoul_language` anahtarı altında saklanmalıdır.
  2. Uygulama açılışında Zustand state initialize edilirken öncelikle `localStorage`'dan dil verisi okunmalı, yoksa varsayılan olarak `en` (İngilizce) yüklenmelidir.
  3. `setUserInfo` içinde `language` değişimi algılandığında `localStorage` güncellenmelidir.
  4. Sayfa yenilendiğinde veya uygulama kapatılıp açıldığında kullanıcının son seçtiği dilin korunduğu doğrulanmalıdır.

* **Çözüm:** Zustand `useAppStore.ts` store yapısında dil alanının başlangıç değeri `localStorage.getItem('madamesoul_language')` ile okunacak şekilde güncellendi. `setUserInfo` işlevinde dil seçeneği değiştiğinde bu değer tarayıcı hafızasına (`localStorage.setItem`) otomatik olarak yazıldı.

---

---

### ✅ MS-160: Eksik Dil Çevirilerinin (dailyGift, focusOptions vb.) Eklenmesi (i18n / Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yerelleştirme (Localization - i18n)
* **Hedef Dosya:** [es.yaml](file:///Users/elifterzi/antigravity/MadameSoul/src/locales/es.yaml)
* **Açıklama:**  
  Uygulamaya yeni eklenen günlük ücretsiz bakiye alma (daily claim) ve tarot odak/kategori seçimi (reading focus area) özellikleri kapsamında yeni dil anahtarları tanımlanmıştır. Ancak bu anahtarlar sadece Türkçe (`tr.yaml`) ve İngilizce (`en.yaml`) dil dosyalarında yer almaktadır. İspanyolca (`es`), Fransızca (`fr`), Çince (`zh`) ve Korece (`ko`) dil dosyalarında bu anahtarlar eksik olduğu için ilgili dilleri seçen kullanıcılarda bu alanlar İngilizceye fallback yapmakta veya hatalı görüntülenebilmektedir.
  Eksik anahtarlar:
  - `dailyGift`
  - `dailyGiftClaimed`
  - `focusOptions.general`
  - `focusOptions.love`
  - `focusOptions.career`
  - `focusOptions.health`
  - `focusLabel`
* **Kabul Kriterleri:**
  1. `es.yaml`, `fr.yaml`, `zh.yaml` ve `ko.yaml` dosyalarına belirtilen 7 yerelleştirme anahtarı kendi hedef dillerindeki anlamlı karşılıklarıyla eklenmelidir.
  2. Giriş sonrası fal formunda yer alan odak seçim kutusu ve günlük ücretsiz kredi kazanım bildirimlerinin tüm dillerde doğru şekilde yüklendiği doğrulanmalıdır.

---

---

### ✅ MS-159: Fal Çekme ve Profil Etkileşimleri İçin Playwright E2E Test Kapsamının Genişletilmesi (Test)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Test Otomasyonu
* **Hedef Dosya:** [app.spec.ts](file:///Users/elifterzi/antigravity/MadameSoul/tests/e2e/app.spec.ts)
* **Açıklama:**  
  Mevcut Playwright E2E testlerimiz sadece onboarding slaytlarını geçmeyi ve login ekranının açılmasını kontrol etmektedir. Uygulamanın kalbi olan kart seçme formu, kart çekme ritüeli, fal yorumu gösterimi, profil modalının açılması ve dil değiştirme işlemlerinin otomatik olarak doğrulanması gerekmektedir.
* **Kabul Kriterleri:**
  1. Playwright test senaryolarına mock kullanıcı ile giriş yapma adımları eklenmelidir.
  2. Giriş sonrası ad soyad, doğum tarihi ve odak alanı formunun doldurulması, 3 kart çekilmesi ve fal sonucunun yüklenmesi senaryoları simüle edilmelidir.
  3. Profil modalının açılması ve geçmiş falların listelenmesi akışları da test kapsamına dahil edilmelidir.

* **Çözüm:** Playwright E2E testleri (`tests/e2e/app.spec.ts`) onboarding adımlarını geçme, form doldurma (isim, doğum tarihi, odak alanı seçimi), kapalı desteden 3 kart çekme ritüeli, mistik ses kontrollerinin testi, fal sonucunun alınması ve profil geçmişindeki falları düzenleyip not kaydetme akışlarını kapsayacak şekilde baştan sona genişletildi.

---

---

### ✅ MS-158: Onboarding Ekranındaki Slayt Görsellerinin Çeşitlendirilmesi (UX / UI)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Onboarding Tanıtım Ekranı
* **Hedef Dosya:** [Onboarding.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Onboarding.tsx)
* **Açıklama:**  
  Uygulamanın onboarding tanıtım akışında 3 ayrı slayt bulunmasına rağmen, bu slaytların arka planında kullanılan görsel dizisi tek bir resmi (`onboarding_1.jpg`) işaret etmektedir. Bu durum tanıtım adımlarını görsel olarak monotonlaştırmakta ve premium hissiyatı zayıflatmaktadır.
* **Kabul Kriterleri:**
  1. Hoş Geldin (Welcome), Keşif (Discovery) ve Yolculuk (Journey) temalarını temsil eden 3 ayrı mistik tasarım görseli oluşturularak `/public/assets/onboarding/` klasörüne eklenmelidir.
  2. `Onboarding.tsx` dosyasındaki `slideImages` dizisi bu yeni görselleri çağıracak şekilde güncellenmelidir.
  3. Slaytlar arasında geçiş yaparken görsellerin yumuşak bir fade-in animasyonuyla değiştiği teyit edilmelidir.

* **Çözüm:** Onboarding slayt akışında Hoş Geldin, Keşif ve Yolculuk temalarına özel 3 adet benzersiz mistik WebP görseli (`onboarding_welcome.webp`, `onboarding_discovery.webp`, `onboarding_journey.webp`) tasarlandı ve `Onboarding.tsx` slayt dizisine eklendi.

---

---

### ✅ MS-157: Mağaza Paket Metinlerinin ve Giriş Bileşeni Çevirilerinin Taşınması (i18n / UX)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Arayüz ve Dil Standartları
* **Hedef Dosya:** [StoreModal.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/StoreModal.tsx)
* **Açıklama:**  
  `StoreModal.tsx` dosyasındaki kredi paketlerinin yanında yazan bonus metinleri ("1 Free Katina Moon", "5 Free Katina Moons") İngilizce olarak kod içerisine yazılmıştır. Ayrıca `Login.tsx` bileşeni kendi içinde devasa bir yerel `translations` nesnesi barındırmaktadır. Bu durum kod kalitesini düşürmece ve yerelleştirme yönetimini zorlaştırmaktadır.
* **Kabul Kriterleri:**
  1. Mağaza bonus metinleri ve `Login.tsx` içindeki tüm statik çeviriler merkezi `src/locales/` altındaki YAML dosyalarına aktarılmalıdır.
  2. Bileşenler içindeki tüm sabit çeviri nesneleri kaldırılmalı, merkezi `t` fonksiyonu kullanılarak değerler çekilmelidir.
  3. Tüm paketlerin bonus metinlerinin seçilen dille uyumlu şekilde değiştiği doğrulanmalıdır.

* **Çözüm:** `StoreModal.tsx` bonus metinleri ve `Login.tsx` içindeki yerel çeviri sözlüğü tamamen temizlendi. Bu çeviriler merkezi `src/locales/` YAML dosyalarına aktarılarak bileşenlerin standard `t` çeviri prop'u ile çalışması sağlandı.

---

---

### ✅ MS-156: Çerez Çubuğu (CookieBanner) ve Hata Yakalayıcı (ErrorBoundary) Metinlerinin Yerelleştirilmesi (i18n / UX)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Arayüz ve Yerelleştirme
* **Hedef Dosya:** [CookieBanner.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/CookieBanner.tsx)
* **Açıklama:**  
  Uygulamadaki çerez bilgilendirme çubuğu (`CookieBanner.tsx`) ve çalışma zamanı hata yakalayıcısı (`ErrorBoundary.tsx`) içerisindeki metinler arayüzde doğrudan Türkçe veya İngilizce olarak hardcoded kodlanmıştır. Uygulamanın desteklediği diğer diller (İspanyolca, Fransızca, Çince, Korece) seçildiğinde bu bileşenlerde dil uyumluluğu sağlanamamakta ve kullanıcı deneyimi zarar görmektedir.
* **Kabul Kriterleri:**
  1. `CookieBanner` ve `ErrorBoundary` içindeki tüm başlık, açıklama ve buton metinleri `src/locales/` altındaki YAML dosyalarına (örneğin `cookieConsent.text`, `errorBoundary.title` vb. anahtarlarla) eklenmelidir.
  2. Bileşenler doğrudan bu yerelleştirilmiş anahtarları `t` fonksiyonu ile çağıracak şekilde güncellenmelidir.
  3. Tüm dillerde çerez onay çubuğu ve hata ekranı test edilmelidir.

* **Çözüm:** `CookieBanner.tsx` ve `ErrorBoundary.tsx` bileşenlerindeki tüm hardcoded metinler kaldırılarak `src/locales/` YAML dosyalarındaki `cookieConsent.*` ve `errorBoundary.*` anahtarlarına taşındı ve arayüzde `t` yerelleştirme fonksiyonuyla okundu.

---

---

### ✅ MS-155: Gemini İstek Sınırlandırmasının (Rate Limit) IP Yerine User UID Üzerinden Yapılması (Architecture)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Sunucu Güvenliği ve İstek Sınırlandırma
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Gemini API uç noktasında bot/saldırı koruması amacıyla kullanılan `express-rate-limit` ara yazılımı IP adresi bazlı çalışmaktadır. Aynı mobil veri şebekesini, okul/ofis ağını veya VPN paylaşan kullanıcılar aynı harici IP adresini kullandıkları için birbirlerinin istek limitini doldurarak "Too many requests" hatası alabilirler. İstek atan kullanıcılar zaten sisteme üye girişi yaptığı için, limitleme IP yerine kullanıcının doğrulanmış Firebase UID'si üzerinden yapılmalıdır.
* **Kabul Kriterleri:**
  1. Rate limiter yapılandırmasında `keyGenerator` fonksiyonu güncellenmeli ve doğrulanmış `req.user.uid` değeri anahtar olarak kullanılmalıdır.
  2. Kimliği doğrulanamamış veya geçersiz istek durumunda fallback olarak yine IP adresi kullanılmalıdır.
  3. Kullanıcının limit aşımı durumunda kullanıcıya gösterilecek hata mesajı yerelleştirilmiş olmalı veya toast üzerinden düzgün aktarılmalıdır.

* **Çözüm:** Express rate limiter `/api/generate` uç noktasında authenticate middleware'den sonraya taşındı. `keyGenerator` fonksiyonu doğrulanmış Firebase `req.user.uid` değerini anahtar olarak kullanacak şekilde güncellendi. Limit aşımında yerelleştirilmiş hata mesajı dönülmesi sağlandı.

---

---

### ✅ MS-154: Dil Dosyalarının Bellekte Önbelleğe Alınması (Locales Memory Caching) (Performance)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Sunucu Performansı ve Optimizasyon
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  `server.ts` içinde yer alan `getTranslation` yardımcı fonksiyonu, sunucuya gelen her fal üretme isteğinde (`/api/generate`) diske giderek ilgili dilin `.yaml` dosyasını senkron olarak okumaktadır (`fs.readFileSync`). Eşzamanlı isteklerin yoğun olduğu zamanlarda bu durum sunucu üzerinde disk I/O darboğazına (bottleneck) yol açarak yanıt sürelerini uzatır.
* **Kabul Kriterleri:**
  1. Sunucu başlatılırken (startup aşamasında) `src/locales/` dizinindeki tüm dil dosyaları bir kez okunmalı, ayrıştırılmalı (YAML.parse) ve bir bellek içi nesnede (memory cache) saklanmalıdır.
  2. `getTranslation` fonksiyonu her istekte diske erişmek yerine bu bellek içi önbellekten çeviri değerlerini döndürmelidir.
  3. Geliştirme ortamında dil dosyası değişikliklerinin yansıması için dosya izleme (file watcher/hot-reload) desteği eklenebilir veya üretim modunda kalıcı önbellek aktif edilmelidir.

* **Çözüm:** Dil dosyaları için Locales Memory Caching entegre edildi. Sunucu startup aşamasında `src/locales/` klasöründeki YAML dosyaları bir kez okunup `localesCache` nesnesine parse edilerek yüklenir. `getTranslation` fonksiyonu her istekte disk okuması (fs.readFileSync) yapmak yerine bellek içi önbellekten hızlıca yanıt döner.

---

---

### ✅ MS-153: Hesap Silme Akışında Re-Authentication Kontrolü ve İşlem Sırası Güvencesi (Bug - Data Integrity)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Gizliliği ve Veri Güvenliği
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Kullanıcı profil sekmesinden hesabını sildiğinde, Firestore koleksiyonlarındaki (users, user_moons, transactions, phones) veriler silindikten sonra Firebase Auth üzerindeki `user.delete()` fonksiyonu tetiklenmektedir. Firebase Auth kuralları gereği, eğer kullanıcının oturum süresi eskiyse Auth silme adımı `auth/requires-recent-login` hatasıyla başarısız olur. Bu durum, kullanıcının Firestore'daki tüm verilerinin silinip Auth hesabının açık kalmasına sebep olarak veritabanında bozuk/kimsesiz (orphaned) hesaplar oluşturur.
* **Kabul Kriterleri:**
  1. Hesap silme akışında Firestore veritabanı silme işlemlerine başlanmadan önce kullanıcının re-authenticate (yeniden şifre doğrulama veya SMS onaylama) yapması zorunlu kılınmalıdır.
  2. Firebase Auth `user.delete()` işlemi başarılı bir şekilde gerçekleştirildikten sonra (veya reauth güvencesi alındıktan sonra) veritabanı silme adımları çalıştırılmalıdır.
  3. Hata alınması durumunda Firestore verilerinin kısmi silinmesini engellemek için silme akışı işlem güvenliği kurallarına uygun tasarlanmalıdır.

---

---

### ✅ MS-152: Üretim Ortamında Stripe Webhook İmza Doğrulamasının Zorunlu Kılınması (Bug - Security)

* **Öncelik:** En Yüksek (Highest)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Paige (📚 Tech Writer / `bmad-agent-tech-writer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği / Stripe Ödeme Entegrasyonu
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusunda yer alan `/api/stripe-webhook` rotası, Stripe API anahtarları veya webhook imza bilgisi eksik olduğunda doğrulamayı bypass ederek gelen isteğin gövdesini doğrudan `JSON.parse` ile ayrıştırıp ödeme onayı vermektedir. Bu durum geliştirme ortamında kolaylık sağlasa da, üretim ortamında (`process.env.NODE_ENV === 'production'`) ciddi bir güvenlik açığıdır. Saldırganlar sahte webhook istekleriyle kendi hesaplarına bedelsiz bakiye tanımlayabilirler.
* **Kabul Kriterleri:**
  1. Üretim ortamında (`process.env.NODE_ENV === 'production'`) webhook imza doğrulaması (`stripe.webhooks.constructEvent`) kesinlikle zorunlu olmalı ve doğrulanamayan hiçbir webhook çağrısına bakiye tanımlanmamalıdır.
  2. İmza doğrulaması başarısız olan istekler HTTP 400 Bad Request hatasıyla reddedilmelidir.
  3. Geliştirme ortamında imza doğrulamasını esneten veya bypass eden mekanizma sadece `NODE_ENV !== 'production'` koşulunda çalışmalıdır.

---

---

### ✅ MS-151: Gemini API Yanıtlarının Önbelleğe Alınması (Caching) ile Maliyet Optimizasyonu (Architecture)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Mimarisi ve Maliyet Optimizasyonu
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Kullanıcıların tarayıcıyı yenilemesi, yarıda kalan bağlantı kopmaları sonrası aynı kartlar ve aynı odak alanı ile mükerrer istek göndermesi durumunda Gemini API'sine tekrar istek atılmakta ve bakiye düşürülmektedir. Sunucuda son 24 saat içinde aynı kullanıcı, kart kombinasyonu ve odak alanı ile atılan istekler için Gemini API'ye gitmek yerine önbellekten (cache) yanıt dönülmelidir.
* **Kabul Kriterleri:**
  1. Firestore'da `reading_cache` adında bir koleksiyon tanımlanmalıdır.
  2. `/api/generate` uç noktasında, istek gövdesindeki (uid, cards, focus) bilgileri içeren bir hash anahtarı ile Firestore `reading_cache` sorgulanmalıdır.
  3. Eğer son 24 saatte üretilmiş bir kayıt varsa, Gemini çağrılmadan önbellekteki okuma metni dönülmeli ve bakiye tekrar düşürülmemelidir.

* **Çözüm:** Firestore `reading_cache` koleksiyonu oluşturuldu. Sunucu tarafında `/api/generate` uç noktasında istek parametrelerinden üretilen `sha256(uid:cards:focus)` hash anahtarı aranır. Son 24 saat içinde üretilmiş bir önbellek kaydı varsa, Gemini API bypass edilerek önbellekteki okuma metni döndürülür ve kullanıcının bakiyesi düşürülmez. Bir hata veya rollback durumunda bakiye iade edilir.

---

---

### ✅ MS-150: Çevrimdışı Kullanım Desteği ve PWA (Progressive Web App) Altyapısının Kurulması (UX / UI)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Mobil Kullanıcı Deneyimi
* **Hedef Dosya:** [index.html](file:///Users/elifterzi/antigravity/MadameSoul/index.html)
* **Açıklama:**  
  Kullanıcılar internet bağlantıları kesildiğinde dahi geçmiş fal kayıtlarına ve kayıtlı notlarına erişmek istemektedirler. Uygulamanın bir PWA (Progressive Web App) haline getirilmesi, çevrimdışı çalışma desteği (service worker) ve ana ekrana ekleme (A2HS) özelliğinin kazandırılması gerekmektedir.
* **Kabul Kriterleri:**
  1. `manifest.json` dosyası oluşturulmalı ve mistik temaya uygun ikonlarla `index.html`'e bağlanmalıdır.
  2. Service Worker (`sw.js`) entegre edilerek statik varlıkların (CSS, JS, Fontlar, Kart Görselleri) önbelleğe alınması ve çevrimdışı ortamda uygulamanın açılabilmesi sağlanmalıdır.
  3. Çevrimdışı durumda Firestore'daki geçmiş verilerin `enableIndexedDbPersistence` aracılığıyla yerel diskten okunması etkinleştirilmelidir.

* **Çözüm:** Progressive Web App desteği için `manifest.json` ve Service Worker (`sw.js`) kuruldu. Varlıkların cache-first stratejisi ile önbelleğe alınması sağlandı. `firebase.ts` dosyasına `enableIndexedDbPersistence` entegre edilerek Firebase veritabanına çevrimdışı erişim yeteneği kazandırıldı.

---

---

### ✅ MS-149: Görsel Optimizasyonu ve Tarot Kart Görsellerinin WebP/Lazy-Loading ile Yüklenmesi (Performance)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Performans ve Mobil Optimizasyon
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot kart görselleri (`public/cards/*`) yüksek çözünürlüklü PNG/JPG formatındadır ve özellikle mobil cihazlarda yavaş yüklenerek LCP (Largest Contentful Paint) skorunu olumsuz etkilemektedir. Kart görsellerinin WebP formatına dönüştürülmesi ve ekranda belirene kadar yüklenmemesi (lazy loading) sağlanmalıdır.
* **Kabul Kriterleri:**
  1. Tüm kart görselleri `.webp` formatına dönüştürülmeli ve `public/cards/` klasörüne aktarılmalıdır.
  2. Arayüzde kullanılan `<img>` etiketlerine `loading="lazy"` niteliği eklenmeli ve WebP yolları kullanılmalıdır.

* **Çözüm:** Tüm kart resimleri `.webp` formatına dönüştürüldü ve `public/cards/` klasörüne yüklendi. `App.tsx` ve `pdfGenerator.ts` dosyalarındaki görsel yolları güncellendi. Arayüzdeki kart `<img>` etiketlerine `loading="lazy"` niteliği eklenerek LCP performansı optimize edildi.

---

---

### ✅ MS-148: Kaydedilen Falları Kişiselleştirme, Favorileme ve Yansıma/Gerçekleşme Notları (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Geçmiş Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Kullanıcılar geçmiş fallarını listelediklerinde faldaki öngörülerin kendi yaşamlarında gerçekleşip gerçekleşmediğini zamanla takip etmek istemektedirler. Fal geçmişini kişiselleştirerek onlara başlıklar eklemek, favorilere ayırmak ve sonradan yansıma/gerçekleşme notları (manifestation notes) eklemek uygulamayı kişisel bir tarot günlüğüne dönüştürecektir.
* **Kabul Kriterleri:**
  1. Profil geçmiş listesindeki her fal kaydında "Favorilere Ekle" (yıldız) butonu bulunmalıdır.
  2. Kullanıcı fal geçmişindeki kayıtlara özel bir başlık (örn. "İş Görüşmesi Öncesi Açılım") verebilmelidir.
  3. Kullanıcı geçmiş faldaki detay ekranında "Yansıma ve Gerçekleşme Notu" başlığı altında serbest metin alanı ile kendi notlarını ekleyip kaydedebilmelidir.

* **Çözüm:** `Profile.tsx` fal geçmişi accordion yapısıyla genişletildi. Her fal kartına favorileme için yıldız ikonu eklendi. Tıklandığında açılan detay görünümünde, fal içeriğinin yanı sıra `customTitle` ve `reflectionNotes` düzenleme alanları sunuldu. Kaydet butonuna tıklandığında değişiklikler Firestore transaction'ı ile atomik olarak kaydedilmektedir.

---

---

### ✅ MS-146: İnteraktif Kart Çekme Ritüelinde Mistik Arka Plan Müzikleri ve Ses Efektleri (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Deneyimi (UX / UI)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot falı bakma ritüeli mistik ve sakinleştirici bir atmosfer gerektirir. Kullanıcının kart seçme (`DRAWING`), kart çevirme ve yorum yüklenme aşamalarında mistik bir arka plan müziği (ambient sound) açabilmesi ve kart etkileşimlerinde (hover, click, flip) küçük ses efektleri (shimmer, soft bell) duyulması premium hissi üst seviyeye çıkaracaktır.
* **Kabul Kriterleri:**
  1. Arayüzün sağ üst kısmına müzik açma/kapama butonu (Mute/Unmute) eklenmelidir.
  2. Kart çekme ekranına geçildiğinde arka planda döngüsel (looping) mistik ortam müziği çalmaya başlamalıdır.
  3. Kart seçerken, hover yaparken ve kartlar açılırken yumuşak ses efektleri (card sound) çalmalıdır.
  4. Ses dosyaları `public/assets/audio/` altında telifsiz ve yüksek kaliteli formatlarda saklanmalıdır.

* **Çözüm:** `App.tsx` içerisine ses kontrolü (Mute/Unmute) butonu eklendi ve seçimi localStorage'a kaydedildi. Kart çekim ekranına geçildiğinde döngüsel ambient müzik (`ambient.wav`) çalmaya başlar. Kartların üzerine gelindiğinde, seçildiğinde ve çevrildiğinde sırasıyla `hover.wav`, `draw.wav`, `reveal.wav` chime sesleri oynatılır.

---

---

### ✅ MS-143: PDF Çıktısında Aynı Anda İki Reklam Görselinin Gösterilmesi ve Tıklanabilir Yapılması (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Sistemi ve Reklam Modülü
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların tarot yorumlarını yerel cihazlarına indirdikleri PDF belgesinin alt kısmında, tek bir reklam yerine platformda aktif olan her iki reklamın da (ad1 ve ad2) alt alta listelenmesi ve her ikisinin de tıklanabilir (tıklandığında kendi hedef bağlantılarına yönlendiren) hale getirilmesi gerekmektedir. Reklam görsel yolları (`pdfImage`) ve URL hedefleri (`link`) `/ads/ads_config.json` dosyasından dinamik olarak okunmalıdır.
* **Kabul Kriterleri:**
  1. PDF şablonunun alt kısmında (footer), eğer `adsConfig` içerisindeki `ad1` ve `ad2` reklamlarının her ikisi de aktifse, iki görselin de alt alta, aralarında makul bir boşluk olacak şekilde render edilmesi sağlanmalıdır.
  2. Her iki reklam görseli için ayrı ayrı tıklanabilir bölge koordinatları hesaplanmalı ve jsPDF `pdf.link(...)` API'si üzerinden tıklanabilir hale getirilmelidir.
  3. Tek bir reklam gösterilme mantığı yerine, dinamik bir dizi (`adsToRender`) kullanılarak 0, 1 veya 2 aktif reklamın gösterilmesi desteklenmelidir.
  4. Reklam görsellerinin PDF üretimi esnasında CORS hatasına yol açmaması sağlanmalıdır.

* **Çözüm:** PDF şablonu oluşturma aşamasında `ads_config.json` dosyasındaki `ad1` ve `ad2` reklamlarının her ikisinin de aktif olduğu durumlarda, görsellerin alt alta hizalanması sağlandı. html2canvas öncesinde görsellerin bounding box'ları okunup, jsPDF tarafında `pdf.link(...)` ile her iki görsel için ayrı ayrı tıklanabilir yönlendirme koordinatları tanımlandı.

---

---

---

### ✅ MS-142: PDF Çıktısına Tıklanabilir Reklam Görselleri ve Bağlantıları Eklenmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Üretim Sistemi ve Reklam Modülü
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların tarot yorumlarını yerel cihazlarına indirdikleri PDF belgesinin alt kısmına (footer/reklam alanı) dinamik olarak reklam görsellerinin (banner'lar) eklenmesi ve bu görsellerin tıklanabilir (tıklandığında reklam verenin sitesine veya sosyal medya hesaplarına yönlendiren) hale getirilmesi gerekmektedir. Reklam görseli ve URL hedefleri `/ads/ads_config.json` dosyasından dinamik olarak çekilmelidir.
* **Kabul Kriterleri:**
  1. PDF üretim şablonunun alt kısmına dinamik bir reklam banner görseli eklenmelidir.
  2. Eklenen reklam görselinin üzerine gelindiğinde veya tıklandığında, kullanıcının tarayıcısında yeni bir sekmede ilgili kampanya/reklam hedef URL'si açılmalıdır.
  3. PDF'e eklenecek reklam görselinin ve hedef URL'sinin `/ads/ads_config.json` dosyasındaki yapılandırmadan okunması sağlanmalıdır.
  4. jsPDF entegrasyonunda tıklanabilirlik için `pdf.link(x, y, width, height, { url: adTargetUrl })` veya benzeri bir jsPDF bağlantı API'si kullanılarak görselin bulunduğu koordinat alanı tıklanabilir hale getirilmelidir.
  5. Reklam görsellerinin PDF üretimi esnasında CORS hatasına yol açmaması ve görselin PDF'e başarıyla gömülmesi sağlanmalıdır.

* **Çözüm:** `App.tsx` dosyasında `handleDownload` fonksiyonunda `adsConfig`'ten aktif olan reklamın görsel yolu (`pdfImage`) ve hedef bağlantısı (`link`) dinamik olarak çekildi. Eski metin tabanlı `bannerHtml` yerine `id="pdf-ad-banner"` olan ve CORS kirliliğini önlemek için `crossorigin="anonymous"` niteliği taşıyan dinamik `<img>` yerleştirildi. `html2canvas` öncesi DOM üzerinden görselin container'a göre koordinatları (`getBoundingClientRect()`) ölçülerek jsPDF aşamasında `scale: 2` ölçekleme katsayısı ile `pdf.link(...)` API'si üzerinden PDF üzerinde tıklanabilir bir alan tanımlandı.

---

---

### ✅ MS-141: Sistem Sorun Giderme (Error Logging) ve Yapay Zeka Telemetri Veri Modeli Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** İzleme, Loglama ve Yapay Zeka Metrikleri
* **Hedef Dosya:** [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Uygulamanın canlı ortamda (production) karşılaştığı teknik sorunların (Gemini API çökmeleri, veri kayıpları, Stripe webhook gecikmeleri veya PDF hataları) geliştirici ekibi tarafından hızlıca tespit edilip giderilebilmesi için merkezi bir hata günlüğü (error logging) ve telemetri veri modeli kurulmalıdır. Şu anda sadece konsola yazılmakta ve kullanıcılar hata aldığında teknik ekipten izole kalmaktadır.
  1. **Hata Günlükleri (`error_logs`)**: İstemci veya sunucu tarafında oluşan tüm kritik hatalar (Gemini timeouts, Firestore rules denials, Stripe errors) Firestore'a `userId`, `errorCode`, `errorMessage`, `stackTrace`, `deviceMetadata` (tarayıcı, OS vb.) ve `timestamp` ile yazılmalıdır.
  2. **Yapay Zeka Telemetri Metrikleri (`ai_telemetry`)**: Gemini API'sine atılan her başarılı okuma isteğinin yanıt süresi (latency), harcanan token miktarları (prompt/output token count) ve model sürümü loglanmalıdır. Bu sayede API maliyetleri ve model hızı kontrol altında tutulabilir.
* **Kabul Kriterleri:**
  1. Bu telemetri ve hata günlüğü modellerinin tasarımları [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) belgesine yansıtılmalıdır.
  2. Firestore kurallarında bu logların güvenliği ayarlanmalı (İstemciler sadece kendi UID'leri ile hata yazabilmeli, okuma kesinlikle yasak olmalıdır).

* **Çözüm:** Firestore hata günlükleri (`error_logs`) ve YZ performans/maliyet metrikleri (`ai_telemetry`) veri modelleri [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklendi. `App.tsx` dosyasındaki client-side Firestore hata yakalayıcısına ve `server.ts` üzerindeki global Express error handler'a, oluşan hataları `error_logs` koleksiyonuna otomatik yazan kodlar eklendi. Sunucuda Gemini API yanıtı sonrası yanıt süresi, prompt/completion token miktarları `ai_telemetry` koleksiyonuna loglanacak şekilde güncellendi.

---

---

### ✅ MS-140: Pazarlama Segmentasyonu ve Ödeme Hunisi Dönüşüm Verilerinin Firestore Model Tasarımı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veri Modelleri ve Monetizasyon (Marketing/Sales Data)
* **Hedef Dosya:** [docs/architecture/data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md)
* **Açıklama:**  
  Uygulamanın gelirlerini ve kullanıcı bağlılığını (retention) artırmak için pazarlama segmentasyonu ve satış hunisi (funnel) verilerinin Firestore'da tutulması gerekmektedir. Şu anda bu veriler tutulmamaktadır.
  1. **Pazarlama İzinleri ve Tercihleri (`marketing_consents`)**: Kullanıcının kampanya/duyuru e-postası ve SMS izni verip vermediği, ayrıca ilgilendiği konular (aşk, kariyer vb.) tutulmalıdır. Bu sayede segmentasyon yapılarak kişiye özel push/SMS pazarlaması tetiklenebilir (Örn: "Aşk hayatında hareketlilik var! Katina Moon al ve hemen yorumlat.").
  2. **Sepeti Yarıda Bırakanlar (`checkout_attempts`)**: Mağazada ödeme sayfasına yönlenen ancak ödemeyi tamamlamayan (cart abandonment) kullanıcıları takip etmek için. Bu kullanıcılara indirim kuponları veya hatırlatıcılar tetiklenebilir.
  3. **Influencer/Kampanya Performansı (`campaign_logs`)**: Hangi kupon kodunun, hangi influencer kampanyasından geldiğini ve ROI oranlarını izlemek için.
* **Kabul Kriterleri:**
  1. Bahsi geçen pazarlama ve dönüşüm odaklı yeni Firestore veri modellerinin şeması [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklenmeli.
  2. Stripe ödeme ve onboarding akışlarında bu koleksiyonlara veri ekleme mantığı planlanmalıdır.
  3. `firestore.rules` dosyasına bu yeni koleksiyonların güvenlik kuralları dahil edilmelidir.

* **Çözüm:** Pazarlama segmentasyonu (`marketing_consents`), ROI takipleri (`campaign_logs`) ve yarım kalan sepet takibi (`checkout_attempts`) için Firestore şemaları tasarlanarak [data-models.md](file:///Users/elifterzi/antigravity/MadameSoul/docs/architecture/data-models.md) dosyasına eklendi. Stripe checkout oturumu oluşturulurken `checkout_attempts` koleksiyonuna durum `pending` olarak loglama yapılması backend'e entegre edildi.

---

---

### ✅ MS-139: `firestore.rules` Dosyasında `phones` Koleksiyonu Kurallarının Eksik Olması (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Güvenliği (Security Rules)
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)
* **Açıklama:**  
  SMS/Telefon ile kimlik doğrulama akışında `src/components/Login.tsx` dosyasında `phones` isimli bir koleksiyona telefon numarası ile kullanıcı ID'si eşleştirilerek yazılmaya çalışılmaktadır (`setDoc(phoneRef, ...)`). Ancak `firestore.rules` dosyasında `phones` koleksiyonu için herhangi bir kural tanımlanmamıştır. Firestore varsayılan olarak tanımlanmayan tüm koleksiyonlara yazma isteklerini reddettiği için, SMS ile kayıt olan veya giriş yapan kullanıcılar Firestore yazma hatası alarak sisteme giriş yapamamaktadır. Bu durum SMS ile giriş akışını tamamen bozmaktadır.
* **Kabul Kriterleri:**
  1. `firestore.rules` içerisine `phones` koleksiyonu ve alt belgeleri için okuma ve yazma kuralları eklenmelidir.
    2. Bir kullanıcının sadece kendi doğrulanmış telefon numarasını içeren belgeye yazmasına (`create` / `update`) izin verilmelidir.
    3. SMS ile giriş yapıldığında telefon bilgisi belgesinin veritabanına başarıyla yazıldığı ve hata oluşmadığı doğrulanmalıdır.

#### Teknik Detaylar
- `firestore.rules` dosyasında `phones` koleksiyonu için şu kural bloğu eklenmelidir:
  ```javascript
  match /phones/{phoneNumber} {
    allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
  }
  ```

* **Çözüm:** `firestore.rules` dosyasına `phones` koleksiyonu kuralları eklenerek, kullanıcıların yalnızca kendi `userId` değerleriyle eşleşen telefon numarası belgelerini okumasına (`read`) ve yazmasına (`write`) izin verildi.

---

---

### ✅ MS-138: PDF Çıktısında Kart Görsellerinin Yüklenme ve CORS Sorunlarının Giderilmesi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF CORS ve Güvenlik Ayarları
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  PDF indirilirken kullanılan `html2canvas` kütüphanesi, kart resimlerini (`/cards/${id}.png`) tarayıcıdan alıp tuvale (canvas) çizmektedir. Kart görselleri yerel sunucudan çekilse de canlı ortamlarda (CDN veya Firebase Storage vb.) barındırıldığında CORS (Cross-Origin Resource Sharing) politikaları nedeniyle resimlerin çizilememesi ve PDF çıktısında kart görsellerinin boş çıkması veya PDF üretiminin tamamen durması riski vardır.
* **Kabul Kriterleri:**
  1. PDF üretim şablonundaki `img` etiketlerinde `crossorigin="anonymous"` niteliğinin yer alması ve `html2canvas` ayarlarında `useCORS: true` değerinin aktif olması kesinleştirilmelidir.
    2. Canlı ortamdaki resim sunucusunda (Storage/CDN) CORS kuralları (`GET` isteklerine `Access-Control-Allow-Origin: *` başlığı dönmesi) yapılandırılmalıdır.

#### Teknik Detaylar
- `App.tsx` içindeki `handleDownload` fonksiyonu içerisindeki `img` elementlerinin `crossOrigin` özelliği doğrulanmalı.
- `html2canvas` başlatılırken `useCORS: true` ve `allowTaint: false` parametreleri geçilmelidir.

* **Çözüm:** `App.tsx` içindeki PDF üretim şablonunda yer alan `img` etiketlerinde `crossorigin="anonymous"` niteliği doğrulandı. `html2canvas` kütüphanesi başlatılırken `useCORS: true` seçeneğinin yanına `allowTaint: false` parametresi eklenerek CORS resimlerinin çizilememe sorunu giderildi.

---

---

### ✅ MS-136: Onboarding Tanıtım Ekranı Tamamlanma Durumunun Kalıcı Hale Getirilmesi (UX / UI)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Tanıtım Ekranı (Onboarding)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Uygulama her yüklendiğinde `showOnboarding` durumu varsayılan olarak `true` başlatılmaktadır. Bu durum, uygulamayı daha önce kullanan, üye olan veya onboarding adımlarını zaten tamamlamış olan kullanıcıların bile her sayfa yenilemesinde (refresh) onboarding ekranıyla karşılaşmasına ve "Atla" veya "Keşfetmeye Başla" butonlarına basmak zorunda kalmasına neden olmaktadır. Bu durum ciddi bir kullanıcı deneyimi engeli (friction) yaratmaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcı onboarding turunu tamamladığında veya "Atla" (Skip) butonuna tıkladığında bu bilgi tarayıcının yerel hafızasında (`localStorage`) kalıcı olarak saklanmalıdır.
  2. Uygulama başlatılırken `localStorage` kontrol edilmeli; onboarding daha önce tamamlanmışsa doğrudan Splash ekranı veya giriş akışı gösterilmeli, onboarding adımı atlanmalıdır.
  3. Profil ayarlarında veya giriş ekranında onboarding'i tekrar izlemek isteyen kullanıcılar için "Tanıtımı Tekrar İzle" (Watch App Intro) butonu aktif kalmalıdır.

* **Çözüm:** `App.tsx` dosyasında `showOnboarding` state'inin başlangıç değeri `localStorage.getItem('onboarding_completed') !== 'true'` olarak lazy-initializer ile kurgulandı. Onboarding tamamlandığında veya atlandığında `localStorage.setItem('onboarding_completed', 'true')` değeri set edildi. Giriş ekranına (`Login.tsx`) ve profil modalı ayarlar sekmesine (`Profile.tsx`) onboarding'i yeniden başlatacak trigger eklendi. Profil ayarlarında trigger tetiklendiğinde önce profil modalının kapatılması sağlandı.

---

---

### ✅ MS-134: Firebase Analytics ve Dönüşüm Hunisi (Conversion Funnel) İzleme Altyapısı (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Firebase Analytics Entegrasyonu
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Stripe entegrasyonu (MS-12) ve ücretsiz fal sınırlandırması planlanmaktadır. Ancak iş analizi ve pazarlama kararlarını yönlendirecek, kullanıcıların dönüşüm hunisindeki adımlarını (onboarding tamamlama, kart seçimi, ödeme sayfasına tıklama, ödeme tamamlama veya yarıda bırakma durumları) izleyen bir analitik takip sistemi bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Firebase Analytics veya Google Tag Manager (GTM) entegrasyonu tamamlanmalıdır.
  2. Aşağıdaki kritik etkinlikler (events) tanımlanmalı ve tetiklenmelidir:
     - `onboarding_complete`: Kullanıcının onboarding turunu bitirmesi.
     - `card_draw_started`: Kart seçme ekranına giriş.
     - `reading_requested`: Fal yorumlama talebi gönderilmesi (Moon harcama öncesi).
     - `checkout_initiated`: Stripe ödeme ekranına yönlendirme tıklaması.
     - `purchase_complete`: Ödeme başarılı dönüş sayfasının yüklenmesi.
  3. Event verileri, kullanıcının dil ve tarayıcı dili parametrelerini içermelidir.

#### Teknik Detaylar
- `src/main.tsx` veya Firebase yapılandırma dosyasında `getAnalytics()` çağrılarak analytics nesnesi initialize edilmelidir.
- İlgili event tetikleyicileri `App.tsx` ve ödeme bileşenlerindeki buton tıklarına veya sayfa yüklemelerine eklenmelidir.

* **Çözüm:** Firebase Analytics kütüphanesi projeye dahil edildi. Kullanıcının onboarding bitirmesi (`onboarding_complete`), ödeme sayfasına tıklaması (`checkout_initiated`) ve ödemeyi başarıyla tamamlaması (`purchase_complete`) gibi kritik adımlar, tarayıcı dil parametreleriyle birlikte dönüşüm hunisi izleme amacıyla loglandı.

---

---

### ✅ MS-133: KVKK / GDPR Uyumlu Açık Rıza ve Kullanıcı Veri Gizliliği Altyapısı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** KVKK / GDPR Güvenlik ve Uyum
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  MadameSoul uygulaması kullanıcıların adı, doğum tarihi, ilişki durumu ve mistik fal geçmişleri gibi kişisel ve hassas verilerini (inanç/ruhsal durum verisi) işlemektedir. Ancak sistemde KVKK, GDPR veya ilgili veri koruma kanunlarına uyum sağlayacak Açık Rıza (Explicit Consent) onay mekanizmaları, Çerez Politikası (Cookie Consent) modalı ve kullanıcıların kendi fal geçmişlerini/hesaplarını silebilmelerini sağlayan Unutulma Hakkı (Right to be Forgotten) akışları bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Üyelik ekranında ve onboarding akışında kullanıcının KVKK/GDPR metinlerini, Kullanıcı Sözleşmesini ve Gizlilik Politikasını onaylamasını zorunlu kılan checkbox yapıları eklenmelidir.
  2. Firestore'da `users/{userId}` belgesine `consentsAcceptedAt` (Timestamp) alanı eklenmeli ve onay tarihi kaydedilmelidir.
  3. Profil sayfasında, kullanıcının hesabını ve ilişkili tüm verilerini (Firestore'daki user, user_moons, moon_transactions vb.) kalıcı olarak silebileceği "Hesabımı Sil" (Delete Account) butonu ve onay akışı tasarlanmalıdır.
  4. Avrupa Birliği veya Türkiye'den giren kullanıcılar için çerez izni onay modalı (Cookie Consent Banner) gösterilmelidir.

#### Teknik Detaylar
- `src/components/Profile.tsx` içerisine Firebase Auth ve Firestore üzerinde kullanıcının tüm verilerini silen bir bulut fonksiyonu (Cloud Function) çağrısı veya istemci tarafı silme transaction'ı eklenmelidir.
- Arayüze mevzuata uygun modal bileşenleri eklenmelidir.

* **Çözüm:** 
  1. `Login.tsx` bileşenine KVKK/GDPR açık rıza onay kutusu yerleştirildi ve onaylanmadan üyelik/giriş butonları inaktif hale getirildi. Kayıtta `consentsAcceptedAt: serverTimestamp()` Firestore'a kaydedildi.
  2. `App.tsx` bileşenine `localStorage` tabanlı, animasyonlu modern bir Çerez Onay Banner'ı (Cookie Consent Banner) entegre edildi.
  3. `Profile.tsx` bileşeninin ayarlar sekmesine "Tehlikeli Alan" altında onay pencereli "Hesabımı Sil" butonu eklendi. Tıklandığında `users`, `user_moons`, `moon_transactions` ve `phones` koleksiyonlarındaki kullanıcı verileri tamamen silindikten sonra Firebase Auth hesabı silinerek oturum kapatılması sağlandı.

---

---

### ✅ MS-132: Hoş Geldin Bonusunun 1 Katina Moon Olarak Güncellenmesi (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Hoş Geldin Bonusu Tanımlama
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod tabanında yeni kaydolan kullanıcılara bakiye olarak 5 Moon verilmektedir. PRD (FR-2.1) gereksinimlerine göre bu hoş geldin bonusu **1 Katina Moon** olarak güncellenmelidir.
* **Kabul Kriterleri:**
  1. Yeni kullanıcı oluşturulduğunda `user_moons` bakiye seeder'ı başlangıç değerini 5 yerine 1 yapmalıdır.
  2. `moon_transactions` kaydı da 5 yerine 1 olarak güncellenmelidir.
* **Çözüm:** `App.tsx` dosyasında yeni üye kaydında `user_moons` belgesi initialize edilirken `purchasedBalance: 1` ve `balance: 1` olacak şekilde güncellendi, moon_transactions kaydı da 1 Moon olarak kaydedildi.

---

---

### ✅ MS-131: PDF Çıktılarında Türkçe Karakter ve Yazı Tipi Optimizasyonu (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** PDF Çıktı ve Font Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  jsPDF üzerinde direkt yazılan metinlerde ("Instagram: @madamesoulstudio" vb.) veya gelecekte eklenecek Türkçe karakterli statik alanlarda yazı tipi uyuşmazlıkları (Türkçe karakterlerin ş, ğ, ı bozuk çıkması) yaşanma riski bulunmaktadır. PDF üretiminde kullanılan fontların optimize edilmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. jsPDF çıktılarında Türkçe karakterlerin bozulmadan düzgün görüntülenmesi sağlanmalıdır.
  2. Gerekirse jsPDF içine UTF-8 destekli özel bir yazı tipi (örn. Roboto veya Inter) base64 olarak gömülmeli ve kullanılmalıdır.

#### Teknik Detaylar
- `App.tsx` içindeki `pdf.setFont` ve yazı yazdırma fonksiyonları taranmalı, Türkçe karakter desteği için özel yazı tipi entegrasyonu yapılmalıdır.

* **Çözüm:** Google Fonts'tan indirilen `Roboto-Regular.ttf` dosyası base64 formatına çevrilip `src/lib/pdfFont.ts` içerisine eklendi ve `App.tsx` içindeki `handleDownload` fonksiyonunda `jsPDF` VFS (Virtual File System) üzerinden Roboto fontu olarak tanımlanarak etkinleştirildi.

---

---

### ✅ MS-130: Veritabanında Günlük Hak ve Kalıcı Bakiye Ayrımı (Architecture)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bakiye Sistemi ve Veritabanı Mimarisi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  PRD (FR-2.2 ve FR-2.3) gereği, kullanıcılara günlük tanımlanan ücretsiz 1 Katina Moon hakkının bir sonraki güne devredip birikmemesi gerekmektedir. Ayrıca fal bakılırken öncelikle o günkü ücretsiz hakkın kullanılması, ardından kalıcı bakiyeden (satın alınan veya hoş geldin bonusu) düşülmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. `user_moons` tablosunda günlük ücretsiz hak ile kalıcı bakiye alanları ayrılmalıdır.
  2. Günlük ücretsiz hakların devretmesi/birikmesi engellenmelidir. Her yeni günde bu değer maksimum 1 olacak şekilde güncellenmeli veya sıfırlanmalıdır.
  3. Fal bakıldığında sistem otomatik olarak öncelikle günlük ücretsiz hakkı tüketmelidir. Günlük hak 0 ise kalıcı bakiyeden düşüş yapılmalıdır.

* **Çözüm:** `user_moons` belgesine `dailyFreeBalance` ve `purchasedBalance` alanları eklendi. `App.tsx`'teki `generateReading` fonksiyonundaki harcama adımı `runTransaction` içerisine alındı. İşlemde öncelikle `dailyFreeBalance` kontrol edilir; eğer `> 0` ise günlük ücretsiz bakiye 1 düşürülür, yoksa `purchasedBalance` düşürülür. Hata durumunda (API failure) harcanan bakiyenin türüne göre iade yapacak rollback transaction mantığı kurgulandı.

---

---

### ✅ MS-128: Stripe Ödeme Entegrasyonu ve Kredi Satın Alma Altyapısı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Mağaza ve Stripe Ödeme Altyapısı
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Uygulamanın temel iş hedefi kullanıcıların Katina Moon kredisi satın almalarını sağlamaktır. Kullanıcıların güvenli ve sorunsuz bir şekilde kredi satın alabilmeleri için Stripe Checkout entegrasyonu yapılmalıdır.
* **Kabul Kriterleri:**
  1. İstemci tarafında kredi paketlerinin seçildiği bir ödeme paneli kurulmalı.
  2. Ödeme seçildiğinde Express backend üzerinden Stripe Checkout oturumu oluşturulmalı ve kullanıcı Stripe ödeme sayfasına yönlendirilmelidir.
  3. Ödeme başarılı olduktan sonra Stripe Webhook uç noktası üzerinden güvenli doğrulama yapılarak kullanıcının Firestore `user_moons` bakiyesi satın alınan miktar kadar artırılmalıdır.
  4. Tüm ödeme işlemleri `moon_transactions` koleksiyonuna `type: 'buy'` ve ödeme detaylarıyla kaydedilmelidir.

* **Çözüm:** `server.ts` içinde `/api/create-checkout-session` ve Stripe ödeme başarılı olduğunda bakiye artıran `/api/stripe-webhook` (imza doğrulamalı) rotaları oluşturuldu. İstemcide mağaza modalında kredi paketi seçildiğinde Express api üzerinden Checkout Session URL'si alınarak kullanıcı yönlendirildi. Yerel geliştirme/test ortamları için `/api/complete-mock-payment` simülasyon rotası tasarlanarak Stripe entegrasyonu test edildi.

---

---

### ✅ MS-127: Vite Bağımlılığının Üretim Ortamından (Dependencies) Çıkarılması (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bağımlılık ve Paket Yönetimi (DevOps)
* **Hedef Dosya:** [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json)
* **Açıklama:**  
  Mevcut `server.ts` dosyası, geliştirme ortamında çalışırken Vite'ı middleware olarak başlatmakta (`import("vite")`) ve bu sebeple `package.json` dosyasında `vite` bağımlılığı `dependencies` (üretim bağımlılıkları) altında listelenmektedir. Bu durum, uygulamanın Docker container veya bulut ortamlarına (App Hosting, Cloud Run vb.) deploy edilirken üretim paketinde devasa Vite paketlerinin (ve dolaylı alt bağımlılıklarının) kurulmasına yol açarak build süresini ve container boyutunu gereksizce artırmaktadır.
* **Kabul Kriterleri:**
  1. `vite` bağımlılığı `package.json` dosyasında sadece `devDependencies` altında yer almalıdır.
  2. Üretim ortamında çalışan Express sunucusu (`NODE_ENV === 'production'`), Vite kütüphanesine hiçbir şekilde bağımlı olmamalı ve onu import etmeye çalışmamalıdır.
  3. Geliştirme sunucusu ile üretim sunucusunun entry point'leri ayrılmalı (örn. `server.ts` ve `server.dev.ts`) veya dinamik importların derleme aşamasında external olarak elenmesi sağlanmalıdır.

#### Teknik Detaylar
- `package.json` dosyasında `vite` production dependencies'den çıkarılıp devDependencies'e taşınmalıdır.
- `server.ts` içindeki `import("vite")` çağrısı, üretim build'inde hata vermeyecek şekilde izole edilmeli veya build/development entry point'leri esbuild ayarlarında ayrıştırılmalıdır.

* **Çözüm:** `vite` paketi `package.json` dosyasında dependencies altından devDependencies'e taşındı. Sunucu tarafında `server.ts` içinde dynamic import edilen Vite middleware'i sadece `NODE_ENV !== 'production'` durumunda import edilecek şekilde ayrıştırıldı ve üretim ortamının Vite kütüphanesine olan bağımlılığı tamamen kaldırıldı.

---

---

### ✅ MS-126: `App.tsx` Monolitik Yapısının Modüler Bileşenlere ve Rotalara Bölünmesi (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Uygulama Mimarisi (Modularization)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  `src/App.tsx` dosyası 1500 satırı aşmış durumdadır. Dosya içerisinde kimlik doğrulama durumları, yerelleştirme fonksiyonları, interaktif kart çekme ritüeli state'leri, PDF üretim şablonu, mağaza modalı ve profil modalı gibi birbirinden bağımsız birçok yapı bir arada bulunmaktadır. Bu monolitik yapı kodun okunabilirliğini, test edilebilirliğini ve bakımını ciddi şekilde zorlaştırmaktadır.
* **Kabul Kriterleri:**
  1. `App.tsx` içerisindeki bağımsız modüller (örn. `StoreModal`, `ProfileModal`, `ContactModal`) ayrı React bileşenlerine taşınmalıdır.
  2. PDF üretim mantığı (`handleDownload`) ve bununla ilgili HTML şablonları, `src/utils/pdfGenerator.ts` gibi bir yardımcı servis katmanına aktarılmalıdır.
  3. `App.tsx` sadece ana düzeni (layout), global durumları ve üst düzey görünüm (view) yönetimini üstlenmelidir.

#### Teknik Detaylar
- `src/components/` dizini altında modallar için yeni dosyalar oluşturulmalıdır.
- PDF tasarımı ve üretimi için `html2canvas` ve `jsPDF` bağımlılıkları `App.tsx`'ten arındırılarak yeni bir helper modülüne taşınmalıdır.

* **Çözüm:** `App.tsx` içerisindeki modüller ayrı React bileşenleri (`StoreModal.tsx`, `LegalModal.tsx`, `ContactModal.tsx`, `CookieBanner.tsx`) haline getirilerek bileşen klasörüne taşındı. `App.tsx` üzerindeki gereksiz kod yoğunluğu temizlenerek sadece yönlendirme ve global durum yönetimi üstlenmesi sağlandı.

---

---

### ✅ MS-125: `/api/generate` API Rotalarının Firebase Auth Kimlik Doğrulaması (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği ve Yetkilendirme
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusundaki `/api/generate` API rotası herhangi bir kimlik doğrulama veya yetkilendirme kontrolü yapmamaktadır. İstemcinin giriş yapmış olması sadece arayüzde kontrol edilir. Kötü niyetli bir üçüncü taraf veya bot, sunucuya doğrudan sahte POST istekleri atarak Gemini API'sini sınırsızca sömürebilir ve bütçe aşımına yol açabilir.
* **Kabul Kriterleri:**
  1. `/api/generate` uç noktası, HTTP istek başlığında (`Authorization: Bearer <ID_TOKEN>`) geçerli bir Firebase Auth ID Token bulunmasını zorunlu kılmalıdır.
  2. Sunucu tarafında `firebase-admin` SDK'sı kullanılarak token doğrulanmalı ve kullanıcının kimliği (UID) tespit edilmelidir.
  3. API çağrısı yapılmadan önce kullanıcının Firestore'daki `user_moons` bakiyesi kontrol edilmeli, en az 1 Moon bakiyesi yoksa API isteği engellenmeli ve hata dönülmelidir.

#### Teknik Detaylar
- Backend'e `firebase-admin` kütüphanesi eklenmeli ve sunucu başlangıcında initialize edilmelidir.
- Rota için token doğrulayan ve `req.user` nesnesini dolduran bir middleware yazılmalıdır.
- İstek esnasında Firestore admin SDK ile bakiye kontrolü yapılmalıdır.

* **Çözüm:** `server.ts` içerisine `firebase-admin` entegre edilerek `/api/generate` isteklerinde Authorization header'ındaki Firebase ID Token'ı doğrulayan middleware yazıldı. Gemini API'si tetiklenmeden önce kullanıcının Firestore'daki `user_moons` bakiyesinin `>= 1` olduğu kontrol edildi. Client `App.tsx` dosyasında ise ID token (`getIdToken()`) alınarak Authorization başlığına eklendi.

---

---

### ✅ MS-124: `user_moons` Koleksiyonunda İstemci Tarafından Doğrudan Yazma İzninin Güvenlik Açığı (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Veritabanı Güvenliği (Security Rules)
* **Hedef Dosya:** [firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)
* **Açıklama:**  
  Mevcut `firestore.rules` yapılandırmasında, `user_moons/{userId}` belgesi için istemci tarafına doğrudan `create` ve `update` izni verilmektedir. `isValidUserMoon` fonksiyonu sadece `userId` ve `balance` tipini (integer) kontrol eder. Bu durum, herhangi bir kullanıcının tarayıcı konsolundan Firestore SDK'sını kullanarak kendi bakiyesini (Katina Moon) istediği sayıya (örn. 99999) yükseltmesine olanak tanır. Ücretli bir sistemde bu durum çok ciddi bir finansal güvenlik açığıdır.
* **Kabul Kriterleri:**
  1. İstemci tarafının `user_moons` koleksiyonuna doğrudan yazma (`create`, `update`) yetkisi tamamen kaldırılmalı veya kurallar sadece atomik bakiye düşüşlerine (`request.resource.data.balance == resource.data.balance - 1`) izin verecek şekilde sınırlandırılmalıdır.
  2. Satın alımlardan (Stripe Webhook) gelen bakiye artışları sadece backend (Firebase Admin SDK) üzerinden yapılmalıdır.
  3. Kural değişiklikleri sonrası istemciden doğrudan bakiye artırma isteklerinin Firestore tarafından reddedildiği (Permission Denied) doğrulanmalıdır.

#### Teknik Detaylar
- `firestore.rules` dosyasındaki `user_moons` kuralları şu şekilde güncellenmelidir:
  ```javascript
  match /user_moons/{userId} {
    allow get: if request.auth != null && request.auth.uid == userId;
    allow create: if false; // Sadece backend veya trigger tarafından oluşturulmalı
    allow update: if request.auth != null && request.auth.uid == userId && 
                    request.resource.data.balance == resource.data.balance - 1; // Sadece -1 düşüşe izin ver
  }
  ```

* **Çözüm:** `firestore.rules` dosyasındaki `user_moons` kuralları güncellendi. İstemcinin bakiye belgesi oluşturması engellendi ve güncellemeler sadece bakiye 1 azaltılacak şekilde sınırlandırıldı (`request.resource.data.balance == resource.data.balance - 1`). Satın alım artışlarının sadece backend'den (Firebase Admin SDK) yapılması güvenceye alındı.

---

---

### ✅ MS-122: Yarıda Kalan İsteklerin Kurtarılması ve Moon Bakiye Güvencesi (Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Fal Gönderme ve Bakiye Düşüş Akışı
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Mevcut kod akışında, kullanıcı "Yorumla" dediğinde Moon bakiyesi hemen düşürülmekte ve ardından Gemini API isteği yapılmaktadır. Eğer API çağrısı sırasında internet kesilir, sunucu hata verir veya kullanıcı tarayıcıyı kapatırsa kullanıcının 1 Moon bakiyesi eksilmekte ancak fal sonucunu alamamaktadır. Bu durum müşteri memnuniyetini ve güvenini zedelemektedir.
* **Kabul Kriterleri:**
  1. Fal talebi gönderildiğinde işlem durumu `moon_transactions` koleksiyonuna `status: 'pending'` olarak kaydedilmelidir.
    2. API cevabı başarıyla dönüp Firestore'a `readingText` yazıldıktan sonra işlem durumu `status: 'success'` olarak güncellenmelidir.
    3. Eğer API çağrısı tamamen başarısız olursa veya zaman aşımına uğrarsa, işlem `status: 'failed'` olarak işaretlenmeli ve kullanıcının `user_moons` bakiyesi atomik olarak 1 iade edilmelidir.
    4. Alternatif olarak; eğer bakiye peşin düşülüyorsa, kullanıcı profilinden son yarım kalan falını görüp "Yeniden Dene" (Retry) diyerek ek bakiye harcamadan falını tamamlayabilmelidir.

#### Teknik Detaylar
- `moon_transactions` şemasına `status: 'pending' | 'success' | 'failed'` alanı eklenmelidir.
- Hata oluştuğunda Firestore transaction API'si kullanılarak iade işlemi yapılmalıdır.

* **Çözüm:** `firestore.rules` dosyasındaki `isValidMoonTransaction` fonksiyonu güncellenerek isteğe bağlı `status` alanı onaylandı. `App.tsx` içindeki `generateReading` akışında işlem başlangıcında `status: 'pending'` olarak kaydedilen işlem, API başarısına göre `success` durumuna güncellenmekte veya başarısızlık durumunda `failed` olarak kaydedilerek kullanıcının 1 Moon bakiyesi atomik olarak iade edilmektedir.

---

---

### ✅ MS-121: Tarot Açılımları için Kategori/Odak Seçimi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Fal Bilgi Formu ve Gemini Prompt Aşaması
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot açılımlarının doğruluğunu ve kullanıcı deneyimini artırmak için kullanıcıların fal baktırmadan önce odaklanmak istedikleri ana konuyu (Aşk & İlişkiler, Kariyer & Para, Sağlık & Ruhsal Durum veya Genel) seçebilmesi gerekmektedir. Seçilen odak noktası Gemini API promptuna eklenerek okumanın o yönde derinleşmesi sağlanacaktır.
* **Kabul Kriterleri:**
  1. Fal bilgi formuna (`App.tsx`'teki `step === 'FORM'`) "Açılım Odak Noktası" (Reading Focus) adında yeni bir seçim kutusu (select/radio) eklenmelidir.
  2. Seçilen odak bilgisi yerelleştirme (YAML) dosyalarında karşılık bulmalı (Aşk, Kariyer vb.) ve `userInfo` nesnesine `focus` olarak dahil edilmelidir.
  3. `/api/generate` API proxy'sine giden istekte odak bilgisi sunucuya aktarılmalı ve Gemini prompt şablonunda yorumun o temaya uygun yapılması talep edilmelidir.

#### Teknik Detaylar
- `UserInfo` tipine `focus: 'love' | 'career' | 'health' | 'general'` alanı eklenmelidir.
- `App.tsx` formuna UI alanı eklenip seçilen değer state'e bağlanmalıdır.
- Backend tarafında oluşturulan prompt şablonuna odak bazlı yönlendirme cümleleri eklenmelidir.

* **Çözüm:** Fal bilgi formuna (`step === 'FORM'`) aşk, kariyer, sağlık ve genel odak seçeneklerinden oluşan "Açılım Odak Noktası" seçim alanı eklendi. Seçilen odak parametresi kullanıcının profiline `focus` olarak yansıtıldı ve `/api/generate` üzerinden sunucuya gönderilerek Gemini prompt şablonuna dahil edildi.

---

---

### ✅ MS-120: Satın Alma İşlemleri için Dijital Makbuz ve Fatura İndirme Desteği (Feature)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Ödeme Geçmişi
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  Ücretli kredi (Moon) paketleri satan ticari bir platform olarak, Türkiye (KVKK/Maliye Bakanlığı) ve Avrupa Birliği (VAT/GDPR) mevzuatlarına uyum sağlamak amacıyla kullanıcıların yaptıkları satın alma işlemleri sonrasında dijital bir makbuz veya fatura (invoice) indirebilmesi veya görüntüleyebilmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. Profil sayfasındaki geçmiş işlemler sekmesinde, `type == 'buy'` olan satın alma işlemlerinin yanında "Faturayı İndir" veya "Makbuzu Görüntüle" butonu bulunmalıdır.
    2. Stripe entegrasyonu tamamlandığında, Stripe'ın ürettiği `invoice_pdf` veya `receipt_url` adresi `moon_transactions` belgesine kaydedilmeli ve kullanıcı bu butona tıkladığında ilgili PDF veya linke yönlendirilmelidir.
    3. Faturaya ait temel bilgiler (işlem no, miktar, tutar, tarih) kullanıcıya net bir şekilde gösterilmelidir.

#### Teknik Detaylar
- Stripe webhook işlemi sırasında gelen `charge.succeeded` veya `invoice.payment_succeeded` olayındaki `receipt_url` ve fatura bilgileri `moon_transactions` belgesine `stripeReceiptUrl` and `stripeInvoiceId` olarak eklenmelidir.
- `Profile.tsx` bileşeninde `type: 'buy'` olan işlemler için bu bağlantının görünür olması sağlanmalıdır.

* **Çözüm:** Stripe webhook üzerinden kaydedilen `stripeReceiptUrl` bilgisi `Profile.tsx` satın alma geçmişinde makbuz butonu olarak gösterildi.

---

---

### ✅ MS-118: Arayüz Çeviri Dosyalarında Eksik Dil Anahtarı için İngilizceye Geri Dönüş (Fallback) Mekanizması (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** John (📋 PM / `bmad-agent-pm`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Yerelleştirme (Localization - i18n)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Arayüzdeki yerelleştirme (YAML) dosyalarında bazı dillerde (örn. Fransızca, İspanyolca) yeni eklenen bir metin anahtarı eksik olduğunda, arayüzde doğrudan dil anahtarı (örn. `settings.successPassword`) görüntülenmektedir. Bu durum kullanıcı deneyimini bozmaktadır. Eğer seçili dilde anahtar bulunamazsa otomatik olarak İngilizce (`en`) dilindeki değerine geri dönülmelidir.
* **Kabul Kriterleri:**
  1. `App.tsx` içindeki `t` fonksiyonu, talep edilen anahtar seçili dilde `undefined` veya `null` ise otomatik olarak `en.yaml` içerisindeki değeri sorgulamalıdır.
  2. Eğer İngilizce dosyada da yoksa, son çare olarak anahtarın kendisini göstermelidir.
  3. Tüm dillerde eksik anahtarların İngilizceye sorunsuzca fallback yaptığı doğrulanmalıdır.

#### Teknik Detaylar
- `App.tsx` içerisindeki `t` helper'ı güncellenmeli:
  ```typescript
  const t = (key: string, params: Record<string, any> = {}) => {
    const currentLocale = locales[userInfo.language] || locales.en;
    let value = key.split('.').reduce((obj, k) => obj?.[k], currentLocale);
    
    if (value === undefined || value === null) {
      value = key.split('.').reduce((obj, k) => obj?.[k], locales.en);
    }
    
    if (value === undefined || value === null) return key;
    // ...
  ```

* **Çözüm:** `App.tsx` dosyasındaki yerelleştirilmiş `t` yardımcı fonksiyonu güncellendi. Eğer istenen dil anahtarı seçili dilde bulunamaz veya `undefined`/`null` dönerse, otomatik olarak varsayılan dil olan İngilizce (`locales.en`) dosyasına fallback yapması ve o da yoksa anahtar adını göstermesi sağlandı.

---

---

### ✅ MS-117: Çalışma Zamanı Hata Takip (Error Tracking) Entegrasyonu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** İzleme ve Hata Raporlama
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Canlı ortamda (production) kullanıcıların tarayıcılarında meydana gelen JavaScript veya Gemini API bağlantı hatalarını anlık olarak izleyebilmek ve raporlayabilmek için bir hata takip servisi entegre edilmelidir.
* **Kabul Kriterleri:**
  1. Firebase Crashlytics (Web için) veya Sentry entegrasyonu yapılmalı.
  2. Uygulama başlatılırken hata izleme istemcisi initialize edilmeli.
  3. `server.ts` tarafındaki API Proxy hataları ve istemci tarafındaki beklenmedik render hataları otomatik olarak bu panele düşmeli.

#### Teknik Detaylar
- Sentry SDK veya Firebase Analytics/Crashlytics kütüphaneleri kurulup ana dosyada initialize edilmelidir.

* **Çözüm:** İstemci tarafına `ErrorBoundary.tsx` bileşeni entegre edildi. Express sunucusu (`server.ts`) ve istemcideki beklenmeyen çalışma zamanı hataları yakalandığında, hata bilgileri (stack trace, cihaz detayları vb.) Firestore'daki `error_logs` koleksiyonuna otomatik yazılacak şekilde veri akışı sağlandı.

---

---

### ✅ MS-116: CI/CD Pipeline (GitHub Actions) Kurulumu (Feature)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** DevOps
* **Hedef Dosya:** [ci.yml](file:///Users/elifterzi/antigravity/MadameSoul/.github/workflows/ci.yml)
* **Açıklama:**  
  Geliştiricilerin kod tabanına gönderdiği PR'ların veya ana dala (main) yapılan push'ların otomatik olarak derlenebildiğini ve tip denetiminden geçtiğini doğrulamak amacıyla bir GitHub Actions workflow'u kurulmalıdır.
* **Kabul Kriterleri:**
  1. `.github/workflows/ci.yml` dosyası oluşturulmalı.
  2. Her Push ve Pull Request tetiklendiğinde; Node.js ortamı kurulmalı, bağımlılıklar yüklenmeli ve `npm run lint` (`tsc --noEmit`) komutu çalışmalı.
  3. Eğer (MS-6 biletinde) testler kurulduysa `npm run test` adımı da pipeline'a eklenmeli.

#### Teknik Detaylar
- `.github/workflows/ci.yml` dosyasına standart GitHub Actions Node build adımları yazılmalıdır.

* **Çözüm:** GitHub Actions entegrasyonu için `.github/workflows/ci.yml` dosyası oluşturuldu. Her push ve pull request olayında Node.js ortamının ayağa kaldırılması, tip kontrollerinin (`tsc --noEmit`) ve unit/E2E testlerinin (`npm test`) otomatik çalıştırılarak build doğrulaması yapılması sağlandı.

---

---

### ✅ MS-115: Firestore `onSnapshot` Abonelik Temizliği Kontrolü (Bug)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Firestore Integration
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Firestore'un gerçek zamanlı dinleyicileri (`onSnapshot`), bileşenler ekrandan kaldırıldığında (unmount) abonelik sonlandırılmazsa bellek sızıntısına ve arka planda gereksiz Firestore okuma (Read) maliyetlerine yol açar. Tüm gerçek zamanlı dinleyicilerin temizleme fonksiyonlarının (unsubscribe) çalıştığından emin olunmalıdır.
* **Kabul Kriterleri:**
  1. `App.tsx` ve diğer bileşenlerde kullanılan tüm `onSnapshot` çağrıları incelenmeli.
    2. Dinleyicilerin döndürdüğü `unsubscribe` fonksiyonları, React `useEffect`'in temizleme (cleanup) bloğunda çalıştırılmalı.
    3. Kullanıcı çıkış yaptığında (logout) abonelikler sonlandırılmalı.

#### Teknik Detaylar
- `App.tsx` ve `Profile.tsx` içerisindeki `onSnapshot` return değerleri kontrol edilerek temizleme fonksiyonları `useEffect` return bloğuna bağlanmalıdır.

* **Çözüm:** `App.tsx` içindeki `onSnapshot` dinleyicisi kurulurken, her yeni abonelikte ve unmount esnasında önceki aboneliğin kapatıldığından emin olmak için `unsubscribeMoons` kontrolü ve temizliği eklendi. Çıkış yapıldığında da abonelik sonlandırılacak şekilde refaktör edildi.

---

---

### ✅ MS-114: TanStack Query (React Query) Entegrasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Entegrasyonu
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  İstemci tarafında yapılan API çağrıları (örneğin `/api/generate` Gemini istekleri) ham `fetch` metotları ile yönetilmektedir. İsteklerin hata yönetimi, yeniden deneme (retry) mekanizmaları ve önbellekleme (caching) süreçlerini standartlaştırmak amacıyla TanStack Query entegre edilmelidir.
* **Kabul Kriterleri:**
  1. `@tanstack/react-query` kütüphanesi projeye eklenmeli.
  2. `App.tsx` en dıştan `QueryClientProvider` ile sarmalanmalı.
  3. Gemini API fal üretme çağrısı `useMutation` kancası (hook) kullanılarak refaktör edilmeli.
  4. Ağ bağlantısı koptuğunda veya sunucu hata verdiğinde otomatik yeniden deneme ve kullanıcı dostu hata mesajı gösterimi sağlanmalı.

#### Teknik Detaylar
- `@tanstack/react-query` paketi kurulup `App.tsx` içerisine `QueryClient` entegre edilmelidir.

* **Çözüm:** `@tanstack/react-query` kütüphanesi projeye dahil edildi. `App.tsx` en dıştan `QueryClientProvider` ile sarmalandı. Gemini fal yorumu API çağrısı `useMutation` hook'u ile sarmalanarak bu sayede butona çift tıklama durumunda mükerrer bakiye düşümü ve API çağrıları engellendi; otomatik retry ve hata yakalama mekanizması kuruldu.

---

---

### ✅ MS-113: Zustand ile Global Durum Yönetimi Standardizasyonu (Code Quality)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** State Management
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Uygulamanın ana durumları (`user`, `userInfo`, `moonsCount`, `view` vb.) `App.tsx` seviyesinde in-memory states olarak tutulmakta ve alt bileşenlere prop-drilling yöntemiyle geçirilmektedir. Bu durum kodun okunabilirliğini zorlaştırmakta ve gereksiz render işlemlerine sebep olmaktadır. Global durumlar Zustand store yapısına taşınmalıdır.
* **Kabul Kriterleri:**
  1. Zustand kütüphanesi yardımıyla `src/store/useAppStore.ts` oluşturulmalı.
  2. `user`, `userInfo` (profil detayları), `moonsCount` (bakiye) ve aktif sayfa yönlendirmesini yöneten `view` durumları bu store içine alınmalı.
  3. Alt bileşenler prop'lar yerine doğrudan bu store'u dinleyecek şekilde güncellenmeli.
  4. React 19 ile uyumluluğu test edilmeli.

#### Teknik Detaylar
- `src/store/useAppStore.ts` altında Zustand store tanımlanıp `App.tsx` içerisindeki ilgili alanlar refaktör edilmelidir.

* **Çözüm:** `src/store/useAppStore.ts` altında Zustand store'u oluşturuldu. Prop-drilling yöntemiyle aktarılan `user`, `userInfo`, `moonsCount` ve `view` global durumları bu store'a taşındı. Arayüz bileşenleri props yerine doğrudan bu store üzerinden durumları dinleyip güncelleyecek şekilde güncellendi.

---

---

### ✅ MS-112: Test Otomasyonu Altyapısının Kurulması (Test)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Test Altyapısı
* **Hedef Dosya:** [package.json](file:///Users/elifterzi/antigravity/MadameSoul/package.json)
* **Açıklama:**  
  Projeye ait kod tabanında unit (birim) veya entegrasyon testlerinin koşulabileceği herhangi bir otomasyon altyapısı bulunmamaktadır. Gelecekteki geliştirmelerde hata (regression) riskini azaltmak amacıyla hafif ve hızlı bir test kütüphanesi olan **Vitest** projeye dahil edilmelidir.
* **Kabul Kriterleri:**
  1. `vitest` ve ilgili test bağımlılıkları `devDependencies` altına eklenmeli.
  2. `vite.config.ts` dosyası testleri destekleyecek şekilde güncellenmeli.
  3. `package.json` dosyasına `test` script'i eklenmeli (`vitest run` veya `vitest watch`).
  4. Örnek/yardımcı bir fonksiyon (örneğin dil çevirileri veya tarih formatlama helper'ı) için en az 1 adet birim testi yazılıp çalıştırılmalı.

* **Çözüm:** Projeye test otomasyonu için Vitest ve E2E testleri için Playwright kuruldu. Örnek birim testleri `tests/unit/helpers.test.ts` altında ve E2E testleri `tests/e2e/app.spec.ts` altında yazıldı. Testler başarıyla doğrulandı.

---

---

### ✅ MS-111: `src/App.tsx` İçerisindeki Yazım Hatası (Code Quality)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kod Kalitesi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  `src/App.tsx` içerisinde kart çekme işlemini başlatan fonksiyonun adı `drawRancomCards` olarak yazılmıştır ("Random" kelimesinde "m" yerine "c" kullanılmıştır). Bu durum kodun okunabilirliğini azaltmakta ve standartlara uymamaktadır.
* **Kabul Kriterleri:**
  1. Fonksiyon ismi `drawRandomCards` olarak düzeltilmelidir.
  2. Bu fonksiyonun çağrıldığı tüm yerler (JSX butonu vb.) güncellenmelidir.

#### Teknik Detaylar
- `src/App.tsx` içerisinde `drawRancomCards` aratılarak `drawRandomCards` ile değiştirilmelidir.

* **Çözüm:** `src/App.tsx` dosyasında bulunan `drawRancomCards` fonksiyon ismi `drawRandomCards` olarak düzeltildi ve çağrıldığı tüm arayüz butonları/JSX alanları bu isimle güncellendi.

---

---

### ✅ MS-110: İstemci Tarafında Oluşturulan Promptların Sunucuda Doğrulanmaması (Security)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** API Güvenliği ve İstek Doğrulama
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Tarot yorumunu oluşturmak üzere hazırlanan prompt metni tamamen istemci tarafında (`src/App.tsx`) kurgulanıp `/api/generate` API'sine düz metin olarak gönderilmektedir. Saldırganlar API'ye doğrudan istek atarak sistemin tamamen farklı amaçlarla (örn. ödev yazdırma, kod yazdırma) Gemini modelini kullanmasını sağlayabilirler.
* **Kabul Kriterleri:**
  1. Sunucu sadece tarot kartı okumaları yapacak şekilde tasarlanmalı, serbest metin üretimine izin vermemelidir.
  2. İstek gövdesi (Request Body) düz metin prompt yerine seçilen kart listesi ve kullanıcı durumunu içeren yapısal veri (JSON) almalıdır. Prompt sunucu tarafında oluşturulmalıdır.

#### Teknik Detaylar
- `/api/generate` uç noktası girdi şeması güncellenmeli:
  ```json
  {
    "cards": ["card_id_1", "card_id_2", "card_id_3"],
    "userName": "Elif",
    "dob": "1995-01-01",
    "relationship": "single",
    "language": "tr"
  }
  ```
- `server.ts` içerisinde prompt şablonu backend tarafında oluşturularak Gemini SDK'sına aktarılmalıdır.

* **Çözüm:** Prompt oluşturma mantığı istemciden kaldırılıp sunucu tarafındaki `/api/generate` API uç noktasına taşındı. İstemci artık sunucuya yapılandırılmış JSON parametreleri (kartlar, dil, odak, kullanıcı adı vb.) göndermekte, sunucu bu parametreleri doğrulamakta ve prompt şablonunu backend üzerinde güvenli şekilde oluşturmaktadır.

---

---

### ✅ MS-109: `/api/generate` API Uç Noktasında Rate Limiting Eksikliği (Security)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend Güvenliği
* **Hedef Dosya:** [server.ts](file:///Users/elifterzi/antigravity/MadameSoul/server.ts)
* **Açıklama:**  
  Express sunucusundaki `/api/generate` API rotası doğrudan internete açıktır ve herhangi bir hız sınırlaması (rate limit) barındırmamaktadır. Kötü niyetli bir kullanıcı veya bot, bu uç noktayı spamlayarak Gemini API kullanım ücretlerini aşırı yükseltebilir (denial-of-wallet saldırısı).
* **Kabul Kriterleri:**
  1. `/api/generate` uç noktasına istemci/IP bazında makul bir istek sınırı (örn. IP başına saatte en fazla 15 istek) getirilmelidir.
  2. Sınır aşıldığında istemciye HTTP 429 (Too Many Requests) hatası dönmelidir.

* **Çözüm:** `server.ts` dosyasına `express-rate-limit` kütüphanesi entegre edildi. 1 saatlik pencerede aynı IP'den en fazla 15 istek kabul edecek şekilde rate limiter tanımlandı ve `/api/generate` POST rotasına middleware olarak eklendi. Rate limit aşıldığında istemciye HTTP 429 durum kodu ile hata mesajı dönmektedir.

---

---

### ✅ MS-108: Firestore Composite Index Olmaması Sebebiyle Geçmiş Okuma Sınırı (Bug)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil / Geçmiş Modülü
* **Hedef Dosya:** [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx)
* **Açıklama:**  
  `src/components/Profile.tsx` içinde kullanıcının tarot okuma geçmişi (`type == 'spend'`) çekilirken, Firestore'da composite index olmaması nedeniyle veritabanından son 50 işlem toplu çekilip filtreleme ve sıralama istemci tarafında in-memory yapılmaktadır.
Eğer bir kullanıcı 50'den fazla "buy" veya "bonus" işlemi yapmışsa, in-memory filtrelemede son 50 kayıt arasında hiç "spend" işlemi kalmayacağı için kullanıcının fal geçmişi boş görünecektir.
* **Kabul Kriterleri:**
  1. Tarihçe sorgusu veritabanı düzeyinde doğrudan filtrelenmeli ve sıralanmalıdır.
    2. İstemci tarafında in-memory filtreleme (`.filter` ve `.sort`) kaldırılmalıdır.

#### Teknik Detaylar
- Firestore'da `moon_transactions` koleksiyonu için `userId` (Ascending) + `type` (Ascending) + `createdAt` (Descending) alanlarını kapsayan bir composite index tanımlanmalıdır.
- `src/components/Profile.tsx` içindeki sorgu şu şekilde güncellenmelidir:
  ```typescript
  const q = query(
    collection(db, 'moon_transactions'),
    where('userId', '==', user.uid),
    where('type', '==', 'spend'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  ```

* **Çözüm:** `Profile.tsx` içindeki geçmiş fal sorgusu doğrudan Firestore seviyesinde `where('type', '==', 'spend')` ve `orderBy('createdAt', 'desc')` ile filtrelenip sıralanacak şekilde güncellendi. `firestore.indexes.json` ve `firebase.json` dosyalarına ilgili composite index tanımları eklenerek veritabanı düzeyinde optimizasyon sağlandı.

---

---

### ✅ MS-107: Günlük Ücretsiz Katina Moon Kredisi Tanımlama Mantığı (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Winston (📐 Architect / `bmad-agent-architect`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bakiye Yönetimi (Moon System)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Kullanıcıların her gün uygulamaya giriş yaptıklarında 1 adet ücretsiz tarot falı bakabilmeleri için günlük 1 "Katina Moon" kazanması gerekmektedir. Ancak şu anki kod tabanında sadece yeni kayıtta **5 Moon** hoş geldin bonusu verilmekte; günlük girişlerde bakiye sıfırlama veya ekleme mekanizması bulunmamaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcı uygulamaya giriş yaptığında en son ne zaman ücretsiz günlük bakiye aldığını kontrol etmelidir.
  2. Eğer son bakiye alma işlemi üzerinden en az 24 saat (veya takvim günü olarak yeni bir gün) geçmişse, kullanıcının bakiyesine otomatik olarak +1 Katina Moon eklenmelidir.
  3. Bu ekleme işlemi Firestore transaction yapısı ile güvenli ve atomik olarak yapılmalıdır.
  4. İşlem `moon_transactions` koleksiyonuna `type: 'bonus'` ve `description: 'Daily Gift'` (veya uygun dildeki karşılığı) olacak şekilde kaydedilmelidir.

* **Çözüm:** `App.tsx` dosyasında `claimDailyGift` fonksiyonu tanımlandı. Kullanıcı oturum açtığında Firestore'daki `user_moons` kaydı dinlenerek `lastDailyClaimedAt` alanı ile o anki zaman karşılaştırılır. Eğer 24 saatten fazla geçmişse `runTransaction` API'si ile atomik olarak kullanıcının `dailyFreeBalance` değeri 1'e set edilir, toplam `balance` güncellenir ve `moon_transactions` koleksiyonuna `type: 'bonus'` olacak şekilde günlük hediye işlem kaydı girilir.

---

---

### ✅ MS-106: Giriş/Kayıt Buton Mikro-Etkileşimlerinin Senkronizasyonu (Task)

* **Öncelik:** Düşük (Low)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Üye Giriş Ekranı (Authentication)
* **Hedef Dosya:** [Login.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Login.tsx)
* **Açıklama:**  
  E-posta giriş formundaki butonlarda bulunan hover/active durum animasyonları (scale, transition), telefon ve SMS butonlarında bulunmamaktadır. Butonların davranışları eşitlenmelidir.
* **Kabul Kriterleri:**
  1. SMS Gönder, Kodu Doğrula ve Telefon ile Devam Et butonlarının sınıfları e-posta butonundaki gibi animasyonlu hale getirilmeli.
  2. Butonların tüm tarayıcılarda aynı hover/active ve yazı boyutu tepkilerini verdiği doğrulanmalı.

* **Çözüm:** `Login.tsx` dosyasındaki sosyal giriş butonlarına, SMS gönderme ve doğrulama butonlarına `active:scale-[0.98]` ve `hover:bg-[#fff]` geçiş sınıfları eklenerek e-posta butonu ile davranışları eşitlendi.

---

---

### ✅ MS-104: Tarayıcı `alert()` Yapısının Özel Modal/Toast ile Değiştirilmesi (Task)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Bildirim ve Geri Bildirim Sistemi
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx#L831)
* **Açıklama:**  
  Kullanıcı mağazadan moon paketi satın almak istediğinde tarayıcının yerel `alert()` kutusu çalışmaktadır. Bu durum uygulamanın premium hissiyatını ve tematik havasını bozmaktadır.
* **Kabul Kriterleri:**
  1. Projeye mistik temaya uygun (mor/altın tonlarında, animasyonlu) bir `Toast` veya `Modal` bildirimi eklenmeli.
  2. Mağaza ödeme bildirimleri ve yetersiz bakiye uyarıları bu yeni bileşen üzerinden gösterilmeli.

* **Çözüm:** `App.tsx` dosyasında mor/altın temalı `toast` ve `showToast` yapısı kuruldu, bakiye yetersiz ve ödeme bekletme bildirimlerindeki tarayıcı `alert()` çağrıları bu toast sistemiyle değiştirildi.

---

---

### ✅ MS-103: İnteraktif Kart Seçim Ritüelinin Geliştirilmesi (Feature)

* **Öncelik:** Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Kullanıcı Deneyimi (UX / UI)
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx)
* **Açıklama:**  
  Tarot falı bakma sürecinin en büyüleyici aşaması, kullanıcının kendi kartlarını seçtiği andır. Şu anki yapıda kullanıcı formu doldurduktan sonra sistem doğrudan 3 kart çekip sonuç ekranına geçmektedir. Bu durum ritüel hissini baltalamakta ve sıradan bir form doldurma hissi yaratmaktadır. Kullanıcının önüne ters çevrilmiş tarot kartı destesi (card deck/board) serilmeli, kullanıcı kartların üzerinde gezinirken mistik hover animasyonları görmeli ve tıklayarak sırasıyla 3 kart seçmelidir (Geçmiş, Şimdiki Zaman, Gelecek). Kartlar seçildikten sonra animasyonlu bir geçişle yorumlama aşamasına geçilmelidir.
* **Kabul Kriterleri:**
  1. Form gönderildikten sonra `step === 'DRAWING'` aşamasına geçildiğinde kullanıcıya 3 kart seçmesini söyleyen mistik bir arayüz gösterilmelidir.
  2. Ters çevrilmiş kartlardan oluşan ve mistik temaya (mor/altın tonları) uygun arkalıklara sahip interaktif bir deste (kart tahtası) sunulmalıdır.
  3. Kartların üzerine gelindiğinde (hover) yumuşak bir yükselme, parlama (glow) ve hafif eğilme (tilt/scale) mikro-etkileşimleri olmalıdır.
  4. Kullanıcı kartlara tıkladığında kart seçilmeli, kaçıncı kart olduğu (Geçmiş/Şimdi/Gelecek) görsel olarak belirtilmeli ve 3 kart tamamlanana kadar seçim devam etmelidir.
  5. 3 kart seçildiğinde otomatik olarak veya "Açılımı Başlat" butonuyla yorum yükleme aşamasına (Gemini API isteğine) geçilmeli ve kartlar animasyonla ters yüz (flip animation) edilerek gösterilmelidir.
---

---

### ✅ MS-102: Okuma Paragrafları ve Uzun Metinler İçin Okunabilir Tipografi Hiyerarşisi (Task)

* **Öncelik:** Orta (Medium)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Genel Stil Sistemi (Theme)
* **Hedef Dosya:** [index.css](file:///Users/elifterzi/antigravity/MadameSoul/src/index.css)
* **Açıklama:**  
  Mevcut `src/index.css` dosyasında `--font-sans` değişkeni serif karakterli `"Playfair Display"` yazı tipine atanmıştır. Bu sebeple tüm metin blokları (Gemini tarafından üretilen uzun fal yorumları dahil) serif yazı tipiyle gösterilmektedir. Uzun paragrafların serif fontuyla ve sıkışık satır aralıklarıyla okunması mobilde ve webde göz yorgunluğuna sebep olmaktadır.
* **Kabul Kriterleri:**
  1. Uzun okuma paragrafları, veri tabloları ve form girişleri için temiz, okunabilirliği yüksek bir sans-serif yazı tipi (örn. `Inter` veya `Roboto`) sisteme dahil edilmelidir.
  2. Başlıklar (`h1`, `h2`, `h3`) ve dekoratif mistik vurgular için serif karakterli `"Cinzel"` veya `"Playfair Display"` kullanılmaya devam edilmelidir.
  3. CSS hiyerarşisi düzenlenmeli; gövde metinleri (`p` etiketleri) için harf ve satır yüksekliği (line-height: 1.8 veya 2.0) optimize edilmelidir.

#### Teknik Detaylar
- `index.css` içindeki `--font-sans` tanımı standart bir sans-serif yazı tipine (örn. `Inter, sans-serif`) dönüştürülmeli, `Playfair Display` ise `--font-serif` veya özel bir başlık fontu değişkeni olarak tanımlanmalıdır.

* **Çözüm:** `index.css` dosyasında Google Fonts `Inter` yazı tipi içe aktarıldı, `--font-sans` değişkeni `Inter` olarak değiştirildi ve `--font-playfair` eklendi. Gövde metinleri ve inputlar için varsayılan font `Inter` yapılırken satır yüksekliği `1.8` olarak optimize edildi.

---

---

### ✅ MS-101: Profil Bilgisi Durum Senkronizasyon Hatası (Bug)

* **Öncelik:** En Yüksek (High)
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Sally (🎨 UX Designer / `bmad-agent-ux-designer`)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Profil ve Fal Gönderme Flow'u
* **Hedef Dosya:** [App.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/App.tsx#L903-L910)
* **Açıklama:**  
  Kullanıcı profil ayarlarını güncellediğinde, [Profile.tsx](file:///Users/elifterzi/antigravity/MadameSoul/src/components/Profile.tsx) Firestore veritabanını başarıyla günceller ve `onUpdateUserInfo` callback'ini tetikler. Ancak `App.tsx` içindeki handler, gelen veriden sadece `name` ve `dob` alanlarını günceller. `birthplace` ve `relationship` alanları local state'e yansıtılmaz. Bu durum, kullanıcının aynı oturumda yeni bir fal baktırırken eski bilgilerle yapay zekaya istek göndermesine neden olur.
* **Kabul Kriterleri:**
  1. `App.tsx` dosyasındaki `onUpdateUserInfo` handler'ı güncellenmeli ve `birthplace` ile `relationship` değerlerini de local state'e kopyalamalı.
    2. Profil kaydedildikten sonra yeni açılan fal formunda güncel doğum yeri ve ilişki durumunun otomatik geldiği doğrulanmalı.

* **Çözüm:** `App.tsx` içindeki `onUpdateUserInfo` handler'ı güncellendi ve `birthplace` ile `relationship` değerlerinin de local state'e senkronize edilmesi sağlandı.

---

---

### ✅ MS-292: Son 1 Katina Moon Kaldığında Fal Yorumu Gelmeme Hatası (Bug / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Client App / Backend / Payments
* **Açıklama:**  
  Kullanıcının bakiyesi tam olarak 1 Moon iken, istemci tarafında bakiye düşüm işlemi yapılıp veritabanı güncellendikten sonra sunucuya `/api/generate` isteği atıldığında; sunucunun kullanıcının güncel bakiyesini veritabanından çekip kontrol etmesi sonucunda bakiye 0 göründüğü için "Not enough Katina Moons! Please purchase more." hatası alınmakta ve fal yorumu müşteriye ulaşmamaktadır.
* **Kabul Kriterleri:**
  1. Kullanıcının bakiyesi tam 1 iken fal yorumunun sorunsuz oluşturulması ve sunucudan hata dönülmemesi sağlanmalıdır.
  2. Bakiye kontrol mantığı istemci-sunucu senkronizasyonunu bozmayacak şekilde düzeltilmelidir.
  3. Hata durumunda kullanıcıya bilgilendirici hata mesajı gösterilmelidir.

* **Çözüm:**  
  1. Sunucu tarafındaki (`server.ts`) bakiye kontrolü, kullanıcının işlem sonrasındaki bakiyesinin `0` veya daha büyük olmasını (negatif olmamasını) doğrulamak için `balance < 0` olarak güncellendi. Böylece tam 1 Moon'u olup istemci tarafından 0'a düşürülen kullanıcılar engellenmemiş oldu.
  2. İstemci tarafında (`App.tsx`) "Falına Başla" butonuna tıklandığında, kullanıcının bakiyesi `0` ise form doldurma adımına geçiş engellenerek doğrudan Toast hatası verildi ve altın renkli uyarı kutusu içeren Mağaza ekranı (`StoreModal.tsx`) açıldı.

---

---

### ✅ MS-291: Admin Paneli Genel Bakış (Overview) Göstergelerinin Filtrelenmesi ve AI Geri Bildirimlerinde E-posta Çözümlemesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Admin Panel / OverviewTab
* **Açıklama:**  
  Admin panelindeki genel bakış göstergelerinin günlük, haftalık, aylık ve tümü seçenekleriyle filtrelenebilmesi; Moon işlemleri göstergesinin harcanan başarılı moonları sayması ve AI geri bildirimlerinde kullanıcıların mail adreslerinin listelenmesi sağlanmıştır.
* **Çözüm:**  
  * `OverviewTab.tsx` üzerinde istemci tarafında veri filtreleme kurgusu yapıldı.
  * Harcanan moon hesabı `type === 'spend' && status === 'success'` olacak şekilde güncellendi.
  * `users` koleksiyonu önceden yüklenerek feedback listesinde `userId` e-posta adresine çözümlendi ve kapsül içinde gösterildi.

---

---

### ✅ MS-289: Firebase Admin Kimlik Bilgilerinin Local Dosyadan Yüklenmesi ve ES Modül __dirname Çakışmasının Giderilmesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Completed)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer Agent / `bmad-agent-dev`)
* **Bileşen:** Backend / Credentials
* **Açıklama:**  
  Yerel geliştirme ortamında Firebase Admin SDK'sının çalışabilmesi için `service-account.json` dosyasından kimlik bilgilerinin yüklenmesi desteği eklenmiş ve ES Modülleri ile çalışırken Node.js `__dirname` değişkeninin tanımsız olması hatası giderilmiştir.
* **Çözüm:**  
  * `server.ts` içinde `fileURLToPath` ve `path.resolve` kullanılarak `service-account.json` yolu güvenli şekilde çözümlendi.
  * Kimlik bilgisi dosyası projede yer almadığında local bypass moduna otomatik geçiş sağlandı.

---

---

### 📋 MS-293: Mağaza Paketlerinin Yeniden Yapılandırılması ve Birim İndirimlerin Gösterilmesi (Feature / UX / UI)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Client App / StoreModal
* **Açıklama:**  
  Stripe ödeme paketlerinde yer alan "+X Ücretsiz Moon" hediye metinlerinin kaldırılması, bunun yerine birim fiyat bazındaki tasarruf yüzdelerinin (%10 Tasarruf, %20 Tasarruf) rozetler halinde şık bir şekilde sunulması ve paket isimlerinin mistik temaya göre (Sezgi Tohumu, Dolunay Ritüeli, Göksel Aydınlanma) güncellenmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. Hediye Moon ibareleri tüm dillerde arayüzden kaldırılmalıdır.
  2. Paket isimleri YAML yerelleştirme dosyalarına taşınarak çoklu dil desteği sağlanmalıdır.
  3. 10 Moon paketinde "%10 Tasarruf", 25 Moon paketinde "%20 Tasarruf" rozetleri şık bir şekilde gösterilmelidir.

---

---

### 📋 MS-294: Premium ve Günlük Açılımların Ayrıştırılması ve PDF İndirme Kısıtlaması (Feature / UX / UI)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Client App / Profile / Readings History
* **Açıklama:**  
  Ücretli satın alınan Moon'lar ile bakılan fallar (Premium Açılımlar) ile günlük ücretsiz hakla bakılan falların (Günlük Açılımlar) profil geçmişinde ayırt edilebilmesi; PDF indirme ve kaydetme özelliğinin yalnızca Premium Açılımlar için geçerli olması, günlük ücretsiz açılımlarda PDF butonunun kilitli/pasif gösterilmesi sağlanmalıdır.
* **Kabul Kriterleri:**
  1. Profil geçmişinde (`deductedFrom === 'purchased'`) olan falların yanında altın parıltılı bir premium simgesi gösterilmelidir.
  2. Yalnızca premium fallar için PDF indirmeye izin verilmeli; günlük ücretsiz fallarda buton tıklandığında bilgilendirici bir uyarı (Satın alıma teşvik eden) gösterilmeli veya buton pasif hale getirilmelidir.
  3. Değişiklikler veritabanındaki `deductedFrom` alanına göre dinamik olarak yönetilmelidir.

---

---

### 📋 MS-295: Mağaza Ekranında Premium Avantajların Gösterilmesi ve Günlük Fallarda Günlük Kilidi (Feature / UX / UI)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Sally (🎨 UX Designer) / Amelia (💻 Developer)
* **Bileşen:** Client App / StoreModal / Profile / Readings History
* **Açıklama:**  
  Kullanıcıların Katina Moon satın aldıklarında elde edecekleri premium avantajları doğrudan Mağaza ekranında (StoreModal) görsel olarak listelemek ve günlük ücretsiz hakla bakılan fallarda Özel Başlık ile Yansıma Notları girilmesini engelleyen kilit kartı eklenmesi gerekmektedir.
* **Kabul Kriterleri:**
  1. Mağaza modalında listelenen paketlerin altına premium moon satın alma avantajları (Sınırsız PDF indirme, günlük yansıma notları vb.) altın renkli parıltı simgesiyle listelenmelidir.
  2. Profil kehanet geçmişinde, günlük ücretsiz fallarda Özel Başlık ve Yansıma Notu giriş alanlarının yerine, bu özelliğin premium avantaj olduğunu açıklayan ve mağazadan satın almaya teşvik eden şık bir glassmorphic kilit kartı gösterilmelidir.
  3. Tüm metinler 6 dile (`en`, `tr`, `es`, `fr`, `zh`, `ko`) yerelleştirilmelidir.

---

---

### 📋 MS-296: Admin Paneli AI Telemetri Koleksiyonunun Eklenmesi ve Yetkilendirme Düzeltmesi (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / Firestore / Security Rules
* **Açıklama:**  
  Admin panelinde veritabanı koleksiyonları altında AI Telemetri (`ai_telemetry`) koleksiyonunun listelenmesi, completionTokens+promptTokens toplamını gösteren bir sütunun eklenmesi ve admin/employee rollerinin tüm telemetri kayıtlarını okuyabilmesi için Firestore güvenlik kurallarının (rules) güncellenerek yetki hatasının giderilmesi.
* **Kabul Kriterleri:**
  1. Admin Panelindeki "Veritabanı Koleksiyonları" sekmesinde `ai_telemetry` seçeneği bulunmalı ve listelenebilmelidir.
  2. Listede `completionTokens+promptTokens` toplamını gösteren bir sütun hesaplanıp sunulmalıdır.
  3. Admin ve Employee rolleri tüm telemetri kayıtlarını görebilmeli, standard kullanıcılar ise sadece kendi kayıtlarına erişebilmelidir.
  4. Değişiklikler başarılı bir şekilde derlenmeli ve deploy edilmelidir.

---

---

### 📋 MS-297: Admin Paneli AI Telemetri İyileştirmeleri (Feature / UX / UI / Dev)

* **Öncelik:** Orta
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / CollectionsTab / UX
* **Açıklama:**  
  AI Telemetri listeleme arayüzünün daha kullanışlı olması amacıyla; kullanıcı e-postası bulunmadığında telefon numarası fallback desteğinin eklenmesi, sayfa üstüne ortalama token gösterge kartlarının yerleştirilmesi, toplam token sütununun `TOTALTOKENS` olarak adlandırılması ve `CREATEDAT` sütununun `MAIL` sütundan hemen sonraya konumlandırılması.
* **Kabul Kriterleri:**
  1. E-posta adresi olmayan kullanıcılarda telemetri tablosunun `MAIL` sütununda telefon numarası gösterilmelidir.
  2. Tablonun üzerinde Ortalama Prompt, Ortalama Completion ve Ortalama Total Token değerlerini dinamik gösteren kartlar yer almalıdır.
  3. `TOTALTOKENS` adında birleştirilmiş token sütunu olmalı ve sıralama düzgün çalışmalıdır.
  4. `CREATEDAT` sütunu `MAIL` sütununun sağında yer almalıdır.

---

---

### 📋 MS-298: Stripe Webhook Gecikmeleri İçin İstemci Tarafı Doğrulama ve Fallback Altyapısı (Feature / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Client App / Backend / Stripe / Checkout
* **Açıklama:**  
  Canlı ortamda (production) veya test ortamlarında Stripe webhook'larının yavaş çalışması, kaybolması ya da gecikmesi durumunda; kullanıcının başarılı ödeme ekranına yönlendiğinde moons yüklenmeme sorunuyla karşılaşmaması için istemci tarafına güvenli doğrulama fallback'i eklenmiştir.
* **Kabul Kriterleri:**
  1. İstemci, Stripe'tan başarıyla döndüğünde (`payment=success` ve `session_id` mevcut olduğunda) backend üzerindeki `/api/verify-checkout-session` endpoint'ini tetiklemelidir.
  2. Backend, checkout deneme kaydı durumunu kontrol etmeli; eğer webhook tarafından henüz tamamlanmadıysa, Stripe API'den oturum durumunu sorgulayıp (`paid`) işlemi güvenli bir şekilde tamamlamalı ve moons yükleme işlemini tetiklemelidir.
  3. Webhook sonradan gelse dahi mükerrer yükleme olmaması için işlem idempotency (completed durumu kontrolü) korunmalıdır.
  4. Değişiklikler başarılı bir şekilde derlenmeli ve deploy edilmelidir.

---

---

### 📋 MS-299: Admin Paneli Stripe Ekranı Bekleyen İşlemler ve Manuel Onaylama Butonu (Feature / UX / UI / Dev)

* **Öncelik:** Yüksek
* **Durum:** ✅ Tamamlandı (Done)
* **Oluşturan (Reporter):** Elif (USER)
* **Atanan (Assignee):** Amelia (💻 Developer)
* **Bileşen:** Admin Panel / FinanceTab / Backend / Admin API
* **Açıklama:**  
  Admin panelinde yer alan "Stripe Finans & Satış" ekranının iyileştirilmesi; beklemede (`pending`) kalmış olan ödeme denemelerinin listelenmesi, bu ödemeleri inceleyerek doğrudan admin panelinden onaylayıp kullanıcının hesabına Moon yüklemesini gerçekleştiren "Manuel Onayla" butonunun eklenmesi.
* **Kabul Kriterleri:**
  1. Stripe Finans ekranında "Bekleyen Ödeme Talepleri (Pending)" adında ayrı bir tablo yer almalıdır.
  2. Tabloda beklemedeki her işlemin yanında "Manuel Onayla" butonu yer almalıdır.
  3. Butona tıklandığında, arka planda güvenli admin endpoint'i tetiklenmeli, ödeme başarılı sayılmalı, moons bakiyesi yüklenmeli ve `admin_audit_logs` tablosuna işlem loglanmalıdır.
  4. Değişiklikler başarılı bir şekilde derlenmeli ve deploy edilmelidir.

---

---
