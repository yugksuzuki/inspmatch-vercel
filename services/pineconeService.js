const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone();

async function initPinecone() {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  return pinecone.Index(process.env.PINECONE_INDEX);
}

async function upsertVector(id, vector) {
  const index = await initPinecone();
  await index.upsert([{ id, values: vector }]);
}

async function queryVector(vector) {
  const index = await initPinecone();
  const result = await index.query({ vector, topK: 1, includeMetadata: true });
  return result.matches?.[0];
}

module.exports = { upsertVector, queryVector };
