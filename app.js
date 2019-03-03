//var routes = require('./routes');
//var user = require('./routes/user');
var path = require("path");

var express = require("express");
var app = express();
//var favicon = require('serve-favicon');
//app.use(favicon(__dirname + '/public/favicon.ico'));

//var logger = require('morgan');
//app.use(logger('dev'));

//var methodOverride = require('method-override');
//app.use(methodOverride());


app.set("views", path.join(__dirname, "views")); //views
//View Engine setup
//app.set('view engine', 'pug');
//app.set('view engine', 'vash'); //vash
app.engine("html", require("vash").renderFile);
app.set("view engine", "html");

//set the public static resource folder
app.use(express.static(path.join(__dirname, "public")));

//Opt into Services
// parse application/x-www-form-urlencoded
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
//var multer = require('multer');
//app.use(multer());

//flash to store data in session and then get the data and remove it from the session
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var flash = require("connect-flash");

app.use(cookieParser());
app.use(
  expressSession({
    secret: "myCustomEncryptionKey",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 }
  })
);
app.use(flash());
// parse application/json
app.use(bodyParser.json());

var data = require("./services/index");
var auth = require("./auth/index.js");
auth.init(app, data);
//Register Routes
var ctrls = require("./controllers/index");
ctrls.init(app, auth, data);

//var bitcore = require('./public/js/bitcore/bitcoreInit.js');
//bitcore.init();

//app.get('/', function (req, res) {
//    //res.writeHead(200, {'Content-Type':'plain/text'});
//    //res.send('Express');
//    //res.render('jade/index', { title:'Express + Jade'});
//    //res.render('ejs/index', { title: 'Express + Ejs' });
//    //res.render('vash/index', { title: 'Express + Vash' });
//});

app.get("/error", (req, res) => {
  res.render("shared/error", { title: "Error", message: "Not authorised" });
});

app.get("/api/sql", async (req, res) => {
  var sql = require("mssql");
  await sql.connect("mssql://sa:pass@localhost:port/mydb");
  const result = await sql.query`select * from mytable`;
});

// error handling middleware should be loaded after the loading the routes
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

/* 
var MongoStore = require('connect-mongo')(expressSession);
app.use(cookieParser());
app.use(expressSession({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://root:myPassword@mongo.onmodulus.net:27017/3xam9l3'
    }),
    resave: false,
    saveUninitialized: true
}));
 * ********************************************************
var RedisStore = require('connect-redis')(expressSession);
app.use(cookieParser());
app.use(expressSession({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'RedisPASS'
  }),
  secret: '1234567890QWERTY'
}));
*/
