# Walkthrough: Express Log Buffer (Toplu Yazma) Mimarisi

Firestore write (yazma) maliyetlerini ve veritabanı üzerindeki anlık yazma baskısını azaltmak amacıyla, hem sunucu hem de istemci taraflı hatalar için bellek içi bir tamponlama (`LogBuffer`) ve toplu yazma mimarisi kuruldu.

## Yapılan Değişiklikler

1. **`LogBuffer` Sınıfı Eklendi (`server.ts`):**
   - Sunucu tarafında bellek içi bir log kuyruğu yöneten sınıf eklendi.
   - Kuyruk dolduğunda (10 log) veya zaman aşımında (5 saniye) biriken tüm logları Firestore `writeBatch` kullanarak toplu olarak diske yazan mekanizma kuruldu.
   - Uygulama kapanırken (`exit`, `SIGINT`, `SIGTERM` sinyallerinde) tamponda kalan logların kaybolmaması için otomatik flush tetikleyicileri bağlandı.
2. **`logServerError` Güncellendi (`server.ts`):**
   - Sunucu hataları artık doğrudan Firestore'a yazılmak yerine `logBuffer.push` ile tampona gönderiliyor.
3. **`POST /api/logs` Endpoint'i Eklendi (`server.ts`):**
   - İstemci tarafından gönderilecek logları kabul eden ve tampona ekleyen public bir API endpoint'i tanımlandı.
4. **İstemci Logları Güncellendi (`App.tsx` & `ErrorBoundary.tsx`):**
   - Frontend üzerinde doğrudan Firestore SDK'sı (`addDoc`) kullanılarak yapılan yazma işlemleri kaldırıldı.
   - Hatalar artık `/api/logs` endpoint'ine `POST` isteği atılarak sunucuya ulaştırılıyor ve sunucudaki `LogBuffer` tarafından toplu olarak veritabanına kaydediliyor.

## Doğrulama ve Test Sonucu

- Proje kodları TypeScript derleyicisi (`npm run lint` / `tsc`) tarafından sorunsuz bir şekilde derlendi.
- Yapılan mimari değişiklikler sayesinde client taraflı hataların Firestore okuma/yazma faturasına yansıması ve eşzamanlı işlem yükü en aza indirgenmiş oldu.
