const got = require('got');
const tough = require('tough-cookie');
const { FileCookieStore } = require('tough-cookie-file-store');
const { MongoCookieStore } = require('../lib/mongo-cookie-store');
const fs = require('fs');
const filenamify = require('filenamify');

module.exports = {
    default: got.extend({
        cookieJar: new tough.CookieJar(new FileCookieStore(`./config/cookies.json`)),
        responseType: 'json',
    }),
    newCookieJar: (request) => {
        const cookie = new tough.CookieJar(new MongoCookieStore(request));
        console.log(cookie);
        return got.extend({
            cookieJar: cookie,
            responseType: 'json',
        });
    },
    deleteCookies: (request) => {
        if (request) {
            request.session.destroy();
        }
    }
}