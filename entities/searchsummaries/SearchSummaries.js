'use strict'

const dynamoose = require('dynamoose');
const itensToPopulate = require("./jsonTable.json")

// Create SearchSummary Schema
var searchSummarySchema = new dynamoose.Schema({
  updated_at: {
    type: String,
  },
  created_at: {
    type: String,
    rangeKey: true
  },
  company: {
    type: String,
    hashKey: true,
  },
  count_from_cache: {
    type: Number,
    required: false,
    default: 0
  },
  avg_duration: {
    type: Number,
    required: false,
    default: 0
  },
  count: {
    type: Number,
    required: false,
    default: 0,
    index: true
  }
});

// Populate Model SearchSummary
function populateSearchSummariesModel() {

  var cont = 0

  itensToPopulate.forEach(function (summary) {

    // Create a new Companie object
    var searchSummary = new searchsummary({
      updated_at: summary.updated_at,
      created_at: summary.created_at,
      company: summary.company,
      count_from_cache: summary.count_from_cache,
      count: summary.count,
      avg_duration: summary.avg_duration
    });

    // Save to DynamoDB    
    setTimeout(function () {

      searchSummary.save(function (a) {
        cont++;
        console.log(cont, a);
      });

    }, 2000)

  });
}

// Export Companie Model
module.exports = dynamoose.model('SearchSummary', searchSummarySchema);