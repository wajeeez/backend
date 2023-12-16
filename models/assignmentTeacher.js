const { date } = require('joi');
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
  fileName:{
    type:String,
    required:true,
    default:""
  },
  title:{
    type:String,
    required:true,
    default:""
  },
  submissionURL:{
    type:[String],
  },
  deadline: {
    type: Date,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },
  totalMarks:{
    type: String,
    default:""
  },
  marks:{
    type: String,
    default:""
  },
  remarks:{
    type: String,
    default:""
  }

});

const Assignment = mongoose.model('AssignmentsTeacher', assignmentSchema);

module.exports = Assignment;
