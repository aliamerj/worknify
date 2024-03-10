import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.S3_REGIN!,
  credentials: {
    accessKeyId: process.env.IAM_KEY!,
    secretAccessKey: process.env.IAM_SECRET!,
  },
});

export const uploadProjectLogo = (
  logoName: string,
  fileType: string,
  size: number,
  userId: string,
) =>
  new PutObjectCommand({
    Bucket: process.env.S3_NAME!,
    ContentType: fileType,
    ContentLength: size,
    Key: logoName,
    Metadata: {
      userId: userId,
    },
  });
export const deleteProjectLogo = (logoName: string) =>
  new DeleteObjectCommand({
    Bucket: process.env.S3_NAME!,
    Key: logoName,
  });
