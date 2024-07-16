import mongoose from 'mongoose';
import { WatchHistory } from '../models/watchHistory.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId ,userId} = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid video ID');
  }
  const user = await  User.findById(userId)
  if(!user){
    const notfound = new ApiResponse(404,null,'User not found')
    return res.json(notfound)
  }
  const watchHistory = await WatchHistory.create({ video: videoId, watchedBy: userId });
  user.watchHistory.push(watchHistory._id)
  user.save()
  return res.status(201).json(new ApiResponse(201, watchHistory, 'Video added to watch history successfully'));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const {userId}=req.params;
  const watchHistory = await WatchHistory.find({ watchedBy: userId }).populate('video');

  if (!watchHistory.length) {
    return res.status(200).json(new ApiResponse(200, [], 'No watch history found'));
  }

  return res.status(200).json(new ApiResponse(200, watchHistory, 'Watch history fetched successfully'));
});

// Optionally, you can add a function to clear watch history
const clearWatchHistory = asyncHandler(async (req, res) => {
  await WatchHistory.deleteMany({ watchedBy: req.user._id });

  return res.status(200).json(new ApiResponse(200, {}, 'Watch history cleared successfully'));
});

export {
  addVideoToWatchHistory,
  getWatchHistory,
  clearWatchHistory,
};
