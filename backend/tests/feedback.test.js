const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const History = require('../models/History');
const Feedback = require('../models/Feedback');

let userToken, doctorToken, adminToken, historyId;

beforeEach(async () => {
  await User.deleteMany();
  await History.deleteMany();
  await Feedback.deleteMany();

  // Regular user setup
  const regUserRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'user@example.com', password: '12345678' });
  expect(regUserRes.statusCode).toBe(201);

  const user = await User.findOne({ email: 'user@example.com' });

  const loginResUser = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@example.com', password: '12345678' });

  userToken = loginResUser.body.token;

  const history = await History.create({
    userId: user._id,
    imagePath: 'dummy.jpg',
    prediction: 'benign',
    confidence: 0.88,
  });
  historyId = history._id;

  // Doctor setup
  const regDocRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'doctor@example.com', password: '12345678' });
  expect(regDocRes.statusCode).toBe(201);

  await User.updateOne({ email: 'doctor@example.com' }, { role: 'doctor' });

  const loginResDoctor = await request(app)
    .post('/api/auth/login')
    .send({ email: 'doctor@example.com', password: '12345678' });

  doctorToken = loginResDoctor.body.token;

  // Admin setup
  const regAdminRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'admin@example.com', password: '12345678' });
  expect(regAdminRes.statusCode).toBe(201);

  await User.updateOne({ email: 'admin@example.com' }, { role: 'admin' });

  const loginResAdmin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: '12345678' });

  adminToken = loginResAdmin.body.token;
});

describe('POST /api/feedback', () => {
  it('should submit feedback with valid token', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        historyId: historyId.toString(),
        isAccurate: true,
        comment: 'Looks good.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/success/i);
  });

  it('should fail without token', async () => {
    const res = await request(app).post('/api/feedback').send({
      historyId: historyId.toString(),
      isAccurate: false,
      comment: 'Missing token',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment: 'Missing fields' });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe('GET /api/feedback/all-feedbacks', () => {
  it('should deny access to regular users', async () => {
    const res = await request(app)
      .get('/api/feedback/all-feedbacks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/insufficient role/i);
  });

  it('should allow doctors to access all feedbacks', async () => {
    const res = await request(app)
      .get('/api/feedback/all-feedbacks')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.feedbacks)).toBe(true);
  });

  it('should allow admins to access all feedbacks', async () => {
    const res = await request(app)
      .get('/api/feedback/all-feedbacks')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.feedbacks)).toBe(true);
  });
});
