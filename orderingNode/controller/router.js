var formidable = require("formidable");
var url = require("url");
//汽车类别
var dangan=require("../models/carClass")
//客户
var Student = require("../models/student.js");
//时间模块
var sd = require("silly-datetime");
var path = require("path");
var fs = require("fs");
exports.showIndex=function (req,res) {
   // res.render("index")
    res.sendFile(path.join(__dirname , "../views/index.html"));
}
//Ajax接口，得到所有客人
//获取所有菜类别
exports.getAllCategory = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    dangan.count({},function(err,count){
        //第6页： limit(2)  skip(10)
        dangan.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//执行添加菜类别
exports.addCategory = function(req,res){
    console.log("服务器收到了一个POST请求");
    var car=[]
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        dangan.addCategory(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//显示菜类别
exports.showUpdate1 = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    dangan.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        //返回数据
        res.json({ "info" : results[0]})
    });
}
//更改菜类别
exports.updatedangan = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        //更改学生
        dangan.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            Student.find({"xuan":results[0].cailei},function (err,data) {
                if(data.length == 0){
                    //更改属性
                    thestudent.cailei = fields.cailei;
                    thestudent.state = fields.state;
                    thestudent.save()
                    res.json({"result" : 1});
                    return;
                }else{
                    for (var i=0;i<data.length;i++){
                        data[i].xuan=fields.cailei;
                        data[i].state=fields.state;
                        data[i].save()
                    }
                    //更改属性
                    thestudent.cailei = fields.cailei;
                    thestudent.state = fields.state;
                    //持久化
                    thestudent.save(function(err){
                        if(err){
                            res.json({"result" : -1});
                        }else{
                            res.json({"result" : 1});
                        }
                    });
                }

            })

        });
    });
}
//删除菜类别
exports.deletedangan = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    //寻找这个学号的学生
    dangan.find({"sid" : sid},function(err,results){
        console.log(results);
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        Student.find({"xuan":results[0].cailei},function (err,data) {
            if(data.length == 0){
                results[0].remove();
                res.json({"result":1})
                return;
            }else{
                for (var i=0;i<data.length;i++){
                    data[i].remove()
                }
                //删除
                results[0].remove(function(err){
                    if(err){
                        res.json({"result" : -1});
                        return;
                    }
                    res.json({"result" : 1});
                });
            }
        })

    });
}


exports.showAdd=function (req,res) {
    // res.render("add");
    res.sendFile(path.join(__dirname , "../views/add2.html"));
}
//防止菜排序号冲突
exports.find=function(req,res){
    Student.checkSid(req.query.sid,function (data) {
        if(data){
            res.json({"result":1})
        }else{
            res.json({"result":-1})
        }
    })
}
//Ajax接口，得到所有菜
exports.getAllStudent = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    Student.count({},function(err,count){
        //分页的逻辑就是跳过（skip）多少条，读取（limit）多少条
        //比如每页两条
        //第1页： limit(2)  skip(0)
        //第2页： limit(2)  skip(2)
        //第3页： limit(2)  skip(4)
        //第4页： limit(2)  skip(6)
        //第5页： limit(2)  skip(8)
        //第6页： limit(2)  skip(10)
        Student.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.getAllStudent2 = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 2;
    //寻找条目总数
    Student.count({},function(err,count){
        //分页的逻辑就是跳过（skip）多少条，读取（limit）多少条
        //比如每页两条
        //第1页： limit(2)  skip(0)
        //第2页： limit(2)  skip(2)
        //第3页： limit(2)  skip(4)
        //第4页： limit(2)  skip(6)
        //第5页： limit(2)  skip(8)
        //第6页： limit(2)  skip(10)
        Student.find({}).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//执行添加
exports.sendFile=function(req,res){
    res.sendFile(path.join(__dirname , "../views/add.html"));
}
exports.doAddStudent = function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req, function(err, fields, files) {
        //使用第三方模块silly-datetime
        var t = sd.format(new Date(),'YYYYMMDDHHmmss');
        //生成随机数
        var ran = parseInt(Math.random() * 8999 +10000);
        //拿到扩展名
        var extname = path.extname(files.address.name);
        //旧的路径
        var oldpath = files.address.path;
        //改名
        fields.state=true//添加状态值
        fields.address=""+t+ran
        fs.rename(oldpath,'./uploads/'+t+ran+".jpg",function (err) {
            Student.addStudent(fields,function(result){
                res.send("添加成功")
            });
        });
    });
}
//显示菜类
exports.showGetLease=function(req,res,next) {
    dangan.find({}).exec(function (err, results) {
        res.json({"carClass": results})
    })
}
//筛选菜类
exports.cai=function(req,res,next){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var xuan= url.parse(req.url,true).query.xuan;
    var pagesize=2;
    Student.count({"xuan":xuan},function(err,count){
        //分页的逻辑就是跳过（skip）多少条，读取（limit）多少条
        //比如每页两条
        //第1页： limit(2)  skip(0)
        //第2页： limit(2)  skip(2)
        //第3页： limit(2)  skip(4)
        //第4页： limit(2)  skip(6)
        //第5页： limit(2)  skip(8)
        //第6页： limit(2)  skip(10)
        console.log(count);
        Student.find({"xuan":xuan}).limit(pagesize).skip(pagesize * page).exec(function (err, results) {
            res.json({"data": results,"pageAmount":Math.ceil(count / pagesize)})
        })
    });
}
exports.File=function(req,res){
    res.sendFile(path.join(__dirname , "../views/bianji.html"));
}

//模糊搜索
exports.search = function(req,res){
    var qobj = url.parse(req.url,true).query;
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize=2;
    //模糊查询请求！
    var str=[]
        Student.search(qobj.w,function(results){
            res.json({"results" : results.slice(pagesize * page,pagesize+pagesize * page),"pageAmount":Math.ceil(results.length / pagesize)});
        });
}
//精确搜索
exports.search2 = function(req,res){
    var qobj = url.parse(req.url,true).query;
    //模糊查询请求！
    var pagesize=2;
    //模糊查询请求！
    Student.count({},function(err,count){
        //分页的逻辑就是跳过（skip）多少条，读取（limit）多少条
        //比如每页两条
        //第1页： limit(2)  skip(0)
        //第2页： limit(2)  skip(2)
        //第3页： limit(2)  skip(4)
        //第4页： limit(2)  skip(6)
        //第5页： limit(2)  skip(8)
        //第6页： limit(2)  skip(10)
        Student.search2(qobj.w,function(results){
            res.json({"results" : results,"pageAmount":Math.ceil(count / pagesize)});
        });
    });
}

exports.showList=function (req,res) {
    res.render("list")
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
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req, function(err, fields, files) {
        var sid = fields.sid;
        if(!sid){
            return;
        }
        //更改学生
        Student.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.xuan = fields.xuan;
            thestudent.name = fields.name;
            thestudent.name = fields.name;
            thestudent.phone = fields.phone;
            thestudent.id = fields.id;
            thestudent.he = fields.he;
            fields.address=thestudent.address
            thestudent.tuijian = fields.tuijian;
            thestudent.tuijian2 = fields.tuijian2;
            thestudent.state = fields.state;
            //拿到扩展名
            var extname = path.extname(files.address.name==undefined?".jpg":files.address.name);
            //旧的路径
            // var oldpath = files.address.path==undefined?fields.address:files.address.path;
            var oldpath = files.address.path;
            console.log(files.address.size);
            //图片重命名
            if(files.address.size==0){
                console.log("sdfjsld")
                thestudent.save(function(err){
                    if(err){
                        res.json({"result" : -1});
                    }else{
                        res.send("修改成功")
                    }
                });
            }else{
                fs.rename(oldpath,'./uploads/'+fields.address+".jpg",function (err) {
                    //持久化
                    thestudent.save(function(err){
                        if(err){
                            res.json({"result" : -1});
                        }else{
                            res.send("修改成功")
                        }
                    });
                });
            }
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
// //获取图片
// exports.showImage=function (req,res) {
//     var img=req.params.address;
//     console.log(img);
// }