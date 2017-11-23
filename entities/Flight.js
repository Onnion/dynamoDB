'use strict'

const dynamoose = require('dynamoose');
const moment = require('moment');
const Connection = require('./Connection');
const Price = require('./Price');

const keys = require("../../../keys.json")
dynamoose.AWS.config.update({
      accessKeyId: keys.acess,
      secretAccessKey: keys.secret,
      region: 'sa-east-1'
});

const Flight = new mongoose.Schema({
      code: {
            type: String,
            required: true
      },
      departure_airport: {
            type: String,
            required: true,
            validate: function (v) { return /^[A-Z]{3,3}$/.test(v); }
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
      boarding_tax: {
            type: Number,
            required: true
      },
      duration: {
            type: Number,
            required: true,
            default: 0
      },
      connections: [Connection.schema],
      prices: [Price.schema]

});

Flight.methods.addConnection = function (connection) {
      this.connections.push(connection);
};

Flight.methods.addPrice = function (price) {
      this.prices.push(price);
};

Flight.methods.validateConnection = function () {

      var error = this.validateSync();

      if (typeof error === 'undefined') {

            return { erro: false };

      } else {

            var errosTranforns = [];

            for (var prop in error.errors) {
                  errosTranforns.push({
                        message: error.errors[prop].message,
                        path: error.errors[prop].path
                  });
            }

            return { erro: true, errors: errosTranforns };
      }

};

module.exports = mongoose.model('Flight', Flight);
