const express = require('express');
const multer = require('multer');
const path = require('path');
const { imageUpload } = require('./src/image/image');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 10000;
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/', express.static(path.join(__dirname, 'frontend/build')));
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Image upload route
app.post('/api/upload', upload.single('image'), imageUpload);

app.listen(port, hostname='0.0.0.0', () => console.log(`Server running on port ${port}`));