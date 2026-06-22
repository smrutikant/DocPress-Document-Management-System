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
    required: function() {
      return this.contentType !== 'pdf';
    },
    default: ''
  },
  rawContent: {
    type: String,
    required: function() {
      return this.contentType !== 'pdf';
    },
    default: ''
  },
  contentType: {
    type: String,
    enum: ['html', 'markdown', 'quill', 'pdf'],
    default: 'quill'
  },
  // For PDF content type
  pdfUrl: {
    type: String,
    required: function() {
      return this.contentType === 'pdf';
    }
  },
  pdfFilename: {
    type: String,
    required: function() {
      return this.contentType === 'pdf';
    }
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
