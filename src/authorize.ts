// Middleware to authorize with express session
import { NextFunction, Request, Response } from "express";
import { Admin } from "./schemas";

export default async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return res.json({ code: 400, message: "Invalid" });
  }
  const admin = await Admin.findOne({ _id: req.session.userId });
  if (!admin) {
    return res.json({ code: 400, message: "Invalid" });
  }
  req.user = admin.toObject();
  next();
}
