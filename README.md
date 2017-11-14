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
```

## Restore DB
#### Use Robomongo
```
$ robo3t-1.1.1-linux-x86_64-c93c6b0/bin/robo3t
$ sudo service mongod start
$ mongo
$ mongorestore --drop -d db_name ./ db_path
```


## For dynamoose exemples
-install dynamosse
```
$ npm install dynamoose
```

-export aws variables
```
$ export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
$ export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
$ export AWS_REGION="sa-east-1"
```

-run createCompanies.js
```
$ node createCompanies.js
```


## For pure-sdk exemples
-configure your aws keys
```
$ aws configure
AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_KEY
Default region name [None]: sa-east-1
Default output format [None]: json
```

-run teste.js
```
$ node teste.js
```
