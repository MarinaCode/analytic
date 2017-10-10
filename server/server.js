var cookieSession = require('cookie-session');
var http = require('http'),
    express = require('express'),
    app = express(),
    config = require('./config/config'),
    routes = require('./src/routes'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),currentPrice = 55,
    path = require('path');

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var clients = [];

// BodyParser Middleware
app.use(morgan('dev')); // log every request to the console
app.use( bodyParser.json({limit: '50mb'}) );
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000 }));

// Express Session
app.use(cookieParser('asdf33g4w4hghjkuil8saef345')); // cookie parser must use the same secret as express-session.

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(session({
    secret: 'asdf33g4w4hghjkuil8saef345', // must match with the secret for cookie-parser
    resave: true,
    saveUninitialized: true,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) } // 4 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
    var allowedOrigins = ['http://localhost:4200', 'http://www.madcrocs.com', 'http://madcrocs.com', 'http://localhost:8080'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
    next();
});
routes(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});
server.listen(config.port);

io.on('connection', connect.bind(this));

function connect(socket) {
    socket.on('join',(stream)=>{
        if(stream.id){
            socket.join(stream.id.toString());
            clients.push(stream.id.toString());
            // if (err || stream.id != decoded.id) {
            //     io.to(stream.id).emit('auth:fail',stream.id);
            //     socket.leave(stream.id);
            //     clients.splice(clients.indexOf(stream.id.toString()),1);
            // } else {
                socket.join(stream.id.toString());
                clients.splice(clients.indexOf(stream.id.toString()),1);
            // }
        }
    });
    socket.on('leave', leave.bind(this));
}
function leave(stream){
   clients.splice( clients.indexOf(stream.id.toString()),1);
}