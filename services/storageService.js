const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const storageConfig = require('../config/storage');

// Configure AWS S3 or S3-compatible storage
const s3Config = {
  accessKeyId: storageConfig.s3.accessKeyId,
  secretAccessKey: storageConfig.s3.secretAccessKey,
  region: storageConfig.s3.region
};

// Add custom endpoint if provided (for S3-compatible storage)
if (storageConfig.s3.endpoint) {
  s3Config.endpoint = storageConfig.s3.endpoint;
}

// Set force path style (for S3-compatible storage)
if (storageConfig.s3.forcePathStyle) {
  s3Config.s3ForcePathStyle = storageConfig.s3.forcePathStyle;
}

const s3 = new AWS.S3(s3Config);

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = storageConfig.local.uploadPath;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// S3 storage configuration
const s3Storage = multerS3({
  s3: s3,
  bucket: storageConfig.s3.bucket,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// File filter for documents (HTML, MD)
const documentFilter = (req, file, cb) => {
  const allowedTypes = /html|md|markdown/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only HTML and Markdown files are allowed!'));
  }
};

// Create upload middleware based on storage type
const createUploadMiddleware = (fileFilter) => {
  const storage = storageConfig.type === 's3' ? s3Storage : localStorage;

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
};

// Memory storage for temporary document uploads (for reading content only)
const memoryStorage = multer.memoryStorage();

const uploadDocumentMemory = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Export upload middlewares
module.exports = {
  uploadImage: createUploadMiddleware(imageFilter),
  uploadDocument: createUploadMiddleware(documentFilter),
  uploadDocumentMemory: uploadDocumentMemory, // For HTML/MD file imports

  // Helper function to delete file
  deleteFile: async (filePath) => {
    if (storageConfig.type === 's3') {
      // Extract key from S3 URL
      const key = filePath.split('.com/')[1];
      const params = {
        Bucket: storageConfig.s3.bucket,
        Key: key
      };
      try {
        await s3.deleteObject(params).promise();
      } catch (error) {
        console.error('Error deleting from S3:', error);
      }
    } else {
      // Delete from local storage
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting local file:', error);
      }
    }
  },

  // Get file URL
  getFileUrl: (filename) => {
    if (storageConfig.type === 's3') {
      // If custom endpoint is provided, use it
      if (storageConfig.s3.endpoint) {
        const endpoint = storageConfig.s3.endpoint.replace(/^https?:\/\//, '');
        return `https://${endpoint}/${storageConfig.s3.bucket}/${filename}`;
      }
      // Default AWS S3 URL
      return `https://${storageConfig.s3.bucket}.s3.${storageConfig.s3.region}.amazonaws.com/${filename}`;
    } else {
      return `/uploads/${filename}`;
    }
  }
};
