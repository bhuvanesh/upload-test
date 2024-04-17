import AWS from 'aws-sdk';
import {useMatches} from '@remix-run/react'


const generatePresignedUrl = async (fileName, ENV, s3) => {
  const params = {
    Bucket: ENV.BUCKET_NAME,
    Key: fileName,
    Expires: 60, // URL expiration time in seconds
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

const uploadFileToS3 = async (file, fileName, ENV) => {
    // const matches = useMatches()
    console.log('inside uploadAWS')
    // console.log(matches)
    // const {ENV} = matches.find(route => route.id === 'routes/upload')?.data || {}
    AWS.config.update({
        accessKeyId: ENV.ACCESS_KEY_ID,
        secretAccessKey: ENV.SECRET_ACCESS_KEY,
        region: ENV.REGION,
      });
      
      const s3 = new AWS.S3();
  try {
    const presignedUrl = await generatePresignedUrl(fileName, ENV, s3);

    console.log("presigned:ok - ", presignedUrl)

    console.log(file)
    console.log(file.get("file"))

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: await file.get("file"),
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }

    const objectUrl = `https://${ENV.BUCKET_NAME}.s3.${ENV.REGION}.amazonaws.com/${ENV.fileName}`;
    return objectUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};
// Function to list the contents of a user-specific folder in an S3 bucket


export { uploadFileToS3 };