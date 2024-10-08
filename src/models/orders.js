const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const schema = new mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },

    confirm_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },

    voucher_is: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vouchers",
    },

    order_detail_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order_details",
      },
    ],

    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Override all methods
schema.plugin(mongoose_delete, { overrideMethods: "all" });

const Orders = mongoose.model("orders", schema);

module.exports = Orders;
