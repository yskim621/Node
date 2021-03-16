var fs = require('fs');
var compression = require('compression');
var sanitizeHtml = require('sanitize-html');
// express는 routing이 주요 기능
const express = require('express');
var bodyParser = require('body-parser')
var topicRouter = require('./routes/topic')
var indexRouter = require('./routes/index')
var helmet = require('helmet')
const app = express()
const port = 3000

app.use(helmet())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());
app.get('*', function(request, response, next){
  fs.readdir(`./data`, function (error, filelist) {
    request.list = filelist;
    next();
  });  
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


/* http로 해당 WebApp에 접속할 때마다 콜백 함수 호출(콜백 함수는 객체인 request와 response를 매개변수로 갖음)
var app = http.createServer(function (request, response) {
  var _url = request.url;
  // port의 뒷 부분인 / 부터 URL의 query string을 객체 형태로 parsing해줌
  var queryData = url.parse(_url, true).query;
*/