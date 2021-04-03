const Joi = require('joi')



const schemas = {
  book: {
    id: Joi.number(),
    page: Joi.number(),
    bookName: Joi.string().max(255).required(),
    writer: Joi.string().max(255).required(),
    content: Joi.string(),
  },
  join: {
    userid: Joi.string().min(8).max(24).required(),
    userpw: Joi.string().min(8).max(24).required(),
  }
}

const joiMiddleWare = (value) => {
  return async (req, res, next) => {
    try{
      const schema = Joi.object(schemas[value])
      await schema.validateAsync(req.body)
      next()
    }
    catch(err){
      next(err)
    }
  }
}

module.exports = joiMiddleWare
