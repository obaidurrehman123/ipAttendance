const { Router } = require("express");
const {
  authenticateUser,
  checkSupUser,
} = require("../middlewares/superMiddleware");
const {
  createUser,
  fetchingUser,
  deleteUser,
  userLogin,
  updateUserDetails,
  userLogout,
} = require("../controllers/user");
const router = Router();

router.post("/addingUser", authenticateUser, checkSupUser, createUser);
router.get("/fetchingUser/:id", authenticateUser, checkSupUser, fetchingUser);
router.delete("/deleteUser/:id", authenticateUser, checkSupUser, deleteUser);
router.post("/loggedIn", userLogin);
router.put(
  "/updateuser/:id",
  authenticateUser,
  checkSupUser,
  updateUserDetails
);
router.post("/logout", authenticateUser, userLogout);
module.exports = router;
