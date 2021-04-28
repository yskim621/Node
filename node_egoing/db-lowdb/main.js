var http = require('http');
var fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var shortid = require('shortid');


// db.json파일에 JSON형식으로 데이터를 저장
const adapter = new FileSync('db.json')
const db = low(adapter)

// 해당 정보가 지정된 파일에 없으면 자동 생성
db.defaults({ topic: [], author: []}).write()
// db.get('author').push({
//     id:1,
//     name: 'egoing',
//     profile: 'developer'
// }).write();

// db.get('topic').push({
//     id:1,
//     title:'lowdb',
//     description:'lowdb is ...',
//     author:1
// }).write();

// db.get('topic').push({
//     id: 2,
//     title: 'mysql',
//     description: 'mysql is ...',
//     author: 1
// }).write();

// console.log(
//     db.get('topic')
//     .find({title:'lowdb', author: 1})
//     .value()
// );

// db.get('topic')
//     .find({id:2})
//     .assign({title:'MySQL & MariaDB'})
//     .write();

// db.get('topic')
//     .remove({id:2})
//     .write();

var sid = shortid.generate();
db.get('author')
    .push({
        id:sid,
        name:'taeho',
        profile:'data scientist'
    })
    .write();

db.get('topic')
    .push({
        id:shortid.generate(),
        title:'PostgreSQL',
        description:'PostgreSQL is ...',
        author:sid
    })
    .write();

var app = http.createServer(function(request,response){
    var url = request.url;
    if(url == '/'){
      url = '/web.html';
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));

});
app.listen(3000);
