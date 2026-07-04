# Habi Herbal Alam — Launch Checklist

Sebelum halaman landing page v2 diluncurkan di habi.co.id, **semua template variable** di bawah ini harus diisi dengan nilai yang benar.

## Cara Penggunaan

Cari dan ganti (find & replace) setiap `{{VARIABLE}}` di file `index.html` dengan nilai sebenarnya.

---

## Template Variables

### Tracking & Analytics

| Variable | Deskripsi | File | Contoh |
|---|---|---|---|
| `{{META_PIXEL_ID}}` | ID Meta Pixel (Facebook Pixel) | index.html | `1234567890123456` |
| `{{GA4_ID}}` | ID Google Analytics 4 | index.html | `G-XXXXXXXXXX` |

### Harga Produk

| Variable | Deskripsi | File | Contoh |
|---|---|---|---|
| `{{HARGA_1_BOTOL}}` | Harga 1 botol (ditampilkan di Hero & Mobile CTA) | index.html | `89.000` |
| `{{HARGA_1}}` | Harga paket 1 botol | index.html | `89.000` |
| `{{HARGA_3}}` | Harga paket 3 botol | index.html | `237.000` |
| `{{SELISIH_3}}` | Penghematan paket 3 botol vs beli satuan | index.html | `30.000` |
| `{{HARGA_6}}` | Harga paket 6 botol | index.html | `444.000` |
| `{{SELISIH_6}}` | Penghematan paket 6 botol vs beli satuan | index.html | `90.000` |

### Legalitas

| Variable | Deskripsi | File | Contoh |
|---|---|---|---|
| `{{NOMOR_BPOM}}` | Nomor registrasi BPOM lengkap | index.html | `POM TR 123 456 789` |

### URL Marketplace & Checkout

| Variable | Deskripsi | File | Contoh |
|---|---|---|---|
| `{{URL_SHOPEE}}` | URL toko Shopee | index.html | `https://shopee.co.id/habi_herbalalam` |
| `{{URL_TOKOPEDIA}}` | URL toko Tokopedia | index.html | `https://www.tokopedia.com/habiherbalalam` |
| `{{URL_TIKTOK}}` | URL TikTok Shop | index.html | `https://www.tiktok.com/@habi/shop` |
| `{{URL_CHECKOUT}}` | URL direct checkout (Scalev/custom) | index.html | `https://checkout.habi.co.id` |

### Media Sosial (Footer)

| Variable | Deskripsi | File | Contoh |
|---|---|---|---|
| `{{URL_INSTAGRAM}}` | URL profil Instagram | index.html | `https://instagram.com/habi.herbalalam` |
| `{{URL_TIKTOK_SOCIAL}}` | URL profil TikTok (bukan shop) | index.html | `https://tiktok.com/@habi.herbalalam` |
| `{{URL_YOUTUBE}}` | URL channel YouTube | index.html | `https://youtube.com/@habiherbalalam` |

---

## Checklist Sebelum Launch

- [ ] Semua `{{VARIABLE}}` di atas sudah diganti dengan nilai sebenarnya
- [ ] Tidak ada teks `{{` yang tersisa di halaman (cek dengan Ctrl+F)
- [ ] Meta Pixel sudah diuji dengan Facebook Pixel Helper (Chrome extension)
- [ ] GA4 sudah memunculkan PageView di Realtime report
- [ ] Semua link marketplace mengarah ke toko yang benar
- [ ] WhatsApp link sudah dicoba dan membuka chat yang benar
- [ ] Nomor BPOM sudah dikonfirmasi valid
- [ ] Harga di semua tempat konsisten (Hero, pricing cards, mobile CTA)
- [ ] Gambar produk sudah diganti dengan foto asli (bukan placeholder)
- [ ] Badge BPOM, Halal, BBI sudah diganti dengan logo resmi
- [ ] Dosis di "Cara Pakai" sudah diverifikasi sesuai label produk
- [ ] Halaman diuji di mobile (375px), tablet (768px), dan desktop (1200px)
- [ ] Lighthouse score: Performance 90+, Accessibility 95+, SEO 95+
- [ ] Canonical URL mengarah ke https://habi.co.id (bukan github.io)
- [ ] og:image URL sudah benar (absolute URL di habi.co.id)
- [ ] File coming-soon (`index.html` di root) sudah diganti dengan v2

---

## Cara Deploy

1. Salin semua file dari folder `v2/` ke root project:
   ```bash
   cp v2/index.html ./index.html
   cp -r v2/css ./css
   cp -r v2/js ./js
   cp -r v2/images ./images
   ```
2. Commit dan push ke GitHub
3. Cloudflare Workers/Pages akan otomatis deploy

> **Catatan:** Simpan backup file coming-soon sebelum mengganti.
