import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

interface Event {
  key: string;
}
interface Response {
  prefecture_code: string;
  prefecture: string;
}

export const handler = async (event: Event): Promise<Response> => {
  const awsConfig = {
    endpoint: process.env.S3_ENDPOINT_LOCALSTACK || "",
    region: "ap-northeast-1",
  };
  const s3Client = new S3Client(awsConfig);
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: event.key,
      })
    );
    const stringResponse = await response.Body?.transformToString();
    const objectResponse = JSON.parse(stringResponse as string);
    return objectResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
