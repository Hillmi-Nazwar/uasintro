require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.APP_PORT || 3001;

const dataProduk = [
  {
    " kd_produk ": " A001",
    " nm_brg ": " Kopi Bubuk 100g ",
    " hrg ": "15000",
    " ket_stok ": " ada "
  },
  {
    " kd_produk ": " A002",
    " nm_brg ": " Mie Instan Goreng ",
    " hrg ": "3500",
    " ket_stok ": " ada "
  },
  {
    " kd_produk ": " B001",
    " nm_brg ": " Gula Pasir 1kg ",
    " hrg ": "18500",
    " ket_stok ": " habis "
  }
];



// Legacy endpoint (RAW DATA)
app.get('/warung-legacy', (req, res) => {
  res.json(dataProduk);
});

app.listen(port, () => {
  console.log(`Vendor A running at http://localhost:${port}`);
});
