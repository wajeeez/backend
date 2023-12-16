const mongoose = require("mongoose");
const jwt =require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/config');

const TeacherSchema = new mongoose.Schema({
  tname: {
    type: String,
    length: 15,
    require: true,
  },

  institute: {
    type: String,
    length: 35, 
    require: true,
  },

  phone: {
    type: String,
    length: 13,
    require: true,
  },

  email: {
    type: String,
    length: 20,
    require: true,
  },

  password: {
    type: String,
    length: 15,
    require: true,
  },
});

TeacherSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id },ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr',
  });
};


module.exports = mongoose.model("Teacher", TeacherSchema,"Teachers");
