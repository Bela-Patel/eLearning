// config/multer.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/videos',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 100 MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('video');

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /mp4|avi|mkv/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!');
    }
}

module.exports = upload;
