// models/watchHistory.model.js

import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  watchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  watchedAt: {
    type: Date,
    default: Date.now,
  },
});

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

export { WatchHistory };
