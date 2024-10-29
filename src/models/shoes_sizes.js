const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const sizeSchema = new mongoose.Schema({
  size_name: {
    type: String,
    required: true,
  },

});

// Override all methods
sizeSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Shoes_sizes = mongoose.model("shoes_sizes", sizeSchema);

module.exports = Shoes_sizes;
