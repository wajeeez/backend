class TeacherDto{
    constructor(teacher){
        this._id=teacher._id;
        this.tname=teacher.tname;
        this.institute=teacher.institute;
        this.email=teacher.email;
    }
}

module.exports=TeacherDto;