//类，mongoose使用的类，管理员类
var mongoose = require("mongoose");
var crypto = require("crypto");

//这个模型返回一个构造函数
var studentSchema = mongoose.Schema({
    "sid" : Number,
    "name" : String,
    "grade" : Number,    //年级1、2、3、4、5、6分别初一初二初三高一高二高三
    "courses" : [Number],
    "password" : String
});

//通过名字寻找用户
studentSchema.statics.findUserByName = function(yonghuming , callback){
    this.findOne({"sid" : yonghuming} , function(err,doc){
        callback(err,doc);
    });
}
//添加user
studentSchema.statics.adduser = function(yonghuming,mima,callback){
    //先给密码加密
    var jiamidemima = crypto.createHash('sha256', mima).digest('hex');
    //向数据库保存
    this.create({"sid" : yonghuming , "password" : jiamidemima},function(err,doc){
        callback(err,doc)
    });
}
//静态方法，根据账号号得到用户
studentSchema.statics.findBySid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        callback(err,results);
    })
}
//更改用户密码
studentSchema.statics.changepw = function(sid,pw,callback){
    this.find({"sid" : sid},function(err,results){
        if(err){
            callback("服务器错误！请检查输入的内容！");
            return;
        }
        if(results.length == 0){
            //-1表示你要更改的学生学号，我没有找到
            callback("没有找到这个用户");
        }else{
            thestudent  = results[0];
            //加密字符串，digest表示进一步处理为hex十六进制
            thestudent.password =crypto.createHash('sha256', pw).digest('hex');
            thestudent.save();
            callback("成功修改！");
        }
    });
}





















//静态方法，创建学生，接受一个数组的数组
studentSchema.statics.createStudent = function(array,grade,callback){
    var studentARR = [];
    //从数组的第一项开始，第0项是表头
    for(var i = 1 ; i < array.length ; i++){
        studentARR.push({
            "sid" : parseInt(array[i][0]) ,
            "name" : array[i][1],
            "grade" : grade
        })
    }
    //核心语句！持久化！
    this.create(studentARR,function(err,r){
        callback(r.length,grade);
    });
}

//删除所有学生
studentSchema.statics.removeAllStudent = function(callback){
    this.remove({},function(err,r){
        callback();
    });
}

//生成所有学生初始密码！
studentSchema.statics.setinitpassword = function(callback){
    var str = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    var count = 0;
    //遍历！
    this.find({},function(err,results){
        results.forEach(function(item){
            //给每一个人生成6位随机密码！
            var password = "";
            for(var i = 0 ; i < 6 ; i++){
                password += str.charAt(parseInt(Math.random() * str.length));
            }
            item.password = password;
            item.save(function(){
                count++;
                //所有学生持久成功
                if(count == results.length){
                    callback(true);
                }
            });
        })
    });
}

//静态方法，得到所有学生，向callback注入一个数组的数组
studentSchema.statics.getAllStudents = function(callback){
    this.find({},function(err,results){
        var arr = [];
        results.forEach(function(item){
            arr.push([item.sid , item.name,item.password]);
            arr.push(["学号","姓名","密码"]);
        });
        callback(arr);
    });
}

//加密所有学生
studentSchema.statics.sha256 = function(callback){

    this.find({},function(err,results){
        console.log(1+results);
        results.forEach(function(item){
            //创建一个加密方法
            var sha256 = crypto.createHash("sha256");
            //加密字符串，digest表示进一步处理为hex十六进制
            item.password = sha256.update(item.password).digest("hex");
            item.save();
        });
        console.log(2+results);
    });
}





//静态方法，根据学号返回这个学号的学生的已经报名的课程数组
studentSchema.statics.getcoursesbysid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        if(err || results.length == 0){
            callback([]);
            return;
        }
        callback(results[0].courses);
    });
}


//根据schema创建模型！
var Student = mongoose.model("Customer",studentSchema);

//暴露！
module.exports = Student;
