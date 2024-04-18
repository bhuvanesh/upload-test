import {
  useLoaderData,
  useActionData,
  Form,
  json,
  redirect,
  Link,
  useNavigation,
  useMatches,
} from "@remix-run/react";
import { useState } from "react";
import { uploadFileToS3 } from "../utils/s3-utils";
import { uploadS3new } from "../utils/s3-utils-v3";

export default function UploadForm() {
  const transition = useNavigation();
  const matches = useMatches();
  // console.log(matches)
  const { ENV } =
    matches.find((route) => route.id === "routes/upload")?.data || {};
  console.log("Inside upload form......");
  console.log(ENV);
  const [fileInputValue, setFileInputValue] = useState("");

  //   const  handleUpload = async (e)=>{
  //         console.log('inside handleupload')
  //         console.log(e.target, 8999)
  //         const file = e.target
  //         console.log(file)

  //         const arrayBuffer = await file.arrayBuffer();
  //         const buffer = Buffer.from(arrayBuffer);
  // const filePath = `112233_${file.name}`; // Include projectid in the filename
  //         // const objectUrl = await uploadFileToS3(buffer, filePath);
  //   }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    const filePath = `112233_${file.name}`; // Include projectid in the filename

    try {
      //   const response = await axios.post('/api/enhance-image', formData);
      // const objectUrl = await uploadFileToS3(formData, filePath, ENV);
    //   const objectUrl = await createPresignedUrlWithClient({
    //     region: ENV.REGION,
    //     bucket: ENV.BUCKET_NAME,
    //     key: "testfile009",
    //     accessKeyId: ENV.ACCESS_KEY_ID,
    //     secretAccessKey: ENV.SECRET_ACCESS_KEY,
    //   });
      const objectUrl = await uploadS3new(formData, filePath, ENV);

      // Handle the enhanced image response here
      console.log("Enhanced image:", file.name, objectUrl);
      // Update state or display the enhanced image
    } catch (error) {
      console.error("Error enhancing image:", error);
    }
  };

  return (
    <div>
      <h1>upload form activated</h1>
      <div>
        <Form method="post" encType="multipart/form-data" className="mb-8">
          <input type="hidden" name="userId" value={112233} />
          <input type="hidden" name="projectid" value={332211} />

          <input
            type="file"
            name="file"
            accept="application/pdf"
            className="mb-4"
            value={fileInputValue}
            onChange={handleFileUpload}
          />
          <button
            type="button"
            name="_action"
            value="upload"
            disabled={transition.state === "submitting"}
            // onClick={handleUpload}
          >
            Upload
          </button>
          <button type="submit">submit</button>
        </Form>
      </div>
    </div>
  );
}
