const request = require('supertest');
const app = require('../server');

describe('GET /api/history', () => {
    it('should block access without token', async () => {
        const res = await request(app).get('/api/history');
        expect(res.statusCode).toBe(401);
    });

    it('should return history with valid token', async () => {
        // Register user
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'testing@example.com', password: 'pass1234' });

        // Login to get token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testing@example.com', password: 'pass1234' });

        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.token).toBeDefined();

        const token = loginRes.body.token;

        const res = await request(app).get('/api/history').set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.history)).toBe(true);
    });
});
