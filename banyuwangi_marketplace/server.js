const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Fungsi baca JSON aman
function loadVendorData(filename) {
  try {
    const raw = fs.readFileSync(filename, 'utf8');
    const json = JSON.parse(raw);

    if (Array.isArray(json)) {
      return json;
    } else {
      return [json];
    }
  } catch (err) {
    console.error(`Error load ${filename}:`, err.message);
    return [];
  }
}

// ENDPOINT DEBUG (tetap sama)
app.get('/debug/vendor-a', (req, res) => {
  const data = loadVendorData('Data/vendorA.json');
  res.json(data);
});

app.get('/debug/vendor-b', (req, res) => {
  const data = loadVendorData('Data/vendorB.json');
  res.json(data);
});

app.get('/debug/vendor-c', (req, res) => {
  const data = loadVendorData('Data/vendorC.json');
  res.json(data);
});

// FUNGSI INTEGRASI (FIXED 100% UAS)
function integrateData() {
  const vendorA = loadVendorData('Data/vendorA.json');
  const vendorB = loadVendorData('Data/vendorB.json');
  const vendorC = loadVendorData('Data/vendorC.json');

  const result = [];


  // === VENDOR A: Warung Legacy (SELALU diskon 10%) ===
  vendorA.forEach(item => {
    let harga = parseInt(item.hrg, 10);
    if (isNaN(harga)) {
      console.warn('Data Vendor A harga tidak valid:', item);
      harga = 0;
    }

    // SELALU DISKON 10% Vendor A
    const hargaFinal = Math.floor(harga * 0.9);

    result.push({
      id: item.kd_produk,
      nama: item.nm_brg,
      hargafinal: hargaFinal,        
      status: item.ket_stok === 'ada' ? 'Tersedia' : 'Habis',
      sumber: 'Vendor A'
    });
  });

  // === VENDOR B: Distro Modern ===
  vendorB.forEach(item => {
    result.push({
      id: item.sku,
      nama: item.productName,
      hargafinal: parseInt(item.price), 
      status: item.isAvailable ? 'Tersedia' : 'Habis',
      sumber: 'Vendor B'
    });
  });

  // === VENDOR C: Resto Kuliner (nested + Recommended)
  vendorC.forEach(item => {
    const hargaFinal = parseInt(item.pricing.base_price) + parseInt(item.pricing.tax);
    let nama = item.details.name;

    // Label Recommended jika kategori Food
    if (item.details.category === 'Food') {
      nama += ' Recommended';
    }

    result.push({
      id: item.id.toString(),
      nama: nama,
      hargafinal: hargaFinal,        
      status: item.stock > 0 ? 'Tersedia' : 'Habis',
      sumber: 'Vendor C'
    });
  });

  return result;
}

// ENDPOINT UTAMA UAS
app.get('/api/products', (req, res) => {
  const products = integrateData();
  res.json({
    success: true,
    total_products: products.length,
    timestamp: new Date().toISOString(),
    data: products
  });
});

// ENDPOINT CEK SERVER
app.get('/', (req, res) => {
  res.json({
    message: 'Banyuwangi Marketplace Integrator running',
    endpoint: '/api/products',
    test_debug: ['/debug/vendor-a', '/debug/vendor-b', '/debug/vendor-c']
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Output Final: GET http://localhost:${port}/api/products`);
  console.log(`Data_VendorA: http://localhost:${port}/debug/vendor-a`);
  console.log(`Debug_VendorB: http://localhost:${port}/debug/vendor-b`);
  console.log(`Debug_VendorC: http://localhost:${port}/debug/vendor-c`);
});
