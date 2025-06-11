const { addMessage, getAllMessage } = require("../controller/messagesController");
const multer  = require('multer');
const router = require("express").Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
router.post("/addmsg",upload.single('image'),addMessage)
router.post("/getmsg", getAllMessage);


module.exports = router;