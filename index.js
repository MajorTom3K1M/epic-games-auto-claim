const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const FreeGames = require('./lib/free-games');
const Login = require('./lib/login');
const Purchase = require('./lib/purchase');
const tough = require('tough-cookie');
const colors = require('colors');
const loginApi = require("./routes/login");
const freeGamesApi = require("./routes/free-games");
const purchaseApi = require("./routes/purchase");
const sessionApi = require("./routes/session");
const cron = require("node-cron");
const got = require('got');
const { MongoSessionCookieStore } = require('./lib/mongo-session-cookie-store');
const { Db } = require('mongodb')
const { initDb } = require('./lib/db');

const app = express();

const databaseConnectionString = "mongodb+srv://majortom:255312038@cluster0.0au3o.mongodb.net/epic-auto-claim?retryWrites=true&w=majority";
// const databaseConnectionString = "mongodb://127.0.0.1:27017/epic-auto";
const store = new MongoStore({
    uri: databaseConnectionString,
    collection: "sessions"
});

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
        maxAge: 86400000 * 730
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


initDb(databaseConnectionString, async (err, db) => {
    if (err) {
        console.log(colors.red('Error connecting to MongoDB: ' + err));
        process.exit(2);
    }

    /** @type {Db} */
    const database = db;
    app.db = db;
    app.port = app.get('port');


    cron.schedule('0 12 * * *', async () => {
        const sessionsList = await database.collection('sessions').find({}).toArray();
        if (sessionsList.length && sessionsList.length > 0) {
            for (let sessionItem of sessionsList) {
                if (sessionItem.session.cookieJar && sessionItem.session.email) {
                    const { email } = sessionItem.session;
                    const { _id } = sessionItem;
                    const cookie = new tough.CookieJar(new MongoSessionCookieStore(db, _id));
    
                    const requestClient = got.extend({
                        cookieJar: cookie,
                        responseType: 'json',
                    });
    
                    const login = new Login(requestClient);
                    const freegames = new FreeGames(requestClient, email);
                    const purchase = new Purchase(requestClient, email);
                    try {
                        console.log('purchase for', email);
                        await login.fullLogin(email, "", "", "");
                        const offers = await freegames.getAllFreeGames();
                        await purchase.purchaseGames(offers);
                    } catch (e) {
                        console.log(colors.red('purchase failed'));
                        console.log(e);
                    }
                }
            }
        }
    });

    try {
        await app.listen(app.get('port'));
        app.emit('appStarted');
        console.log(colors.green('EPICAUTOCLAIM running on host: http://localhost:' + app.get('port')));
    } catch (ex) {
        console.error(colors.red('Error starting EPICAUTOCLAIM app:' + err));
        process.exit(2);
    }
});