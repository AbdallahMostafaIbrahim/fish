import express from "express";
import config from "../config.json" assert { type: "json" };
import { connect } from "mongoose";
import apiRouter from "./api.js";
import cors from "cors";
import path from "path";

await connect("mongodb://127.0.0.1:27017/fish");

const app = express();

app.use(cors());

app.use(config.basePath, express.static(path.join(process.cwd(), "./public/")));

app.use("/api", apiRouter);

// app.get("*", (req, res) => {
//   res.redirect(config.basePath);
// });

app.listen(8000, () => {
  console.log("Server Listening on port 80");
});
