const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk parse JSON
app.use(express.json());

// Data vendor (sama seperti sebelumnya)
const vendorA = [
    {"kd_produk": "A001", "nm_brg": "Kopi Bubuk 100g", "hrg": "15000", "ket_stok": "ada"}
];

const vendorB = [
    {"sku": "TSHIRT-001", "productName": "Kaos Ijen Crater", "price": 75000, "isAvailable": true}
];

const vendorC = [
{
    "id": 501,
    "details": {"name": "Nasi Tempong", "category": "Food"},
    "pricing": {"base_price": 20000, "tax": 2000},
    "stock": 50
}
];

// FUNGSI INTEGRASI (sama seperti sebelumnya)
function integrateData(vendorA, vendorB, vendorC) {
const result = [];

  // Vendor A - Diskon 10%
vendorA.forEach(item => {
    let harga = parseInt(item.hrg);
    if (item.ket_stok === "ada") {
      harga = Math.floor(harga * 0.9);
    }
    result.push({
    id: item.kd_produk,
    nama: item.nm_brg,
    harga_final: harga,
    status: item.ket_stok === "ada" ? "Tersedia" : "Habis",
    sumber: "Vendor A"
    });
});

  // Vendor B
vendorB.forEach(item => {
    result.push({
    id: item.sku,
    nama: item.productName,
    harga_final: item.price,
    status: item.isAvailable ? "Tersedia" : "Habis",
    sumber: "Vendor B"
    });
});

  // Vendor C - Label Food
vendorC.forEach(item => {
    const nama = item.details.category === "Food" 
    ? item.details.name + " (Recommended)" 
    : item.details.name;
    const harga_final = item.pricing.base_price + item.pricing.tax;
    
    result.push({
    id: item.id.toString(),
    nama: nama,
    harga_final: harga_final,
    status: item.stock > 0 ? "Tersedia" : "Habis",
    sumber: "Vendor C"
    });
});

return result;
}

// ENDPOINT POSTMAN: GET /api/products
app.get('/api/products', (req, res) => {
const result = integrateData(vendorA, vendorB, vendorC);
res.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: result
});
});

app.listen(port, () => {
console.log(`🚀 Server running at http://localhost:${port}`);
console.log(`📱 Postman: GET http://localhost:${port}/api/products`);
});
