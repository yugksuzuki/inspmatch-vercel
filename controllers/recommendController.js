const express = require('express');
const router = express.Router();
const { generateEmbedding } = require('../services/embeddingService');
const { queryVector } = require('../services/pineconeService');
const { getProductById } = require('../services/shopifyService');

router.post('/', async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.status(400).json({ message: 'Imagem base64 não fornecida.' });
    }

    // Gera embedding com CLIP
    const embedding = await generateEmbedding(base64);

    // Busca produto similar na Pinecone
    const match = await queryVector(embedding);
    if (!match) {
      return res.status(404).json({ message: 'Nenhum produto semelhante encontrado.' });
    }

    // Recupera o produto do Shopify
    const product = await getProductById(match.id);
    res.json({ product, similarityScore: match.score });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao recomendar produto', error: err.message });
  }
});

module.exports = router;