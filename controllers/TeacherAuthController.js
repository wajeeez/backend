const Joi = require("joi");
const TeacherDto = require("../dto/TeacherDto");
const Teacher = require("../models/teachermodel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const JWTService = require("../services/JWTServices");
const RefreshToken = require("../models/token");




const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/config');


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

    //Save Data in DB

    let accessToken;
    let refreshToken;

    let user;

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

      //Passowrd Decrypt
      const match = await bcrypt.compare(password, teacher.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
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
  }


};

module.exports = TeacherAuthController;
