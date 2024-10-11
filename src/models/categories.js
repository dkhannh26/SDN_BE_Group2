const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  accessory_category_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accessory_category",
    },
  ],
});

// Override all methods
categoriesSchema.plugin(mongoose_delete, { overrideMethods: "all" });

const Categories = mongoose.model("categories", projectSchema);

module.exports = Categories;
