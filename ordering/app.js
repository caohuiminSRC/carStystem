var express = require("express");
var app = express();
var path = require("path")

app.use(express.static("view"))
app.use(express.static("public"))
app.get("/"    ,function (req, res) {
    res.sendFile(path.join(__dirname , "view/index.html"));
})
app.listen(4000);