const express = require('express')
const TeacherAuthController = require('../controllers/TeacherAuthController')
const TeacherCreateClass = require('../controllers/TeacherCreateClass')
const router = express.Router()
const auth = require('../middleware/auth');

const StudentAuth = require('../controllers/Student')
const Assignemts = require('../controllers/Assignment');
const UploadAssignment = require('../controllers/Assignment');
const getAllAssignments = require('../controllers/GetAllAssignment');
const StdAssignmentUpload = require('../controllers/StdAssignmentUpload')
const GetAllSubmissions = require('../controllers/GetAllSubmissions')

router.get('/test', (req, res) => res.json({ msg: "Working Alright" }))

router.post('/teacher/register', TeacherAuthController.register)

router.post('/teacher/login', TeacherAuthController.login)

router.post('/teacher/createclass', TeacherCreateClass.createclass)

router.post('/teacher/logout', auth, TeacherAuthController.logout)

router.get('/teacher/classes/:teacherId', TeacherCreateClass.fetchclass)
router.get('/teacher/class/:_id', TeacherCreateClass.fetchsingleclass)


//student
router.post('/student/login', StudentAuth.studentlogin)
router.get('/student/classes/:stdId', StudentAuth.fetchclasses)
router.get('/student/class/:_id', StudentAuth.fetchsingleclass)


//Assignment 
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

router.get('/student/studentData/:email',StudentAuth.getStudentData);

router.post('/teacher/assignments/upload', UploadAssignment)
router.get('/teacher/assignments/list/:class_id', getAllAssignments)
router.post('/student/assignments/upload', StdAssignmentUpload)

router.get('/student/assignment/submissionAll/:fileURL', GetAllSubmissions)


router.get('/student/submitted',StudentAuth.getSubmittedAssignment)
router.get('/student/getSubmitedFileURL',StudentAuth.getSubmissionFileURL)

router.get('/student/isSubmission',StudentAuth.CheckSubmissionAvailable)

router.get('/student/allSubmissions',StudentAuth.getAllSubmission)

module.exports = router;

