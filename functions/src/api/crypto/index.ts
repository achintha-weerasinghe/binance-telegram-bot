import * as functions from "firebase-functions";
import * as express from "express";
import { logger } from "firebase-functions";
import { BotActions } from "./bot-actions";

export const cryptoRouter = express.Router();

const {
  token: BOT_TOKEN,
  region: REGION,
  projectid: PROJECT_ID,
} = functions.config().crypto;

const botActions = new BotActions(BOT_TOKEN, REGION, PROJECT_ID);
botActions.init();

cryptoRouter.post(`/bot${BOT_TOKEN}`, async (req: express.Request, res: express.Response) => {
  const body = req.body;

  if (!body) {
    return res.status(200).send({ success: true });
  }

  try {
    await botActions.handleUpdate(body);
  } catch (error) {
    logger.error("ERROR WHILE HANDLING UPDATE", error);
  }

  return res.status(200).send({ success: true });
});

cryptoRouter.get("*", async (req: express.Request, res: express.Response) => {
  res.status(404).send("Not found");
});
