//auth/index.js
(function(auth) {
  auth.init = function(app, data) {
    var data = data;
    var hasher = require("./hasher.js");

    auth.isAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) {
        //added to Request object from the passport middleware
        return next();
      }
      res.redirect("/login");
    };
    auth.isApiAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) {
        //added to Request object from the passport middleware
        return next();
      }
      res.status(401).send({ title: "Error", message: "Not authorised" });
    };
    function userVerify(username, password, next) {
      data.getUser(username, function(err, user) {
        if (!err && user) {
          var testHash = hasher.computeHash(password, user.salt);
          if (testHash === user.passwordHash) {
            return next(null, user);
          }
          //req.flash('message', "Incorrect password");
          //res.redirect('/login');
        }
        return next(null, false, { message: "Incorrect username or password" });
      });
    }
    //setup passport authentication
    var passport = require("passport"),
      localStrategy = require("passport-local").Strategy;

    passport.use(new localStrategy(userVerify));
    passport.serializeUser(function(user, next) {
      next(null, user.username);
    });
    passport.deserializeUser(function(key, next) {
      data.getUser(key, function(err, user) {
        if (err) {
          return next(null, false, { message: "Failed to retrieve user" });
        } else {
          return next(null, user);
        }
      });
    });
    app.use(passport.initialize());
    app.use(passport.session());

    //Routes for Login
    app.get("/login", function(req, res) {
      res.render("account/login", {
        title: "Log in to The Board",
        message: req.flash("message")
      });
    });
    app.post("/login", function(req, res, next) {
      passport.authenticate("local", function(err, user, info) {
        if (err) {
          next(err, null);
        } else {
          req.logIn(user, function(err) {
            if (!user) {
              req.flash("message", "Incorrect username or password");
              return res.redirect("/login");
            }
            if (err) {
              next(err, null);
            } else {
              if (req.body.rememberme === "on") {
                var hour = 360 * 10000;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
              }
              res.redirect("/");
            }
          });
        }
      })(req, res, next);
    });

    //Routes for Log out
    app.get("/logout", function(req, res) {
      req.logout();
      res.redirect("/login");
    });

    //Routes for Register
    var baseUrl = "/register/";
    app.get(baseUrl, function(req, res) {
      res.render("account/register", {
        title: "Register for The Board",
        message: req.flash("message")
      });
    });
    app.post(baseUrl, function(req, res) {
      //var categoryName = req.params.categoryName;
      var salt = hasher.createSalt();

      var user = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        passwordHash: hasher.computeHash(req.body.password, salt),
        salt: salt
      };
      data.addUser(user, function(err) {
        if (err) {
          req.flash("message", "Could not register, " + err);
          res.redirect(baseUrl);
        } else {
          res.redirect("/");
        }
      });
    });
  };
})(module.exports);
