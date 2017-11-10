
var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Os nomes do bucket devem ser exclusivos em todos os usuários do S3
var myBucketqq = 'my.unique.bucket.qq';
var myKey = 'myBucketKey';
s3.createBucket({Bucket: myBucketqq}, function(err, data) {
if (err) {
   console.log(err);
   } else {
     params = {Bucket: myBucketqq, Key: myKey, Body: 'Hello!'};
     s3.putObject(params, function(err, data) {
         if (err) {
             console.log(err)
         } else {
             console.log("Dados enviados com sucesso para myBucket/myKey");
         }
      });
   }
});
