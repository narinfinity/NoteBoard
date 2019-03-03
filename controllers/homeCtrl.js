//homeCtrl.js
(function (homeCtrl) {
    homeCtrl.init = function (app, auth, data) {
        var auth = auth, data = data;

        app.get('/'
            ,auth.isAuthenticated ,function (req, res) {
            
            data.getCategory(function (err, results) {
                
                res.render('home/index', {
                    user: req.user,
                    title: 'The Categories',
                    error: err,
                    categories: results,
                    message: req.flash("message")
                });
              
            });                    
        });

        app.post('/add'
            , auth.isAuthenticated , function (req, res) {
             
            var categoryName = req.body.categoryName;
            data.addCategory(categoryName, function (err) {
                if (err) {
                    console.log(err);
                    req.flash("message", err);
                    res.redirect('/');                    
                } else {
                    res.redirect('/');
                }                
            });        
        });
    };
})(module.exports);