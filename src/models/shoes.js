const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "discounts",
  },

  shoes_size_detail_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shoes_size_detail",
    },
  ],

  images_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images",
    },
  ],

  feedback_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feedbacks",
    },
  ],
});

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Shoes = mongoose.model("shoes", schema);

module.exports = Shoes;
