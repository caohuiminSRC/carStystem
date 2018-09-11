//类，mongoose使用的类，管理员类
var mongoose = require("mongoose");
var Course = require("./Course.js")
//这个模型返回一个构造函数
var courseSchema = mongoose.Schema({
    "cid" : Number,
    "name" : String,
    "measure" : String,
    "bed" : String,
    "meal" :String,
    "price":String,
    "surplus":String
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
        results[0].bed = newJSON.bed;
        //入住状态不能随便更改
        // results[0].meal = newJSON.meal;
        results[0].save();
    })
}
courseSchema.statics.change2 = function(newJSON,callback){
    this.find({"_id" : newJSON["_id"]},function(err,results){
        results[0].measure = newJSON.measure;
        results[0].bed = newJSON.bed;
        //入住状态不能随便更改
        // results[0].meal = newJSON.meal;
        results[0].save();
        callback();
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
//静态方法：得到所有且未入住的房间
courseSchema.statics.getNoShow = function(types,callback){
    this.find({"name":types,"meal":'未入住'}).sort({"cid":1}).exec(function(err,results){
            callback(results);
    });
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
var Course = mongoose.model("Type",courseSchema);

//暴露！
module.exports = Course;