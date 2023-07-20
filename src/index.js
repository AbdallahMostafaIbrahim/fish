import express from "express";
import { basePath } from "../config.json";
import { connect } from "mongoose";
import apiRouter from "./api";

await connect("mongodb://127.0.0.1:27017/fish");

const app = express();

app.get(basePath, (req, res) => {
  res.send("Hello");
});

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.redirect(basePath);
});

app.listen(80, () => {
  console.log("Server Listening on port 80");
});
