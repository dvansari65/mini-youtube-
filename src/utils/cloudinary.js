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

  function getPublicIdFromUrl(url) {
    // Assuming the Cloudinary URL has the structure:
    // https://res.cloudinary.com/your_cloud/image/upload/v12345678/foldername/filename.jpg
    const parts = url.split('/');
    
    // Get the file name with extension (e.g., "filename.jpg")
    const fileWithExtension = parts.pop();

    // Get the file name without extension (e.g., "filename")
    const fileName = fileWithExtension.split('.')[0];

    // Optionally, get the folder name if used
    const folder = parts[parts.length - 1]; // e.g., "foldername" if using folders in Cloudinary

    return `${folder ? folder + '/' : ''}${fileName}`; // public_id: folder/filename
}

async function deleteFromCloudinary(publicId) {
  try {
      // Call the Cloudinary API to delete the image
      const result = await cloudinary.uploader.destroy(publicId);

      // Check if deletion was successful
      if (result.result === 'ok') {
          console.log('Image deleted successfully from Cloudinary');
      } else {
          console.log('Failed to delete image from Cloudinary');
      }
  } catch (err) {
      console.error('Error deleting from Cloudinary:', err);
  }
}




export{uploadOnCloudinary,deleteFromCloudinary,getPublicIdFromUrl} 