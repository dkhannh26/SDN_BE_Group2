var express = require("express");
var router = express.Router();
var {
  getTshirtList,
  addTshirt,
  deleteTshirt,
  updateTshirt,
  getTshirt,
  uploadTshirtImg
} = require("../controllers/tshirt.controller");

var {
  getPantList,
  addPant,
  deletePant,
  updatePant,
  getPant,
  uploadPantImg
} = require("../controllers/pant.controller");

var {
  getAccessoryList,
  addAccessory,
  deleteAccessory,
  updateAccessory,
  getAccessory,
  uploadAccessoryImg
} = require("../controllers/accessory.controller");


var {
  getShoesList,
  addShoes,
  deleteShoes,
  updateShoes,
  getShoes,
  uploadShoesImg
} = require("../controllers/shoes.controller");

router.get("/tshirt", getTshirtList);
router.get("/tshirt/:id", getTshirt);
router.delete("/tshirt/:id", deleteTshirt);
router.post("/tshirt/upload/:id", uploadTshirtImg);
router.post("/tshirt", addTshirt);
router.put("/tshirt/:id", updateTshirt);

router.get("/pant", getPantList);
router.get("/pant/:id", getPant);
router.delete("/pant/:id", deletePant);
router.post("/pant/upload/:id", uploadPantImg);
router.post("/pant", addPant);
router.put("/pant/:id", updatePant);

router.get("/accessory", getAccessoryList);
router.get("/accessory/:id", getAccessory);
router.delete("/accessory/:id", deleteAccessory);
router.post("/accessory/upload/:id", uploadAccessoryImg);
router.post("/accessory", addAccessory);
router.put("/accessory/:id", updateAccessory);

router.get("/shoes", getShoesList);
router.get("/shoes/:id", getShoes);
router.delete("/shoes/:id", deleteShoes);
router.post("/shoes/upload/:id", uploadShoesImg);
router.post("/shoes", addShoes);
router.put("/shoes/:id", updateShoes);
module.exports = router;
