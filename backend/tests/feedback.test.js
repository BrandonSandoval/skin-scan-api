// feedback.test.js

const request = require('supertest');
const app = require('../server'); // or wherever your Express app is
const User = require('../models/User');
const History = require('../models/History');
const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');

describe('POST /api/feedback', () => {
  let token;
  let userId;
  let historyId;

  beforeAll(async () => {
    // Create a dummy user
    const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedpassword123' // Include this field
    });
    userId = user._id;

    // Generate a token for the dummy user
    token = jwt.sign({ userId }, process.env.JWT_SECRET || 'testsecret');

    // Create a dummy history record
    const history = await History.create({
      userId,
      imagePath: 'dummy.jpg',
      prediction: 'benign',
      confidence: 0.95
    });
    historyId = history._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await History.deleteMany({});
    await Feedback.deleteMany({});
  });

  it('should submit feedback successfully', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({
        historyId: historyId.toString(),
        isAccurate: true,
        comment: "Test feedback"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Feedback submitted successfully');
  });

  it('should fail without token', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        historyId: historyId.toString(),
        isAccurate: false,
        comment: "Should fail"
      });

    expect(res.statusCode).toBe(401); // or whatever you return for unauthenticated
  });
});

