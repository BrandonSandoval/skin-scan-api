const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

afterEach(async () => {
    await User.deleteMany();
})

describe('User Model Test', () => {
    it('should create a new user', async () => {
        const user = new User({
            email: 'unit@test.com',
            passwordHash: 'testhas123'
        });

        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe('unit@test.com');
        expect(savedUser.passwordHash).toBe('testhas123');
        expect(savedUser.createdAt).toBeDefined();
    });

    it('fails to create user without required fields', async () => {
        const userWithoutRequiredField = new User({ email: 'missingpass@test.com' });

        let err;
        try {
            await userWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.passwordHash).toBeDefined();
    });
});
