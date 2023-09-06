const Joi = require("joi");
const CreateClassDto = require("../dto/createclassDto");
const classmodel = require("../models/classes");
const sendEmail = require('./email'); // Import the sendEmail function

const mongoose = require('mongoose');
const student = require('../models/studentModel');
const StudentModel = require("../models/studentModel");

function generateRandomPassword() {
  const passwordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/])(?!.*\s).{8,}$/;

  const specialCharacters = '!@#$%^&*()_+~`-={}[]:;\'"<>,.?/';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  const allCharacters = specialCharacters + lowercaseLetters + uppercaseLetters + digits;

  let password = '';
  do {
    password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters.charAt(randomIndex);
    }
  } while (!passwordPattern.test(password));

  return password;
}










const TeacherCreateClass = {

  async createclass(req, res, next) {


    const createclass = Joi.object({
      teacherName: Joi.string().required(),
      teacherID: Joi.string().required(),
      teacherEmail: Joi.string().email().required(),
      subjectName: Joi.string().required(),
      students: Joi.array().items(Joi.string()).min(1).required(),
    });

    const { error } = createclass.validate(req.body);

    
    if (error) {
      return next(error);
    }

    const {teacherName,teacherID,teacherEmail,subjectName,students}=req.body;


    const Create_Class = new classmodel({
        teacherName,
        teacherID,
        teacherEmail,
        subjectName,
        students    
    });

   
    
    let classes = await Create_Class.save();


  
    
  
    const createclassDto = new CreateClassDto(classes);

    for (let i = 0; i < students.length; i++) {
      const email = students[i];
      console.log(student);

      const resp = await StudentModel.findOne({ stdEmail: email });


      console.log("resp",resp)
  

      if(resp){
     
        const updateResult = await StudentModel.updateMany(
          { stdEmail: email }, // Match the specific student
          { $push: { classID: classes._id } }
        );
        sendEmail(email,"")
      }else{

        const name = email.split('@')[0]; 
        const randomPassword = generateRandomPassword();
        console.log(randomPassword);
    

        const studentObje = new StudentModel({
          stdName:name,
          stdEmail:email,
          classID: classes._id,
          teacherID,
          teacherEmail,
          password:randomPassword
        })

        let studentobj = await studentObje.save();

        sendEmail(email,randomPassword)

      }

    }
   





    





    //Send Email to make a password and make student Login
  
    
    return res.status(201).json({ createclassDto });
  },



  async fetchclass(req,res,next){

    const teacherId = req.params.teacherId;

    // Find classes matching the teacherId
    console.log(teacherId)
    // const teachId = ObjectID(teacherId);
    const teacherID = new mongoose.Types.ObjectId(teacherId);
    const response = await classmodel.find({teacherID:teacherID})

    if(!response){
      res.status(500).json({ error: 'Error fetching classes' });
    }else{
      console.log(response)
      res.json({response});
    }

 

  },

  async fetchsingleclass(req,res,next){

    const classId = req.params._id;

  
    console.log(classId)
  

    const response = await classmodel.findOne({_id:classId})

    if(!response){
      res.status(500).json({ error: 'Error fetching classes' });
    }else{
    
      res.json({response});
    }
  }


};

module.exports = TeacherCreateClass;
