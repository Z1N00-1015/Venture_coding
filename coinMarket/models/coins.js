const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coins = mongoose.model("coins", {
    btc: "bitcoin",
    eth: "etherium"
})