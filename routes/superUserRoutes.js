const { Router } = require("express");
const router = Router();
const {
  addSuperUser,
  getSuperUserDetails,
  superUserLogin,
} = require("../controllers/superUserController");
router.post("/createSuper", addSuperUser);
router.get("/getsuperuser", getSuperUserDetails);
router.post("/superuserlogin", superUserLogin);
module.exports = router;
