import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    //tokens generated
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

//byDefault cookies are modifiable and anywhere but whenever httpOnly is true -->Cookies can only be modifiable by server
const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  //logic
  // get user details from frontend
  // validation - not empty
  // check if user already exists -- username, email
  // check for images and check for avatar
  // upload them to cloudinary -- avatar
  // create user object, create entry in db
  // remove password and refresh tokens field form response
  // check for user creation
  // return response

  // 1. get user details from frontend
  //if data coming from form or json then we will get it in req.body() and if from urlencoded form then we will get it in req.body
  const { fullName, email, username, password } = req.body;

  // 2.validation - not empty
  //   if(fullName === ""){
  //     throw new ApiError(400 , "fullName is required")
  //   }

  //cool way
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //3. check if user already exists -- username, email if any of username or email same then duplicate user
  // "User" -- model is directly connected to mongoose by this User and can be accessed

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }
  //4. check for images and check for avatar
  //multer gives access of req.files

  //   console.log(req.files);
  //   console.log(req.body)

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  // 5.upload them to cloudinary -- avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //   console.log(avatar);

  //6. create user object, create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //7. remove password and refresh tokens field form response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8.check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  //9. return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //1. req. body -- > body
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  // 2.username or email
  // checks if anyone of user name or email matches
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //3.find the user
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //4.password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  //5.access and refresh token -- tokens generated and stored at the time of login
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // all except password and refreshtoken

  //6.send cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      //in res of req we will get new updated value
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { newRefreshToken, accessToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const editUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, " Avatar file is missing");
  }

  //delete old image ->need to create a delete from cloudinary utility

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading new avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated Successfully"));
});

const getAllUserExpense = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const expenses = await Expense.find({ userId }).sort({ transactionDate: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "All expenses fetched successfully"));
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const now = dayjs();
  const startOfWeek = now.startOf("week").toDate();
  const startOfMonth = now.startOf("month").toDate();
  const startOfYear = now.startOf("year").toDate();

  const [weekly, monthly, yearly] = await Promise.all([
    Expense.aggregate([
      { $match: { userId, transactionDate: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { userId, transactionDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { userId, transactionDate: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const result = {
    weeklyExpense: weekly[0]?.total || 0,
    monthlyExpense: monthly[0]?.total || 0,
    yearlyExpense: yearly[0]?.total || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Expense summary fetched"));
});

const getCategoryWiseExpense = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const categorySummary = await Expense.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const formatted = categorySummary.map((item) => ({
    category: item._id,
    total: item.total,
    count: item.count,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, formatted, "Category-wise expense summary fetched")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  editUserAvatar,
  getExpenseSummary,
  getCategoryWiseExpense,
  getAllUserExpense,
};
