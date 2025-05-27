const axios = require('axios');

async function generateEmbedding(base64) {
  const response = await axios.post(
    'https://api.replicate.com/v1/predictions',
    {
      version: process.env.REPLICATE_MODEL_VERSION,
      input: { image: `data:image/jpeg;base64,${base64}` },
    },
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const predictionUrl = response.data.urls.get;

  let result = null;
  while (!result) {
    const poll = await axios.get(predictionUrl, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });

    if (poll.data.status === 'succeeded') {
      result = poll.data.output;
    } else if (poll.data.status === 'failed') {
      throw new Error('Embedding failed');
    }

    await new Promise((res) => setTimeout(res, 2000));
  }

  return result;
}

module.exports = { generateEmbedding };