const e = require("express");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { calculatingtime } = require("../helpers/ExternalApi");
const {
  ipaddress,
  attendanceinformation,
  attendancerecordinfo,
} = require("../models");
const attendanceInfoController = async (req, res) => {
  try {
    let attendance = null;
    const emailData = await calculatingtime();
    const emails = emailData.map((data) => data.email);
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const ipHours = emailData[i].ipHours;
      if (ipHours) {
        const ips = Object.keys(ipHours);
        for (let j = 0; j < ips.length; j++) {
          const ip = ips[j];
          const ipHourData = ipHours[ip];
          const ipHoursValues = JSON.parse(ipHourData);
          const hours = ipHoursValues.hours;
          const minutes = ipHoursValues.minutes;
          const minutesValue = hours * 60 + minutes;
          const ipCheck = await ipaddress.findOne({
            where: { ipAddress: ip },
          });
          const location = ipCheck ? ipCheck.location : "remote";
          attendance = await attendanceinformation.create({
            email: email,
            ip: ip,
            location: location,
            duration: minutesValue,
          });
          // console.log(email, ip, hours, minutes, minutesValue, location)
        }
      }
    }
    return res.status(200).json({
      success: true,
      message: "Successfully added the data",
      attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting information",
      error: error.message,
    });
  }
};
const isOfficeLocation = (location) => {
  const officeLocations = [
    "pf4-groundfloor",
    "pf1-firstfloor",
    "pf1-secondfloor",
  ];
  return officeLocations.includes(location);
};
const attendanceStatusController = async (req, res) => {
  try {
    const distinctEmail = await attendanceinformation.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("email")), "email"]],
    });
    for (const { email } of distinctEmail) {
      const attendanceData = await attendanceinformation.findAll({
        attributes: [
          [
            Sequelize.fn("SUM", Sequelize.col("duration")),
            "totalAttendanceDuration",
          ],
          "location",
        ],
        where: {
          email: email,
          createdAt: {
            [Op.gte]: new Date().setHours(0, 0, 0, 0),
            [Op.lte]: new Date().setHours(23, 59, 59, 999),
          },
        },
        group: ["location"],
      });
      console.log(`Attendance data for email: ${email}`);
      let remoteTotalMinutes = 0;
      let officeTotalMinutes = 0;
      attendanceData.forEach((attendance) => {
        const { totalAttendanceDuration, location } = attendance.dataValues;
        if (location === "remote") {
          remoteTotalMinutes += parseInt(totalAttendanceDuration);
        } else if (isOfficeLocation(location)) {
          officeTotalMinutes += parseInt(totalAttendanceDuration);
        }
      });
      let totHours = (remoteTotalMinutes + officeTotalMinutes) / 60;
      totHours = parseFloat(totHours.toFixed(2));
      let officeTotalHours = officeTotalMinutes / 60;
      officeTotalHours = parseFloat(officeTotalHours.toFixed(2));

      let attendanceStatus = "absent";

      if (totHours >= 7.5) {
        if (officeTotalHours <= 3) {
          attendanceStatus = "absent";
        } else if (officeTotalHours > 3 && officeTotalHours < 5) {
          attendanceStatus = "halfday";
        } else if (officeTotalHours > 5) {
          attendanceStatus = "present";
        }
      }
      console.log("attendance status:", attendanceStatus);
      console.log("total hours:", totHours);
      const existingAttenStatus = await attendancerecordinfo.findOne({
        where: { email: email, date: new Date().setHours(0, 0, 0, 0) },
      });
      if (existingAttenStatus) {
        await attendancerecordinfo.update(
          { status: attendanceStatus, workinghoursperday: totHours },
          { where: { id: existingAttenStatus.id } }
        );
      } else {
        await attendancerecordinfo.create({
          email: email,
          status: attendanceStatus,
          date: new Date().setHours(0, 0, 0, 0),
          day: new Date().toLocaleString("en-US", { weekday: "long" }),
          workinghoursperday: totHours,
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Successfully added the data",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Not updated attendance Successfully",
      error,
    });
  }
};

module.exports = { attendanceInfoController, attendanceStatusController };
