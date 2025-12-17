const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  revisedBy: {
    type: String,
    required: true
  },
  revisedAt: {
    type: Date,
    default: Date.now
  }
});

const contentSchema = new mongoose.Schema({
  conceptId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  htmlContent: {
    type: String,
    required: true
  },
  rawContent: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['html', 'markdown', 'quill'],
    default: 'quill'
  },
  revisions: [revisionSchema],
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for search
contentSchema.index({ htmlContent: 'text', rawContent: 'text' });

module.exports = mongoose.model('Content', contentSchema);
