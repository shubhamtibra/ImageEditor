const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function imageEdit(req, res) {
  
  try {
    let sharpData = sharp('uploads/' + req.body.filename)
    if (req.body.cropRect) {
      sharpData = sharpData.extract(req.body.cropRect)
    }
    sharpData = sharpData.rotate(req.body.rotation).modulate({brightness: req.body.brightness, saturation: req.body.saturation}).linear(req.body.contrast, -(128 * req.body.contrast) + 128)
    await sharpData.toFile('uploads/' + 'final-' + req.body.filename)
    res.status(200).json({message: "Image edited successfully",
      url: `${req.protocol}://localhost:10000/uploads/final-${req.body.filename}`,
    });
  } catch (error) {
    res.status(400).send("Failed to edit image.");
  }
}

async function imageUpload(req, res) {
  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }
  try {
    const sharpData = sharp(req.file.path)
    const compression = {
      jpeg: { quality: 60 },
      jpg: { quality: 60 },
      webp: { quality: 60 },
      png: { compressionLevel: 5 },
    }
    const {format} = await sharpData.metadata();
    const previewFilename = `preview-${req.file.filename}`;
    await sharpData
      [format](compression[format])
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

module.exports = { imageUpload, imageEdit };
