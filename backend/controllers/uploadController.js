const asyncHandler = require('express-async-handler');

const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

   // Cloudinary returns the URL in file.path
  const urls = req.files.map((file) => file.path);

  res.status(201).json({ success: true, urls });
});

module.exports = { uploadImages };