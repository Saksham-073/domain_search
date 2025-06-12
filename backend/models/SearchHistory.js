const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  domain: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  searchResult: {
    domain: String,
    available: Boolean,
    registrar: String,
    createdDate: String,
    updatedDate: String,
    expiryDate: String,
    nameServers: [String],
    source: {
      type: String,
      enum: ['internal', 'external'],
      required: true
    },
    provider: String,
    fromCache: Boolean,
    fallback: Boolean,
    error: String,
    apiResponse: String
  },
  apiSource: {
    type: String,
    enum: ['internal', 'external'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

searchHistorySchema.index({ sessionId: 1, timestamp: -1 });
searchHistorySchema.index({ domain: 1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = SearchHistory; 