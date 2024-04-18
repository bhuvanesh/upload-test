import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    getSignedUrl,
    S3RequestPresigner,
  } from "@aws-sdk/s3-request-presigner";
  import https from "https";


const createPresignedUrlWithClient = ({ client, command}) => {
    // const creds = {
    //     accessKeyId: accessKeyId,
    //     secretAccessKey: secretAccessKey,
    // };
    // const client = new S3Client({ region:region, credentials:creds});
    // const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
  };

  async function put(url, data) {
    // return new Promise((resolve, reject) => {
    //   const req = https.request(
    //     url,
    //     { method: "PUT", headers: { "Content-Length": new Blob([data]).size } },
    //     (res) => {
    //       let responseBody = "";
    //       res.on("data", (chunk) => {
    //         responseBody += chunk;
    //       });
    //       res.on("end", () => {
    //         resolve(responseBody);
    //       });
    //     },
    //   );
    //   req.on("error", (err) => {
    //     reject(err);
    //   });
    //   req.write(data);
    //   req.end();
    // });
    try{
        const response = await fetch(url, {
            method: 'PUT',
            body: data,
          });
    }catch(e){
        console.log(e)
    }
    

  }
  


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
        // await put(presignUrl, await file.get("file"));
    }catch(err){
        console.log(err, response)
    }finally{
        return presignUrl
    }
    // return presignUrl
  }

//   AWS.config.update({
//     accessKeyId: ENV.ACCESS_KEY_ID,
//     secretAccessKey: ENV.SECRET_ACCESS_KEY,
//     region: ENV.REGION,
//   });

export {createPresignedUrlWithClient, uploadS3new}