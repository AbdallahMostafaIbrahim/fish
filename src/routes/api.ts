import express from "express";
import authRouter from "./auth";
import campaignRouter from "./campagins";
import { CampaignRun } from "../schemas";

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.post("/submitCredentials", async (req, res) => {
  const body = req.body;
  if (!body.id) return res.json({ code: 400, message: "Invalid" });

  const exists = await CampaignRun.findById(body.id);
  if (!exists) return res.json({ code: 400, message: "Invalid" });
  if (exists.results?.submitted)
    return res.json({ code: 400, message: "Invalid" });
  await CampaignRun.updateOne(
    { _id: body.id },
    {
      $set: {
        results: {
          credentials: body.credentials,
          submitted: true,
          submittedAt: new Date(),
        },
      },
    }
  );

  return res.json({ code: 200, message: "Success" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/campaigns", campaignRouter);

export default apiRouter;
