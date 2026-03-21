const {
    validateEmail,
    validatePassword,
    validateTextInput,
    validateObjectId,
} = require('../middleware/validationMiddleware');

describe('Validation Middleware', () => {
    describe('validateEmail', () => {
        it('should accept valid email', () => {
            const result = validateEmail('user@example.com');
            expect(result.valid).toBe(true);
            expect(result.value).toBe('user@example.com');
        });

        it('should reject invalid email', () => {
            const result = validateEmail('not-an-email');
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should reject empty email', () => {
            const result = validateEmail('');
            expect(result.valid).toBe(false);
        });

        it('should reject null email', () => {
            const result = validateEmail(null);
            expect(result.valid).toBe(false);
        });

        it('should trim whitespace from email', () => {
            const result = validateEmail('  user@example.com  ');
            expect(result.valid).toBe(true);
            expect(result.value).toBe('user@example.com');
        });
    });

    describe('validatePassword', () => {
        it('should accept valid password', () => {
            const result = validatePassword('SecurePass123!');
            expect(result.valid).toBe(true);
        });

        it('should reject short password', () => {
            const result = validatePassword('pass');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('at least 6');
        });

        it('should reject very long password', () => {
            const longPassword = 'a'.repeat(200);
            const result = validatePassword(longPassword);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('too long');
        });

        it('should reject null password', () => {
            const result = validatePassword(null);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateTextInput', () => {
        it('should accept valid text input', () => {
            const result = validateTextInput('This is valid feedback');
            expect(result.valid).toBe(true);
            expect(result.value).toBeDefined();
        });

        it('should escape HTML in input', () => {
            const result = validateTextInput('<script>alert("xss")</script>');
            expect(result.valid).toBe(true);
            expect(result.value).not.toContain('<script>');
        });

        it('should reject empty text', () => {
            const result = validateTextInput('   ');
            expect(result.valid).toBe(false);
        });

        it('should reject text exceeding max length', () => {
            const longText = 'a'.repeat(6000);
            const result = validateTextInput(longText);
            expect(result.valid).toBe(false);
        });

        it('should accept custom max length', () => {
            const result = validateTextInput('a'.repeat(100), 'testField', 50);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateObjectId', () => {
        it('should accept valid MongoDB ObjectId', () => {
            const validId = '507f1f77bcf86cd799439011';
            const result = validateObjectId(validId);
            expect(result.valid).toBe(true);
        });

        it('should reject invalid ObjectId format', () => {
            const result = validateObjectId('not-a-valid-id');
            expect(result.valid).toBe(false);
        });

        it('should reject null id', () => {
            const result = validateObjectId(null);
            expect(result.valid).toBe(false);
        });
    });
});
