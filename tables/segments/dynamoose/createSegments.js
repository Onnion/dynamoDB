var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

// Create Companie Schema
var segmentsSchema =  new Schema({
  id : {
    type: String,
    hashKey: true
  },
  hash : {
    type: String
  },
  updated_at:  {
    type: String,
  },
  created_at :  {
    type: String,
    rangeKey: true
  },
  origin :  {
    type: String,
  },
  destination :  {
    type: String,
  },
  company :  {
    type: String,
  },
  amount :  {
    type: Number,
  },
  date :  {
    type: String,
  },
  type :  {
    type: String,
  },
  modality : {
    type: String
  }
});

// Create Companie Model
var Segments = dynamoose.model('Segments', segmentsSchema, [{create: false,update: true}]);

// Populate Table Companie
// itensToPopulate.forEach(function(seg) {
//   // Create a new Companie object
//   var segment = new Segments({
//     id : seg.id,
//     hash: seg.hash,
//     updated_at :  seg.updated_at,
//     created_at :  seg.created_at,
//     origin :  seg.origin,
//     destination :  seg.destination,
//     company : seg.company,
//     amount : seg.amount,
//     date : seg.date,
//     type : seg.type,
//     modality: seg.modality
//   });
//
//   // Save to DynamoDB
//   segment.save();
//   console.log('put in table');
// });

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
function companieScan(origin, destination, company, type, modality){
  var filter = {
    ProjectionExpression: "id, #origin, #destination, #company, #type, #modality, created_at",
    FilterExpression: '#origin = :origin and #destination = :destination and #company = :company and #type = :type and #modality = :modality and updated_at between :date1 and :date2',
    ExpressionAttributeValues: {
      ':origin': origin,
      ':destination': destination,
      ':company': company,
      ':type': type,
      ':modality': modality,
      ':date2': '2017-07-17T17:50:02.372Z',
      ':date1': '2017-05-24T18:34:45.476Z'
    },
    ExpressionAttributeNames: {
        "#origin": "origin",
        "#destination": "destination",
        "#company": "company",
        "#type": "type",
        "#modality": "modality"
    },
    ScanIndexFoward: false
  }

  Segments.scan(filter).exec()
  .then(function(companie) {
    console.log(companie);
  })
  .catch(function(err) {
    console.error(err);
  });
};

companieScan('VCP','MAO','latam','points','economic');
//companieGet('58d02b9b7a343d148a8f7a30');
