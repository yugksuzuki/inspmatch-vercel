const { PineconeClient } = require('@pinecone-database/pinecone');
const client = new PineconeClient();

async function initPinecone() {
  await client.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
  return client.Index(process.env.PINECONE_INDEX);
}

async function upsertVector(id, vector) {
  const index = await initPinecone();
  await index.upsert({ upsertRequest: { vectors: [{ id, values: vector }] } });
}

async function queryVector(vector) {
  const index = await initPinecone();
  const result = await index.query({ queryRequest: { vector, topK: 1, includeMetadata: false } });
  return result.matches[0];
}

module.exports = { upsertVector, queryVector };