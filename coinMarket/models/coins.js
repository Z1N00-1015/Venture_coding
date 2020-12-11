const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coin = mongoose.model("Coin", {
    symbol: String,
    
    name: String,
    
    active: {
        type: Boolean,
        default: true,
      },
})

module.exports = {
    Coin
  };