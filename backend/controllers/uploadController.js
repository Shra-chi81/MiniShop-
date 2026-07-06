const asyncHandler = require('express-async-handler');

const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

  res.status(201).json({ success: true, urls });
});

module.exports = { uploadImages };