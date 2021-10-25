const { Model } = require('cores/Model')
const { employeesSchema } = require('models/employees.model')
const { CustomeMessage } = require('helpers/customeMessage')
var _ = require('underscore');

class EmployeesController extends Model {
  constructor() {
    super()
    this.model = new Model(employeesSchema)
  }

  async controller(req, res, next) {
    const { model } = this
    // const filter = req.query
    const employees = await model.findAll()

    if (employees.length < 1) {
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
        data: _.sortBy( employees, 'days_worked' ).reverse()
      }
    })
  }
}

module.exports = { EmployeesController }
