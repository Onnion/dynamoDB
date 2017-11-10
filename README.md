# dynamoDB

-download dynamoDB local version:  
 http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html#DynamoDBLocal.DownloadingAndRunning

-install java jre in your so version

-run in folder of your dynamoDB local version
```
$ java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

-install node modules
```
$ npm install


-configure your aws keys
```
$ aws configure
AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_KEY
Default region name [None]: sa-east-1
Default output format [None]: json
```
us-west-2
-run teste.js
```
$ node teste.js
```