var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
const shortid = require('shortid');
var db = require('../lib/db');
const bcrypt = require('bcrypt');


module.exports = function(passport){
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
    console.log(fmsg);
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  // 로그인 전송 시 passport가 로그인 처리
  router.post('/login_process',
    passport.authenticate('local', { 
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true 
  }));
  
  router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
    console.log(fmsg);
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
        <p><input type="password" name="pwd" placeholder="password" value="111111"></p>
        <p><input type="password" name="pwd2" placeholder="password comfirm" value="111111"></p>
        <p><input type="text" name="displayName" placeholder="displayName" value="egoing"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if(pwd !== pwd2){
      request.flash('error', 'Password must same!');
      response.redirect('/auth/register');
    } else{
      bcrypt.hash(pwd, 10, function(err, hash) {
        var user = {
          id:shortid.generate(),
          email: email,
          password: hash,
          displayName: displayName
        }
        db.get('users').push(user).write();
        request.login(user, function(err){
          console.log('redirect');
          return response.redirect('/');
        })
        
      });
    }
  });

  router.get('/logout', function (request, response) {
    request.logout();
    // request.session.destroy(function(err){
    //   response.redirect('/');
    // });
    request.session.save(function(){
      response.redirect('/');
    })
  });

  return router;
};