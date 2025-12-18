
const express = require('express');
const app = express();
const PORT = 3002; // make sure it does not conflict with Vendor A or integrat

const products = [
  {
    "sku": "TSHIRT-001",
    "productName": "Kaos Ijen Crater",
    "price": 75000,
    "isAvailable": true
  },
  {
    "sku": "HAT-002",
    "productName": "Topi Banyuwangi Sunrise of Java",
    "price": 55000,
    "isAvailable": true
  },
  {
    "sku": "CAP-003",
    "productName": "Celana curduroi",
    "price": 1000000,
    "isAvailable": true
  }
];

// Health check
app.get('/status', (req, res) => {
  res.json({ status: 'Vendor B running' });
});

// Products endpoint
app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Vendor B running at http://localhost:${PORT}/products`);
});
