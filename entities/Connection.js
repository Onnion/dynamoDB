'use strict'

const dynamoose = require('dynamoose');
const moment = require('moment');

const keys = require("../../../keys.json")
dynamoose.AWS.config.update({
      accessKeyId: keys.acess,
      secretAccessKey: keys.secret,
      region: 'sa-east-1'
});

const Connection = new mongoose.Schema({
      code: {
            type: String,
            required: true
      },
      departure_airport: {
            type: String,
            required: true,
            validate: function (v) { return /^[A-Z]{3,3}$/.test(v);}
      },
      arrival_airport: {
            type: String,
            required: true,
            validate: function (v) { return /^[A-Z]{3,3}$/.test(v); }
      },
      departure_date: {
            type: String,
            required: true,
      },
      arrival_date: {
            type: String,
            required: true,
      },
      duration: {
            type: Number,
            required: true,
            default: 0
      },
      waiting: {
            type: Number,
            required: true,
            default: 0
      }

});
