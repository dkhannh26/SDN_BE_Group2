const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const schema = new mongoose.Schema(
  {
    size_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shoes_sizes",
    },

    shoes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shoes",
    },

    quantity: {
      type: Number,
    }
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Shoes_size_detail = mongoose.model("shoes_size_detail", schema);

module.exports = Shoes_size_detail;
