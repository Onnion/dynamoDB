var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )
var Promise = require('promise');

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
    index: {
      global: true,
      rangeKey: 'created_at',
      name: 'CompanyIndex',
      project: true,
      throughput: 5
    }
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
    default: 0
  }
});

// Create Companie Model
var SearchSummariesSS = dynamoose.model('SearchSummaries', searchSummariesSchema,{update: true });

// Populate Table Companie
itensToPopulate.forEach(function(summary) {
  // Create a new Companie object
  var searchSummary = new SearchSummariesSS({
    updated_at :  summary.updated_at,
    created_at :  summary.created_at,
    company :  summary.company,
    count_from_cache :  summary.count_from_cache,
    count : summary.count,
    avg_duration: summary.avg_duration
  });

  // Save to DynamoDB
  searchSummary.save();
});

// Get
function searchSummaryGet(idvar){
  Companie.get(idvar).then(function(companie){
    console.log(companie);
  }).catch(function(err){
    console.log(err);
  })
}

// Query
function searchSummaryQuery(){
  SearchSummariesSS.query('company').eq('azul')
  .filter('count')
  .between(200,5000)
  .and()
  .filter('updated_at')
  .beginsWith('2017')
  .and()
  .filter('count_from_cache')
  .gt(443)
  .exec().then((dogs) => {
    console.log(dogs);
  })
  .catch((err) => {
    console.log(err);
  });
}

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
  SearchSummariesSS.scan(filter).exec()
  .then(function(companie) {
    //return promisse
    // return new Promise((resolve, reject) => {
    //   resolve(companie);
    // });
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};


//run query
searchSummaryScan();
//subscribe promisse
//searchSummaryScan().then((list) => {console.log(list)})