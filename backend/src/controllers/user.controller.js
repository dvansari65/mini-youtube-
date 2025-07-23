import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import fs from "fs";
import jwt from "jsonwebtoken";
import imagekit from "../imagekit/imagekit.js";

const registerUser = AsyncHandler(async (req, res) => {
    const { email, fullName, userName, password } = req.body;

    const avatar = req.files?.avatar?.[0];
    const coverImage = req.files.coverImage?.[0];

    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (existedUser) {
        throw new ApiError(401, "User already existed!");
    }
    const uploadedAvatar = await imagekit.upload({
        file: fs.readFileSync(avatar.path),
        fileName: avatar.originalname
    })

    const uploadedCoverImage = await imagekit.upload({
        file: fs.readFileSync(coverImage.path),
        fileName: coverImage.originalname
    })
    console.log("cover image and avatar:",updateAvatar,"::",updateCoverImage)

    if(!uploadedAvatar || !uploadedCoverImage){
        throw new ApiError(500,"images failed to upload!")
    } 
    
    const user = await User.create({
        fullName,
        userName: userName,
        avatar:uploadedAvatar?.url ,
        coverImage:uploadedCoverImage?.url,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(400, "Account not created!");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(200,{
                success:true,
                message:"user created successfully"
            })
        );
});

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "user not found");
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
        s;
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    };
    // console.log("options", options);
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
                    loggedInUser,
                },
                "User successfully logged in"
            )
        );
});

const logOutUser = AsyncHandler(async (req, res) => {
    if (!req.user._id || !req.user) {
        throw new ApiError(401, "user not found");
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    );
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
    };
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User successfully logged out"));
});

const refreshTokenForUser = AsyncHandler(async (req, res) => {
    const InputUserRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;
    //    console.log("userRefreshToken:",InputUserRefreshToken)

    if (!InputUserRefreshToken) {
        throw new ApiError(401, "Inavalid refreshToken given by user");
    }
    try {
        const decodedUserRefreshToken = jwt.verify(
            InputUserRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        console.log("decodedUserRefreshToken :", decodedUserRefreshToken);

        if (!decodedUserRefreshToken) {
            throw new ApiError(401, "Inavalid refreshToken given by user");
        }

        const user = await User.findById(decodedUserRefreshToken?._id);

        if (!user) {
            throw new ApiError(401, "invalid request");
        }
        if (decodedUserRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "tokens not matched with the database!");
        }

        const { newRefreshToken, accessToken } =
            await generateAccessAndRefreshToken(user?._id);

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        };
        // console.log("Cookies set:", res.getHeaders()["set-cookie"]);
        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        refreshToken: newRefreshToken,
                        accessToken,
                        options,
                    },
                    "Refreshtoken created successfully!!"
                )
            );
    } catch (error) {
        throw new ApiError(401, "invalid user");
    }
});

const changeUserPassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(401, "Invalid request");
    }
    const isPasswordValidate = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValidate) {
        throw new ApiError(401, "Invalid password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully!"));
});

const getCurrentUser = AsyncHandler(async (req, res) => {
    const newUser = req.user;
    // console.log("what is in 'req.user:'",req.user)
    // console.log("what is in req.user._id",req.user._id)
    if (!newUser) {
        throw new ApiError(404, "User not found ");
    }
    console.log("user info:", newUser);
    return res
        .status(200)
        .json(new ApiResponse(200, { newUser }, "User found successfully!"));
});

const updateAccountDetails = AsyncHandler(async (req, res) => {
    const { fullName, userName, email } = req.body;

    // Check if another user already has this userName or email
    const existingUser = await User.findOne({
        _id: { $ne: req.user._id },
        $or: [{ userName }, { email }],
    });

    if (existingUser) {
        throw new ApiError(
            400,
            "Username or email already in use. Please use a different one."
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                email,
                fullName,
                userName,
            },
        },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Information updated successfully"));
});

const updateAvatar = AsyncHandler(async (req, res) => {
    const avatarLocalFilePath = req.file?.path;
    if (!avatarLocalFilePath) {
        throw new ApiError(404, "avatar file path  not found  ");
    }
    const userImageAvatar = await uploadOnCloudinary(avatarLocalFilePath);

    if (!userImageAvatar.url) {
        throw new ApiError(404, "avatar file url is required  ");
    }

    let user;
    user = await User.findById(req.user?._id);

    if (user.avatar) {
        const publicId = getPublicIdFromUrl(user.avatar);
        await deleteFromCloudinary(publicId);
    }

    user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: userImageAvatar.url },
        },
        {
            new: true,
        }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "avatar image updated successfully"));
});

const updateCoverImage = AsyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(404, "cover image  file path  not found  ");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImageLocalPath.url) {
        throw new ApiError(404, "cover image file url is required  ");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: coverImage.url },
        },
        {
            new: true,
        }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "cover image image updated successfully"));
});

const getUserChannelProfile = AsyncHandler(async (req, res) => {
    const { userName } = req.params;
    // console.log("req.params => ",req.params)
    if (!userName) {
        throw new ApiError(404, "user not found");
    }
    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subcribers",
                as: "subcribedTo",
            },
        },
        {
            $addFields: {
                subcriberCount: {
                    $size: "$subscribers",
                },
                subscribedToCount: {
                    $size: "$subcribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subcriber"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                userName: 1,
                fullName: 1,
                email: 1,
                subcriberCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
            },
        },
    ]);
    if (!channel || !Array.isArray(channel)) {
        throw new ApiError(404, "channel not found ");
    }
    console.log("channel info:", channel);
    return res
        .status(200)
        .json(new ApiResponse(200, channel, "channel found successfully"));
});
const getWatchHistory = AsyncHandler(async (req, res) => {
    if (!req.user || !req.user?._id) {
        throw new ApiError(401, "unauthorized request!");
    }
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
    ]);
    console.log("user after adding pipeline =>", user);
    if (!user?.length || !Array.isArray(user)) {
        throw new ApiError(404, "there is no watch history ");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "history obtained successfully"));
});
export default registerUser;
export {
    loginUser,
    logOutUser,
    refreshTokenForUser,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    registerUser,
};
