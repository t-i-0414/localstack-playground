import * as dotenv from "dotenv";
dotenv.config();

import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import { handler } from "../../../src/lambda/handlers/sample-localstack";

const awsConfig = {
  endpoint: "https://s3.localhost.localstack.cloud:4566",
  region: "ap-northeast-1",
};

const s3Client = new S3Client(awsConfig);
describe("正常系", () => {
  const event = {
    key: "sample/value1",
  };

  beforeAll(async () => {
    await s3Client.send(
      new CreateBucketCommand({ Bucket: "sample-get-object-from-s3" })
    );
    await s3Client.send(
      new PutObjectCommand({
        Body: fs.readFileSync(path.join(__dirname, "test-data.json")),
        Bucket: "sample-get-object-from-s3",
        Key: "sample/value1",
      })
    );
  });
  afterAll(async () => {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "sample-get-object-from-s3",
        Key: "sample/value1",
      })
    );
    await s3Client.send(
      new DeleteBucketCommand({ Bucket: "sample-get-object-from-s3" })
    );
  });

  test("テストデータのオブジェクトを返却する事を確認", async () => {
    const response = await handler(event);
    expect(response).toHaveProperty("prefecture_code");
    expect(response.prefecture_code).toBe("001");
    expect(response).toHaveProperty("prefecture");
    expect(response.prefecture).toBe("北海道");
  });
});
