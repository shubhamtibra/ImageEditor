const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
async function imageUpload(req, res) {
  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }
  try {
    const sharpData = sharp(req.file.path)
    const metadata = await sharpData.metadata();
    const previewFilename = `preview-${req.file.filename}`;
    await sharpData
      .resize(200) // Resize to width of 200px, maintaining aspect ratio
      .toFile(path.join('uploads', previewFilename));
    setTimeout(() => {
      fs.unlinkSync(req.file.path);
    }, 1000 * 60 * 60);
    res
      .status(201)
      .json({
        message: "Image uploaded successfully",
        filename: req.file.filename,
        previewFilename: previewFilename,
        previewUrl: `${req.protocol}://localhost:10000/uploads/${previewFilename}`,
      });
  } catch (error) {
    fs.unlinkSync(req.file.path);
    return res.status(400).send("Invalid image file.");
  }
}

module.exports = { imageUpload };
