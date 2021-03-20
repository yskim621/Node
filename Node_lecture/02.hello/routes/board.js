const express = require('express')
const router = express.Router()


// /board /board/list /board
router.get(['/', '/list', '/list/:page'], (req, res, next)=>{
  res.send('<h1>Board List</h1>')
})

module.exports = router;