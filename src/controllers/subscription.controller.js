import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscriptionCheck = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id,
    });

    if (subscriptionCheck) {
        await subscriptionCheck.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Subscription Removed Successfully"));
    }

    const createSubscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user?._id,
    });

    return res.status(200).json(new ApiResponse(200, createSubscription, "Congratulations! You have Successfully Subscribed to this channel"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "fullName email username avatar coverImage");

    return res.status(200).json(new ApiResponse(200, { subscribers }, "Subscribers fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "fullName email username avatar coverImage");

    return res.status(200).json(new ApiResponse(200, { subscribedChannels }, "Subscribed channels fetched successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
};
