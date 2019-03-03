(function (data) {
    var seedData = require('./seedData');
    var database = require('./dadabase.js');
    
    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                //test if data exists
                db.categories
                .count(function (err, count) {
                    if (err) {
                        console.log("Failed to seed database: " + err);
                    } else {
                        if (count === 0) {
                            console.log("Seeding the database...");
                            seedData.categories.forEach(function (item, index) {
                                db.categories.insert(item, function (err) {
                                    if (err) {
                                        console.log("Failed to insert note into database: " + err)
                                    }
                                });
                            });
                        } else {
                            console.log("Database already seeded.");
                        }
                    }
                });
            }
        });
    }    ;
    seedDatabase();
    
    //CRUD for Categories
    data.getCategory = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.categories
                .find({ notes: { $not: { $size: 10 } } })//{notes: { $size: 3}, name: "History1"}                
                .sort({ name: 1 })//{ name: -1 }
                .toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
        //next(null, seedData.initialNotes);
    };
    data.addCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.categories
                .find({ name: categoryName })
                .count(function (err, count) {
                    if (err) {
                        next(err, null);
                    } else {
                        if (count !== 0 || categoryName.trim() === '') {
                            next("Category: " + categoryName + " already exists.", null);
                        } else {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.categories
                            .insert(cat, function (err) {
                                if (err) {
                                    next(err, null);
                                } else {
                                    next(null, null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    
    //CRUD methods for Notes
    data.getNote = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.categories
                .findOne({ name: categoryName }, function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results.notes);
                    }
                });
            }
        });
    };
    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.categories
                .update({ name: categoryName }
                    , { $push: { notes: noteToInsert } }
                    , next)
            }
        });
    };
    
    //CRUD for Users
    data.getUser = function (username, next) {
        database.getDb(function (err, db) {
            if (err) { return next(err); }
            else {
                db.users
                .findOne({ username: username }, function (err, user) {                    
                    return next(err, user);
                });
            }            
        });
    };    
    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.users
                .find({ name: user.name.trim() })
                .count(function (err, count) {
                    if (err) {
                        next(err, null);
                    } else {
                        if (count != 0 || user.name.trim() === '') {
                            next("user with name: " + user.name + " already exists.", null);
                        } else {
                            db.users
                            .insert(user, next);
                        }
                    }
                });
            }
        });
    };

})(module.exports);