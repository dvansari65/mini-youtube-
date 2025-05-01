import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) {
        console.log("No local file path provided.");
        return null;
      }
  
      console.log("Attempting to upload to Cloudinary:", localFilePath);
  
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
  
      console.log("Cloudinary upload successful. Response:", response);
  
      fs.unlinkSync(localFilePath); // delete local file
      return response;
  
    } catch (error) {
      console.error("Cloudinary upload failed. Error:", error);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath); // cleanup
        console.log("Local file deleted after failure.");
      }
      return null;
    }
  };
  



export default uploadOnCloudinary