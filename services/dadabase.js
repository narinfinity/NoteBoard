//database.js
(function (database) {
    var mongodb = require('mongodb');
    var mongoUrl = "mongodb://localhost:27017/theBoardDb";
    var theDb = null;

    database.getDb = function (next) {
        if (!theDb) {
            //connect to the database once
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                if (err) {
                    next(err, null);
                } else {
                    theDb = {
                        //creator: "Shawn"
                        db: db
                        ,users: db.collection('users')
                        ,categories: db.collection('categories')
                    }; 
                    next(null, theDb);
                }
            });

        } else { 
            next(null, theDb);
        }
    }  
})(module.exports);