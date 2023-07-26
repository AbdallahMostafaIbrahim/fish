import "./types";
import express from "express";
import { connect } from "mongoose";
import apiRouter from "./routes/api";
import cors from "cors";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";
import argon2 from "argon2";
import { Admin } from "./schemas";
dotenv.config();

const main = async () => {
  await connect("mongodb://127.0.0.1:27017/fish");

  const app = express();

  app.use(cors({ credentials: true, origin: "*" }));

  app.use(
    session({
      secret: process.env.COOKIE_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use(
    "/common/oauth2/v2.0/authorize",
    express.static(path.join(process.cwd(), "./public/"))
  );

  app.use("/api", apiRouter);

  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server Listening on port ${process.env.PORT || 8000}`);
  });

  async function init() {
    const count = await Admin.count();
    if (count === 0) {
      const admin = await Admin.create({
        email: process.env.ADMIN_EMAIL,
        name: process.env.ADMIN_NAME,
        password: await argon2.hash(process.env.ADMIN_PASSWORD!),
      });
      console.log("Created admin", "(" + admin.email + ")");
    }
  }

  init();
};

main();
