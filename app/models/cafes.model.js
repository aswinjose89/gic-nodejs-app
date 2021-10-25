const { Module } = require('configs/Module')
const mongoose = new Module().mongoose()

const setCafesSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  employees: {
    type: Number,
    trim: true,
    required: true
  },
  logo: {
    type: String,
    default: null
  },
  location: {
    type: String,
    trim: true,
    required: true
  }
},
{
    timestamps: true
})

const cafesSchema = mongoose.model('cafes', setCafesSchema)
module.exports = { cafesSchema }