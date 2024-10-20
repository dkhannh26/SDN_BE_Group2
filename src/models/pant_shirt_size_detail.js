const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const schema = new mongoose.Schema(
  {
    size_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pant_shirt_sizes",
    },
    pant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pants",
    },
    tshirt_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tshirts",
    },
    order_detail_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order_details",
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    import_detail_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "import_details",
      },
    ],

    cart_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Pant_shirt_size_detail = mongoose.model("pant_shirt_size_detail", schema);

module.exports = Pant_shirt_size_detail;
