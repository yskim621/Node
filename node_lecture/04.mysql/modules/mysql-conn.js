// const mysql = require('mysql2')
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });

// Async + await 형식의 처리 방식
const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, 
  // 동시 접속자 처리 수 - 일종의 토큰 방식으로 동접자가 Limit를 넘으면 서버가 respone을 안하고 접속자가 많아서 메모리 사용이 max가 되면 일정 서비스가 안 되거나 서버 다운(메모리 확장 필요)
  connectionLimit: 10, 
  queueLimit: 0
});

module.exports = { mysql, pool }