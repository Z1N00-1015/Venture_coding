const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assets = mongoose.model("assets", {

    usd: {type: Number,
        default: 10000},
    btc: {type: Number,
        default: 0},
    xrp: {type: Number,
        default: 0},
    bch: {type: Number,
        default: 0},
    eth: {type: Number,
        default: 0},
    member: { type: mongoose.Schema.Types.ObjectId,
    ref: "User" }
});

module.exports = {
  assets
};