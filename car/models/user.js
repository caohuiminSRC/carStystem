//引用mongoose
var mongoose = require('mongoose');
//加密模块
var crypto = require('crypto');
//定义用户的schema
var userSchema = mongoose.Schema({
    yonghuming: String,
    mima : String
});
//定义用户的model
var user = mongoose.model('user', userSchema);
//通过名字寻找用户
exports.findUserByName = function(yonghuming , callback){
    user.findOne({"yonghuming" : yonghuming} , function(err,doc){
        callback(err,doc);
    });
}
//添加user
exports.adduser = function(yonghuming,mima,callback){
    //先给密码加密
    var jiamidemima = crypto.createHmac('sha256', mima).digest('hex');
    //向数据库保存
    user.create({"yonghuming" : yonghuming , "mima" : jiamidemima},function(err,doc){
        callback(err,doc)
    });
}
exports.getK = function(yonghuming,callback){
    user.findOne({"yonghuming":yonghuming},function(err){
        callback(err);
    });
}
