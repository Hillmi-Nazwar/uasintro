require('dotenv').config();
const express = require('express');

const port = process.env.APP_PORT;
const dbUser = process.env.DB_USER;


const dataProduk = [
  {
    "kd_produk": "A001",
    "nm_brg": "Kopi Bubuk 100g",
    "hrg": 15000,
    "ket_stok": "ada"
  },
  {
    "kd_produk": "A002",
    "nm_brg": "Mie Instan Goreng",
    "hrg": 3500,
    "ket_stok": "ada"
  },
  {
    "kd_produk": "B001",
    "nm_brg": "Gula Pasir 1kg",
    "hrg": 18500,
    "ket_stok": "habis"
  }
];

const hitungHargaFinal = (harga) => Math.round(harga * 0.9);

const app = express();




app.get('/status', (req, res) => {

  res.json({
    status: 'Server berjalan dengan baik',
    database_user: dbUser, 
    message: 'Berhasil terhubung dari Postman!'
  });
});


app.get('/warung-legacy', (req, res) => {

  const { status } = req.query;

  let produkUntukDikirim = dataProduk;


  if (status) {

    produkUntukDikirim = dataProduk.filter(
      (produk) => produk.ket_stok.trim() === status
    );
  }


  const responsDenganDiskon = produkUntukDikirim.map(produk => {
    // Menggunakan fungsi helper dan mengakses properti yang sudah bersih
    return { ...produk, harga_final: hitungHargaFinal(produk.hrg) };
  });

  res.json(responsDenganDiskon);
});


app.get('/warung-legacy/:id', (req, res) => {

  const { id } = req.params;


  // Saran: Sederhanakan logika pencarian agar lebih andal.
  const produkDitemukan = dataProduk.find(p => p.kd_produk.trim() === id);

 
  if (produkDitemukan) {
   
    const responsProduk = { 
      ...produkDitemukan, 
      harga_final: hitungHargaFinal(produkDitemukan.hrg) };

    return res.json(responsProduk);
  }

  // Jika tetap tidak ditemukan, kirim status 404 Not Found
  res.status(404).json({ message: `Produk dengan ID '${id}' tidak ditemukan.` });
});

// Langkah 5: Jalankan server dan buat ia mendengarkan di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berhasil berjalan dan mendengarkan di http://localhost:${port}`);
});