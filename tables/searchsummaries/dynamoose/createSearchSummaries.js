var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

// Create Companie Schema
var searchSummariesSchema =  new Schema({
  id : {
    type: String,
    hashKey: true
  },
  updated_at:  {
    type: String,
  },
  created_at :  {
    type: String,
  },
  company :  {
    type: String,
  },
  count_from_cache :  {
    type: Number,
  },
  count :  {
    type: Number,
  }
});


// Create Companie Model
var SearchSummaries = dynamoose.model('SearchSummaries', searchSummariesSchema);

// Populate Table Companie
itensToPopulate.forEach(function(summary) {
  // Create a new Companie object
  var searchSummary = new SearchSummaries({
    id : summary.id,
    updated_at :  summary.updated_at,
    created_at :  summary.created_at,
    company :  summary.company,
    count_from_cache :  summary.count_from_cache,
    count : summary.count
  });

  // Save to DynamoDB
  searchSummary.save();
  console.log('put in table');
});

// Get
function companieGet(idvar){
  Companie.get(idvar).then(function(companie){
    console.log(companie);
  }).catch(function(err){
    console.log(err);
  })
}

// Query
function companieGet(idvar){
  Companie.get(idvar).then(function(companie){
    console.log(companie);

  }).catch(function(err){
    console.log(err);

  })
}

// Scan
function companieScan(data1, data2){
  var filter = {
    FilterExpression: 'created_at between :date1 AND :date2',
    ExpressionAttributeValues: {
      ':date1': data1,
      ':date2': data2
    }
  }

  Companie.scan(filter).not().exec()
  .then(function(companie) {
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};

//companieScan('2017-03-10T19:20:29.257Z','2017-12-12T19:20:59.254Z');
//companieGet('58d02b9b7a343d148a8f7a30');
