const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coin = mongoose.model("Coin", {
    name: String,
    active: {
        type: Boolean,
        default: true,
      },
})

module.exports = {
    Coin
  };