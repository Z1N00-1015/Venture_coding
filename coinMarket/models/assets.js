const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Assets = mongoose.model("Asset", {
    user: { ref: "User", 
    type: Schema.Types.ObjectId },

    coin: [{ ref: "Coin", 
      type: Schema.Types.ObjectId}],

    quantity: {
      type: mongoose.Schema.Types.Mixed}
      });

module.exports = {
  Assets
};