const express = require('express');
const upload = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin'), upload.array('images', 5), uploadImages);

module.exports = router;