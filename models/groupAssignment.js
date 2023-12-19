const mongoose = require('mongoose');

const groups = new mongoose.Schema({
      
      stdEmails: {
          type: [String],
          required: true
        },
      classID: {
        type: String,
        required: true
      },
      teacherID: {
        type: String,
        required: true
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
      submissionURL:{
        type:[String],
      },
      deadline: {
        type: Date,
        required: true,
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


const StudentModel= mongoose.model('Students', students);

module.exports = StudentModel;


