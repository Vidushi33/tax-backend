const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    Bas:Number, 
    LTA:Number,
    HRA:Number, 
    FA:Number,
    Inv:Number,
    Rent:Number,
    City:String,
    Med:Number
});

const UserModel = mongoose.model("taxes" , UserSchema);

module.exports = UserModel;