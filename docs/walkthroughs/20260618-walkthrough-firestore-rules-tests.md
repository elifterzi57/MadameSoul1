# Walkthrough: Firestore Güvenlik Kuralları Birim Testleri

Firestore güvenlik kurallarını emülatör üzerinde otomatik olarak test etmek için gerekli birim test altyapısı ve örnek test senaryoları sisteme entegre edildi.

## Yapılan Değişiklikler

1. **Bağımlılıkların Yüklenmesi (`package.json`):**
   - `@firebase/rules-unit-testing` ve `firebase-tools` paketleri projeye geliştirme bağımlılığı (`devDependencies`) olarak eklendi.
2. **Test Scripti Ekleme (`package.json`):**
   - Projenin scripts kısmına, Firestore emülatörünü başlatıp vitest testini tetikleyen `test:rules` komutu eklendi:
     ```json
     "test:rules": "npx firebase emulators:exec --only firestore \"npx vitest run tests/unit/firestore-rules.test.ts --pool=forks\""
     ```
3. **Birim Test Dosyası Oluşturulması (`tests/unit/firestore-rules.test.ts`):**
   - `firestore.rules` dosyasını okuyan ve aşağıdaki alanları test eden kapsamlı bir test paketi yazıldı:
     - **Kullanıcı Bilgileri (`/users`):** Yetkisiz erişimlerin engellenmesi, sahibinin kendi dokümanına yazabilmesi, employee/admin rollerinin okuma yetkileri.
     - **Bakiye Güvenliği (`/user_moons`):** Sahibinin bakiyesini doğrudan yetkisiz/keyfi artırmasının engellenmesi (`updateDoc` reddi) ve admin/employee rollerinin yetkileri.
     - **Log Bütünlüğü (`/error_logs`, `/admin_audit_logs`):** Logların harici kullanıcılar tarafından güncellenmesi veya silinmesinin engellenmesi (salt eklenebilir / append-only).

## Nasıl Çalıştırılır?

Bu testleri lokal ortamınızda çalıştırmak için sisteminizde **Java Runtime Environment (JRE)** kurulu olmalıdır. Ardından şu komutu çalıştırabilirsiniz:

```bash
npm run test:rules
```
