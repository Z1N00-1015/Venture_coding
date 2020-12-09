const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coins = mongoose.model("coins", {

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
    coins
  };