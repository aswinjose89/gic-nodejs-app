const { Model } = require('cores/Model')
const { cafesSchema } = require('models/cafes.model')
const { CustomeMessage } = require('helpers/customeMessage')
const { Jwt } = require('libs/jwt')

class CreateCafeController extends Model {
  constructor() {
    super()
    this.model = new Model(cafesSchema)
    this.jwt = new Jwt()
  }

  async controller(req, res) {
    const { model, jwt } = this
    const { name, description, employees, logo, location } = req.body
    const cafe = await model.findOne({ name, description, employees, logo, location })

    if (cafe) {
      return new CustomeMessage(res).error(409, {
        response: {
          status: 'error',
          code: res.statusCode,
          method: req.method,
          message: 'Oops..data already exists in database',
          data: cafe
        }
      })
    }

    const { _id } = await model.findOneAndCreate({ name, description, employees, logo, location })
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

module.exports = { CreateCafeController }
