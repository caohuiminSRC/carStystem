var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    sid  : Number ,
    name : String,
    phone  : String,
    address  : String,
    id:String,
    driver:String
});
//静态方法，增加学生
studentSchema.statics.addStudent = function(json,callback){
    //增加学生的时候要先检查合法性，验证id是否被占用
    Student.checkSid(json.sid,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new Student(json);
            s.save(function(err){
                if(err){
                    callback(-2);  //服务器错误
                    return;
                }
                //发回1这个状态
                callback(1);
            });
        }else{
            //学号被占用了，返回-1
            callback(-1);
        }
    });
}
//验证学号是否存在
studentSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        //如果有相同的id返回false
        callback(results.length == 0);
    });
}
//类
var Student = mongoose.model("customer",studentSchema);
//暴露
module.exports = Student;