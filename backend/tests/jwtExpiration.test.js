const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

describe('JWT Expiration Tests', () => {
    const jwtSecret = 'test-secret-key';

    beforeEach(() => {
        process.env.JWT_SECRET = jwtSecret;
    });

    describe('JWT Token Expiration', () => {
        it('should reject expired token', () => {
            // Create an expired token
            const expiredToken = jwt.sign(
                { userId: '123', role: 'user' },
                jwtSecret,
                { expiresIn: '-1h' } // Already expired
            );

            const req = {
                headers: {
                    authorization: `Bearer ${expiredToken}`,
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('expired'),
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should accept valid non-expired token', () => {
            const validToken = jwt.sign(
                { userId: '123', role: 'user' },
                jwtSecret,
                { expiresIn: '7d' }
            );

            const req = {
                headers: {
                    authorization: `Bearer ${validToken}`,
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toBeDefined();
            expect(req.user.userId).toBe('123');
            expect(req.user.role).toBe('user');
        });

        it('should include exp claim in token', () => {
            const token = jwt.sign(
                { userId: '123', role: 'user' },
                jwtSecret,
                { expiresIn: '7d' }
            );

            const decoded = jwt.decode(token);
            expect(decoded).toHaveProperty('exp');
            expect(typeof decoded.exp).toBe('number');
        });

        it('should reject token signed with wrong secret', () => {
            const token = jwt.sign(
                { userId: '123', role: 'user' },
                'wrong-secret',
                { expiresIn: '7d' }
            );

            const req = {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Invalid token',
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject malformed token', () => {
            const req = {
                headers: {
                    authorization: 'Bearer not.a.valid.jwt.token',
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject missing authorization header', () => {
            const req = {
                headers: {},
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'No token provided',
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject authorization header without Bearer prefix', () => {
            const token = jwt.sign(
                { userId: '123', role: 'user' },
                jwtSecret,
                { expiresIn: '7d' }
            );

            const req = {
                headers: {
                    authorization: token, // Missing "Bearer" prefix
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        it('should verify token algorithm', () => {
            // Create token with HS512 (not our expected HS256)
            const token = jwt.sign(
                { userId: '123', role: 'user' },
                jwtSecret,
                { expiresIn: '7d', algorithm: 'HS512' }
            );

            const req = {
                headers: {
                    authorization: `Bearer ${token}`,
                },
                ip: '127.0.0.1',
                path: '/api/test',
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authMiddleware(req, res, next);

            // Should reject because we expect HS256
            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
