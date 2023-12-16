const Joi = require("joi");
const TeacherDto = require("../dto/TeacherDto");
const Teacher = require("../models/teachermodel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const JWTService = require("../services/JWTServices");
const RefreshToken = require("../models/token");




const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/config');
const teachermodel = require("../models/teachermodel");

const sendEmail = require("./email");
const sendEmailUpdate = require("./email")

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
  

const passwordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/])(?!.*\s).{8,}$/;

const TeacherAuthController = {

  //REGISTER TEACHER

  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      tname: Joi.string().min(5).max(30).required(),
      institute: Joi.string().min(5).max(30).required(),
      phone: Joi.string()
        .pattern(/^[0-9]{11}$/)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userRegisterSchema.validate(req.body);

    // Error 1
    if (error) {
      return next(error);
    }

    //Error 2
    const { tname, institute, phone, email, password } = req.body;

    try {
      const emailInUse = await Teacher.exists({ email });
      const usernameInUse = await Teacher.exists({ tname });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "TeacherName not available, use another Name",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //Password Hashing

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const userToRegister = new Teacher({
        tname,
        institute,
        phone,
        email,
        password: hashedPassword,
      });

      user = await userToRegister.save();

     } catch (error) {
      return next(error);
    }

  

    const teacherDto = new TeacherDto(user);

    const token = jwt.sign({ id: teacherDto._id, email:teacherDto.email , name:teacherDto.tname},ACCESS_TOKEN_SECRET, {
      expiresIn: '1hr',
    });

    return res.status(201).json({ teacher:teacherDto , token });
  },

   //REGISTER TEACHER
  async login(req, res, next) {
    //
    const TeacherLoginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    const { error } = TeacherLoginSchema.validate(req.body);

    if (error) {
      const err = {
        status: 401,
        message: "Invalid Email or Password",
      };
      return next(err);
    }

    const { email, password } = req.body;

    let teacher;
    try {
      //Emain and Password Match
      teacher = await Teacher.findOne({ email: email });
     
      if (!teacher) {
        const error = {
          status: 401,
          message: "Invalid Email ID ",
        };
        return next(error);
      }


      if(teacher.password !=password ){
        const error = {
                status: 401,
                message: "Invalid Password",
              };
      
              return next(error);

      }
      
      //Passowrd Decrypt
      // const match = await bcrypt.compare(password, teacher.password);

    //   if (!match) {
    //     const error = {
    //       status: 401,
    //       message: "Invalid Password",
    //     };

    //     return next(error);
    //   }
    } catch (error) {
      return next(error);
    }


    const teacherDto = new TeacherDto(teacher);

    const token = jwt.sign({ id: teacherDto._id, email:teacherDto.email , name:teacherDto.tname },ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr',
  });
    return res.status(200).json({ teacher: teacherDto , auth: true, token });
  },

  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    console.log("Refresh Token: " + refreshToken);
  
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
  
    // Delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  
    res.status(200).json({ user: null, auth: false });
  },

  async forgetpassword(req,res,next){

    try{
      const {email} =req.body
      
      const randomPassword = generateRandomPassword();
      
      const user = await teachermodel.findOne({ email:email });
  
      if (!user) {
        return res.status(404).json({ message: 'No Record Found' });
      }
  
      // Check if the provided email matches the stdEmail
      if (user.email === email) {

        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user.password=hashedPassword
        // Save the updated user to the database
        const updatedUser = await user.save();
        // Password updated successfully

        console.log("randomPassword",randomPassword)
        sendEmailUpdate.sendEmail(email,randomPassword)
        return res.status(200).json({updatedUser , message:"You will recieve an Email with Password to login"});
      } else {
      return res.status(403).json({ message: 'Email does not match Teacher Email' });
    
    }
    }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }
  
     
  
  
    },
  

    


};

module.exports = TeacherAuthController;
