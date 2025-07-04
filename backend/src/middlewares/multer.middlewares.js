import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'attachments',
    allowed_formats: ['jpg', 'jpeg', 'png','pdf', 'docx', 'xlsx', 'pptx'], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Multer middleware
const upload = multer({ storage });

export default upload;
