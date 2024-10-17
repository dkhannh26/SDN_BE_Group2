var express = require("express");
var router = express.Router();
var {
  getTshirtList,
  addTshirt,
  deleteTshirt,
  updateTshirt,
} = require("../controllers/tshirtController");
router.get("/tshirt", getTshirtList);
router.delete("/tshirt/:id", deleteTshirt);
router.post("/tshirt", addTshirt);
router.put("/tshirt/:id", updateTshirt);
module.exports = router;
