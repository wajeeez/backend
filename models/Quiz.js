const { date } = require('joi');
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
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

const Quiz = mongoose.model('QuizTeacher', quizSchema);

module.exports = Quiz;
