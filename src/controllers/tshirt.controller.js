const Tshirt = require("../models/tshirts");
const Image = require("../models/images");
const Pant_shirt_size_detail = require("../models/pant_shirt_size_detail");
const Pant_shirt_sizes = require("../models/pant_shirt_sizes");
const Discounts = require("../models/discounts")
const { uploadMultipleFiles } = require("../services/fileService");
const mongoose = require('mongoose');
const Images = require("../models/images");

const getTshirtList = async (req, res) => {
  try {
    let result = []
    let tshirts = await Tshirt.find({ deleted: false });


    for (const tshirt of tshirts) {
      let tshirtImg = await Image.find({ tshirt_id: tshirt._id });

      let { _id, name, price } = tshirt;
      let tshirtDiscount = await Discounts.findById(tshirt.discount_id)
      let imageUrl = `/images/upload/${_id}/${tshirtImg[0]?._id}${tshirtImg[0]?.file_extension}`;

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
    console.error(error);
    res.status(404).json({ error });
  }
};


const getTshirt = async (req, res) => {
  const tshirt = await Tshirt.findById(req.params.id)
  const { name, price, discount_id } = tshirt

  const discount = await Discounts.findById(discount_id)

  const sizes = await Pant_shirt_size_detail.find({ tshirt_id: tshirt._id })
  let sizeResult = []


  for (const item of sizes) {
    const size = await Pant_shirt_sizes.findOne({ _id: item.size_id });

    sizeResult.push({
      [size.size_name]: item.quantity
    });
  }

  const images = await Images.find({ tshirt_id: tshirt._id })
  const imagesResult = []


  for (let img of images) {

    imagesResult.push({
      tshirt_id: img.tshirt_id,
      img_id: img._id,
      file_extension: img.file_extension
    })
  }

  const result = {
    name: name,
    price: price,
    discount: {
      discount_id: discount?._id,
      percent: discount?.percent
    },
    size: sizeResult,
    images: imagesResult
  }

  res.status(200).json(result)

}

const addTshirt = async (req, res) => {
  let tshirtID //biến trả về cho FE để gọi api post hình
  try {
    let { name, price, size, discount_id } = req.body;
    let tshirt = await Tshirt.create({ name, price, discount_id });
    tshirtID = tshirt._id
    discount_id = new mongoose.Types.ObjectId(discount_id);

    if (size) {
      for (let key in size) {
        const sizeModel = await Pant_shirt_sizes.findOne({ size_name: key })
        Pant_shirt_size_detail.create({ tshirt_id: tshirt._id, size_id: sizeModel._id, quantity: size[key] })
      }
    }

  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }

  res.status(200).json(tshirtID)
};

const uploadTshirtImg = async (req, res) => {
  let fileArray //mảng chứa các file hình
  const shirt_id = new mongoose.Types.ObjectId(req.params.id);

  if (req.files) {
    if (!Array.isArray(req.files) || Object.keys(req.files).length !== 0) {
      fileArray = Object.values(req.files);
    }
    await uploadMultipleFiles(fileArray, shirt_id, 'shirt');
  }
}

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
    await Images.deleteMany({ tshirt_id: req.params.id })
    let tshirt = await Tshirt.findOneAndUpdate({ _id: req.params.id }, req.body);
    await Pant_shirt_size_detail.deleteMany({ tshirt_id: req.params.id })

    const size = req.body.size
    if (size) {
      for (let key in size) {
        const sizeModel = await Pant_shirt_sizes.findOne({ size_name: key })
        Pant_shirt_size_detail.create({ tshirt_id: tshirt._id, size_id: sizeModel._id, quantity: size[key] })
      }
    }
    res.status(200).json(tshirt._id);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

module.exports = { getTshirtList, addTshirt, deleteTshirt, updateTshirt, getTshirt, uploadTshirtImg };
