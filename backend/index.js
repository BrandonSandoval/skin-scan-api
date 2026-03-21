const mongoose = require('mongoose');
const app = require('./server');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            logger.info('Connected to MongoDB');
            app.listen(PORT, () => {
                logger.info(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            logger.error('MongoDB connection error', { error: err.message });
        });
}
