const mongoose = require('mongoose');
const app = require('./server');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
}
