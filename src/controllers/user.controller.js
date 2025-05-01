import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import fs from "fs";

const registerUser = AsyncHandler(async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const { email, fullName, userName, password } = req.body;
    console.log("email", email);

    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    if (existedUser) {
        throw new ApiError(400, "User already existed!");
    }

    let coverImageLocalFilePath = null;
    let coverImage = null;

    // Check if coverImage was uploaded
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalFilePath = req.files.coverImage[0].path;
        coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
    }

    if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatarLocalFilePath = req.files.avatar[0].path;
    console.log("avatarlocalFilepath", avatarLocalFilePath);

    if (!fs.existsSync(avatarLocalFilePath)) {
        throw new ApiError(400, "Avatar file is required");
    }

    console.log("Uploading avatar from path:", avatarLocalFilePath);

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    console.log("given avatar is", avatar);
    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(400, "Account not created!");
    }
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User account registered successfully")
    );
});

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404,"user not found")
        }
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(500, "Tokens not generated");
    }
};

const loginUser = AsyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        throw new ApiError(400, "Enter email and password");
    }
    const user = await User.findOne({ userName });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };
    console.log("options", options);
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                    loggedInUser
                },
                "User successfully logged in"
            )
        );
});

const logOutUser = AsyncHandler(async (req, res) => {

    if(!req.user._id || !req.user){
        throw new ApiError(401,"user not found")
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    );
    const options = {
        httpOnly: true,
        secure: true
    };
    return res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "User successfully logged out")
        );
});

export default registerUser;
export { loginUser, logOutUser };