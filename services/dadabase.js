//database.js
(function (database) {
    var mongodb = require('mongodb');
    var url = "mongodb://localhost:27017";
    var theDb = null;

    database.getDb = function (next) {
        if (!theDb) {
            //connect to the database once
            mongodb.MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    next(err, null);
                } else {
                    const db = client.db("mydb");
                    theDb = {
                        //creator: "Shawn"
                        db: db
                        ,users: db.collection('users')
                        ,categories: db.collection('categories')
                    }; 
                    next(null, theDb);
                }
                //client && client.close();
            });
            
        } else { 
            next(null, theDb);
        }
    }  
})(module.exports);