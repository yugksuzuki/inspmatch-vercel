const axios = require('axios');

const shopify = axios.create({
  baseURL: `https://${process.env.SHOP_NAME}/admin/api/2023-07`,
  headers: {
    'X-Shopify-Access-Token': process.env.ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

async function getProductById(productId) {
  const response = await shopify.get(`/products/${productId}.json`);
  return response.data.product;
}

async function getAllProducts() {
  const response = await shopify.get('/products.json?limit=250');
  return response.data.products;
}

module.exports = { getProductById, getAllProducts };