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
const GetAllSubmissions = require('../controllers/GetAllSubmissions');
const TeacherMarks_Remarks = require('../controllers/TeacherMarks_Remarks');
const KPIS = require('../controllers/KPIS');
const QuizStdUpload = require('../controllers/QuizUpload');

router.get('/test', (req, res) => res.json({ msg: "Working Alright" }))

router.post('/teacher/register', TeacherAuthController.register)

router.post('/teacher/login', TeacherAuthController.login)

router.post('/teacher/createclass', TeacherCreateClass.createclass)


router.post('/delete/student/:classId',TeacherCreateClass.removeStudent)
router.post('/teacher/addstudents/:classId', TeacherCreateClass.addStudentsToClass)
router.post('/teacher/deleteClass/:classId',TeacherCreateClass.deleteClass)


router.post('/teacher/logout', auth, TeacherAuthController.logout)

router.get('/teacher/classes/:teacherId', TeacherCreateClass.fetchclass)
router.get('/teacher/class/:_id', TeacherCreateClass.fetchsingleclass)
router.post('/teacher/update',StudentAuth.updateTeacherData)


//student
router.post('/student/login', StudentAuth.studentlogin)
router.get('/student/classes/:stdId', StudentAuth.fetchclasses)
router.get('/student/class/:_id', StudentAuth.fetchsingleclass)
router.post('/student/update',StudentAuth.updateStudentData)

//Assignment 
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

router.get('/student/studentData/:email',StudentAuth.getStudentData);
router.post('/teacher/assignments/upload', UploadAssignment.UploadAssignment)
router.post('/teacher/assignments/:_id', UploadAssignment.deleteAssignment)

router.post('/student/delete/submission/:fileURL',UploadAssignment.deleteSubmission)


router.get('/teacher/assignments/list/:class_id', getAllAssignments.getAllAssignments)
router.post('/student/assignments/upload', StdAssignmentUpload)
router.get('/student/assignment/submissionAll/:fileURL', GetAllSubmissions.GetAllSubmissions)
router.get('/student/submitted',StudentAuth.getSubmittedAssignment)
router.get('/student/getSubmitedFileURL',StudentAuth.getSubmissionFileURL)
router.get('/student/isSubmission',StudentAuth.CheckSubmissionAvailable)
router.get('/student/allSubmissions',StudentAuth.getAllSubmission)


router.post('/forgetpassword',StudentAuth.forgetpassword)
router.post('/teacher/forgetpassword',TeacherAuthController.forgetpassword)



//Lecture Apis 

router.post("/teacher/submitLecture",UploadAssignment.UploadLecture)
router.get("/students/getLecture/:class_id",getAllAssignments.getAllLecture)
//delete lecture
router.post('/teacher/deleteLectures/:fileURL', UploadAssignment.DeleteLecture)
router.post('/teacher/editLectures/:fileURL', UploadAssignment.EditLecture)
router.post('/teacher/editAssignment/:_id', UploadAssignment.editTeacherAssignment)

//Group Assignments

router.get("/students/getAllStudents/:class_id",StudentAuth.getAllStudents)
router.post("/students/createGroup/:class_id",StudentAuth.creatGroup)
router.get("/students/getAllGroups/:class_id",StudentAuth.getAllGroups)

router.post('/teacher/groupAssignment/upload', UploadAssignment.UploadGroupAssignment)
router.post('/student/groupAssignment/upload', UploadAssignment.UploadSubmission)
router.post('/assignment/group/updateStudentMarks',UploadAssignment.SubmitGroupMarks)
//Marks Api

router.post('/assignment/updateStudentMarks',TeacherMarks_Remarks.SubmitMarks)



router.post('/notification/assignment/submission/:classId',UploadAssignment.getSubmissionNotification)
router.post('/notification/assignment/upload/:classId',UploadAssignment.getAssignmentNotification)


//KPIS
router.post("/delete/group/:groupId",UploadAssignment.deleteGroup)

router.post('/getKPIS',KPIS.getAssignmentStatistics)

router.post('/getTotalStudentCount/:_id',KPIS.getTotalStudentsbyclassId)

router.get('/teacher/getName/:email',TeacherAuthController.getName)

//Quiz

//Teacher Side Quiz
router.post('/teacher/quiz/upload', UploadAssignment.UploadQuiz)
router.post('/teacher/quizEdit/:_id', UploadAssignment.quizTeacherEdit)
router.post('/teacher/deleteQuiz/:_id', UploadAssignment.deleteQuiz)
router.get('/teacher/quiz/list/:class_id', getAllAssignments.getAllQuiz)
router.post('/quiz/updateStudentMarks',TeacherMarks_Remarks.SubmitQuizMarks)


//Student Side Quiz




router.post('/student/quiz/upload', QuizStdUpload)
router.get('/student/quiz/submissionAll/:fileURL', GetAllSubmissions.GetALLQuizSubmission)
router.get('/student/quiz/submitted',StudentAuth.getQuizAssignment)
router.get('/student/quiz/getSubmitedFileURL',StudentAuth.getQuizFileURL)
router.get('/student/quiz/isSubmission',StudentAuth.CheckQuizSubmission)
router.get('/student/quiz/allSubmissions',StudentAuth.getAllQuizSubmission)

router.post('/student/quiz/delete/submission/:fileURL',UploadAssignment.deleteQuizSubmission)




module.exports = router;
