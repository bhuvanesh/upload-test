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

  const [fileInput, setFileInput] = useState("");

  const handleFileChange = (e) =>{
    if (e.target.files) {
        setFileInput(e.target.files[0]);
      }
  }

  const handleFileUpload = async (event) => {
    // const file = event.target.files[0];
    // console.log(file);
    const formData = new FormData();
    formData.append("file", fileInput);
    const filePath = `112233_${fileInput.name}`; // Include projectid in the filename

    try {

      const objectUrl = await uploadS3new(formData, filePath, ENV);

      // Handle the enhanced image response here
      console.log("Uploaded File:", fileInput.name, objectUrl);
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
            // value={fileInput}
            onChange={handleFileChange}
          />
          <button
            type="button"
            name="_action"
            value="upload"
            disabled={transition.state === "submitting"}
            onClick={handleFileUpload}
          >
            Upload
          </button>
          {/* <button type="submit">submit</button> */}
        </Form>
      </div>
    </div>
  );
}
