const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const uploadController = require('./controllers/uploadController');
const recommendController = require('./controllers/recommendController');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/upload', uploadController);
app.use('/recommend', recommendController);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));