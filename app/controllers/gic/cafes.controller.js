const { Model } = require('cores/Model')
const { cafesSchema } = require('models/cafes.model')
const { CustomeMessage } = require('helpers/customeMessage')
var _ = require('underscore');

class CafesController extends Model {
  constructor() {
    super()
    this.model = new Model(cafesSchema)
  }

  async controller(req, res, next) {
    const { model } = this
    const filter = req.query
    console.log(req.query)
    const cafes = await model.findAll(filter)

    if (cafes.length < 1) {
      return new CustomeMessage(res).error(404, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..data not exists or deleted from owner'
        }
      })
    }

    return new CustomeMessage(res).success(200, {
      response: {
        status: 'success',
        code: res.statusCode,
        method: req.method,
        message: 'Yeah..data already to use',
        data: _.sortBy( cafes, 'employees' ).reverse()
      }
    })
  }
}

module.exports = { CafesController }
