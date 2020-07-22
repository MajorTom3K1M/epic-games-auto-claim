const got = require('got');
const tough = require('tough-cookie');
const { FileCookieStore } = require('tough-cookie-file-store');
const fs = require('fs');
const filenamify = require('filenamify');

module.exports = {
    default: got.extend({
        cookieJar: new tough.CookieJar(new FileCookieStore(`./config/cookies.json`)),
        responseType: 'json',
    }),
    newCookieJar: (username) => {
        const fileSafeUsername = filenamify(username);
        return got.extend({
            cookieJar: new tough.CookieJar(
                new FileCookieStore(`./config/${fileSafeUsername}-cookies.json`)
            ),
            responseType: 'json',
        });
    },
    deleteCookies: (username) => {
        if (username) {
            fs.unlinkSync(`./config/${username}-cookies.json`);
        } else {
            fs.unlinkSync(`./config/cookies.json`);
        }
    }
}