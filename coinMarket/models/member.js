const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const member = mongoose.model("member", {
  name: String,
  email: String,
  password: String,
  key: String,
});

module.exports = {
  member
};