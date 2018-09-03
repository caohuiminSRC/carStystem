var express=require("express");
var app=express();
var router=require("./controller/router")
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/food');
var ejs = require('ejs');
// app.set('view engine', 'ejs')
app.engine('html',ejs.__express);
// 设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
app.set('view engine', 'html');
app.use(express.static('static'));
app.use("/uploads",express.static('uploads'));


app.get("/",router.showIndex)
app.get('/category1',router.getAllCategory);//Ajax接口得到所有菜类别
app.post("/category",router.addCategory)//显示菜类别档案页
app.get('/category2/:sid', router.showUpdate1);//呈递更改菜类别
app.post('/category2/:sid', router.updatedangan);//更改菜类别
app.delete('/category/:sid',router.deletedangan);//删除菜类别

app.get("/add",router.showAdd);
app.get("/find",router.find)//防止菜排序号冲突
app.get('/student',router.getAllStudent);//Ajax接口得到所有菜
app.get('/student22222',router.getAllStudent2);//Ajax接口得到所有菜
app.post('/student',router.doAddStudent);//Ajax接口添加菜
app.get("/admin/student/uploadform",router.sendFile)//防止提交表单乱跳

app.get("/list",router.showList)//商品列表
app.get('/student/:sid', router.showUpdate);//呈递更改客户表
app.post('/studentsss', router.updateStudent);//更改客户
app.delete('/student/:sid',router.deleteStudent);//删除客户
app.get("/getLease",router.showGetLease)//显示菜类
app.get("/cai",router.cai)//筛选菜类
app.get("/admin/student/bianji",router.File)//防止提交表单乱跳编辑

app.get("/search",router.search);//模糊查找
// app.get("/search2",router.search2);//精确查找


app.get("/uploads/:address",function (req,res,next) {
    next();
})//获取图片
app.listen(3000,"172.16.49.70");
// app.listen(3000);
console.log("3000")