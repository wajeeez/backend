const Joi = require("joi");
const TeacherDto = require("../dto/TeacherDto");
const Teacher = require("../models/teachermodel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const JWTService = require("../services/JWTServices");
const RefreshToken = require("../models/token");
const classes =require('../models/classes')
const studentDto = require('../dto/studentDto')
const mongoose = require('mongoose');
const classmodel = require("../models/classes");
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/config');
const StudentModel = require("../models/studentModel");
const GroupModel = require("../models/Groups")
const Submission = require("../models/stdsubmissionFile");
const stdAssignmentFile = require("../models/stdassignmentFile");
const sendEmail = require("./email");
const sendEmailUpdate = require("./email");
const teachermodel = require("../models/teachermodel");
const passwordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/])(?!.*\s).{8,}$/;


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
  


const StudentAuth ={


 
  //REGISTER TEACHER
  async studentlogin(req, res, next) {
    //
    const StudentLoginSchema = Joi.object({
      email: Joi.string().email().required(),
    //  password:Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    const { error } = StudentLoginSchema.validate(req.body);

    if (error) {
      console.log(error)
      // const err = {
      //   status: 401,
      //   message: "Invalid Email ",
      // };
      return next(error);
    }

    const { email, password } = req.body;

    let response;
    let respo;
    try {
      //Emain and Password Match
  //    response = await classes.find({ students: email });
      response = await StudentModel.findOne({ stdEmail: email,password:password });
    
      if (!response) {
        const error = {
          status: 401,
          message: "Invalid Email ID or Password ",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    

    //  const student = new studentDto(response);


    const token = jwt.sign({ email:email },ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr',
  });

      if (response.length === 0) {
        res.status(200).json({ auth: false,error: 'Error: The response is empty.' });
      } else {
      
        return res.status(200).json({  auth: true ,response,token});
      }

   
  },





  async fetchclasses(req,res,next){

    const stdId = req.params.stdId;

    // Find classes matching the teacherId
    console.log(stdId)
    // const teachId = ObjectID(teacherId);
    // const stdID = new mongoose.Types.ObjectId(stdId);
    const response = await classmodel.find({students:stdId})

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
  },

  async updateStudentData(req,res,next){

    try{
    const {email,name,password}=req.body

    const student = await StudentModel.findOne({stdEmail:email})
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    // Update name and password
    student.stdName = name;
    student.password = password;

    // Save the updated student data
    await student.save();

    return res.status(200).json({ message: 'Student data updated successfully', student });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
},

  async getStudentData(req,res,next){

    const email = req.params.email;

    const response = await StudentModel.findOne({stdEmail:email})

    if(!response){
      res.status(500).json({ error: 'Error fetching Student Data' });
    }else{
    
      res.json({response});
    }
  },

  async getSubmittedAssignment(req,res,next){

    const {fileURL} = req.query

      //const subResponse = await stdAssignmentFile.findOne({_id:response.submissionFileURL})

      const file = await stdAssignmentFile.findById({_id:fileURL});

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      res.setHeader('Content-Type', file.contentType);
      res.send(file.data);

      //const submitURL = response.data.Submission;
      
    



  },

  async getSubmissionFileURL(req, res, next) {
    const { Email, classId } =  req.query;
  
    // Check if Email or classId is null or undefined
    if (!Email || !classId) {
      return res.status(400).json({ error: 'Email and classId are required' });
    }
  
    const response = await Submission.find({ Email, classId });
  
    if (!response) {
      return res.status(200).json({ error: 'NO SUBMISSION', response });
    } else {
      return res.json({ response });
    }
  },
  







  async CheckSubmissionAvailable(req,res,next){

    const {Email,classId} =req.body;

    const response = await stdAssignmentFile.findOne({email:Email, classId:classId})

    if(!response){
      res.status(500).json({ error: 'Error fetching Student Data' });
    }else{
    
      res.json({response});
    }


  },



  async getAllSubmission(req,res,next){

    const {classId,fileURL} = req.query

      //const subResponse = await stdAssignmentFile.findOne({_id:response.submissionFileURL})

      const file = await Submission.find({assignmentFileURL:fileURL,classId:classId});

      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
     
      res.json(file);

      //const submitURL = response.data.Submission;
    

  },



  async forgetpassword(req,res,next){

  try{
    const {email} =req.body
    
    const randomPassword = generateRandomPassword();
    
    const user = await StudentModel.findOne({ stdEmail:email });

    if (!user) {
      return res.status(404).json({ message: 'No Record Found' });
    }

    // Check if the provided email matches the stdEmail
    if (user.stdEmail === email) {
      // Generate a random password (you can use your own logic)
      // Update the user's password with the random password
      user.password = randomPassword;

      // Save the updated user to the database
      const updatedUser = await user.save();


     
     // Password updated successfully
      sendEmailUpdate.sendEmail(email,randomPassword)
      return res.status(200).json({updatedUser , message:"You will recieve an Email with Password to login"});
    } else {
    return res.status(403).json({ message: 'Email does not match stdEmail' });
  
  }
  }catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
  }

   


  },

  async getAllStudents(req,res,next){

    const {class_id} = req.params

      //const subResponse = await stdAssignmentFile.findOne({_id:response.submissionFileURL})
      const foundClass = await classmodel.findOne({ _id: class_id });

      // Check if the class exists
      if (!foundClass) {
        return null; // Class not found
      }
      // Extract student emails from the class
      const studentEmails = foundClass.students || [];
    
      // Fetch additional data for students based on emails
      const studentsData = await StudentModel.find({ stdEmail: { $in: studentEmails } });
  
      // return studentsData;

      res.json(studentsData);

      //const submitURL = response.data.Submission;
    

  },

  async creatGroup(req,res,next){

    const {class_id} = req.params
    const {stdIds} = req.body

      //const subResponse = await stdAssignmentFile.findOne({_id:response.submissionFileURL})


    console.log(class_id)
    console.log(stdIds)



    const group = new GroupModel({
     
      stdIds:stdIds,
      classID:class_id
    })

    let response = await group.save();
   
    res.status(200).json({message:"SuccessFull"});
   

  },

  
  async getAllGroups(req,res,next){

  

    const {class_id} = req.params
    

      //const subResponse = await stdAssignmentFile.findOne({_id:response.submissionFileURL})


    

      const groups = await GroupModel.find({classID :class_id });
    
      // console.log(students)
      if (!groups) {
        return res.status(404).send("Student not found.");
    }

    return res.status(200).json(groups)

  },



  async updateTeacherData(req,res,next){

    try{
    const {email,name,password}=req.body;


    const teacherEmail =email;
    const teacher = await teachermodel.findOne({email:email})
   
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
  
    // Update name and password
    if(name!="" || name != null){
      teacher.tname = name;
      const teacherClasses = await classes.updateMany(
        { teacherEmail: teacherEmail },
        { $set: { teacherName: name } }
      );


      if(teacherClasses.modifiedCount < 0){
      return res.status(404).json({ error: 'Cant Update Name of Teacher', message: err.message });
 
      }
    }

    teacher.password = password;

    // Save the updated student data
    await teacher.save();
    

    return res.status(200).json({ message: 'Teacher data updated successfully', teacher });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
},

}


module.exports = StudentAuth;
