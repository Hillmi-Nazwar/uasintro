require('dotenv').config(); // MUST be first

const express = require('express');
const { integrateData } = require('./integrator/integrator');


const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get('/api/products', async (req, res) => {
    try {
        const products = await integrateData();

        res.json({
            success: true,
            total_products: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to integrate vendor data',
            error: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Banyuwangi Marketplace Integrator running',
        endpoint: '/api/products'
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
