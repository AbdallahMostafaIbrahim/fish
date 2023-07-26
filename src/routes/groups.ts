import express from "express";
import csv from "csv-parser";
import { Group, User } from "../schemas";
import authorize from "../authorize";
import streamifier from "streamifier";

const groupRouter = express.Router();

groupRouter.use(authorize);

groupRouter.get("/", async (req, res) => {
  const groups = await Group.find();
  return res.json({ code: 200, groups });
});

groupRouter.get("/:id", async (req, res) => {
  // List First 100 Users
  var page = parseInt(req.query.page?.toString() || "1");
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const group = await Group.findOne({ _id: req.params.id });
  if (!group) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const users = await User.find({ group: req.params.id })
    .skip((page - 1) * 100)
    .limit(100);
  const usersCount = await User.count({ group: req.params.id });
  return res.json({ code: 200, users, group: group, count: usersCount });
});

groupRouter.post("/", async (req, res) => {
  const body = req.body;
  const group = await Group.create({
    name: body.name,
    users: [],
  });
  return res.json({ code: 200, group });
});

groupRouter.post("/:id/csv-import", async (req, res) => {
  const id = req.params.id;
  const fileContent = Buffer.from(req.body.file, "base64").toString("utf-8");
  const results: { name: string; email: string }[] = [];

  const group = await Group.findById(id);
  if (!group) {
    return res.status(404).json({ code: 400, message: "Group not found" });
  }

  streamifier
    .createReadStream(fileContent)
    .pipe(csv({ headers: ["name", "email"] }))
    .on("data", (data: any) => results.push(data))
    .on("end", async () => {
      // The results array now contains the CSV rows as objects
      // Let's add the users to the group
      const promises = results.map((row) => {
        const user = new User({
          name: row.name,
          email: row.email,
          group: group._id,
        });
        return user.save();
      });

      try {
        const users = await Promise.all(promises);
        res.status(200).json({
          message: `Imported ${users.length} users to the group.`,
          code: 200,
        });
      } catch (err) {
        res.status(500).json({
          message: "Error importing users",
          error: (err as any).message,
        });
      }
    });
});

groupRouter.post("/:id/user", async (req, res) => {
  const groupId = req.params.id;
  const { name, email } = req.body;

  try {
    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Create a new user
    const user = new User({ name, email, group: groupId });
    await user.save();

    return res.status(200).json({ code: 200, user });
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
  }
});

export default groupRouter;
