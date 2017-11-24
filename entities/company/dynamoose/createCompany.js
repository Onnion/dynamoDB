var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

// Create Companie Schema
var companieSchema =  new Schema({
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
  name :  {
    type: String,
  },
  code :  {
    type: String,
  }
});

// Create Companie Model
var Companie = dynamoose.model('Companie', companieSchema);

// Populate Table Companie
// itensToPopulate.forEach(function(comp) {
//   // Create a new Companie object
//   var companie = new Companie({
//     id : comp.id,
//     updated_at :  comp.updated_at,
//     created_at :  comp.created_at,
//     name :  comp.name,
//     code :  comp.code,
//   });

//   // Save to DynamoDB
//   companie.save();
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


companieScan('2017-03-10T19:20:29.257Z','2017-12-12T19:20:59.254Z');
//companieGet('58d02b9b7a343d148a8f7a30');
