const moment = require('moment')

const zeroPlus = n => n < 10 ? '0' + n  : n 
const nowDate = () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
}

// module.exports = { zeroPlus: zeroPlus , nowDate: nowDate }
module.exports = { zeroPlus, nowDate }