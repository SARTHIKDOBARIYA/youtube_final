import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js"; // Assuming you have a Subscription model
import { Like } from "../models/like.model.js"; // Assuming you have a Like model
import { Comment } from "../models/comment.model.js"; // Assuming you have a Comment model
import { Tweet } from "../models/tweet.model.js"; // Assuming you have a Tweet model
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // Ensure the user is authenticated
  if (!req.user?._id) throw new ApiError(401, "Unauthorized request");

  const userId = req.user._id;

  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(userId)
    }
    },
    // Lookup for Subscribers of a channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // Lookup likes for the user's videos
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedVideos",
      },
    },
    // Lookup comments for the user's videos
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    // Group to calculate stats
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalSubscribers: { $first: { $size: "$subscribers" } },
        totalLikes: { $sum: { $size: "$likedVideos" } },
        totalComments: { $sum: { $size: "$videoComments" } },
      },
    },
    // Project the desired fields
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        totalSubscribers: 1,
        totalLikes: 1,
        totalComments: 1,
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, channelStats[0], "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // Ensure the user is authenticated
  if (!req.user?._id) throw new ApiError(401, "Unauthorized request");

  const videos = await Video.find({
    owner: req.user._id,
  });

  if (!videos.length) {
    return res.status(200).json(new ApiResponse(200, [], "No videos found"));
  }

  return res.status(200).json(new ApiResponse(200, videos, "Total videos fetched successfully"));
});

export {
  getChannelStats,
  getChannelVideos,
};
