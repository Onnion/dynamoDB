var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = [
  {ownerId:1, name: 'Foxy Lady', breed: 'Jack Russell Terrier ', color: ['White', 'Brown', 'Black']},
  {ownerId:2, name: 'Quincy', breed: 'Jack Russell Terrier', color: ['White', 'Brown']},
  {ownerId:2, name: 'Princes', breed: 'Jack Russell Terrier', color: ['White', 'Brown']},
  {ownerId:3, name: 'Toto', breed: 'Terrier', color: ['Brown']},
  {ownerId:4, name: 'Odie', breed: 'Beagle', color: ['Tan'], cartoon: true},
  {ownerId:5, name: 'Pluto', breed: 'unknown', color: ['Mustard'], cartoon: true},
  {ownerId:6, name: 'Brian Griffin', breed: 'unknown', color: ['White']},
  {ownerId:7, name: 'Scooby Doo', breed: 'Great Dane', cartoon: true},
  {ownerId:8, name: 'Blue', breed: 'unknown', color: ['Blue'], cartoon: true},
  {ownerId:9, name: 'Lady', breed: ' Cocker Spaniel', cartoon: true},
  {ownerId:10, name: 'Copper', breed: 'Hound', cartoon: true},
  {ownerId:11, name: 'Old Yeller', breed: 'unknown', color: ['Tan']},
  {ownerId:12, name: 'Hooch', breed: 'Dogue de Bordeaux', color: ['Brown']},
  {ownerId:13, name: 'Rin Tin Tin', breed: 'German Shepherd'},
  {ownerId:14, name: 'Benji', breed: 'unknown'},
  {ownerId:15, name: 'Wishbone', breed: 'Jack Russell Terrier', color: ['White']},
  {ownerId:16, name: 'Marley', breed: 'Labrador Retriever', color: ['Yellow']},
  {ownerId:17, name: 'Beethoven', breed: 'St. Bernard'},
  {ownerId:18, name: 'Lassie', breed: 'Collie', color: ['tan', 'white']},
  {ownerId:19, name: 'Snoopy', breed: 'Beagle', color: ['black', 'white'], cartoon: true}];
// Create Companie Schema
var dogSchema  = new Schema({
  ownerId: {
    type: Number,
    validate: function(v) { return v > 0; },
    hashKey: true
  },
  breed: {
    type: String,
    trim: true,
    required: true,
    index: {
      global: true,
      rangeKey: 'ownerId',
      name: 'BreedIndex',
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }
  },
  name: {
    type: String,
    rangeKey: true,
    index: {
      global: true,
      rangeKey: 'ownerId',
      name: 'NameIndex',
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }
  },
  color: {
    lowercase: true,
    type: [String],
    default: ['Brown']
  },
  cartoon: {
    type: Boolean
  }
});

// Create Companie Model
var TesteDog = dynamoose.model('Teste', dogSchema,{update: true });

//Populate Table Companie
itensToPopulate.forEach(function(comp) {
  // Create a new Companie object
  var companie = new TesteDog({
    id : comp.id,
    updated_at :  comp.updated_at,
    created_at :  comp.created_at,
    name :  comp.name,
    code :  comp.code,
  });


  // Save to DynamoDB
  companie.save();
  console.log('put');
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

//companieQuery();
//companieGet('58d02b9b7a343d148a8f7a30');
