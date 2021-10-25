//route home
const { HomeRoute } = require('routes/home/home.route')
const { AboutRoute } = require('routes/home/about.route')

//route GIC
const { DrinksRoute } = require('routes/gic/drinks.route')
const { CafesRoute } = require('routes/gic/cafes.route')
const { CreateCafeRoute } = require('routes/gic/createCafe.route')
const { CreateEmployeeRoute } = require('routes/gic/createEmployee.route')
const { EmployeesRoute } = require('routes/gic/employees.route')

class Route {
  init() {
    return [
      //init home route
      new HomeRoute().route(),
      new AboutRoute().route(),

      //GIC
      new DrinksRoute().route(), //Covers both coffee and beers
      new CafesRoute().route(), //Get API to collect all cafes
      new CreateCafeRoute().route(), //POST API to create new cafe
      new CreateEmployeeRoute().route(), //POST API to create new employee
      new EmployeesRoute().route(), //Get API to collect all employees
    ]
  }
}

module.exports = { Route }
