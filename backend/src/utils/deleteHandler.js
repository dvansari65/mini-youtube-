
import imagekit from "../imagekit/imagekit.js"


export const deleteFileFromImagekit = async (fileId) => {
    try {
        if (!fileId) {
            console.warn("No URL provided to deleteFileFromImagekit");
            return;
        }
        if (fileId) {
            await imagekit.deleteFile(fileId)
        }
    } catch (error) {
        console.log("failed to delete file!", error)
    }
}
