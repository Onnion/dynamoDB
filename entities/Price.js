'use strict';

const dynamoose = require('dynamoose');
dynamoose.AWS.config.update({
      accessKeyId: keys.acess,
      secretAccessKey: keys.secret,
      region: 'sa-east-1'
});

const FareSchema = new dynamoose.Schema({
      money: {
            type: Number,
            default: 0
      },
      points: {
            type: Number,
            default: 0
      }
});

const PriceSchema = new dynamoose.Schema({
      type: {
            type: String,
            default: 'points'
      },
      adult: FareSchema,
      child: FareSchema,
      baby: FareSchema,
      boarding: {
            type: Number,
            default: 0
      },
      modality: {
            type: String,
            default: null
      }
});

module.exports = mongoose.model('Price', PriceSchema);