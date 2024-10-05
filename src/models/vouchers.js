const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const schema = new mongoose.Schema({
  condition: {
    type: Number,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },

  order_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
  ],
});

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Vouchers = mongoose.model("vouchers", schema);

module.exports = Vouchers;
