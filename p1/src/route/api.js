const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const regCtrl = require("../controller/registrationController");
const { authorizeRole } = require("../middleware/role");
//=====================================================================//

router.post("/register", authController.registerAPI);
router.post("/login", authController.loginAPI);

router.post("/", auth, authorizeRole("student"), regCtrl.registerEvent);
router.delete("/:registrationId", auth, authorizeRole("student"), regCtrl.unregisterEvent);

// Chỉ admin được phép xem và tìm kiếm
router.get("/listRegistrations", auth, authorizeRole("admin"), regCtrl.listRegistrations);
router.get("/getRegistrationsByDate", auth, authorizeRole("admin"), regCtrl.getRegistrationsByDate);

module.exports = router;