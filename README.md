# Niagava — ERP Mini: Stok, Transaksi & Laporan

> **Kategori proyek: Web App — ERP Mini (Inventori + Transaksi + Laporan).**
> Satu sistem kecil yang tersambung: catat transaksi → stok berubah → laporan laba ter-update.

ERP mini untuk UMKM distribusi/konveksi/toko yang masih mencatat stok di
notebook. Proyek ini adalah **concept demo** untuk portofolio jasa
pembuatan web — distributor "Nusa Pack" dan seluruh angka bersifat fiktif.
Nama "Niagava" sengaja dibuat unik (belum dipakai entitas mana pun di
internet).

**Live:** https://niagava.vercel.app

## Fitur

- **4 tab**: Ringkasan, Stok, Transaksi, Laporan.
- **Ringkasan**: nilai persediaan, omzet & laba kotor bulan ini, grafik
  omzet 7 hari (SVG custom), dan daftar stok yang perlu restock.
- **Stok**: 8 SKU dengan harga beli/jual, margin otomatis, badge stok
  kritis; tombol Masuk/Keluar langsung membuka form transaksi terisi.
- **Transaksi**: form barang masuk/keluar dengan validasi stok (tidak bisa
  menjual melebihi stok) + estimasi nilai otomatis; tabel 25 transaksi
  terbaru.
- **Laporan**: laba kotor per produk bulan berjalan + bar kontribusi laba,
  diurutkan dari yang paling menguntungkan.
- Semua data tersimpan di **localStorage** + tombol reset data demo.

## Untuk siapa demo ini?

Distributor, toko bahan, konveksi, gudang, UMKM produksi — semua yang
butuh stok dan laporan tapi belum butuh ERP penuh.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (reveal animasi)
- Lucide Icons

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # build produksi ke folder dist/
```

## Catatan

- Seluruh produk & transaksi adalah data contoh (seed) yang disimpan di
  localStorage browser — tidak ada backend sungguhan.
- Dibuat sebagai concept demo portofolio oleh
  [Agni Miftah Fauzi](https://github.com/Atazyyy).
