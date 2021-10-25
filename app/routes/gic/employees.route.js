const { Controller } = require('cores/Controller')
const { View } = require('cores/View')
const { EmployeesController } = require('controllers/gic/employees.controller')

class EmployeesRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    return this.get('/cafes/employees', (req, res) => new EmployeesController().controller(req, res))
  }
}

module.exports = { EmployeesRoute }
