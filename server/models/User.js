const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Data must have name!"],
  },
  pinCode: {
    type: String,
    require: [true, "Pin code is require"],
  },
  nfcId: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
