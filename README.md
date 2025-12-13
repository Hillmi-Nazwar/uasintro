# Proyek Integrasi API Marketplace

Proyek ini bertujuan untuk mengintegrasikan data dari tiga vendor yang berbeda ke dalam satu format API standar.

## Anggota Kelompok
1.  **Vendor A (Warung Legacy)** - Baruna Akbar Rizqi
2.  **Vendor B (Distro Modern)** - Ahmad Septa Argya Putra
3.  **Vendor C (Resto & Kuliner)** - Zen Vero
4.  **Lead Integrator** - Hillmi Nazwar
5.  **Dokumentasi & Pengujian** - Mathew Hermansyah

---

## Deskripsi Tugas Vendor

### Vendor A (Warung Legacy)
Mensimulasikan sistem lama di mana semua data direpresentasikan sebagai string. Menerapkan diskon 10% pada harga produk.

### Vendor B (Distro Modern)
Mensimulasikan sistem standar internasional yang menggunakan Bahasa Inggris dan `camelCase` untuk nama properti.

### Vendor C (Resto & Kuliner)
Mensimulasikan struktur data yang lebih kompleks dengan *nested object*. Harga produk dipisahkan dari pajak.

---

## Spesifikasi API Final

### Endpoint Utama
- **URL**: `GET /api/products`
- **Deskripsi**: Mengembalikan daftar produk yang sudah dinormalisasi dari semua vendor.
- **Response**:
  - `success` (boolean)
  - `total_products` (number)
  - `timestamp` (string ISO)
  - `data` (array produk)

### Struktur Produk Output
- `id` (string)
- `nama` (string)
- `harga_final` (integer)
- `status` (string: "Tersedia" atau "Habis")
- `sumber` (string: "Vendor A", "Vendor B", atau "Vendor C")

### Logika Bisnis Tambahan
- **Vendor A**: Diskon 10% diterapkan jika stok tersedia.
- **Vendor C**: Produk dengan kategori "Food" akan diberi label `(Recommended)`.
- Semua `harga_final` harus bertipe `number` (integer).
