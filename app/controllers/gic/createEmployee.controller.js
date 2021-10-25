const { Model } = require('cores/Model')
const { employeesSchema } = require('models/employees.model')
const { CustomeMessage } = require('helpers/customeMessage')
const { Jwt } = require('libs/jwt')

class CreateEmployeeController extends Model {
  constructor() {
    super()
    this.model = new Model(employeesSchema)
    this.jwt = new Jwt()
  }

  async controller(req, res) {
    const { model, jwt } = this
    const { name, cafe, days_worked } = req.body
    const employee = await model.findOne({ name, cafe })

    if (employee) {
      return new CustomeMessage(res).error(409, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..Employee and cafe already exists.No same employee can work in 2 cafes',
          data: employee
        }
      })
    }

    const duplicate = await model.findOne({ name, cafe, days_worked })

    if (duplicate) {
      return new CustomeMessage(res).error(409, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..data already exists in database',
          data: duplicate
        }
      })
    }


    const { _id } = await model.findOneAndCreate({ name, cafe, days_worked })
    const token = jwt.createToken({ _id, name }, { expiresIn: '1d', algorithm: 'HS384' })
    return new CustomeMessage(res).success(200, {
      response: {
        status: 'success',
        code: res.statusCode,
        method: req.method,
        message: 'Yeah..data successuly store in database',
        access_token: token
      }
    })
  }
}

module.exports = { CreateEmployeeController }
