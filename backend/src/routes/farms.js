const router = require("express").Router()
const farmController = require("../controllers/farmController")
const check = require("express-validator")

router.post("/create-farm", farmController.createFarm)
router.get("/", farmController.getAllData)
router.post("/add-data/:id", farmController.appendFarmData)
router.get("/:id", farmController.getFarmsData)
router.get("/sensors/avg", farmController.getBySensorType)
router.put("/delete-farm/:id", farmController.deleteAllDataFromFarm)
router.get("/row-count/:id", farmController.fetchFromArrayByRange)

module.exports = router