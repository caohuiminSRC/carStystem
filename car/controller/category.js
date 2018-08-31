//汽车类别
var dangan=require("../models/carClass");
var formidable = require("formidable");
var url = require("url");
//类别档案页面
exports.showCategory = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("category",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
//获取所有汽车类别
exports.getAllCategory = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 10;
    //寻找条目总数
    dangan.count({},function(err,count){
        dangan.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//执行添加汽车类别
exports.addCategory = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //数据库持久
        dangan.addCategory(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//显示汽车类别
exports.showUpdate1 = function(req,res){
    //拿到id号
    var sid = req.params.sid;
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    dangan.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此车，请检查网址");
            return;
        }
        //返回数据
        res.json({ "info" : results[0]})
    });
}
//更改汽车类别
exports.updatedangan = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改车辆
        dangan.find({"sid" : sid},function(err,results){
            console.log(results);
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.name = fields.name;
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
//删除汽车类别
exports.deletedangan = function(req,res){
    //拿到id号
    var sid = req.params.sid;
    //寻找这个id号的车辆
    dangan.find({"sid" : sid},function(err,results){
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