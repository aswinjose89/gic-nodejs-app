const { Controller } = require('cores/Controller')
const { View } = require('cores/View')
const { CreateEmployeeController } = require('controllers/gic/createEmployee.controller')

class CreateEmployeeRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    return this.post('/cafe/employee', (req, res) => new CreateEmployeeController().controller(req, res))
  }
}

module.exports = { CreateEmployeeRoute }
