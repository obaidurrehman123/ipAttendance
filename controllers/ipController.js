const { getuserIp } = require("../helpers/gettingIp");
const { ipaddress } = require("../models");
// adding Ip in to database
const addIp = async (req, res) => {
  try {
    const { ip, location } = req.body;
    if (!ip) {
      return res.status(400).json({ message: "ip cannot be empty" });
    }
    if (!location) {
      return res.status(400).json({ message: "location cannot be empty" });
    }
    const createIp = await ipaddress.create({
      ipAddress: ip,
      location: location,
    });
    return res.status(200).json({
      success: true,
      message: "successfully added ip address",
      createIp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in adding ip address",
      error,
    });
  }
};

//getting the ip
const getIp = async (req, res) => {
  try {
    const ipAddressWifi = await getuserIp();
    return res.json({ ipAddress: ipAddressWifi });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting ip address",
      error,
    });
  }
};

// get All Ip's

const getAllIpRecord = async (req, res) => {
  try {
    const allIps = await ipaddress.findAll();
    return res.status(200).json({
      message: "successfully fetched the ip records",
      success: true,
      allIps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getting ip addresses",
      error,
    });
  }
};

// updateIpRecord
const updateApi = async (req, res) => {
  try {
    const ipId = req.params.id;
    const { ip, location } = req.body;
    if (!ipaddress) {
      res.status(400).json({ message: "ip cannot be empty" });
    }
    if (!location) {
      res.status(400).json({ message: "location cannot be empty" });
    }
    await ipaddress.update(
      {
        ipAddress: ip,
        location: location,
      },
      { where: { id: ipId } }
    );
    res.status(200).send({
      status: true,
      message: "Successfully updated the ip record",
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Updating the ip record",
      error,
    });
  }
};
// delete product
const deleteIp = async (req, res) => {
  try {
    const deleteProduct = await ipaddress.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({
      status: true,
      message: "Successfully Deleted the Ip",
      deleteProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Deleting Ip",
    });
  }
};
module.exports = { getIp, addIp, getAllIpRecord, updateApi, deleteIp };
