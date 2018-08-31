var Rented=require("../models/Rented");

//统计分析页面
exports.showStatistics = function(req,res){
    if(!(req.session.login)){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("statistics",{
        "column" : "login" ,
        "login" : req.session.login,
        'yonghuming': req.session.yonghuming
    });
}
//租出
exports.lease1=function(req,res,next){
    Rented.find({"d":true}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}