import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGIN!,
  credentials: {
    accessKeyId: process.env.AWS_IAM_KEY!,
    secretAccessKey: process.env.AWS_IAM_SECRET!,
  },
});

export const uploadProjectLogo = (
  projectName: string,
  fileType: string,
  size: number,
  userId: string,
) =>
  new PutObjectCommand({
    Bucket: process.env.AWS_S3_NAME!,
    ContentType: fileType,
    ContentLength: size,
    Key: projectName,
    Metadata: {
      userId: userId,
    },
  });
