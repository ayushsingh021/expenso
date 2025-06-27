import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  changeCurrentPassword,
  updateAccountDetails,
  editUserAvatar,
  getCurrentUser,
  getExpenseSummary,
  getCategoryWiseExpense,
  getAllUserExpense
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//routes
router.route("/register").post(
  //middleware --(upload) before running the function it will store in local storage
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secured routes --> user verifyJWT as a middleware after auth then logout will happen
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-current-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/edit-user-avatar").post(verifyJWT, editUserAvatar);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/get-all-user-expenses").get(verifyJWT,getAllUserExpense);
router.route("/expense-summary/time").get(verifyJWT, getExpenseSummary);
router
  .route("/expense-summary/category")
  .get(verifyJWT, getCategoryWiseExpense);

export default router;
