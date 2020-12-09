const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Assets = mongoose.model("Assets", {
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
    user: { type: mongoose.Schema.Types.ObjectId,
            ref: "User" }
});

module.exports = {
  Assets
};