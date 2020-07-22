const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const colors = require('colors');
const loginApi = require("./routes/login");
const freeGamesApi = require("./routes/free-games");
const purchaseApi = require("./routes/purchase");
const sessionApi = require("./routes/session");
const cron = require("node-cron");
const { initDb } = require('./lib/db');

const app = express();

const databaseConnectionString = "mongodb+srv://majortom:255312038@cluster0.0au3o.mongodb.net/epic-auto-claim?retryWrites=true&w=majority";
const store = new MongoStore({
    uri: databaseConnectionString,
    collection: "sessions"
});

// const secretSession = crypto.randomBytes(20).toString('hex');
// const secretCookie = crypto.randomBytes(20).toString('hex');
const secretSession = "e181854993af325045aa5251b9f57f60a2bb1bf8";
const secretCookie = "47469f94449d8b360e6b566f00a7bd369c441145";

app.use(cookieParser(secretCookie));
app.use(session({
    store: store,
    resave: false,
    secret: secretSession,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 86400000 * 365
    }
}));
app.use(bodyParser.json());
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
}));

app.use('/', loginApi);
app.use('/', freeGamesApi);
app.use('/', purchaseApi);
app.use('/', sessionApi);

app.enable('trust proxy');
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.set('port', process.env.PORT || 3001);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// cron.schedule('0 12 * * *', () => {
//     console.log('Running a task');
// });

initDb(databaseConnectionString, async (err, db) => {
    // On connection error we display then exit
    if (err) {
        console.log(colors.red('Error connecting to MongoDB: ' + err));
        process.exit(2);
    }
    
    app.db = db;
    app.port = app.get('port');

    try {
        await app.listen(app.get('port'));
        app.emit('appStarted');
        console.log(colors.green('MyCart running on host: http://localhost:' + app.get('port')));
    } catch (ex) {
        console.error(colors.red('Error starting MyCart app:' + err));
        process.exit(2);
    }
});


// app.listen(app.get('port'), (err) => {
//     console.log(`App listening at http://localhost:${app.get('port')}`);
// });
