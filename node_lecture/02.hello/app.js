const express = require('express')
const app = express()
const path = require('path')
const createError = require('http-errors')
// 구조 분해 할당
const {zeroPlus, nowDate} = require('./modules/util')
//const util = require('./modules/util') // {zeroPlus, nowDate}
 
app.listen(3000, ()=> {
  console.log(`=====================================`);
  console.log(`Server Start`);
  console.log(`http://127.0.0.1:300`);
  console.log(`=====================================`);
})

/* pug view engine 이용을 위한 code */
app.set('view engine', 'ejs')
//app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.locals.pretty = true;

// Front End 개발자는 public folder내에서 개발
app.use('/', express.static(path.join(__dirname, './public')))
app.use('/uploads', express.static(path.join(__dirname, './storages')))

/* Middleware - router로 넘어가기 전에 processing하는 단계 */
//path가 없기 때문에 무조건 실행
app.use((req, res, next)=>{
  req.nowTime = nowDate();
  console.log(req.nowTime)
  next();
})

/* Router */
const userRouter = require('./routes/user')
const boardRouter = require('./routes/board')
app.use('/user', userRouter)
app.use('/board', boardRouter)

/* response가 있는 것은 router
app.get('/', (req, res, next)=>{
  res.send('<h1>Hello Root'+ req.nowTime +'</h1>')
})
*/


/* Error */
// app.get('/hello', (req, res, next)=>{
//   next(createError(500, {msg: 'DB에러가 발생하였습니다.'}))
//   res.send('hello'+ req.nowTime)
// })

app.use((req, res, next)=>{
  const msg = '<h1 style="margin: 100px;">Error 404</h1><div>'+ req.nowTime +'</div>';
  next(createError(404, {msg, code:404}))
})

app.use((err, req, res, next)=>{
  //console.log(err)
  res.send(err.msg)
})