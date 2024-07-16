import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels);
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);

export default router;
