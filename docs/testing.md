# Test Rehberi (Testing Guide)

Bu belgede, MadameSoul uygulamasında kurulan test altyapısı, mevcut testler, bu testlerin nasıl çalıştırılacağı ve sonuçlarının nasıl izleneceği açıklanmıştır.

Uygulamada iki tür test altyapısı bulunmaktadır:
1. **Birim Testleri (Unit Tests)**: Fonksiyonel bazda mantıksal doğrulamalar yapar (Vitest).
2. **Uçtan Uca Testler (E2E Tests)**: Gerçek tarayıcı üzerinde kullanıcı senaryolarını test eder (Playwright).


---

## 1. Birim Testleri (Unit Tests - Vitest)

Birim testleri, uygulamanın arayüzünden bağımsız olarak çalışan küçük yardımcı fonksiyonların (helpers, formatters, state logic vb.) ve yetkilendirme kurallarının doğru çalışıp çalışmadığını denetler.

* **Kullanılan Kütüphane:** [Vitest](https://vitest.dev/)
* **Test Klasörü:** [tests/unit/](file:///Users/elifterzi/antigravity/MadameSoul/tests/unit/)
* **Mevcut Testler:**
  - [helpers.test.ts](file:///Users/elifterzi/antigravity/MadameSoul/tests/unit/helpers.test.ts): Tarih formatlama (`formatDate`) ve doğum tarihi doğrulama (`isValidDob`) mantığını test eder.
  - [rbac.test.ts](file:///Users/elifterzi/antigravity/MadameSoul/tests/unit/rbac.test.ts): Rol tabanlı erişim kontrolünü (Role-Based Access Control) test eder; çalışan (employee), yönetici (admin) ve standart kullanıcı yetkilerinin API katmanındaki davranışını doğrular.

### Komutlar ve Çalıştırma

Terminalde projenin kök dizinindeyken aşağıdaki komutları kullanabilirsiniz:

```bash
# Tüm birim testlerini tek seferlik çalıştırır ve raporlar:
npm test

# Testleri "watch" (izleme) modunda çalıştırır (kod değiştikçe testler otomatik tekrarlanır):
npm run test:watch
```

### Sonuçları İzleme
Komutu çalıştırdıktan sonra terminalde hangi testlerin geçtiğini veya kaldığını görebilirsiniz:
* **Yeşil Check (`✓`)**: Test başarıyla geçti.
* **Kırmızı Çarpı (`×`)**: Test başarısız oldu. Altında hangi satırda ne hata alındığı (beklenen vs. gelen değer) detaylıca yazar.

---

## 2. Uçtan Uca Testler (E2E Tests - Playwright)

Uçtan uca testler, uygulamayı gerçek bir tarayıcıda (Chromium) açarak butonlara tıklar, formları doldurur ve kullanıcı akışlarının uçtan uca hatasız çalıştığını doğrular.

* **Kullanılan Kütüphane:** [Playwright](https://playwright.dev/)
* **Test Klasörü:** [tests/e2e/](file:///Users/elifterzi/antigravity/MadameSoul/tests/e2e/)
* **Mevcut Testler:**
  - [app.spec.ts](file:///Users/elifterzi/antigravity/MadameSoul/tests/e2e/app.spec.ts): 
    - **Onboarding ve Giriş Akışı:** Kullanıcının onboarding ekranındaki slaytları tek tek geçip giriş ekranına ulaşabildiğini test eder.
    - **Onboarding Atlatma:** Kullanıcının onboarding'i "Atla" butonuyla geçip doğrudan giriş formunu görebildiğini doğrular.

### Komutlar ve Çalıştırma

Playwright testlerini çalıştırmak için Express sunucusunun açık olması gerekir. Ancak Playwright yapılandırmamız (`playwright.config.ts`), test başlamadan önce yerel sunucuyu otomatik olarak ayağa kaldıracak şekilde ayarlanmıştır.

```bash
# Uçtan uca testleri arka planda (headless) çalıştırır:
npm run test:e2e

# Testleri görsel arayüz (UI Mode) ile çalıştırarak adımları izlemek için:
npx playwright test --ui
```

### Sonuçları İzleme ve Raporlama

Playwright testleri bittiğinde sonuçları terminalde listeler. Ancak daha detaylı, ekran görüntülü ve interaktif bir rapor incelemek isterseniz şu adımları takip edebilirsiniz:

1. Testlerin ardından Playwright otomatik bir HTML raporu üretir. Bu raporu açmak için:
   ```bash
   npx playwright show-report
   ```
2. Bu komut tarayıcınızda bir sayfa açarak her bir test adımının ne kadar sürdüğünü, nerede hata verdiğini ve hata anındaki ekran görüntüsünü (screenshot) gösterir.

---

## 3. Özet Komut Tablosu

| Hangi Test? | Hangi Araç? | Komut | Kullanım Amacı |
| :--- | :--- | :--- | :--- |
| **Birim Testi** | Vitest | `npm test` | Tek seferlik mantık testi |
| **Birim Testi (İzleme)** | Vitest | `npm run test:watch` | Geliştirme yaparken anlık test |
| **E2E Testi** | Playwright | `npm run test:e2e` | Tarayıcıda kullanıcı senaryoları testi |
| **E2E Testi (Görsel)** | Playwright | `npx playwright test --ui` | Görsel arayüzle adım adım debug yapma |
| **E2E Raporu** | Playwright | `npx playwright show-report` | Son E2E testinin detaylı HTML raporunu görme |
