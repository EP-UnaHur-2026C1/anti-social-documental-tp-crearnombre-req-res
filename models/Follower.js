const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

followerSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follower = mongoose.model("Follower", followerSchema);

module.exports = Follower;
