var express=require("express");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/car');
var app=express();
var session = require('express-session');
//使用session中间件
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
//登录注册首页
var router=require("./controller/router");
//客户页
var client=require("./controller/client");
//租赁页面
var lease=require("./controller/lease");
//归还页面
var returns=require("./controller/return");
//统计分析页面
var statistics=require("./controller/statistics");
//汽车类别
var category=require("./controller/category");
//汽车档案
var carfiles=require("./controller/carfiles");
//数据展示
var data=require("./controller/data");

//设置ejs
app.set('view engine', 'ejs');
//路由映射
app.use(express.static('static'));
//router 路由登录注册
app.get("/",router.showLogin)//显示登录页
app.post("/checklogin",router.checklogin);//校验
app.get("/regist",router.showRegister)//注册页
app.get("/checkuserexist",router.checkuserexist);//验证用户名是否被占用
app.post("/doreg",router.doreg);//实现用户注册
app.get("/index",router.showIndex)//显示首页

//客户查询页面
app.get("/query",client.showQuery)//显示客人查询页
app.get('/student',client.getAllStudent);//Ajax接口得到所有客户
app.post('/student',client.doAddStudent);//Ajax接口添加客户
app.get('/student/:sid', client.showUpdate);//呈递更改客户表
app.post('/student/:sid', client.updateStudent);//更改客户
app.delete('/student/:sid',client.deleteStudent);//删除客户

//租赁登记
app.get("/lease",lease.showLease)//显示租赁登记页
app.get("/getLease",lease.showGetLease)//显示汽车租赁类
app.get("/kehu",lease.getAllkehu)//获取所有客户
app.get("/carData",lease.carData)//获取单独类型车的数据
app.get("/carsid",lease.carsid)//获取汽车价格
app.post("/lease2",lease.lease)//租出汽车

//归还页面路由
app.get("/return",returns.showReturn)//显示归还登记页
app.get("/guihuan",returns.return)//归还页渲染
app.get("/quedinghuan/:sid",returns.quehuan)//查看所交的钱，以及退款
app.get("/returnCar",returns.returnCar)//确定归还汽车


//统计分析页面路由
app.get("/statistics",statistics.showStatistics)//显示统计分析页
app.post("/lease1",statistics.lease1)//租出汽车

//汽车类别
app.get("/category",category.showCategory)//显示类别档案页
app.get('/category1',category.getAllCategory);//Ajax接口得到所有汽车类别
app.post("/category",category.addCategory)//显示汽车类别档案页
app.get('/category2/:sid', category.showUpdate1);//呈递更改汽车类别
app.post('/category2/:sid', category.updatedangan);//更改汽车类别
app.delete('/category/:sid',category.deletedangan);//删除汽车类别

//汽车档案
app.get("/carfiles",carfiles.showCarfiles)//显示汽车档案页
app.get("/carfiles1",carfiles.getAllCarfiles);//显示汽车档案Ajax接口得到的所有汽车类型
app.get("/search",carfiles.search);// 实现汽车搜索功能
app.post("/carfiles",carfiles.addCarfiles);//显示汽车档案页
app.get("/carfiles2/:sid",carfiles.showUpdateCarfiles);//呈递更改汽车类型表
app.post("/carfiles2/:sid",carfiles.updateCarfiles);//显示更改后汽车类型表
app.delete("/carfiles/:sid",carfiles.deleteCarfiles);//删除汽车类型

//数据展示
app.get("/data",data.showData)//显示数据展示页
app.get("/show",data.show)//展示数据


//退出系统
app.get('/quit',router.quit);

app.listen(3000);
console.log("3000端口已经在服务器运行")