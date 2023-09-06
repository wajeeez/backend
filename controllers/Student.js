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
const Submission = require("../models/stdsubmissionFile");
const stdAssignmentFile = require("../models/stdassignmentFile")

const passwordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/])(?!.*\s).{8,}$/;

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








}
module.exports = StudentAuth;
