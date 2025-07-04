const request = require('supertest');
const app = require('../server'); 

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'testing@example.com', password: 'pass1234'})
        expect(res.statusCode).toBe(201)
        expect(res.body.message).toMatch(/success/i)
    })
    
    it('should login and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testing@example.com', password: 'pass1234' })
        expect(res.statusCode).toBe(200)
        expect(res.body.token).toBeDefined()
    })
})