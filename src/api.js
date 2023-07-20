import { Admin } from "./schemas";
import express from "express";

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.post("/submitCredentials", (req, res) => {
  const body = req.body;
  if (!body.userId) {
    return res.json({ code: 400, message: "No user Id" });
  }
});

apiRouter.post("/admin/login", (req, res) => {
  const body = req.body;
  const admin = Admin.findOne({ email: body.email });
  if (!admin) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const correct = argon2;
});

export default apiRouter;
