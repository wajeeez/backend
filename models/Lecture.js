const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
  },
  teacherID: {
    type: String,
    required: true,
  },

  lectureDesc:{
    type: String,
    default: "Not Available",
    required: true,

  },
  lectureName: {
    type: String,
    required: true,
  },
  lectureLink: {
    type: String,
    default: "Not Available",
  },
  fileURL: {
    type: String,
    required: true,
  },
  remarks:{
    type: String,
    default: "Not Available",
  }

});

const Lecture = mongoose.model('LecturesTeachers', lectureSchema);

module.exports = Lecture;