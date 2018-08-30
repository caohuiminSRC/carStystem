var Student = require("../models/student.js");
var formidable = require("formidable");
var url = require("url");
exports.showQuery=function (req,res) {
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("query",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
//Ajax接口，得到所有客人
exports.getAllStudent = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 10;
    //寻找条目总数
    Student.count({},function(err,count){
        Student.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//执行添加
exports.doAddStudent = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        Student.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//呈递更改客户的表单
exports.showUpdate = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    Student.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        //返回数据
        res.json({ "info" : results[0]})
    });
}
//更改客户的Ajax接口，是post请求接口
exports.updateStudent = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Student.find({"sid" : sid},function(err,results){
            console.log(results);
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.name = fields.name;
            thestudent.sex = fields.sex;
            thestudent.phone = fields.phone;
            thestudent.address = fields.address;
            thestudent.id = fields.id;
            thestudent.driver = fields.driver;
            //持久化
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
//删除客户
exports.deleteStudent = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    //寻找这个学号的学生
    Student.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
}