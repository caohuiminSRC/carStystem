var carData = require("../models/carData.js");
var url = require("url");
var dangan=require("../models/carClass");
var carClass=require("../models/carData");
var formidable = require("formidable");
var dateTime = require('date-time');
var Rented=require("../models/Rented");

//数据页面
exports.showData = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("data",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
//返回数据
exports.show = function (req, res) {
    carClass.find({}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
