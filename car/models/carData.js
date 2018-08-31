//引用mongoose
var mongoose = require('mongoose');
//定义用户的schema
var carfilesSchema = mongoose.Schema({
    sid: Number,
    name : String,
    type: String,
    price:Number,
    day:Number,
    b:Boolean
});
//静态方法，增加学生
carfilesSchema.statics.addStudent = function(json,callback){
    //增加学生的时候要先检查合法性，验证id是否被占用
    Carclass.checkSid(json.sid,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new Carclass(json);
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
carfilesSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        //如果有相同的id返回false
        callback(results.length == 0);
    });
}
carfilesSchema.statics.check = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        //如果有相同的id返回false
        callback(results[0]);
    });
}
carfilesSchema.statics.search = function(word,callback){
    console.log("我是Course类，我收到了模糊查询次" + word);
    this.find(
        {
            "$or" : [
                {"name" : new RegExp(word)},
                {"type" : new RegExp(word)}
            ]
        }
    ).sort({"sid":1}).exec(
        function(err,results){
            callback(results);
        }
    );
}
//定义用户的model
var Carclass = mongoose.model('class', carfilesSchema);

module.exports=Carclass;
