import UploadForm from "../components/UploadForm";
import {json} from '@remix-run/node'

export default function UploadCustom(){
    return (
        <div >
          <h1>Welcome to upload route</h1>
         <h1>Just checking</h1>
         <UploadForm/>
        </div>
      );
}

// const REGION = process.env.AWS_S3_REGION;
// const ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
// const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export function loader(){
  const ENV = {
    REGION: process.env.AWS_S3_REGION,
    ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
    BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  }

  return json({ENV})
}