const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;

// ---------- Helpers ----------
function clean(val) {
  return typeof val === 'string' ? val.trim() : val;
}

function normalizeStock(input) {
  if (typeof input === 'string') {
    const v = input.trim().toLowerCase();
    if (v === 'ada') return 'Tersedia';
    if (v === 'habis') return 'Habis';
  }
  if (input === true) return 'Tersedia';
  if (typeof input === 'number') return input > 0 ? 'Tersedia' : 'Habis';
  return 'Habis';
}

function vendorDiscount(vendor, price) {
  if (vendor === 'Vendor A') return Math.floor(price * 0.9);
  return price;
}

function normalizeCategory(name, category, vendor) {
  if (vendor === 'Vendor C' && category === 'Food') {
    return `${name} (Recommended)`;
  }
  return name;
}

// ---------- Normalization per vendor ----------
function normalizeVendorA(raw) {
  const harga = parseInt(clean(raw[' hrg ']), 10);
  return {
    id: clean(raw[' kd_produk ']),
    nama: clean(raw[' nm_brg ']),
    harga_final: vendorDiscount('Vendor A', harga),
    status: normalizeStock(raw[' ket_stok ']),
    sumber: 'Vendor A'
  };
}

function normalizeVendorB(raw) {
  return {
    id: raw.sku,
    nama: raw.productName,
    harga_final: raw.price,
    status: raw.isAvailable ? 'Tersedia' : 'Habis',
    sumber: 'Vendor B'
  };
}

function normalizeVendorC(raw) {
  const price = (raw.pricing?.base_price || 0) + (raw.pricing?.tax || 0);
  return {
    id: String(raw.id),
    nama: normalizeCategory(raw.details?.name, raw.details?.category, 'Vendor C'),
    harga_final: price,
    status: normalizeStock(raw.stock),
    sumber: 'Vendor C'
  };
}

// ---------- Integration Endpoint ----------
app.get('/marketplace', async (req, res) => {
  try {
    // Vendor A
    const vendorARes = await axios.get('http://localhost:3001/warung-legacy');
    const vendorAData = vendorARes.data.map(normalizeVendorA);

    // Vendor B
    const vendorBRes = await axios.get('http://localhost:3002/products');
    const vendorBData = vendorBRes.data.map(normalizeVendorB);

    // Vendor C
    const vendorCRes = await axios.get('http://localhost:3003/menu');
    const vendorCData = vendorCRes.data.map(normalizeVendorC);

    // Combine all
    const allProducts = [...vendorAData, ...vendorBData, ...vendorCData];

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({
      message: 'Integration failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Integrator running at http://localhost:${PORT}`);
});
