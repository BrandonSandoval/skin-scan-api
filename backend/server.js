const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => res.send('SkinScan API is running!'));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));