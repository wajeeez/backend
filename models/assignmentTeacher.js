const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
  },
  teacherID: {
    type: String,
    required: true,
  },
  studentEmails:{
    type:[String],

  },
  subjectName: {
    type: String,
    required: true,
  },
  fileURL: {
    type: String,
    required: true,
  },
  submissionURL:{
    type:[String],
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Assignment = mongoose.model('AssignmentsTeacher', assignmentSchema);

module.exports = Assignment;
