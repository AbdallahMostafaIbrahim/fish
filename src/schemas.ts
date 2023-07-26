import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  campaign: { type: mongoose.Types.ObjectId, ref: "Campaign" },
  group: { type: mongoose.Types.ObjectId, ref: "Group" },
});

const groupSchema = new mongoose.Schema({
  name: String,
});

const campaignSchema = new mongoose.Schema({
  name: String,
  webPage: { type: mongoose.Types.ObjectId, ref: "WebPage" },
  groups: [{ type: mongoose.Types.ObjectId, ref: "Group" }],
  status: String,
});

const campaignRunSchema = new mongoose.Schema({
  campaign: { type: mongoose.Types.ObjectId, ref: "Campaign" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  results: {
    credentials: mongoose.Schema.Types.Mixed,
    clickedLink: Boolean,
    submitted: Boolean,
    submittedAt: Date,
  },
});

const webPageSchema = new mongoose.Schema({
  name: String,
  staticPath: String,
});

const adminSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

export const User = mongoose.model("User", userSchema);
export const Campaign = mongoose.model("Campaign", campaignSchema);
export const WebPage = mongoose.model("WebPage", webPageSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const Group = mongoose.model("Group", groupSchema);
export const CampaignRun = mongoose.model("CampaignRun", campaignRunSchema);
