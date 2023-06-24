const { AttendanceStatus, User } = require("../models");

const fetchingAttendanceDetails = async (req, res) => {
  try {
    const userId = req.params.id; // Replace with the actual user ID
    const result = await AttendanceStatus.findAll({
      attributes: ["id", "day", "WorkingHourPerDay", "status"],
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "department"],
          where: { id: userId },
        },
      ],
    });
    res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Fetching details",
      error,
    });
  }
};

module.exports = { fetchingAttendanceDetails };
