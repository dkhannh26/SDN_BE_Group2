const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const sizeSchema = new mongoose.Schema({
  size_name: {
    type: String,
    required: true,
  },

  pant_shirt_size_detail_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pant_shirt_size_detail",
    },
  ],
});

// Override all methods
sizeSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Pant_shirt_sizes = mongoose.model("pant_shirt_sizes", sizeSchema);

module.exports = Pant_shirt_sizes;