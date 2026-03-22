const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
} = require('../controllers/resumeController');

// Multer config - memory storage (no disk writes)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
