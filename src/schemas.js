import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  campaign: { type: mongoose.Types.ObjectId, ref: "Campaign" },
  results: {
    credentials: mongoose.Schema.Types.Mixed,
    clickedLink: Boolean,
    submitted: Boolean,
  },
});

const campaignSchema = new mongoose.Schema({
  name: String,
  webPage: { type: mongoose.Types.ObjectId, ref: "WebPage" },
});

const webPageSchema = new mongoose.Schema({
  name: String,
  staticPath: String,
});

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

export const User = mongoose.model("User", userSchema);
export const Campaign = mongoose.model("Campagin", campaignSchema);
export const WebPage = mongoose.model("WebPage", webPageSchema);
export const Admin = mongoose.model("Admin", adminSchema);
