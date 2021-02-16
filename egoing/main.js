var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  filelist.forEach(value => {
    list += `<li><a href=/?id=${value}>${value}</a></li>`;
  });
  list += '</ul>';
  return list;
}

// http로 해당 WebApp에 접속할 때마다 콜백함 수 호출
var app = http.createServer(function (request, response) {
  var _url = request.url;
  // port의 뒷 부분인 / 부터 URL의 query string을 객체 형태로 parsing해줌
  var queryData = url.parse(_url, true).query;
  //console.log(queryData);
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id


  if (pathname === '/') {
    if (queryData.id === undefined) {

      fs.readdir(`./data`, function (error, filelist) {
        //console.log(filelist);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir(`./data`, function (error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list =  templateList(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a> `);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.writeHead(200);
      response.end(template);
    });
  } else if(pathname === '/create_process'){
    var body = '';
    // 전체 데이터의 일부를 서버가 수신할 때마다 해당 콜백 함수 호출
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        //console.log(post);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
    });

  } else if(pathname === '/update'){
    fs.readdir(`./data`, function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list =  templateList(filelist);
        var template = templateHTML(title, list, 
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a> `);
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    // 전체 데이터의 일부를 서버가 수신할 때마다 해당 콜백 함수 호출
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
          fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
    });

  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);