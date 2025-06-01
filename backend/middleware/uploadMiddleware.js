const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/static');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Filter for only jpg/jpeg/png files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
    }
};

const upload = multer( {storage, fileFilter} );

module.exports = upload;