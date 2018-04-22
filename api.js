
const qiniu = require('qiniu');
const qs = require('querystring');
const fs = require('fs');
const request = require('request');
const http = require('http');

let bucket = 'picshow';
let domain = 'p7hgnuu8t.bkt.clouddn.com';
let accessKey = 'DpaRG0pS-N9DqNpGKY8_Bz078ZSR1icUCbkZ6bjf';
let secretKey = '83iUAorV8Wuh-0VDhv_ZHCTF2iTqPLZ8-vL5vOax';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
  scope: bucket
};

var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
//华南地区
config.zone = qiniu.zone.Zone_z2;

var bucketManager = new qiniu.rs.BucketManager(mac, config);

var list = [];

module.exports = {
  //发送token
  send_token: function(req, res) {
    res.json(uploadToken);
  },
  //获取所有图片信息
  getAllImage: function(req, res) {
    // {}必须要写！ 不服自己去改源码！
    bucketManager.listPrefix(bucket, {}, function(err, respBody, respInfo) {
      res.json(respBody.items);
    });
  },
  //图片下载
  download: function(req, res) {
    req.on('data',function(buf){
      var obj = qs.parse(buf.toString());

      res.set({
        "Content-type":"application/octet-stream",
        "Content-Disposition":"attachment;filename="+encodeURI(obj.key)
      });

      var publicDownloadUrl = bucketManager.publicDownloadUrl(domain, obj.key);
      var ImgPath = 'http://' + publicDownloadUrl;
      
      //下载到服务器
      var ImgStream = request(ImgPath).pipe(fs.createWriteStream(obj.key));

      res.json(ImgPath);
     
    })
  }
};
