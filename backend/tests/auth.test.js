const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
    // Create user before testing login
    beforeEach(async () => {
        // Register a new user before each test
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'testing@example.com', password: 'pass1234'});
    });

    it('should register a new user', async () => {
        // Use a different email for this test to avoid conflicts
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'another@example.com', password: 'pass1234'});
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/success/i);
    });
    
    it('should login and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testing@example.com', password: 'pass1234' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});