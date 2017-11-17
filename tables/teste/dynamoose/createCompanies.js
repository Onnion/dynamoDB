var dynamoose = require('dynamoose');
var should = require('should');
var Schema = dynamoose.Schema;
var itensToPopulate = [
  {ownerId:1, name: 'Foxy Lady', breed: 'Jack Russell Terrier', color: 'White, Brown and Black', siblings: ['Quincy', 'Princes']},
  {ownerId:2, name: 'Quincy', breed: 'Jack Russell Terrier', color: 'White and Brown', siblings: ['Foxy Lady', 'Princes']},
  {ownerId:2, name: 'Princes', breed: 'Jack Russell Terrier', color: 'White and Brown', siblings: ['Foxy Lady', 'Quincy']},
  {ownerId:3, name: 'Toto', breed: 'Terrier', color: 'Brown'},
  {ownerId:4, name: 'Oddie', breed: 'beagle', color: 'Tan'},
  {ownerId:5, name: 'Pluto', breed: 'unknown', color: 'Mustard'},
  {ownerId:6, name: 'Brian Griffin', breed: 'unknown', color: 'White'},
  {ownerId:7, name: 'Scooby Doo', breed: 'Great Dane'},
  {ownerId:8, name: 'Blue', breed: 'unknown', color: 'Blue'},
  {ownerId:9, name: 'Lady', breed: ' Cocker Spaniel'},
  {ownerId:10, name: 'Copper', breed: 'Hound'},
  {ownerId:11, name: 'Old Yeller', breed: 'unknown', color: 'Tan'},
  {ownerId:12, name: 'Hooch', breed: 'Dogue de Bordeaux', color: 'Brown'},
  {ownerId:13, name: 'Rin Tin Tin', breed: 'German Shepherd'},
  {ownerId:14, name: 'Benji', breed: 'unknown'},
  {ownerId:15, name: 'Wishbone', breed: 'Jack Russell Terrier', color: 'White'},
  {ownerId:16, name: 'Marley', breed: 'Labrador Retriever', color: 'Yellow'},
  {ownerId:17, name: 'Beethoven', breed: 'St. Bernard'},
  {ownerId:18, name: 'Lassie', breed: 'Collie', color: 'tan and white'},
  {ownerId:19, name: 'Snoopy', breed: 'beagle', color: 'black and white'},
  {ownerId:20, name: 'Max', breed: 'Westie'},
  {ownerId:20, name: 'Gigi', breed: 'Spaniel', color: 'Chocolate'},
  {ownerId:20, name: 'Mimo', breed: 'Boxer', color: 'Chocolate'},
  {ownerId:20, name: 'Bepo', breed: 'French Bulldog', color: 'Grey'}
];

var keys = require("../../../keys.json")
dynamoose.AWS.config.update({
  accessKeyId: keys.acess,
  secretAccessKey: keys.secret,
  region: 'sa-east-1'
});

// Create Companie Schema
var dogSchema  = new Schema({
  ownerId: {
    type: Number,
    validate: function(v) { return v > 0; },
    hashKey: true,
    index: [{
      global: true,
      rangeKey: 'color',
      name: 'ColorRangeIndex',
      project: true, // ProjectionType: ALL
    },{
      global: true,
      rangeKey: 'breed',
      name: 'BreedRangeIndex',
      project: true, // ProjectionType: ALL
    }]
  },
  breed: {
    type: String,
    required: true,
    index: {
      global: true,
      rangeKey: 'name',
      name: 'BreedIndex',
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }
  },
  name: {
    type: String,
    rangeKey: true,
    index: true // name: nameLocalIndex, ProjectionType: ALL
  },
  color: {
    type: String,
    default: 'Brown',
    index: [{ // name: colorLocalIndex
      project: ['name'] // ProjectionType: INCLUDE
    },{ // name: colorGlobalIndex, no ragne key
      global: true,
      project: ['name'] // ProjectionType: INCLUDE
    }]
  },
  siblings: {
    type: 'list',
    list: [ {
      type: String
    } ]
  }
});

// Create Companie Model
var TesteDogDog = dynamoose.model('TesteDogDog', dogSchema,{update: true });

//Populate Table Companie
itensToPopulate.forEach(function(comp) {
  // Create a new Companie object
  var companie = new TesteDogDog({
    ownerId : comp.ownerId,
    breed :  comp.breed,
    name :  comp.name,
    color :  comp.color,
    siblings :  comp.siblings
  });

  // Save to DynamoDB
  companie.save();
  //console.log('put');
});

// Get
function companieGet(idvar){
  Companie.get(idvar).then(function(companie){
    console.log(companie);
  }).catch(function(err){
    console.log(err);
  })
}

// BatchGet
function companieBatch(){
  TesteDogDog.batchGet([{ownerId: 4, name: 'Oddie'},{ownerId: 6, name: 'Brian Griffin'}], function (err, dogs) {
    if (err) {
      return console.log(err);
    }
    console.log(dogs);
  });
}

// Query
function companieQuery(){
  //should.not.exist(err);
  //dogs.length.should.eql(1);
  //dogs[0].name.should.eql('Gigi');
  TesteDogDog.query('breed').eq('Jack Russell Terrier')
  .filter('color')
  .contains('Brown')
  .and()
  .filter('siblings')
  .contains('Quincy')
  .descending()
  .exec().then((dogs) => {
    console.log(dogs);
  })
  .catch((err) => {
    console.log(err);
  });
};

// Scan
function companieScan(){
  var filter = {
    IndexName: "BreedIndex",
    ProjectionExpression: "ownerId",
    FilterExpression: 'breed = :code',
    ExpressionAttributeValues: {
      ':code': 'Jack Russell Terrier'
    },
    ScanIndexForward: true
  }

  TesteDogDog.scan().exec()
  .then((companies) => {
    console.log(companies);
  })
  .catch((err) => {
    console.error(err);
  });

};


companieQuery();
//companieGet('58d02b9b7a343d148a8f7a30');
