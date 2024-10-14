const Tshirt = require("../models/tshirts");
const { uploadMultipleFiles } = require("../services/fileService");

const getTshirtList = async (req, res) => {
  try {
    // const page = queryString.page;
    // const { limit, filter, population } = aqp(queryString);
    // delete filter.page;
    // const offset = (page - 1) * limit;
    // // console.log(population);

    // let result = await Project.find(filter)
    //   .populate(population)
    //   .skip(offset)
    //   .limit(limit)
    //   .exec();

    let tshirts = await Tshirt.find({});
    return res.status(200).json({ data: tshirts });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

const addTshirt = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    let tshirt = await Tshirt.create({ name, quantity, price });
    let imgUrl = [];
    let imgPath = [];
    // console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    } else {
      let results = await uploadMultipleFiles(req.files.image, tshirt);

      // console.log(results);
      results.detail.forEach((r) => {
        imgPath.push(r.path);

        imgUrl.push(r.name);
      });

      // imgUrl.push(results.path);
    }
    // console.log(imgUrl);

    let updateTshirt = await Tshirt.updateOne(
      { _id: tshirt._id },
      { images_id: imgUrl }
    );

    return res.json({ data: imgPath });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

const deleteTshirt = async (req, res) => {
  try {
    const id = req.params.id;
    let tshirt = await Tshirt.deleteById({ _id: id });
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
