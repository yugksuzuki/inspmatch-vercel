const { Pinecone } = require('@pinecone-database/pinecone');

// Instancia o cliente Pinecone com a nova API
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX);
const namespace = process.env.PINECONE_NAMESPACE || 'default';

// Insere ou atualiza um vetor no índice
async function upsertVector(id, vector, metadata = {}) {
  await index.upsert([
    {
      id,
      values: vector,
      metadata,
    },
  ], namespace);
}

// Consulta o vetor mais similar
async function queryVector(vector) {
  const result = await index.query({
    vector,
    topK: 1,
    includeMetadata: true,
    namespace,
  });

  return result.matches?.[0];
}

module.exports = { upsertVector, queryVector };
