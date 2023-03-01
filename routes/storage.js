import express from "express";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

// Set the AWS Region.
const REGION = "us-east-1";
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("This is tts restAPI.");
});

/* バケットリストを取得 */
router.get("/buckets", async function (req, res, next) {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    const bucketList = data.Buckets.filter((item) => item.Name.startsWith("km-"))
    console.log("Success", data.Buckets);
    res.send(JSON.stringify(bucketList));
  } catch (err) {
    console.log("Error", err);
    res.send(JSON.stringify(err))
  }
});

/* 対象のバケットにあるファイルリストを取得 */
router.get("/:bucket/files", async function (req, res, next) {
  try {
    const { bucket } = req.params;
    const bucketParams = { Bucket: bucket };
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    const fileList = []
    data.Contents.forEach(item => {
      fileList.push(item.Key);
    });
    console.log("Success", data);
    res.send(JSON.stringify(fileList));
  } catch (err) {
    console.log("Error", err);
    res.send(JSON.stringify(err))
  }
});

/* 対象のバケットにある対象ファイルの中身を取得 */
router.get("/:bucket/file/:filename", async function (req, res, next) {
  try {
    const { bucket, filename } = req.params;
    const bucketParams = {
      Bucket: bucket,
      Key: filename,
    };
    console.log(bucketParams)
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    // Convert the ReadableStream to a string.
    const result = await data.Body.transformToString()
    console.log("Success", data);
    res.send(result);
  } catch (err) {
    console.log("Error", err);
  }
});


export default router;
