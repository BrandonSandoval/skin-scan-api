jest.setTimeout(60000);
process.env.JWT_SECRET = 'test-secret';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { closeServer } = require('./server');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    // Removed console.log
}, 10000);

afterEach(async () => {
    // Clean collections between tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    // Proper shutdown sequence
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        // Removed console.log
    }

    // Close Express server
    await closeServer();
    // Removed console.log

    // Stop MongoDB Memory Server
    if (mongoServer) {
        await mongoServer.stop();
        // Removed console.log
    }

    // Small delay to ensure all connections are properly closed
    await new Promise((resolve) => setTimeout(resolve, 500));
});
