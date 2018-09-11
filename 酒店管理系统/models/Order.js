//类，mongoose使用的类，管理员类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var courseSchema = mongoose.Schema({
    "ID" : String,
    "sid" : String,
    "pwText" : String,
    "sex" : String,
    "meal" : String,
    "Roomnumber" : String,
    "surplus" : String,
    'price':String,
    'checkin':String,
    "day" : String,
    "enter":String,
    "start":Date,
    "end":Date,
    "sheng":String,
    "geshu":String,
    "phone":String,
    "message":String
});
//静态方法：增加房间类型
courseSchema.statics.add = function(json,callback){
    this.create(json,function(err,r){
        callback(err,r);
    });
}



//静态方法：得到所有房间类型
courseSchema.statics.getAll = function(callback){
    this.find({}).sort({"cid":1}).exec(function(err,results){
        callback(results);
    });
}
//改变房间数据，_id不更改
courseSchema.statics.change = function(newJSON){
    this.find({"_id" : newJSON["_id"]},function(err,results){
        results[0].name = newJSON.name;
        results[0].measure = newJSON.measure;
        results[0].number = newJSON.number;
        results[0].surplus = newJSON.surplus;
        results[0].bed = newJSON.bed;
        results[0].meal = newJSON.meal;
        results[0].network = newJSON.network;
        results[0].television = newJSON.television;
        results[0].price = newJSON.price;
        results[0].save();
    })
}
//静态方法：删除房间类型，接受一个_cid数组为参数，删除这个数组里面的所有项
courseSchema.statics.delete = function(arr,callback){
    var _arr = [];
    arr.forEach(function(item){
        _arr.push({"_id" : item});
    });

    //删除_id为这个，或者那个的。所以用$or引导！
    this.remove({$or : _arr},function(err,r){
        callback(err,r.n);
    });
};
//订单更改
courseSchema.statics.change2 = function(newJSON,callback){
    this.find({"_id" : newJSON["_id"]},function(err,results){
        results[0].geshu = newJSON.geshu;
        results[0].checkin = newJSON.checkin;
        results[0].pwText = newJSON.pwText;
        results[0].phone = newJSON.phone;
        results[0].message = newJSON.message;
        results[0].save();
        callback(1)
    })
}

//查询方法
courseSchema.statics.search = function(word,callback){
    console.log("我是Course类，我收到了模糊查询次" + word);
    this.find(
        {
            "$or" : [
                {"detail" : new RegExp(word)},
                {"name" : new RegExp(word)},
                {"teacher" : new RegExp(word)}
            ]
        }
    ).sort({"cid":1}).exec(
        function(err,results){
            callback(results);
        }
    );
}

//根据schema创建模型！
var Course = mongoose.model("order",courseSchema);

//暴露！
module.exports = Course;