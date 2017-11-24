'use strict';

const dynamoose = require('dynamoose');
const dotenv    = require('dotenv');

//Loading config
dotenv.load();

//Dynamo config
var dynamoconfig = {
      accessKeyId:      process.env.DYNAMO_ACCESS_KEY,
      secretAccessKey:  process.env.DYNAMO_SECRET_ACCESS_KEY,
      region:           process.env.REGION
}

module.exports = dynamoose.AWS.config.update(dynamoconfig);