// Teacher DTO
class createclassDto {
    constructor(classes) {
      this._id=classes._id; 
      this.teacherName =classes.teacherName;
      this.teacherID = classes.teacherID;
      this.teacherEmail = classes.teacherEmail;
      this.subjectName = classes.subjectName;
      this.students = classes.students;
    }
  }
  
  module.exports = createclassDto;