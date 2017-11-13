var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

// Create Companie Schema
var testeSchema =  new Schema({
  id : {
    type: String,
    hashKey: true
  },
  updated_at:  {
    type: String,
  },
  created_at :  {
    type: String,
    rangeKey: true
  },
  name :  {
    type: String,
  },
  code :  {
    type: String,
  }
});

// Create Companie Model
var Teste = dynamoose.model('Teste', testeSchema);

//Populate Table Companie
itensToPopulate.forEach(function(comp) {
  // Create a new Companie object
  var companie = new Teste({
    id : comp.id,
    updated_at :  comp.updated_at,
    created_at :  comp.created_at,
    name :  comp.name,
    code :  comp.code,
  });

  // Save to DynamoDB
  companie.save();
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
function companieScan(){
  var filter = {
    ProjectionExpression: "#id, created_at",
    FilterExpression: '#code = :code',
    ExpressionAttributeValues: {
      ':code': 'tt'
    },
    ExpressionAttributeNames: {
        "#id": "id",
        '#code': 'code'
    },
  }

  Teste.scan(filter).not().exec()
  .then(function(companies) {
    console.log(companies);
  })
  .catch(function(err) {
    console.error(err);
  });
};


companieScan();
//companieGet('58d02b9b7a343d148a8f7a30');
