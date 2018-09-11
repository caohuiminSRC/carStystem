//引用模块
var express = require("express");
var session = require('express-session')
var mongoose = require("mongoose");
//路由
var common_router = require("./router/common-router.js");//登录公共
var admin_router = require("./router/admin-router.js");//管理员
var student_router = require("./router/student-router.js");//客户
//创建APP
var app = express();
//mongoose在链接数据库，此时这两条语句要写在app.js中而不是每个模块中
//因为mongoose底层是在帮我们监听是不是在连接数据。在需要使用mongoose实例的地方，请重新require它。而不要connect它！
mongoose.connect('mongodb://localhost:27017/hotel');
//设置默认模板引擎
app.set("view engine","ejs");
//设置session
//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'hotelSystem', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));
app.use ("/public" ,express.static("public"));


app.get ("/",common_router.showIndex);//登录
app.get("/register",student_router.showRegister)//客户注册
app.get("/checkuserexist",student_router.checkuserexist);//验证用户名是否被占用
app.post("/doreg",student_router.doreg);//实现用户注册
app.get ("/revise",student_router.showRevise);//修改用户密码页面
app.get ("/revise/changepw",student_router.changepw);//修改用户密码


app.post("/checklogin",common_router.checklogin);//Ajax接口，检查登录是否成功，能够返回{result:-2}


app.get ("/admin",admin_router.showAdmin);//管理员管理面板
app.post("/admin/student/changepw",admin_router.changepw);//管理员修改用户密码
app.get("/admin/revise",admin_router.showAdminRevise);//修改管理员密码页面
app.post("/admin/changepw",admin_router.changepwAdmin);//修改管理员密码

app.get("/category",admin_router.Category);//显示添加房间类别页面
app.post("/admin/course/add",admin_router.addCourse);//增加房间类型
app.get ("/admin/course/all",admin_router.getallcourse);//Ajax的接口，得到所有房间类型
app.post("/admin/course/change",admin_router.changecourse);//Ajax的接口，改变房间数据
app.post("/admin/course/delete",admin_router.deletecourse);//Ajax的接口，删除房间类型
app.get("/admin/course/moyige",admin_router.moyige);//获取某一个类型的数据

app.get ("/admin/student",admin_router.showRoom);//新建房间
app.post("/admin/room/add",admin_router.addRoom);//增加房间类型
app.get ("/admin/room/all",admin_router.getallroom);//Ajax的接口，得到所有房间
app.post("/admin/room/change",admin_router.changeroom);//Ajax的接口，改变房间数据
app.post("/admin/room/change2",admin_router.changeroom2);//Ajax的接口，改变房间数据
app.post("/admin/room/delete",admin_router.deleteroom);//Ajax的接口，删除房间
app.get("/admin/room/find",admin_router.findRoom);//查找房间页面
app.get("/admin/room/findRoom",admin_router.find);//查找房间

app.get("/lobby",admin_router.showLobby);//大堂入住页面
app.get ("/admin/room/noShow",admin_router.getNoShow);// 得到所有且未入住的房间
app.post("/checkin",admin_router.addCheckin);//Ajax的接口 大堂入住！


app.get("/out",admin_router.showOut);//退房管理
app.get("/admin/room/outFind",admin_router.outFind)//退房查找
app.get("/admin/room/chekout",admin_router.chekout)//确认退房

app.get("/record",admin_router.showRecord)//入住记录查询页面
app.get("/admin/room/findRecord",admin_router.findRecord)//入住查询

app.get("/check",admin_router.showCheck)// 管理员订单查询页面
app.get("/admin/room/checkFind",admin_router.checkFind)//订单房查找

app.post("/check",admin_router.Checkin)//订单入住
app.get("/onLine",student_router.showOnline)//在线预订页
app.post("/onlineRoom",student_router.addRoom) //预订房间                                                                   //预订成功
app.get("/findOnline",student_router.findOnline)//查询预订房间页
app.get("/student/room/findOnline",student_router.findRecord);//预订房间查询
app.get("/student/room/chekout",student_router.chekout); //取消订单
app.post("/student/room/change",student_router.change);//修改订单
app.get('/quit',admin_router.quit);//退出系统
//静态资源服务
app.get ("/*",common_router.show404);//404页面
//监听
app.listen(3000);
console.log("3000");
