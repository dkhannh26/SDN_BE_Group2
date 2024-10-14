var express = require("express");
var router = express.Router();
var {
  getTshirtList,
  addTshirt,
  deleteTshirt,
  updateTshirt,
} = require("../controllers/tshirtController");
router.get("/tshirt", getTshirtList);
router.delete("/tshirt/delete/:id", deleteTshirt);
router.post("/tshirt/create", addTshirt);
router.put("/tshirt/update", updateTshirt);
module.exports = router;
