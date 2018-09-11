var path = require("path");
// var xlsx = require('node-xlsx');//导入到数据库
var formidable = require("formidable");
var Student = require("../models/Student.js")
var Course = require("../models/Course.js")
var Admin=require("../models/Admin.js")
var Room=require("../models/Room.js")
var Order=require("../models/Order")
var fs = require("fs");
var date = require('date-time');
// var nodeExcel = require('excel-export');//从数据库下载到本地
var url = require("url");

//管理员面板
exports.showAdmin = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
       res.send("本页面需要登录，请<a href=/>登录</a>");
       return;
    }
    res.render("admin",{
        "username" : req.session.username
    });
    // res.sendFile(path.join(__dirname , "../views/admin.ejs"));
}
//管理员更改用户密码
exports.changepw = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Student.changepw(parseInt(fields.sid), fields.pw,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
            res.end(info);
        });
    });
}
//修改管理员密码页面
exports.showAdminRevise=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("adminrevise",{
        "xingming" : req.session.username
    });
}
//修改管理员密码
exports.changepwAdmin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Admin.changepw(fields.sid, fields.pw,function(info){
            //将回调函数显示的信息，原封不动呈递给Ajax接口，会被jQuery alert出来。
            res.end(info);
        });
    });
}


//显示添加房间类别页面
exports.Category=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("category",{
        "username" : req.session.username
    })
}
// 增加房间类型
exports.addCourse = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //保存！直接把fomidable拿到的表单JSON提交给数据库保存！不变形！
        Course.add(fields,function(err,r){
            if(err){
                res.send("提交失败！");
            }else{
                res.send("提交成功");
            }
        })
    });
}
// 得到所有房间类型
exports.getallcourse = function(req,res){

    Course.getAll(function(results){
        res.json({"results" : results});
    })
}
//改变房间数据
exports.changecourse = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Course.change(fields,function(err,r){
            res.send("");
        });
    });
}
//删除房间类型
exports.deletecourse = function(req,res){
    //得到要删除的数组
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //HTTP请求的POST参数不能传数组，只能传递字符串。所以前台会把数组stringify
        //后台parse()
        var needToDelete = JSON.parse(fields.needToDelete);

        //调用模块的方法
        Course.delete(needToDelete,function(err,n){
            if(err){
                res.send("-1");
            }else{
                res.send(n.toString());
            }
        });
    });
}
//获取某一个房间类型数据
exports.moyige=function(req,res){
    Course.findOne({"name":req.query.type},function (err,data) {
        res.json({"data":data})
    })
}
//管理员-增加房间
exports.showRoom = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/admin-student.html"));
}
// 增加房间
exports.addRoom = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //保存！直接把fomidable拿到的表单JSON提交给数据库保存！不变形！
        Course.findOne({"name":fields.name},function (err,data) {
            fields.price=data.price;
            Room.add(fields,function(err,r){
                if(err){
                    res.send("提交失败！");
                }else{
                    res.send("提交成功");
                }
            })
        })
    });
}
// 得到所有房间
exports.getallroom = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    Room.getAll(function(results){
        res.json({"results" : results});
    })
}
//改变房间
exports.changeroom = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Room.change(fields,function(err,r){
            res.send("")
        });
    });
}
exports.changeroom2 = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Room.change2(fields,function(err,r){
            res.json({"result":1});
        });
    });
}
//删除房间
exports.deleteroom = function(req,res){
    //得到要删除的数组
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //HTTP请求的POST参数不能传数组，只能传递字符串。所以前台会把数组stringify
        //后台parse()
        var needToDelete = JSON.parse(fields.needToDelete);

        //调用模块的方法
        Room.delete(needToDelete,function(err,n){
            if(err){
                res.send("-1");
            }else{
                res.send(n.toString());
            }
        });
    });
}
//查找房间页面
exports.findRoom=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("findRoom",{
        "username" : req.session.username
    })
}
// 查找房间
exports.find=function(req,res){
   var cid=req.query.cid;
    Room.findOne({"cid":cid},function (err,data) {
        res.json({"result":data})
    })
}


//大堂入住页面
exports.showLobby=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("lobby",{
        "username" : req.session.username
    })
}
// 得到所有且未入住的房间
exports.getNoShow = function(req,res){
    var types=req.query.type;
    Room.getNoShow(types,function(results){
        res.json({"results" : results});
    })
}
//大堂入住
exports.addCheckin=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        // fields.book=true;
        fields.enter="已入住";
        fields.start=date();
        Order.add(fields,function(err,r){
            if(err){
                res.json({"result":-1})
            }else{
                Room.findOne({"cid":fields.Roomnumber},function (err,data) {
                   data.meal="已入住"
                    data.save();
                })
                res.json({"result":1})
            }
        })
    });
}



//退房管理
exports.showOut=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("out",{
        "username" : req.session.username
    })
}
// 退房查找
exports.outFind=function(req,res){
    var cid=req.query.cid;
    Order.findOne({"Roomnumber":cid,"enter":"已入住"},function (err,data) {
        res.json({"result":data})
    })
}
//确认退房
exports.chekout=function(req,res){
    var _id=req.query._id;
    Order.findOne({"_id":_id},function (err,data) {
        data.enter="已退房";
        data.save();
        Room.findOne({"cid":data.Roomnumber},function (err,data2) {
            console.log(data2)
            data2.meal="未入住";
            data2.save();
            res.json({"result":1})
        })
    })
}


//入住记录查询页面
exports.showRecord=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("record",{
        "username" : req.session.username
    })
}
//入住查询
exports.findRecord=function(req,res){
    var obj=req.query;
    Order.find({ $or: [ { sid:obj.name }, { pwText: obj.name } ],$and:[{"start":{"$gt":obj.start+" 0:0:0"}},{"start":{"$lt":obj.end+" 0:0:0"}}] },function (err,data) {
        res.json({"result":data})
    })
}
// 管理员订单查询页面
exports.showCheck=function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("Check",{
        "username" : req.session.username
    })
}
// 订单房查找
exports.checkFind=function(req,res){
    var obj=req.query;
    Order.find({ $or: [ { phone:obj.cid,enter:"已订单" }, { pwText: obj.cid,enter:"已订单" } ]},function (err,data) {
        res.json({"result":data})
    })
}
exports.Checkin=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Order.find({"_id":fields.weiyi},function (err,r) {
            if(err){
                res.json({"result":-1})
            }else{
                Room.findOne({"cid":fields.Roomnumber},function (err,data) {
                    data.meal="已入住"
                    data.save();
                })
                r[0].ID=fields.ID;
                r[0].Roomnumber=fields.Roomnumber;
                r[0].sex=fields.sex;
                r[0].sid=fields.sid;
                r[0].enter="已入住";
                r[0].save();
                res.json({"result":1})
            }
        })
    });
}

















//管理员-学生面板
exports.showuploadform = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
       res.send("本页面需要登录，请<a href=/>登录</a>");
       return;
    }
    res.sendFile(path.join(__dirname , "../views/uploadform.html"));
}

//处理上传的excel文件
exports.doexcelpost = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
       res.send("本页面需要登录，请<a href=/>登录</a>");
       return;
    }
    //表单
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname , "../uploads");
    form.parse(req, function(err, fields, files) {
        fs.rename(files.wenjian.path,files.wenjian.path+".xlsx",function(err){
            if(err){
                res.send("上传文件发生了错误");
                return;
            }

            //上传完毕之后，就要开始识别了
            var obj = xlsx.parse(files.wenjian.path + ".xlsx");
            //计数
            var count = 0;
            //清空当前数据库中的所有学生之后，然后进行插入操作
            Student.removeAllStudent(function(){
                //遍历这个对象中的data数组，data数组长度是6，是6个表的信息。
                for(var i = 0 ; i < 6 ; i++){
                    //命令模型分别将6个年级的学生信息持久化！
                    Student.createStudent(obj[i].data,i + 1,function(length,grade){
                        res.write(grade + "年级成功插入" + length + "人\n");

                        count++;
                        if(count == 6){
                            res.end("所有数据成功插入，请去生成初始密码");
                        }
                    });
                }
            });
        });
    });
}

//设置初始密码！
exports.setinitpassword = function(req,res){
    //初始所有密码，找模型！脏活、累活，一定要找模型！
    Student.setinitpassword(function(result){
        if(result){
            //向前端界面输出1
            res.end("1");
        }
    });
}

//下载Excel表格
exports.exportexcel = function(req,res){
    //从数据库中得到所有数据，然后下载表格。
    Student.getAllStudents(function(arr){
        //插件：https://www.npmjs.com/package/excel-export
        //API文档博客：http://blog.csdn.net/hogewoci/article/details/10004799
        var conf = {};
        conf.cols = [
            {caption:'学号', type:'string'},
            {caption:'姓名', type:'string'},
            {caption:'初始密码', type:'string'}
        ];
        conf.rows = arr;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "studentPwd.xlsx");
        //命令数据库加密所有明码字符串
        Student.sha256();
        res.end(result, 'binary');
    });
}



//显示管理课程页面
exports.showAdminCourse = function(req,res){
    res.sendFile(path.join(__dirname , "../views/admin-course.html"));
}

//添加课程
exports.addCourse = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //保存！直接把fomidable拿到的表单JSON提交给数据库保存！不变形！
        Course.add(fields,function(err,r){
            if(err){
                res.send("提交失败！");
            }else{
                res.send("提交成功");
            }
        })
    });
}

//得到所有课程
exports.getallcourse = function(req,res){
    Course.getAll(function(results){
        res.json({"results" : results});
    })
}

//更改课程
exports.changecourse = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Course.change(fields,function(err,r){
            res.send("");
        });
    });
}

//删除课程
exports.deletecourse = function(req,res){
    //得到要删除的数组
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //HTTP请求的POST参数不能传数组，只能传递字符串。所以前台会把数组stringify
        //后台parse()
        var needToDelete = JSON.parse(fields.needToDelete);

        //调用模块的方法
        Course.delete(needToDelete,function(err,n){
           if(err){
               res.send("-1");
           }else{
               res.send(n.toString());
           }
        });
    });
}

//搜索
exports.search = function(req,res){
    var qobj = url.parse(req.url,true).query;

    //模糊查询请求！
    Course.search(qobj.w,function(results){
        res.json({"results" : results});
    });
}


//退出系统
exports.quit = function(req,res){
    req.session.login = null;
    res.json({'result':1});
}