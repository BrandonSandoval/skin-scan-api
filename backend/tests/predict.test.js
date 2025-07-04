const request = require('supertest');
const path = require('path');
const app = require('../server');

let token;
jest.setTimeout(15000); // 15 seconds timeout for slow predictions

beforeAll(async () => {
  // Ensure the test user is registered before login
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'testing@example.com', password: 'pass1234' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testing@example.com', password: 'pass1234' });

  token = loginRes.body.token;
});

describe('POST /api/predict', () => {
  it('should return a prediction result with label and confidence', async () => {
    const imagePath = path.join(__dirname, '..', 'static', 'sample.jpg');

    const res = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`) 
      .attach('image', imagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('label');
    expect(res.body).toHaveProperty('confidence');
    expect(typeof res.body.label).toBe('string');
    expect(typeof res.body.confidence).toBe('number');
  });

  it('should return 400 if no image is uploaded', async () => {
    const res = await request(app)
      .post('/api/predict')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no image/i);
  });
});
