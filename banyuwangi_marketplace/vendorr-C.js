const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk parse JSON
app.use(express.json());

// Impor data dari module vendor
const { getVendorCData } = require('./vendorC.js'); // DIUBAH: Menggunakan vendorC.js

// Transformasi data dari Vendor C
function transformVendorC(data) {
  return data.map(item => {
    const nama = item.details.category === "Food" 
      ? `${item.details.name} (Recommended)` 
      : item.details.name;
    const harga_final = item.pricing.base_price + item.pricing.tax;

    return {
      id: item.id.toString(),
      nama: nama,
      harga_final: harga_final,
      status: item.stock > 0 ? "Tersedia" : "Habis",
      sumber: "Vendor C"
    };
  });
}

// ENDPOINT POSTMAN: GET /api/products
app.get('/api/products', (req, res) => {
  // Panggil fungsi untuk mendapatkan data terbaru setiap kali ada request
  const dataVendorC = getVendorCData();

  // Jalankan transformasi hanya untuk data Vendor C
  const result = transformVendorC(dataVendorC);

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: result
});
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
console.log(`Postman: GET http://localhost:${port}/api/products`);
});
