var carClass=require("../models/carData");
var Rented=require("../models/Rented");
//归还页面
exports.showReturn = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("return",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
// 归还页面渲染
exports.return=function(req,res){
    console.log('111')
    Rented.find({"d":false}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//点击归还
exports.quehuan=function(req,res,next){
    var sid=req.params.sid
    Rented.find({"sid":sid,"d":true}).exec(function(err,results){
        res.json({
            "result" : results[0]
        });
    });
}
// 归还汽车
exports.returnCar=function(req,res,next){
    var sid=req.query.sid;
    var id=req.query.id;
    Rented.find({"id":id}).exec(function(err,results){
        results[0].d=false;
        results[0].save();
        carClass.find({"sid":sid}).exec(function(err,result){
            result[0].b=false;
            result[0].save();
            res.json({"result":1})
        });
    });
}