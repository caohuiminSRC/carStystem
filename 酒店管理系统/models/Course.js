//类，mongoose使用的类，管理员类
var mongoose = require("mongoose");
var Room=require("./Room.js")
//这个模型返回一个构造函数
var courseSchema = mongoose.Schema({
    "cid" : Number,
    "name" : String,
    "measure" : String,
    "bed" : Number,
    "meal" : String,
    "network" : String,
    "television" : String,
    'number':Number,
    'surplus':Number,
    "price" : Number,
    "customer" : [Number]
});
//静态方法：增加房间类型
courseSchema.statics.add = function(json,callback){
    var $this=this;
    Room.find({"name":json.name,"meal":"未入住"},function(err,results){
        json.surplus=results.length;
        Room.find({"name":json.name},function(err,results){
            json.number=results.length;
            console.log(json);
            $this.create(json,function(err,r){
                callback(err,r);
            });
        })
    })
    // this.create(json,function(err,r){
    //     callback(err,r);
    // });
}
//静态方法：得到所有房间类型
courseSchema.statics.getAll = function(callback){
    this.find({}).sort({"cid":1}).exec(function(err,results){
        if(results.length==0){
            return;
        }else{
            for(let i=0;i<results.length;i++){
                Room.find({"name":results[i].name},function(err,result){
                    // console.log(result);
                    results[i].number=result.length;
                    Room.find({"name":results[i].name,"meal":"未入住"},function(err,result){
                        // console.log(result);
                        results[i].surplus=result.length;
                        results[i].save();
                    })
                })

                console.log(results[i]);
            }
            callback(results);
        }
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
var Course = mongoose.model("Room",courseSchema);

//暴露！
module.exports = Course;