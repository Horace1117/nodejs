var MyUtil = function () {
};
var http = require('http');
var superagent = require('superagent');

MyUtil.prototype.get=function(url,callback){
    superagent.get(url).end(function (err,res) {
        if(err){
            return console.error(err);
        }
        else{
            callback(res.text,res.statusCode);
        }
    })
}
module.exports = new MyUtil();