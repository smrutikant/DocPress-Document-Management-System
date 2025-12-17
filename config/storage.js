require('dotenv').config();

module.exports = {
  type: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'
  local: {
    uploadPath: './uploads'
  },
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.BUCKET || process.env.AWS_BUCKET_NAME,
    endpoint: process.env.S3_ENDPOINT || null, // For S3-compatible storage (e.g., DigitalOcean Spaces, MinIO, etc.)
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' || false
  }
};
