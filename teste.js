// REQUEST
const root = 'https://jsonplaceholder.typicode.com';
const request = require('request');

var options = {
  url: root+'/posts/1',
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    postToSave = JSON.parse(body);

  }
}
request(options, callback);

// MONGO
// connection
// var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
//
// var promise = mongoose.createConnection('mongodb://localhost/myapp', {
//   useMongoClient: true,
// });
// var promise = mongoose.connect('mongodb://localhost/myapp', {
//   useMongoClient: true,
// });
//
// // mongoose.createConnection('mongodb://localhost/teste');
// // mongoose.connect('mongodb://localhost/my_database');
//
// var Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId;
//
// //create post schema
// var postSchema = new Schema({
//     id   	  : ObjectId,
//     title     : String,
//     body      : String
// });
// var Post = mongoose.model('Post', postSchema);
// //save post
// function saveOne(_post){
// 	_post.save(function(err) {
//   	if (err) throw err;
// 	});
//   console.log('asd')
// }
// // get all the users
// function getAll(){
//    Post.find({}, function(err, posts) {
//     if (err) throw err;
//     console.log(posts);
//   });
// }
// //create new post
// var post = new Post({
//   title: 'teste',
//   body: 'testando conexão com o mongoose'
// });
//
// saveOne(post);
// getAll();

// CHEERIO
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var fs = require('fs');
var stream = fs.createWriteStream("posts.json");
const cheerio = require('cheerio');
function requestIfpeHTML(){
	request('http://www.ifpe.edu.br/noticias', function (error, response, data) {
		body.data = data;
		body.emit('update');
	});
}
//requisição a página do ifpe
requestIfpeHTML();
var listPostsIFPE = []

body.on('update', function() {
  var html = body.data;
  const $ = cheerio.load(html);

  //seletores cheerio / captura de dados
  $('#content-core .tileItem').each(function(i, elem) {
    const div = cheerio.load(elem);
    listPostsIFPE[i] = {
      "title":div('.summary').text(),
      "body":div('.description').text()
    };
  });
  //ler lista e gravar no arquivo
  // stream.once('open', function(fd) {
  //   stream.write('listPostsIFPE');
  //   stream.end();
  // });
});



//DYNAMON
var AWS = require("aws-sdk");

AWS.config.update({
  region: "sa-east-1",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var paramsCreatePosts = {
    TableName : "Posts",
    KeySchema: [
        { AttributeName: "title", KeyType: "HASH"},  //Partition key
        { AttributeName: "body", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "title", AttributeType: "S" },
        { AttributeName: "body", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};''
//Tabela Posts criada
dynamodb.createTable(paramsCreatePosts, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

console.log("Importing Posts into DynamoDB. Please wait.");
setTimeout(function(){
  //Popula a tablema Post com os items da página do IFPE
  listPostsIFPE.forEach(function(post) {
      var params = {
          TableName: "Posts",
          Item: {
              "title": post.title,
              "body":  post.body
          }
      };
      docClient.put(params, function(err, data) {
         if (err) {
             console.error("Unable to add movie", post.title, ". Error JSON:", JSON.stringify(err, null, 2));
         } else {
             console.log("PutItem succeeded:", post.title);
         }
      });
  });


//console.log("Querying for movies from 1992 - titles A-L, with genres and lead actor");

// var params = {
//     TableName : "Movies",

//     //Valores que vão ser retornados
//     ProjectionExpression:"#yr, title, info.genres, info.actors[0]",

//     //condições da consulta
//     KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",

//     //nomeia a variável 'year' para '#yr' pois
//     //'year' é uma palavra reservada
//     ExpressionAttributeNames:{
//         "#yr": "year"
//     },

//     //
//     ExpressionAttributeValues: {
//         ":yyyy":1992,
//         ":letter1": "A",
//         ":letter2": "L"
//     }
// };

// docClient.query(params, function(err, data) {
//     if (err) {
//         console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Query succeeded.");
//         data.Items.forEach(function(item) {
//             console.log(item.title);
//         });
//     }
// });


},10000);
