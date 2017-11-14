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
    index: {
      global: true,
      rangeKey: 'name',
      name: 'CodeIndex',
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }
  }
});

// Create Companie Model
var Teste = dynamoose.model('Teste', testeSchema,{create: false, update: true });

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
function companieQuery(){
  var paramsQuery = {
    IndexName: "CodeIndex",
    ProjectionExpression: "#id, created_at, code",
    FilterExpression: '#code = :code',
    ExpressionAttributeValues: {
      ':code': 'qq'
    },
    ExpressionAttributeNames: {
        "#id": "id",
        '#code': 'code'
    },
    ScanIndexForward: false
  }

  Teste.query(paramsQuery, (err, data) => {
    if (err) {
      console.log(err);
    }else if(data) {
      console.log(data);
    }
  })
}

// Scan
function companieScan(){
  var filter = {
    IndexName: "CodeIndex",
    ProjectionExpression: "#id, created_at, code",
    FilterExpression: '#code = :code',
    ExpressionAttributeValues: {
      ':code': 'qq'
    },
    ExpressionAttributeNames: {
        "#id": "id",
        '#code': 'code'
    },
    ScanIndexForward: false
  }

  Teste.scan(filter).exec()
  .then((companies) => {
    console.log(companies);
  })
  .catch((err) => {
    console.error(err);
  });

};

companieQuery();
//companieGet('58d02b9b7a343d148a8f7a30');
