import express from "express";
import { Admin } from "../schemas";
import argon2 from "argon2";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const body = req.body;
  const admin = await Admin.findOne({ email: body.email });
  if (!admin) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const correct = await argon2.verify(admin.password!, body.password);
  if (!correct) {
    return res.json({ code: 400, message: "Invalid" });
  }
  req.session.userId = admin._id.toString();
  return res.json({
    code: 200,
    message: "Success",
    user: {
      email: admin.email,
      name: admin.name,
      id: admin._id,
    },
  });
});

authRouter.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const admin = await Admin.findOne({ _id: req.session.userId });
  if (!admin) {
    return res.json({ code: 400, message: "Invalid" });
  }
  return res.json({
    code: 200,
    user: {
      email: admin.email,
      name: admin.name,
      id: admin._id,
    },
  });
});

authRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ code: 400, message: "Invalid" });
    }
    return res.json({ code: 200, message: "Success" });
  });
});

export default authRouter;
