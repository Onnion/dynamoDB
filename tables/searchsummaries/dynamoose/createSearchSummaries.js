var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )
var Promise = require('promise');
var moment = require("moment");

var keys = require("../../../keys.json")
dynamoose.AWS.config.update({
  accessKeyId: keys.acess,
  secretAccessKey: keys.secret,
  region: 'sa-east-1'
});

// Create Companie Schema
var searchSummariesSchema =  new Schema({
  updated_at:  {
    type: String,
  },
  created_at :  {
    type: String,
    rangeKey: true
  },
  company :  {
    type: String,
    hashKey: true,
    index: [{
      global: true,
      rangeKey: 'count',
      name: 'CountRangeIndex',
      project: true
    }]
  },
  count_from_cache :  {
    type: Number,
    required: false,
    default: 0
  },
  avg_duration: {
    type: Number,
    required: false,
    default: 0
  },
  count :  {
    type: Number,
    required: false,
    default: 0,
    index: true
  }
});

// Create Companie Model
var searchsummary = dynamoose.model('SearchSummaries', searchSummariesSchema,{update: true });

// Populate Model SearchSummary
function populateSearchSummariesModel(){
  itensToPopulate.forEach(function(summary) {
    // Create a new Companie object
    var searchSummary = new searchsummary({
      updated_at :  summary.updated_at,
      created_at :  summary.created_at,
      company :  summary.company,
      count_from_cache :  summary.count_from_cache,
      count : summary.count,
      avg_duration: summary.avg_duration
    });
  
    // Save to DynamoDB
    searchSummary.save().then(() => {
      console.log('saved');
    });
  });
}

// Query
function searchSummaryQuery(company){
  SearchSummaries.query('company').eq(company)
  
  .exec().then((dogs) => {
    console.log(dogs);
  })
  .catch((err) => {
    console.log(err);
  });
}

// GetAll
function searchSummaryGetAll(){
  searchsummary.scan().exec()
  .then(function(companie) {
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};

// Scan
function searchSummaryScan(){
  var filter = {
    FilterExpression: 
    'begins_with(updated_at, :time)'+ ' and '+
    'count_from_cache > :count'+' and '+
    '#count between :count1 AND :count2',
    ExpressionAttributeValues: {
      ':time': "2017",
      ':count' : 443,
      ':count1' : 200,
      ':count2' : 5000,
    },
    ExpressionAttributeNames:{
      "#count": "count"
    }
  }
  SearchSummaries.scan(filter).exec()
  .then(function(companie) {
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};


// Steps to work
populateSearchSummariesModel();
searchSummaryGetAll();