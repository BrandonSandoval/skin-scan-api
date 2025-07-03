const multer = require('multer');
const path = require('path');

// Store file in memory instead of disk
const storage = multer.memoryStorage();

// Filter for only jpg/jpeg/png files
const fileFilter = (req, file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    const ext = require('path').extname(file.originalname).toLowerCase();
    cb(null, allowedExt.includes(ext));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;