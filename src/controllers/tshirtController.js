const Tshirt = require("../models/tshirts");
const Image = require("../models/images");
const Pant_shirt_size_detail = require("../models/pant_shirt_size_detail");
const Pant_shirt_size = require("../models/pant_shirt_sizes");
const Discounts = require("../models/discounts")
const { uploadMultipleFiles } = require("../services/fileService");

const getTshirtList = async (req, res) => {
  try {
    let result = []
    let tshirts = await Tshirt.find({ deleted: false });

    for (const tshirt of tshirts) {
      let tshirtImg = await Image.find({ tshirt_id: tshirt._id });
      let { _id, name, price } = tshirt;
      let imageUrl = `/images/upload/${_id}/${tshirtImg[0]._id}${tshirtImg[0].file_extension}`;

      let tshirtDiscount = await Discounts.findById(tshirt.discount_id)

      let item = {
        tshirtId: _id,
        tshirtName: name,
        tshirtPrice: price,
        tshirtImg: imageUrl,
        tshirtDiscountPercent: tshirtDiscount?.percent
      };

      result.push(item);
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

const addTshirt = async (req, res) => {
  try {
    const { name, quantity, price, size, discount_id } = req.body;
    // let tshirt = await Tshirt.create({ name, quantity, price });
    // let imgUrl = [];
    // let imgPath = [];

    // if (req.files || Object.keys(req.files).length !== 0) {
    //   if (!Array.isArray(req.files.image)) {
    //     req.files.image = [req.files.image];
    //   }
    //   let results = await uploadMultipleFiles(req.files.image, tshirt);

    //   results.detail.forEach((r) => {
    //     imgPath.push(r.path);
    //     imgUrl.push(r.name);
    //   });

    // }



    for (let key in size) {
      const sizeModel = await Pant_shirt_size.findOne({ size_name: key })
      Pant_shirt_size_detail.create({ tshirt_id: tshirt._id, size_id: sizeModel._id, quantity: size[key] })
    }

    // return res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

const deleteTshirt = async (req, res) => {
  try {
    const id = req.params.id;
    let tshirt = await Tshirt.findOneAndUpdate({ _id: id }, { deleted: true });
    return res.status(200).json({ tshirt, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

const updateTshirt = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

module.exports = { getTshirtList, addTshirt, deleteTshirt, updateTshirt };
