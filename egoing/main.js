var http = require('http');
var fs = require('fs');
var url = require('url');


function templateHTML(title, list, body){
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
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  filelist.forEach(value => {
    list += `<li><a href=/?id=${value}>${value}</li>`
  });
  list += '</ul>'
  return list;
}

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
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir(`./data`, function (error, filelist) {
        //console.log(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list =  templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);