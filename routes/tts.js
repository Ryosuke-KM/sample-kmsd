import express from "express";
import { StartSpeechSynthesisTaskCommand } from "@aws-sdk/client-polly";
import { PollyClient } from "@aws-sdk/client-polly";

// Set the AWS Region.
const REGION = "us-east-1";
// Create an Amazon S3 service client object.
const pollyClient = new PollyClient({ region: REGION });
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("This is tts restAPI.");
});

/* 日本語テキストを送ると、それを読み上げた音声データ.mp3のURLを取得 */
router.post("/save-to-s3", async function (req, res, next) {
  try {
    const result = await pollyClient.send(new StartSpeechSynthesisTaskCommand(req.body));
    console.log("Success", result);
    res.send(JSON.stringify(result.SynthesisTask.OutputUri))
    // res.send(JSON.stringify(bucketList));
  } catch (err) {
    console.log("Error", err);
    res.send(JSON.stringify(err))
  }
});

export default router;
