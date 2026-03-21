jest.setTimeout(60000);
process.env.JWT_SECRET = 'test-secret';

// Mock child_process.spawn for predict tests
const originalSpawn = require('child_process').spawn;
const { EventEmitter } = require('events');

jest.spyOn(require('child_process'), 'spawn').mockImplementation((command, args) => {
    // Only mock Python spawn, not others
    if (command === 'python3' && args[0].includes('predict.py')) {
        // Return a mock process that behaves like the real one
        const mockProcess = new EventEmitter();
        mockProcess.stdout = new EventEmitter();
        mockProcess.stderr = new EventEmitter();
        mockProcess.on = EventEmitter.prototype.on;
        
        // Simulate successful prediction response
        setImmediate(() => {
            mockProcess.stdout.emit('data', Buffer.from(JSON.stringify({
                label: 'benign',
                confidence: 0.95
            })));
            mockProcess.emit('close', 0);
        });
        
        return mockProcess;
    }
    
    // For other commands, use the original spawn
    return originalSpawn(command, args);
});

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
