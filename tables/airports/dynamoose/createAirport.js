var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;
var itensToPopulate = require( "../jsonTable.json" )

// Create Companie Schema
var airportSchema =  new Schema({
  timestamps: { 
    createdAt: 'create_at', 
    updatedAt: 'updated_at'
  },
  iata :  {
      type: String,
      required: true,
      hashKey: true,
      validate: function(v) { return /^[A-Z]{3,3}$/.test(v); },
  },
  name: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  name_avianca: {
      type: String,
      required: false,
      index: true
  },
  name_azul: {
      type: String,
      required: false,
      index: true
  },
  city :  {
    type: String,
    trim: true
  },
  country :  {
    type: String,
    trim: true
  },
  country_code :  {
      type: String,
      enum:["AN","AF","ZA","AX","AL","DE","AD","AO","AI","AQ","AG","SA","DZ","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BE","BZ","BJ","BM","BY","BO","BQ","BA","BW","BV","BR","BN","BG","BF","BI","BT","CV","KH","CM","CA","KY","KZ","CF","TD","CZ","CL","CN","CY","CX","CC","CO","KM","CG","CD","CK","KR","KP","CI","CR","HR","CU","CW","DK","DJ","DM","DO","EG","SV","AE","EC","ER","SK","SI","ES","US","EE","ET","FO","FJ","PH","FI","FR","GA","GM","GH","GE","GS","GI","GR","GD","GL","GP","GU","GT","GG","GY","GF","GW","GN","GQ","HT","HM","HN","HK","HU","YE","IN","ID","IQ","IR","IE","IS","IL","IT","JM","JP","JE","JO","KI","KW","LA","LS","LV","LB","LR","LY","LI","LT","LU","MO","MK","MG","MY","MW","MV","ML","MT","FK","IM","MP","MA","MH","MQ","MU","MR","YT","UM","MX","MM","FM","MZ","MD","MC","MN","ME","MS","NA","NR","NP","NI","NE","NG","NU","NF","NO","NC","NZ","OM","NL","PW","PS","PA","PG","PK","PY","PE","PN","PF","PL","PR","PT","QA","KE","KG","GB","RE","RO","RW","RU","EH","AS","WS","PM","SB","SM","SH","LC","BL","KN","SX","MF","ST","VC","SN","SL","RS","SC","SG","SY","SO","LK","SZ","SD","SS","SE","CH","SR","SJ","TH","TW","TJ","TZ","TF","IO","TL","TG","TK","TO","TT","TN","TC","TM","TR","TV","UA","UG","UY","UZ","VU","VA","VE","VN","VI","VG","WF","ZM","ZW"],
      validate: function(v) { return /^[A-Z]{2,2}$/.test(v); },
  },
  search_code :  {
    type: String,
  },
  is_mac_code :  {
    type: Boolean,
  },
  has_amadeus :  {
    type: Boolean,
      default: false
  }
});

// Create Companie Model
var Airport = dynamoose.model('Airport', airportSchema);

// Populate Table Companie
itensToPopulate.forEach(function(comp) {
  // Create a new Companie object
  var airport = new Companie({
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
