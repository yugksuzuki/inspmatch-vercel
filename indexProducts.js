require('dotenv').config();
const { getAllProducts } = require('./services/shopifyService');
const { generateEmbedding } = require('./services/embeddingService');
const { upsertVector } = require('./services/pineconeService');
const axios = require('axios');

async function downloadImageAsBase64(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

async function indexAllProducts() {
  const products = await getAllProducts();

  for (const product of products) {
    const imageUrl = product?.image?.src;
    if (!imageUrl) continue;

    try {
      console.log(`Indexando produto: ${product.title}`);

      const base64 = await downloadImageAsBase64(imageUrl);
      const embedding = await generateEmbedding(base64);
      await upsertVector(product.id.toString(), embedding);

      console.log(`✔️ Produto indexado: ${product.id}`);
    } catch (err) {
      console.error(`❌ Falha ao indexar ${product.title}: ${err.message}`);
    }
  }
}

indexAllProducts();