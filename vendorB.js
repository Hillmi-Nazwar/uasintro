const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Contoh data produk untuk Banyuwangi Marketplace
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

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(products, null, 2));
});

server.listen(port, hostname, () => {
  console.log(`Server Banyuwangi Marketplace berjalan di http://${hostname}:${port}/`);
});