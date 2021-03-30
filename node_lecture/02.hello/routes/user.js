const express = require('express')
const router = express.Router()

const pug = { title: '회원관리', css: 'user'}

router.get('/', (req, res, next) => {
  const users = [
		{id: 1, name: '홍길동', kor: 75},
		{id: 2, name: '홍길만', kor: 80},
		{id: 3, name: '홍길순', kor: 85},
	]
  // 첫번째 인자는 view file , 두번째 인자는 객체
  //res.render('hello', {users, ...pug})
  res.render('user/list', {users, ...pug})
})
router.get('/join', (req, res, next) => {
  res.send('<h1>User Join</h1>')
})
router.get('/login', (req, res, next) => {
  res.send('<h1>User login</h1>')
})
router.get('/logout', (req, res, next) => {
  res.send('<h1>User logout</h1>')
})

module.exports = router