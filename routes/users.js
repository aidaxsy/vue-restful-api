const express = require('express');
const bcrypt = require('bcrypt');
let router = express.Router();
let userModel = require('../db/userModel')

/*
注册接口
    + 业务接口说明:注册业务
    + 请求方式:post请求
    + 入参:username,password,password2
    + 返回值:重定向,注册成功重定向到/login,失败重定向到/regist 
*/
router.post('/regist',(req,res,next)=>{
    // console.log(req.body);
    // 接收post数据
    let {username,password,password2} = req.body;//解构赋值
    // 密码不直接存入数据库，先加密，再存入数据库
    password = bcrypt.hashSync(password, 10);
    // 数据校验工作，在这里完成
    // 查询是否存在这个用户
    userModel.find({username}).then(docs=>{
        if(docs.length > 0){
            // res.send('用户已存在')
            // 重定向
            res.redirect('/regist')
        }else{
            // 用户不存在，开始注册
            let createTimne = Date.now();
            // 插入数据
            userModel.insertMany({
                username,
                password,
                createTimne
            }).then(docs=>{
                res.json({
                    error:0,
                    data:{
                        username
                    }
                })
            }).catch(err=>{
                res.json({
                    error:1
                })
            })
        }
    })
});

/*
登录接口
    + 业务接口说明:登录业务
    + 请求方式:post请求
    + 入参:username,password
    + 返回值:重定向,注册成功重定向到/,失败重定向到/login
*/
router.post('/login',(req,res,next)=>{
    // 接收post数据
    let {username,password} = req.body;
    // 操作数据库
    userModel.find({username})
    .then(docs=>{
        if(docs.length > 0){
            // 说明有这个用户产生
            // 检验数据库里面的密文是否由你输入的明文密码产生
            var result = bcrypt.compareSync(password,docs[0].password)
            if(result){
                res.json({
                    error:0,
                    data:{
                        username
                    }
                })
            }else{
                res.json({
                    error:1
                })
            }
            
        }else{
            res.json({
                error:1
            })
        }
    })
    .catch(function(){
        res.json({
            error:1
        })
    })
});


module.exports = router;
