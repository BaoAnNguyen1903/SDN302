const express = require("express");
const router = express.Router();
const studioController = require("../controllers/studioController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", authorize("admin"), studioController.getAllStudios);
router.post("/", authorize("admin"), studioController.addStudio);
router.delete("/:studioId", authorize("admin"), studioController.deleteStudio);

module.exports = router;
