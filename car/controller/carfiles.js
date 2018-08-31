//汽车数据
var carClass=require("../models/carData");
var formidable = require("formidable");
var url = require("url");

//类别档案页面
exports.showCarfiles = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("carfiles",{
    "column" : "login" ,
    "login" : req.session.login,
    'yonghuming': req.session.yonghuming
    });
}
//Ajax接口，得到所有汽车档案
exports.getAllCarfiles = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 10;
    //寻找条目总数
    carClass.count({},function(err,count){
        carClass.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//搜索
exports.search = function (req, res) {
    var sou = url.parse(req.url,true).query.sou;
    console.log(sou)
    carClass.search(sou,function(results){
        res.json({"results" : results});
    });
}
// //执行添加汽车档案
exports.addCarfiles = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //数据库持久
        carClass.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//呈递更改汽车档案的表单
exports.showUpdateCarfiles = function(req,res){
    //拿到id号
    var sid = req.params.sid;
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    carClass.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此车，请检查网址");
            return;
        }
        //返回数据
        res.json({ "info" : results[0]})
    });
}
//更改汽车档案的Ajax接口，是post请求接口
exports.updateCarfiles = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改车辆
        carClass.find({"sid" : sid},function(err,results){
            console.log(results);
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.name = fields.name;
            thestudent.type = fields.type;
            thestudent.price = fields.price;
            thestudent.day = fields.day;
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
//删除汽车档案
exports.deleteCarfiles = function(req,res){
    //拿到id号
    var sid = req.params.sid;
    //寻找这个id号的车辆
    carClass.find({"sid" : sid},function(err,results){
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