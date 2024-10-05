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

  pant_shirt_size_detail_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pant_shirt_size_detail",
    },
  ],

  feedback_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feedbacks",
    },
  ],

  images_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images",
    },
  ],
});

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Pants = mongoose.model("pants", schema);

module.exports = Pants;
