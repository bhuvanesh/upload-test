import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    getSignedUrl
  } from "@aws-sdk/s3-request-presigner";
  import https from "https";


const createPresignedUrlWithClient = ({ client, command}) => {
    return getSignedUrl(client, command, { expiresIn: 3600 });
  };

  const uploadS3new = async (file, filePath, ENV)=>{
    const creds = {
        accessKeyId: ENV.ACCESS_KEY_ID,
        secretAccessKey: ENV.SECRET_ACCESS_KEY,
    };
    const client = new S3Client({ region:ENV.REGION, credentials:creds});
    const command = new PutObjectCommand({ Bucket: ENV.BUCKET_NAME, Key: filePath });

    const presignUrl = await createPresignedUrlWithClient({client:client, command:command})
    try{
        console.log("Calling PUT using presigned URL with client");
        const response = await fetch(presignUrl, {
            method: 'PUT',
            body: await file.get("file"),
          });

    if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }
      else{
        console.log("Upload Success")
      }

    }catch(err){
        console.log(err, response)
    }finally{
        const objectUrl = `https://${ENV.BUCKET_NAME}.s3.${ENV.REGION}.amazonaws.com/${ENV.fileName}`;
        return objectUrl;
    }
    // return presignUrl
  }


export {uploadS3new}