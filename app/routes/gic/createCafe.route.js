const { Controller } = require('cores/Controller')
const { View } = require('cores/View')
const { CreateCafeController } = require('controllers/gic/createCafe.controller')

class CreateCafeRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    return this.post('/cafe', (req, res) => new CreateCafeController().controller(req, res))
  }
}

module.exports = { CreateCafeRoute }
