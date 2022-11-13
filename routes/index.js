const express = require("express");
const articleModel = require('../db/articleModel');
const moment = require('moment');
let router = express.Router();

// 返回指定页路由
router.get("/list",(req,res)=>{
    // console.log(req.query);
    // 数据类型是number
    let page = parseInt(req.query.page || 1);//如果page没有传，默认是第一页
    let size = parseInt(req.query.size || 5);//如果size没有传，默认一页显示5条文章
    let username = req.session.username;
    // 第一步：查询文章总页数并计算总页数
    articleModel.find().count().then(total=>{
        // console.log(total);//total就是文章的总条数
        // 获取总页数
        var pages = Math.ceil(total/size);
        // 第二步：分页查询
        // page = 2&size = 5
        // 6-10;
        articleModel.find().sort({'createTime':-1}).skip((page-1)*size).limit(size)
        .then(docs=>{
            // console.log(docs);//docs不是传统意义的js数组，要使用slice()方法把它转换成js数组
            var arr = docs.slice();
            // console.log(typeof arr);
            for(var i = 0; i < arr.length; i++){
                // 原有的文档的字段值最好不要修改
                // 添加一个新的字段，来表示格式化的时间；
                arr[i].createTimeZH = moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss')
            }
            // console.log(arr);
            res.json({
                error:0,
                data:{
                    currentPage:page,
                    totalPage:pages,
                    list:arr
                }
            })
        })
        .catch(err=>{
            res.json({
                error:1
            });
        })
    })

})



// 详情页路由
router.get("/detail",(req,res)=>{
    var id = req.query.id;
    // 用id查询
    articleModel.findById(id)
    .then(doc=>{
        doc.createTimeZH = moment(doc.createTime).format('YYYY-MM-DD HH-mm-ss');
        res.json({
            error:0,
            data:doc
        })
    })
    .catch(err=>{
        res.json({
            error:1
        });
    })
    
}) 

module.exports = router;