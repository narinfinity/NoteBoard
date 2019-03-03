//notesCtrl.js
(function (notesCtrl) {
    notesCtrl.init = function (app, auth, data) {
        var auth = auth, data = data;

        //CRUD, return is html
        app.get("/notes/:categoryName"
            , auth.isAuthenticated, function (req, res) {
            
            var categoryName = req.params.categoryName;
            data.getNote(categoryName, function (err, results) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    //render view - views/notes/notes.html
                    res.render('notes/notes', { 
                        user: req.user,
                        title: "The notes of: " + categoryName,
                        error: err,
                        notes: results,
                        categoryName: categoryName,
                        message: req.flash("message")
                    });
                }
            });
        });
        app.post("/notes/:categoryName" 
            , auth.isAuthenticated, function (req, res) {

            var categoryName = req.params.categoryName;
            var noteToInsert = {
                note: req.body.note,
                author: req.body.author,
                color: req.body.color
            };
            data.addNote(categoryName
                , noteToInsert
                , function (err) {
                if (err) {
                    console.log(err);
                    req.flash("message", err);
                } else {
                }
                res.redirect('/notes/' + categoryName);
            });           
        });
        
        //CRUD Web API return is JSON
        var baseUrl = "/api/notes/";
        app.get(baseUrl + ":categoryName"
            , auth.isApiAuthenticated, function (req, res) {

            var categoryName = req.params.categoryName;
            data.getNote(categoryName, function (err, results) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.set('Content-Type', 'application/json');                    
                    results.user = req.user;
                    res.send(results);                 
                }             
            });
        });        
        app.post(baseUrl + ":categoryName"
            , auth.isApiAuthenticated, function (req, res) {

            var categoryName = req.params.categoryName;
            var noteToInsert = {
                note: req.body.note,
                author: req.body.author,
                color: req.body.color
            };
            data.addNote(categoryName
                , noteToInsert
                , function (err) {
                if (err) {
                    res.status(400).send("Failed to add note.");
                } else {
                    res.set('Content-Type', 'application/json');
                    res.status(201).send(noteToInsert);
                }
            });            
        });
    };
})(module.exports);