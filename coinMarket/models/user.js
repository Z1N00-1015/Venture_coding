const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  key: String,
});


const Key = mongoose.model("key", {
  key: String,
  user: { type: mongoose.Schema.Types.ObjectId,
    ref: "User" }
})
module.exports = {
  User
};