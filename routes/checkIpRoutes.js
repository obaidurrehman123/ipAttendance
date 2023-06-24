const { Router } = require("express");
const {
  getIp,
  addIp,
  getAllIpRecord,
  updateApi,
  deleteIp,
} = require("../controllers/ipController");
const router = Router();

router.get("/checkiproute", getIp);
router.post("/addingip", addIp);
router.get("/getAllIpRecord", getAllIpRecord);
router.put("/updateIp/:id", updateApi);
router.delete("/deleteIp/:id", deleteIp);
module.exports = router;
