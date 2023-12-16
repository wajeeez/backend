
const mongoose = require('mongoose');


const classes = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  teacherID: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  students: {
    type: [String],
    required: true
  }
});




module.exports = mongoose.model("Classes", classes,"Classes");
