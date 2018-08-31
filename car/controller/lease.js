var Student = require("../models/student.js");
var dangan=require("../models/carClass");
var carClass=require("../models/carData");
var formidable = require("formidable");
var dateTime = require('date-time');
var Rented=require("../models/Rented");
//租赁页面
exports.showLease = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("lease",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
//显示汽车类
//获取客人信息
exports.getAllkehu=function(req,res){
    Student.find({}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//显示汽车类
exports.showGetLease=function(req,res) {
    dangan.find({}).exec(function (err, results) {
        res.json({"carClass": results})
    })
}
//获取单个类型车的数据
exports.carData=function(req,res){
    var name=req.query.class;
    carClass.find({"type":name}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//获取id
exports.carsid=function(req,res){
    var name=req.query.type;
    var sid=req.query.sid;
    carClass.find({"type":name,"sid":sid}).exec(function(err,results){
        res.json({
            "results" : results[0]
        });
    });
}
//租出
exports.lease=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        // 租出起始时间
        fields.start=dateTime(),
            //到期时间
            fields.Operator=req.session.yonghuming
        //添加到数据库
        Rented.addStudent(fields,function (result) {
            carClass.check(fields.sid,function (data) {
                console.log(data)
                data.b=true;
                data.save();
            })
            res.json({"result":1})
        })

    });
}