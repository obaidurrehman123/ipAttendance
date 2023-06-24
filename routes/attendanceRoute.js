const { Router } = require("express");

const {
  fetchingAttendanceDetails,
} = require("../controllers/attendanceController");
const router = Router();
router.get("/fetchattendence/:id", fetchingAttendanceDetails);
module.exports = router;
