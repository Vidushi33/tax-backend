const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNo: Number,

  password: String,
});

UserSchema.methods.generateJwtToken = function () {
  return jwt.sign({ user: this._id.toString }, "user");
};

UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  console.log("details", user);
  if (!user) {
    return 0;
  }
  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    return 1;
  }
  return user;
};

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      return next();
    });
  });
});

const UserModel = mongoose.model("entries", UserSchema);

module.exports = UserModel;
