const mongoose = require('mongoose');

const quizSubmissionschema = new mongoose.Schema({
  Email:{
    type: String,   
    required: true,
  },
  classId :{
    type: String,   
    required: true,
  },
  Name:{
    type:String,
    required:true,
  },
  assignmentFileURL: {
    type: String,   
    required: true,
  },
  submissionFileURL: {
    type: String,
    required: true, 
  },
  submissionDate: {
    type: Date,
    default: Date.now,
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

const quizSubmission = mongoose.model('QuizSubmission', quizSubmissionschema);

module.exports = quizSubmission;
