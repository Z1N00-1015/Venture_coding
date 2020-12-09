const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keys = mongoose.model("keys", {
  key: String,
});

module.exports = {
  keys
};