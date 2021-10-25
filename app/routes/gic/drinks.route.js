const axios = require('axios');
const { Controller } = require('cores/Controller')
const { View } = require('cores/View')
var _ = require('underscore');
const { DrinksController } = require('controllers/gic/drinks.controller')

Array.prototype.randomizer = function(){
  return this[Math.floor(Math.random()*this.length)];
}

class DrinksRoute extends Controller {
  constructor() {
    super()
    this.view = new View()
  }
  route() {
    const { view } = this
    return this.get('/drinks', (req, res) => new DrinksController().controller(req, res))
  }  
}

module.exports = { DrinksRoute }
