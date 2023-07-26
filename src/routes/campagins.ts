import express from "express";
import { Campaign, CampaignRun, User } from "../schemas";
import authorize from "../authorize";

const campaignRouter = express.Router();

campaignRouter.use(authorize);

campaignRouter.get("/", async (req, res) => {
  const campaigns = await Campaign.find();
  return res.json({ code: 200, campaigns });
});

campaignRouter.get("/:id", async (req, res) => {
  const campaign = await Campaign.findOne({ _id: req.params.id });
  if (!campaign) {
    return res.json({ code: 400, message: "Invalid" });
  }
  return res.json({ code: 200, campaign });
});

campaignRouter.post("/", async (req, res) => {
  const body = req.body;
  const campaign = await Campaign.create({
    name: body.name,
    groups: [],
    users: [],
  });
  return res.json({ code: 200, campaign });
});

campaignRouter.put("/:id/addGroup", async (req, res) => {
  const body = req.body;
  const campaign = await Campaign.findOne({ _id: req.params.id });
  if (!campaign) {
    return res.json({ code: 400, message: "Invalid" });
  }
  campaign.groups.push(body.group);
  await campaign.save();
  return res.json({ code: 200, campaign });
});

campaignRouter.put("/:id/removeGroup", async (req, res) => {
  const body = req.body;
  const campaign = await Campaign.findOne({ _id: req.params.id });
  if (!campaign) {
    return res.json({ code: 400, message: "Invalid" });
  }
  campaign.groups = campaign.groups.filter((g) => g !== body.group);
  await campaign.save();
  return res.json({ code: 200, campaign });
});

campaignRouter.post("/:id/start", async (req, res) => {
  const id = req.params.id;
  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const users = await User.find({ group: { $in: campaign.groups } });
  const promises = users.map((user) => {
    return CampaignRun.create({
      campaign: id,
      user: user._id,
      results: {
        submitted: false,
      },
    });
  });
  await Promise.all(promises);

  return res.json({ code: 200, message: "Success" });
});

export default campaignRouter;
