var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    id:String,
    sid:String,
    day:String,
    rent:Number,
    total:Number,
    guest:String,
    pay:Number,
    start:Date,
    end:Date,
    give:Number,
    d:Boolean,
    Operator:String,
    carName:String,
    carClass:String
});
//静态方法，增加车辆
studentSchema.statics.addStudent = function(json,callback){
    //增加车辆的时候要先检查合法性，验证id是否被占用
    Rented .checkSid(json.sid,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new  Rented(json);
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
studentSchema.statics.lease1 = function(b,callback){
    this.find({"d" : true} , function(err,results){
        //如果有相同的id返回false
        callback(results);
    });
}
//类
var Rented = mongoose.model("Rented",studentSchema);
//暴露
module.exports = Rented;