# Walkthrough - Admin Panel List Missing Mail and Name Fix

## Değişiklik Özeti
Admin panelindeki veritabanı koleksiyon listelerinde (özellikle `user_moons`, `moon_transactions`, vb.) `mail` ve `name` alanlarının `-` şeklinde görünmesine neden olan hata giderildi.

### Yapılan Değişiklikler
1. **[firestore.rules](file:///Users/elifterzi/antigravity/MadameSoul/firestore.rules)**:
   * `/phones/{phoneNumber}` kuralı güncellenerek çalışanların (`isEmployee()`) telefon koleksiyonunu okuyabilmesine izin verildi. Önceden sadece telefon sahibinin kendi verisini okumasına izin verildiği için çalışan/admin kullanıcılarda bu sorgu yetki hatası alıyordu.
2. **[admin/src/components/CollectionsTab.tsx](file:///Users/elifterzi/antigravity/MadameSoul/admin/src/components/CollectionsTab.tsx)**:
   * `fetchUsersMap` fonksiyonundaki `Promise.all` yapısı ayrıştırıldı. Artık `users` ve `phones` koleksiyonları bağımsız try-catch bloklarında çekiliyor. Herhangi bir kısıtlama veya hata durumunda telefon numarası verisi çekilemese dahi kullanıcı eşleştirmesi (`usersMap`) bozulmadan oluşturulmaya devam ediyor.

## Doğrulama ve Testler
* Admin paneli `npm run build` komutuyla hatasız derlendi.
