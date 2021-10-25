const { Module } = require('configs/Module')
const mongoose = new Module().mongoose()

const setEmployeesSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  cafe: {
    type: String,
    trim: true,
    required: true
  },
  days_worked: {
    type: Number,
    trim: true,
    required: true
  }
},
{
    timestamps: true
})

const employeesSchema = mongoose.model('employees', setEmployeesSchema)
module.exports = { employeesSchema }