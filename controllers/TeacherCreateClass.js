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
        sendEmail.sendEmail(email,"")
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

        sendEmail.sendEmail(email,randomPassword)

      }

    }
   





    





    //Send Email to make a password and make student Login
  
    
    return res.status(201).json({ createclassDto });
  },


  async addStudentsToClass(req, res, next) {
    try {
      const addStudentsSchema = Joi.object({
        students: Joi.array().items(Joi.string()).min(1).required(),
      });
  
      const { error } = addStudentsSchema.validate(req.body);
  
      if (error) {
        return next(error);
      }
  
      const { students } = req.body;
      const classId = req.params.classId;
  
      // Find the class by classId
      const existingClass = await classmodel.findById(classId);
  
      if (!existingClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Add new students to the existing class
      for (let i = 0; i < students.length; i++) {
        const email = students[i];
  
        // Check if the student already exists in the class
        const isStudentInClass = existingClass.students.includes(email);
  
        if (!isStudentInClass) {
          // Add student to the classModel
          existingClass.students.push(email);
          await existingClass.save();
  
          // Check if the student already exists
          const existingStudent = await StudentModel.findOne({ stdEmail: email });
  
          if (existingStudent) {
            // If the student exists, update the classID
            await StudentModel.updateMany(
              { stdEmail: email },
              { $push: { classID: classId } }
            );
            sendEmail.sendEmail(email, "Welcome back!");
           
          } else {
            // If the student doesn't exist, create a new student and assign to the class
            const name = email.split('@')[0];
            const randomPassword = generateRandomPassword();
  
            const newStudent = new StudentModel({
              stdName: name,
              stdEmail: email,
              classID: [classId], // Create an array with the current classID
              teacherID: existingClass.teacherID,
              teacherEmail: existingClass.teacherEmail,
              password: randomPassword,
            });
  
            await newStudent.save();
            sendEmail.sendEmail(email, randomPassword);
          }
        }
      }
  
      return res.status(200).json({ message: 'Students added to the class successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  },
  


  async removeStudent(req, res, next) {
    try {
      const removeStudentSchema = Joi.object({
        studentId: Joi.string().required(),
        studentEmail: Joi.string().required(),
      });
  
      const { error } = removeStudentSchema.validate(req.body);
  
      if (error) {
        return next(error);
      }
  
      const { studentId, studentEmail } = req.body;
      const classId = req.params.classId;
  
      // Find the class by classId
      const existingClass = await classmodel.findById(classId);
  
      if (!existingClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Check if the student exists in the class
      const studentIndex = existingClass.students.indexOf(studentEmail);
  
      if (studentIndex !== -1) {
        // Remove the student from the classModel
        existingClass.students.splice(studentIndex, 1);
        await existingClass.save();
  
        // Remove the classID from the student in the StudentModel
        await StudentModel.updateOne(
          { _id: studentId, stdEmail: studentEmail },
          { $pull: { classID: classId } }
        );
  
        return res.status(200).json({ message: 'Student removed from the class successfully' });
      } else {
        return res.status(404).json({ message: 'Student not found in the class' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  },


  async deleteClass(req,res,next){
    try {
      const classId = req.params.classId;
  
      // Find the class by classId
      const existingClass = await classmodel.findById(classId);
  
      if (!existingClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Delete the class
      await classmodel.deleteOne({ _id: existingClass._id });
  
      // Remove the classId from associated students
      await StudentModel.updateMany(
        { classID: classId },
        { $pull: { classID: classId } }
      );
  
      return res.status(200).json({ message: 'Class deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
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
