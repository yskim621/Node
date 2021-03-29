const express = require('express')
const app = express()
app.listen(3001, ()=> {console.log('http://127.0.0.1:3001')})

//1번 방식
app.use((req, res, next) => {
  req.msg = '미들웨어 1번';
  next()
})

//2번 방식
const mw2 = (req, res, next) =>{
  req.msg2 = '미들웨어 2번'
  next()
}

//3번 방식
const mw3 = (value) => {
  return (req, res, next) => {
    req.msg3 = '미들웨어 ' + value
    next()
  }
}

//4번 방식 - 미들웨어 내에서 실행
const mw4 = (req, res, next) =>{
  req.msg4 = '미들웨어 4번'
  //next()
}

app.get('/1', (req, res, next)=>{
  res.json({
    mw1: req.msg,
    mw2: req.msg2
  })
})

app.get('/2', mw2, mw3('3번'), (req, res, next ) => {
  //mw4(req, res, next)
  res.json({
    mw1: req.msg,
    mw2: req.msg2,
    mw3: req.msg3,
    mw4: req.msg4,
  })
})


app.get('/2', isUser, myJoy('3번'), (req, res, next ) => {
  mw4(req, res, next)
  res.json({
    mw1: req.msg,
    mw2: req.msg2,
    mw3: req.msg3,
    mw4: req.msg4,
  })
})