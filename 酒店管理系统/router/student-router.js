var Student = require("../models/Student.js");
var Course = require("../models/Course.js");
var tool = require("../models/tool.js");
var url = require("url");
var formidable=require("formidable");
var Order=require("../models/Order");
var Room=require("../models/Room.js")

//注册页
exports.showRegister=function(req,res){
    res.render("reg")
}
//验证用户名是否存在
exports.checkuserexist = function(req,res){
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.sid){
        res.send("请提供sid参数！");
        return;
    }
    console.log(queryobj.sid);
    //查询数据库中，用户是否存在，如果存在输出-1，不存在输出0
    Student.findUserByName(queryobj.sid,function(err,doc){
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
        var yonghuming = fields.sid;
        var mima = fields.password;
        //在提交的时候再次检查用户名是否重复了
        Student.findUserByName(yonghuming,function(err,doc){
            if(doc){
                //-1就是用户名存在
                res.json({"result" : -1});
                return;
            }
            //在数据库中添加一个user
            Student.adduser(yonghuming,mima,function(err,doc){
                if(err){
                    //-2就是服务器错误
                    res.json({"result" : -2})
                    return;
                }
                //注册成功！！
                req.session.login = 1;
                req.session.sid = yonghuming;
                res.json({"result" : 1})
            });
        });
    });
}
//显修改页面页面
exports.showRevise = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("revise",{
        "xingming" : req.session.xingming,
        "xuehao" : req.session.xuehao,
        "grade" : req.session.grade
    });
}
//修改用户密码
exports.changepw = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Student.changepw(parseInt(fields.sid), fields.pw,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
            res.end(info);
        });
    });
}
//显示在线预订页
exports.showOnline=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("onLine",{
        "xingming" : req.session.xingming,
        "xuehao" : req.session.xuehao,
        "grade" : req.session.grade
    });
}
//预订房间
exports.addRoom=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        fields.enter="已订单";
        Order.add(fields,function(err,r){
            if(err){
                res.json({"result":-1})
            }else{
                Room.find({"name":fields.meal},function (err,data) {
                    console.log(data.length);
                })
                res.json({"result":1})
            }
        })
    });
}
//查询房间预订页
exports.findOnline=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("findOnline",{
        "xingming" : req.session.xingming,
        "xuehao" : req.session.xuehao,
        "grade" : req.session.grade
    });
}
// 预订房间查询
exports.findRecord=function(req,res){
    var obj=req.query;
    console.log(obj.cid);
    Order.find({ $or: [ { phone:obj.cid,enter:"已订单" }, { pwText: obj.cid,enter:"已订单" } ]},function (err,data) {
        console.log(data);
        res.json({"result":data})
    })
}
//取消订单
exports.chekout=function(req,res){
    var _id=req.query._id;
    Order.findOne({"_id":_id},function (err,data) {
        console.log(data);
        data.enter="已退订";
        data.save();
        Room.findOne({"cid":data.Roomnumber},function (err,data2) {
            res.json({"result":1})
        })
    })
}
//修改订单
exports.change=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Order.change2(fields,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
           if(info==1){
               res.json({"result":1})
           }else{
               res.json({"result":-1})
           }
        });
    });
}

















exports.getstudentcourses = function(req,res){
    //学号
    var xuehao = req.params.xuehao;

    //命令模块给我结果
    Student.getcoursesbysid(xuehao,function(arr){
        res.json({"result" : arr});
    });
}


//显示学生选的课程
exports.showXuanke=function(req,res){
    //学号
    var xuehao = req.params.sid;
    //命令模块给我结果
    var ke=[]
    Student.getcoursesbysid(xuehao,function(arr){
        if(arr.length==0){
            res.render("enroll",{
                "ke":arr.length,
                "xingming" : req.session.xingming,
                "xuehao" : req.session.xuehao
            })
        }
        for(var i = 0 ; i < arr.length ; i++){
            Course.find({"cid":arr[i]},function (err,data) {
                ke.push(data[0].name)
                if(ke.length==arr.length){
                    res.render("enroll",{
                        "ke":ke,
                        "xingming" : req.session.xingming,
                        "xuehao" : req.session.xuehao
                    });
                }
            })
        }
    });
}
//报名
exports.baoming = function(req,res){
    var querystringobj = url.parse(req.url,true).query;
    var cid = querystringobj.cid;
    var sid = querystringobj.sid;
    tool.baoming(sid,cid,function(resultnumber){
        res.send(resultnumber);
    });
}

//退报
exports.tuiding = function(req,res){
    var querystringobj = url.parse(req.url,true).query;
    var cid = querystringobj.cid;
    var sid = querystringobj.sid;

    tool.tuiding(sid,cid,function(){
        res.send("ok");
    });
}


//显示某一个课程
exports.showcourse = function(req,res){
    //拿到参数
    var cid = req.params.cid;
    Course.find({"cid":cid},function(err,results){
        if(results.length == 0){
            res.send("没有这个课程");
            return;
        }
        //课程
        var thecourse = results[0];
        //如果这个课程没有人报名：
        if(thecourse.students.length == 0){
            res.render("course",{
                "coursename" : results[0].name,
                "xingming" : req.session.xingming,
                "xuehao" : req.session.xuehao,
                "xuesheng" : []
            });

            return;
        }

        //遍历这个课程的报名学员students数组，再次寻找数据库得到他们的名字
        var students = [];

        for(var i = 0 ; i < thecourse.students.length ; i++){
            Student.find({"sid" : thecourse.students[i]},function(err,results2){
                students.push(results2[0]);
                if(students.length == thecourse.students.length){
                    console.log(students.length)
                    //都寻找完毕了
                    res.render("course",{
                        "coursename" : results[0].name,
                        "xingming" : req.session.xingming,
                        "xuehao" : req.session.xuehao,
                        "xuesheng" : students
                    });
                }
            });
        };
    })
}