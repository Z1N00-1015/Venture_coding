const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coins = mongoose.model("Coins", {

    btc: {type: String,
        default: "bitcoin"},
    eth: {type: String,
        default: "Ethereum"},
    xrp: {type: String,
        default:'ripple'},
    bth: {type: String,
        default: "bitcoin-cash"}

})

module.exports = {
    Coins
  };