const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Fungsi baca JSON aman
function loadVendorData(filename) {
  try {
    const raw = fs.readFileSync(filename, 'utf8');   // baca teks dari file
    const json = JSON.parse(raw);                    // parse ke JS

    // pastikan hasilnya array supaya bisa forEach
    if (Array.isArray(json)) {
      return json;
    } else {
      return [json]; // kalau object tunggal, bungkus jadi array
    }
  } catch (err) {
    console.error(`Error load ${filename}:`, err.message);
    return []; // jangan lempar error, biar aman
  }
}

// Fungsi integrasi 3 vendor
function integrateData() {
  const vendorA = loadVendorData('vendorA.json');
  const vendorB = loadVendorData('vendorB.json');
  const vendorC = loadVendorData('vendorC.json');

  const result = [];

// tambahkan di bawah fungsi loadVendorData dan sebelum app.listen

app.get('/debug/vendor-a', (req, res) => {
  const data = loadVendorData('vendorA.json');
  res.json(data);
});

app.get('/debug/vendor-b', (req, res) => {
  const data = loadVendorData('vendorB.json');
  res.json(data);
});

app.get('/debug/vendor-c', (req, res) => {
  const data = loadVendorData('vendorC.json');
  res.json(data);
});


  // === Vendor A: Warung Legacy (diskon 10%) ===
  vendorA.forEach(item => {
    let harga = parseInt(item.hrg, 10); // String -> Number

    if (isNaN(harga)) {
      console.warn('Data Vendor A harga tidak valid:', item);
      harga = 0;
    }

    if (item.ket_stok === 'ada') {
      harga = Math.floor(harga * 0.9); // diskon 10%
    }

    result.push({
      id: item.kd_produk,
      nama: item.nm_brg,
      harga_final: harga,
      status: item.ket_stok === 'ada' ? 'Tersedia' : 'Habis',
      sumber: 'Vendor A'
    });
  });

  // === Vendor B: Distro Modern ===
  vendorB.forEach(item => {
    result.push({
      id: item.sku,
      nama: item.productName,
      harga_final: item.price,
      status: item.isAvailable ? 'Tersedia' : 'Habis',
      sumber: 'Vendor B'
    });
  });

  // === Vendor C: Resto Kuliner (nested + Recommended) ===
  vendorC.forEach(item => {
    const nama = item.details.category === 'Food'
      ? item.details.name + ' (Recommended)'
      : item.details.name;

    const harga_final = item.pricing.base_price + item.pricing.tax;

    result.push({
      id: item.id.toString(),
      nama: nama,
      harga_final: harga_final,
      status: item.stock > 0 ? 'Tersedia' : 'Habis',
      sumber: 'Vendor C'
    });
  });

  return result;
}

// Endpoint untuk Postman
app.get('/api/products', (req, res) => {
  const products = integrateData();
  res.json({
    success: true,
    total_products: products.length,
    timestamp: new Date().toISOString(),
    data: products
  });
});

// Endpoint cek server
app.get('/', (req, res) => {
  res.json({
    message: 'Banyuwangi Marketplace Integrator running',
    endpoint: '/api/products'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Test di Postman: GET http://localhost:${port}/api/products`);
});
