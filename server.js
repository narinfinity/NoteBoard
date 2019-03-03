var http = require('http');
//var routes = require('./routes');
//var user = require('./routes/user');
var path = require('path');

var express = require('express');
var app = express()
//var favicon = require('serve-favicon');
//app.use(favicon(__dirname + '/public/favicon.ico'));

//var logger = require('morgan');
//app.use(logger('dev'));

var methodOverride = require('method-override');
app.use(methodOverride());

//View Engine setup
//app.set('view engine', 'pug');
//var ejsEngine = require('ejs-locals');
//app.engine('ejs', ejsEngine); //support master pages
//app.set('view engine', 'ejs'); //ejs view engine
//app.set('view engine', 'vash'); //vash
app.engine('html', require('vash').renderFile);
app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views')); //views
//set the public static resource folder
app.use(express.static(path.join(__dirname, '/public/')));

//Opt into Services
// parse application/x-www-form-urlencoded
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//var multer = require('multer');
//app.use(multer());

//flash to store data in session and then get the data and remove it from the session
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var flash = require('connect-flash');

app.use(cookieParser());
app.use(expressSession({
    secret: 'myCustomEncryptionKey',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: 10*10000 }
}));
app.use(flash());
// parse application/json
app.use(bodyParser.json());

var data = require('./services/index');
var auth = require('./auth/index.js');
auth.init(app, data);
//Register Routes
var ctrls = require('./controllers/index');
ctrls.init(app, auth, data);

var bitcore = require('./public/js/bitcore/bitcoreInit.js');
//bitcore.init();


//app.get('/', function (req, res) {
//    //res.writeHead(200, {'Content-Type':'plain/text'});
//    //res.send('Express');
//    //res.render('jade/index', { title:'Express + Jade'});    
//    //res.render('ejs/index', { title: 'Express + Ejs' });
//    //res.render('vash/index', { title: 'Express + Vash' });
//});

app.get('/error', function (req, res) {
    res.render('shared/error', { title: 'Error', message: "Not authorised" });
});

app.get('/api/sql', function (req, res) {
    var msnodesql = require('msnodesql');
    var connString = "Driver={SQL Server Native Client 11.0};Server=.\\SQLEXPRESS;Database=Northwind;Trusted_Connection={Yes}";
    msnodesql.query(connString, "Select * FROM dbo.Customers", function (err, results) {
        //Error Handling
        res.send(results);
    });
});

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
    //var errorHandler = require('errorhandler');
    //app.use(errorHandler());
}

app.set('port', process.env.port || 3000);
var server = http.createServer(app);
server.listen(app.get('port'));

var updater = require('./updater/index.js');
updater.init(server);

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