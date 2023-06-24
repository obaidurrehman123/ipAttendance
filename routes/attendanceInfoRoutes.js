const { Router } = require("express");

const router = Router();
const {
  attendanceInfoController,
  attendanceStatusController,
} = require("../controllers/attendanceInfoController");
router.get("/attendanceInfoThirdApi", attendanceInfoController);
router.post("/showAttendance", attendanceStatusController);
module.exports = router;
