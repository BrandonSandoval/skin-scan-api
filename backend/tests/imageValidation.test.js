const {
    validateImageUpload,
    validateFileSize,
    validateMimeType,
    validateFileHeader,
    validateFilename,
    MAX_FILE_SIZE,
} = require('../utils/validateImage');

describe('Image Validation Utilities', () => {
    describe('validateFileSize', () => {
        it('should accept file within size limit', () => {
            const file = {
                buffer: Buffer.alloc(1024 * 1024), // 1MB
            };
            const result = validateFileSize(file);
            expect(result.valid).toBe(true);
        });

        it('should reject file exceeding size limit', () => {
            const file = {
                buffer: Buffer.alloc(MAX_FILE_SIZE + 1),
            };
            const result = validateFileSize(file);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('exceeds maximum');
        });

        it('should reject empty file', () => {
            const file = {
                buffer: Buffer.alloc(0),
            };
            const result = validateFileSize(file);
            expect(result.valid).toBe(false);
        });

        it('should reject file without buffer', () => {
            const result = validateFileSize({});
            expect(result.valid).toBe(false);
        });
    });

    describe('validateMimeType', () => {
        it('should accept JPEG mime type', () => {
            const file = { mimetype: 'image/jpeg' };
            const result = validateMimeType(file);
            expect(result.valid).toBe(true);
        });

        it('should accept PNG mime type', () => {
            const file = { mimetype: 'image/png' };
            const result = validateMimeType(file);
            expect(result.valid).toBe(true);
        });

        it('should reject other mime types', () => {
            const file = { mimetype: 'image/gif' };
            const result = validateMimeType(file);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('not allowed');
        });

        it('should handle case-insensitive mime type', () => {
            const file = { mimetype: 'IMAGE/JPEG' };
            const result = validateMimeType(file);
            expect(result.valid).toBe(true);
        });
    });

    describe('validateFileHeader', () => {
        it('should detect JPEG magic bytes', () => {
            // JPEG magic bytes: FF D8 FF
            const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x00]);
            const file = {
                buffer: jpegBuffer,
                mimetype: 'image/jpeg',
            };
            const result = validateFileHeader(file);
            expect(result.valid).toBe(true);
            expect(result.detectedFormat).toBe('JPEG');
        });

        it('should detect PNG magic bytes', () => {
            // PNG magic bytes: 89 50 4E 47
            const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
            const file = {
                buffer: pngBuffer,
                mimetype: 'image/png',
            };
            const result = validateFileHeader(file);
            expect(result.valid).toBe(true);
            expect(result.detectedFormat).toBe('PNG');
        });

        it('should reject mismatched JPEG header', () => {
            const file = {
                buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
                mimetype: 'image/jpeg',
            };
            const result = validateFileHeader(file);
            expect(result.valid).toBe(false);
        });

        it('should reject mismatched PNG header', () => {
            const file = {
                buffer: Buffer.from([0xff, 0xd8, 0xff]),
                mimetype: 'image/png',
            };
            const result = validateFileHeader(file);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateFilename', () => {
        it('should accept valid filename', () => {
            const result = validateFilename('skin-scan-123.jpg');
            expect(result.valid).toBe(true);
        });

        it('should accept PNG filename', () => {
            const result = validateFilename('scan_image.png');
            expect(result.valid).toBe(true);
        });

        it('should reject directory traversal attempts', () => {
            const result = validateFilename('../../../etc/passwd');
            expect(result.valid).toBe(false);
        });

        it('should reject filenames with path separators', () => {
            const result = validateFilename('path/to/file.jpg');
            expect(result.valid).toBe(false);
        });

        it('should reject filenames with backslashes', () => {
            const result = validateFilename('path\\to\\file.jpg');
            expect(result.valid).toBe(false);
        });

        it('should reject filenames with invalid characters', () => {
            const result = validateFilename('file$name!.jpg');
            expect(result.valid).toBe(false);
        });

        it('should reject missing file extension', () => {
            const result = validateFilename('noextension');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateImageUpload (integration)', () => {
        it('should validate complete valid image', () => {
            const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff]);
            jpegBuffer.fill(0x00, 3); // Pad with zeros
            const file = {
                buffer: jpegBuffer,
                mimetype: 'image/jpeg',
            };
            const result = validateImageUpload(file, 'test.jpg');
            expect(result.valid).toBe(true);
            expect(result.detectedFormat).toBe('JPEG');
        });

        it('should reject file with spoofed extension', () => {
            const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
            const file = {
                buffer: pngBuffer,
                mimetype: 'image/jpeg', // Claims to be JPEG but has PNG header
            };
            const result = validateImageUpload(file, 'test.jpg');
            expect(result.valid).toBe(false);
        });

        it('should reject oversized file', () => {
            const jpegBuffer = Buffer.alloc(MAX_FILE_SIZE + 1);
            jpegBuffer[0] = 0xff;
            jpegBuffer[1] = 0xd8;
            jpegBuffer[2] = 0xff;
            const file = {
                buffer: jpegBuffer,
                mimetype: 'image/jpeg',
            };
            const result = validateImageUpload(file, 'test.jpg');
            expect(result.valid).toBe(false);
        });
    });
});
