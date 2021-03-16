const express = require('express')
const app = express()
const port = 3000
//console.log(app);


app.get('/', (req, res) => {
  const myName = 'Karl';
  res.send(`<h1>Hello Express! ${myName}</h1>`)
})


app.get('/hello', (req, res) => {
  res.send('<h1>Hello, Express</h1>')
})

app.get('/api', (req, res) => {
	const id = req.query.id;
	const users = [
		{id: 1, name: '홍길동', kor: 75},
		{id: 2, name: '홍길만', kor: 80},
		{id: 3, name: '홍길순', kor: 85},
	]
	var sendUser = id ? users.filter(v => id == v.id) : [...users];
	res.json(sendUser);
});

app.listen(port, () => {
  console.log(`=====================================`);
  console.log(`http://127.0.0.1:300`);
  console.log(`=====================================`);
})