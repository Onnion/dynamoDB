var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

var keys = require("../../../keys.json")
dynamoose.AWS.config.update({
  accessKeyId: keys.acess,
  secretAccessKey: keys.secret,
  region: 'sa-east-1'
});

// Create Companie Schema
var searchSummariesSchema =  new Schema({
  id : {
    type: String,
    hashKey: true,
    index: [{
      global: true,
      rangeKey: 'count',
      name: 'CountRangeIndex',
      project: true, // ProjectionType: ALL
    },{
      global: true,
      rangeKey: 'company',
      name: 'CompanyRangeIndex',
      project: true, // ProjectionType: ALL
    }]
  },
  updated_at:  {
    type: String,
  },
  created_at :  {
    type: String,
    rangeKey: true,
    index: true
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
  },
  count :  {
    type: Number,
    rangeKey: true,
    index: true 
  }
});

// Create Companie Model
var SearchSummariesSS = dynamoose.model('SearchSummaries', searchSummariesSchema,{update: true });

// Populate Table Companie
itensToPopulate.forEach(function(summary) {
  // Create a new Companie object
  var searchSummary = new SearchSummariesSS({
    id : summary.id,
    updated_at :  summary.updated_at,
    created_at :  summary.created_at,
    company :  summary.company,
    count_from_cache :  summary.count_from_cache,
    count : summary.count
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
  .between(200,2000)
  .descending()
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
    FilterExpression: 'created_at between :date1 AND :date2',
    ExpressionAttributeValues: {
      // ':date1': data1,
      // ':date2': data2
    }
  }

  SearchSummaries.scan().exec()
  .then(function(companie) {
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};

searchSummaryQuery();
//companieGet('58d02b9b7a343d148a8f7a30');
