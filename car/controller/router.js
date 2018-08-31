//登录注册
var Student = require("../models/student.js");
//管理员
var user = require("../models/user.js");
var formidable = require("formidable");
var url = require("url");
var crypto = require('crypto');
//登录页
exports.showLogin=function (req,res) {
    res.render("login");
}
//检查用户登陆用户名、密码是否正确
exports.checklogin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        //先来检查用户名是否存在
        user.findUserByName(yonghuming,function(err,doc){
            if(!doc){
                //-1用户名不存在！！！
                res.json({"result":-1});
                return;
            }
            //密码和密码进行加密比对
            if(crypto.createHmac('sha256', mima).digest('hex') === doc.mima){
                //写session
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                //比较密码的正确性，加密的和加密的比较、
                res.json({"result":1});
                //跳转
                return;
            }else{
                res.json({"result":-2});
                return;
            }
        });
    });
}
//注册页
exports.showRegister=function(req,res){
    res.render("reg")
}
//验证用户名是否存在
exports.checkuserexist = function(req,res){
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.yonghuming){
        res.send("请提供yonghuming参数！");
        return;
    }
    //查询数据库中，用户是否存在，如果存在输出-1，不存在输出0
    user.findUserByName(queryobj.yonghuming,function(err,doc){
        if(doc){
            res.json({"result" : -1});
        }else{
            res.json({"result" : 0});
        }
    });
}
//执行注册，在真正执行注册的时候也要后台验证一下用户名是否占用
exports.doreg = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        //在提交的时候再次检查用户名是否重复了
        user.findUserByName(yonghuming,function(err,doc){
            if(doc){
                //-1就是用户名存在
                res.json({"result" : -1});
                return;
            }
            //在数据库中添加一个user
            user.adduser(yonghuming,mima,function(err,doc){
                if(err){
                    //-2就是服务器错误
                    res.json({"result" : -2})
                    return;
                }
                //注册成功！！
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result" : 1})
            });
        });
    });
}
//首页
exports.showIndex = function(req,res){
    var login = req.session.login == 1 ? true : false;
    var yonghuming = login ? req.session.yonghuming : "";
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }else if(yonghuming) {
        user.getK(yonghuming,function(err,v){
            res.render("index",{
                "login" : login,
                "yonghuming" : yonghuming,
            });
        });
    }else{
        res.render("index",{
            "login" : login,
            "yonghuming" : "",
        });
    }

}
//显示客人查询页
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
//退出系统
exports.quit = function(req,res){
    req.session.login = null;
    res.json({'result':1});
}