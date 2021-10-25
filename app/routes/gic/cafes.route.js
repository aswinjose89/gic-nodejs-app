const { Controller } = require('cores/Controller')
const { View } = require('cores/View')
const { CafesController } = require('controllers/gic/cafes.controller')

class CafesRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    return this.get('/cafes', (req, res) => new CafesController().controller(req, res))
  }
}

module.exports = { CafesRoute }
