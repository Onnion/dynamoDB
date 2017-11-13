var AWS = require("aws-sdk");
//var itensToPopulate = require( "./jsonTable.json" )
AWS.config.update({
  region: "sa-east-1",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var paramsCreateCompanies = {
    TableName : "Companies",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

//Cria tabela de companias
function createCompaniesTable(){
  dynamodb.createTable(paramsCreateCompanies, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      }
  });
}
//createCompaniesTable();

//Popula tabela de companias
// itensToPopulate.forEach(function(companie) {
//     var params = {
//         TableName: "Companies",
//         Item: {
//             "id" : companie.id,
//             "updated_at" :  companie.updated_at,
//             "created_at" :  companie.created_at,
//             "name" :  companie.name,
//             "code" :  companie.code,
//         }
//     };
//     docClient.put(params, function(err, data) {
//        if (err) {
//            console.error("Unable to add movie", err);
//        } else {
//            console.log("PutItem succeeded:", companie.name);
//        }
//     });
// });


var paramsScan = {
    TableName: "Companies",
    ProjectionExpression: "#id, #name",
    ExpressionAttributeNames: {
        "#id": "id",
        "#body": "name"
    },
    FilterExpression: "begins_with ( #title, :letter1 )",
    ExpressionAttributeValues: {
        ":letter1": "A"
    }
};
var paramsDel = {
    TableName : "Companies"
};
dynamodb.deleteTable(paramsDel, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
