const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// db.json파일에 JSON형식으로 데이터를 저장
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({users:[], topics:[]}).write();

module.exports = db;