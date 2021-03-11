<<<<<<< HEAD
var mysql = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '********',
  database : 'opentutorials'
});
  
connection.connect();
  
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
  
=======
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'opentutorial',
  insecureAuth: true
});
 
connection.connect();
 
connection.query('SELECT * from topic', function (error, results, fields) {
  if (error) {
      console.log(error);
  } 
  console.log(results);
});
 
>>>>>>> d8e8f025dfa072c72fd6f0d3589a2f2603a9d5b0
connection.end();