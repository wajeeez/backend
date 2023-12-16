const mongoose = require("mongoose");

const teacherlogin = new mongoose.Schema({

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


module.exports = mongoose.model("TeacherLogins", teacherlogin,"TeacherLogin");
