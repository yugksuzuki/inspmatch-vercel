const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  // Lógica de upload e indexação na Pinecone (a implementar)
  res.json({ message: 'Upload endpoint funcionando.' });
});

module.exports = router;