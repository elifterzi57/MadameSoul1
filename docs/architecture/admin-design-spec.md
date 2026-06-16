# MadameSoul Admin Tasarım Spesifikasyonu & Stil Kılavuzu

Bu doküman, MadameSoul Admin uygulamasının görsel dilini, renk paletini, tipografisini ve temel arayüz bileşenlerini tanımlar. Amaç, ana uygulamanın premium, mistik ve gizemli atmosferini korurken; şirket içi operasyonlarda maksimum okunabilirlik, hız ve hatasız kullanım sağlamaktır.

---

## 1. Tasarım Felsefesi
Admin paneli tasarımı iki ana sütun üzerine inşa edilmiştir:
- **Mistik Estetik (Branding):** MadameSoul'un imzası olan mor, gece siyahı ve kozmik altın tonları. Cam efekti (glassmorphism) ile derinlik hissi.
- **Fonksiyonel Netlik (Operational Efficiency):** Yoğun veri tablolarında yüksek kontrast, net sınır çizgileri, sezgisel form elemanları ve gözü yormayan karanlık tema düzeni.

---

## 2. Renk Paleti (Color Palette)

### 2.1. Temel Renkler (Brand Colors)
| Renk Adı | Değer (Hex/RGB) | Kullanım Alanı |
| :--- | :--- | :--- |
| **Obsidyen Siyahı (Base BG)** | `#05000a` | Tüm uygulamanın ana arka planı. |
| **Kozmik Gece (Card/Container)** | `#0a0512` | Kartlar, tablolar ve form panellerinin arka planı. |
| **Derin Mor (Highlight/Glow)** | `#1e1332` | Aktif menü öğeleri, hover durumları ve mistik degrade dolguları. |
| **Kozmik Altın (Accent Gold)** | `#ecd8a6` | Birincil butonlar, aktif sekmeler, vurgulanan metinler ve önemli ikonlar. |

### 2.2. Semantik Renkler (Status Colors)
Admin panelinde hata, başarı ve uyarı durumlarının hızla taranabilmesi için semantik renkler özel bir parlama (glow) efektiyle zenginleştirilmiştir:
- **Başarı (Success):** Zümrüt Yeşili (`#10b981`) -> Arka plan: `rgba(16, 185, 129, 0.1)`, Sınır: `rgba(16, 185, 129, 0.3)`
- **Hata/Kritik (Error/Alert):** Lal Kırmızısı (`#ef4444`) -> Arka plan: `rgba(239, 68, 68, 0.1)`, Sınır: `rgba(239, 68, 68, 0.3)`
- **Uyarı (Warning):** Kehribar Sarısı (`#f59e0b`) -> Arka plan: `rgba(245, 158, 11, 0.1)`, Sınır: `rgba(245, 158, 11, 0.3)`
- **Bilgi (Info/System):** Kozmik Mavi (`#6366f1`) -> Arka plan: `rgba(99, 102, 241, 0.1)`, Sınır: `rgba(99, 102, 241, 0.3)`

---

## 3. Glassmorphism ve Derinlik Efektleri
Tüm kartlarda ve modallarda MadameSoul'un mistik havasını yansıtmak için şu CSS sınıfları/stilleri temel alınacaktır:
- **Backdrop Blur:** `backdrop-blur-md` (veya `backdrop-blur-xl`)
- **Container Sınırları:** Altın renginin düşük opaklıklı versiyonu: `border border-[#ecd8a6]/20`
- **Gölgeler (Box Shadow):** Altın rengi hafif bir parıltı efekti:
  `shadow-[0_0_30px_rgba(236,216,166,0.05)]`

---

## 4. Tipografi (Typography)

Ana uygulamada olduğu gibi admin panelinde de hiyerarşik bir font eşleşmesi uygulanır:
- **H1, H2, H3 (Başlıklar):** `"Cinzel", serif`. Sadece ana sayfa başlıklarında, modül isimlerinde ve büyük metrik kartlarının başlıklarında marka algısını korumak için kullanılır. Harf aralığı (`letter-spacing: 0.05em`) açık olmalıdır.
- **Gövde Metni, Tablolar, Formlar:** `"Inter", sans-serif`. Okunabilirliği en üst düzeye çıkarmak için tüm veri içeren tablolarda, loglarda ve form alanlarında bu yazı tipi zorunludur.

---

## 5. İkon Seti (Icons)
Ana uygulamada kullanılan **Lucide React** kütüphanesi admin panelinde de standarttır. İkonlar her zaman `text-[#ecd8a6]/70` renginde olmalı, hover durumunda parlak altın rengine (`text-[#ecd8a6]`) dönmelidir.

- **Dashboard:** `LayoutDashboard`
- **Kullanıcılar:** `Users`
- **İşlemler/Bakiyeler:** `Coins` veya `CreditCard`
- **Hata Logları:** `AlertOctagon` veya `Terminal`
- **Ayarlar:** `Settings`
- **Çıkış:** `LogOut`
- **Yükleniyor:** `Loader2` (spin efekti ile)

---

## 6. Bileşen Tasarımları (Components)

### 6.1. Sekmeler (Tabs)
Sekmelerde aktif durum, altına gelen ince bir altın çizgi ve yazı renginin parlak altına dönmesiyle gösterilir.
```tsx
// Aktif Sekme
<button className="px-4 py-2 border-b-2 border-[#ecd8a6] text-[#ecd8a6] font-serif text-sm tracking-wider">
  Aktif Sekme
</button>

// Pasif Sekme
<button className="px-4 py-2 text-[#ecd8a6]/50 hover:text-[#ecd8a6]/80 font-serif text-sm tracking-wider transition-colors">
  Pasif Sekme
</button>
```

### 6.2. Butonlar (Buttons)
- **Birincil Buton (Primary):** Dolgulu altın buton. Üzerindeki yazı koyu mor/siyah tonunda olmalıdır.
  ```html
  class="bg-[#ecd8a6] hover:bg-white text-[#0a0512] font-serif uppercase tracking-widest text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
  ```
- **İkincil Buton (Secondary - Glass):** Transparan, ince altın sınırlı buton.
  ```html
  class="bg-[#120a1c]/80 hover:bg-white/5 text-[#ecd8a6]/70 hover:text-[#ecd8a6] border border-[#ecd8a6]/20 hover:border-[#ecd8a6]/50 font-serif uppercase tracking-widest text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
  ```

### 6.3. Veri Tabloları (Data Tables)
Tablolar operasyonel hız için sade tutulmalı ancak sınır hatları net olmalıdır.
- **Tablo Başlığı (Thead):** Arka plan `#120a1c`, metin rengi `#ecd8a6/70`, font-size küçük ve kalın.
- **Satırlar (Row):** Her satırın altında ince bir sınır çizgisi: `border-b border-[#ecd8a6]/10`. Hover durumunda satır arka planı hafifçe parlamalıdır (`hover:bg-[#1e1332]/30`).

### 6.4. Form Girdileri (Inputs & Selects)
Girdiler koyu temaya uyumlu olmalı ve odaklanıldığında (focus) hafif bir altın parlaması yaymalıdır.
```html
class="w-full bg-[#120a1c]/60 border border-[#ecd8a6]/20 rounded-lg px-4 py-3 outline-none focus:border-[#ecd8a6]/60 focus:ring-1 focus:ring-[#ecd8a6]/60 text-[#ecd8a6] transition-all placeholder:text-[#ecd8a6]/30"
```
