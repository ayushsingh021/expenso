import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
//its a middleware so  -> next         --> res is not used so we can use =>  _ (underscore)
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      //One More thing to learn : discuss abt frontend
      throw new ApiError(400, "Invalid Access Token");
    }
    req.user = user; //giving access of req.user to the next func
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
