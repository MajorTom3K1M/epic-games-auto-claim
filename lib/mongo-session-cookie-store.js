/** I have copy and edit code from cookie-file-store */
const { Store, permuteDomain, pathMatch, Cookie } = require('tough-cookie');
const { Db } = require('mongodb');
const util = require('util');

class MongoSessionCookieStore extends Store {
    constructor(db, sessionId) {
        super();
        this.synchronous = true;
        this.idx = {};
        this.db = db;
        this.sessionId = sessionId;

        if (util.inspect.custom) {
            this[util.inspect.custom] = this._inspect;
        }
        const self = this

        if (!db) {
            throw new Error('Unknown mongo database for read/write cookies')
        }
        this._loadFromSession(this.db, function (dataJson) {
            if (dataJson) self.idx = dataJson;
        })
    }

    findCookie(domain, path, key, cb) {
        if (!this.idx[domain]) {
            cb(null, undefined)
        } else if (!this.idx[domain][path]) {
            cb(null, undefined)
        } else {
            cb(null, this.idx[domain][path][key] || null)
        }
    }

    findCookies(domain, path, allowSpecialUseDomain, cb) {
        const results = []

        if (typeof allowSpecialUseDomain === 'function') {
            cb = allowSpecialUseDomain
            allowSpecialUseDomain = false
        }

        if (!domain) {
            cb(null, [])
        }

        let pathMatcher
        if (!path) {
            pathMatcher = function matchAll(domainIndex) {
                for (const curPath in domainIndex) {
                    const pathIndex = domainIndex[curPath]
                    for (const key in pathIndex) {
                        results.push(pathIndex[key])
                    }
                }
            }
        } else {
            pathMatcher = function matchRFC(domainIndex) {
                Object.keys(domainIndex).forEach(cookiePath => {
                    if (pathMatch(path, cookiePath)) {
                        const pathIndex = domainIndex[cookiePath]
                        for (const key in pathIndex) {
                            results.push(pathIndex[key])
                        }
                    }
                })
            }
        }

        const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain]
        const idx = this.idx
        domains.forEach(curDomain => {
            const domainIndex = idx[curDomain]
            if (!domainIndex) {
                return
            }
            pathMatcher(domainIndex)
        })

        cb(null, results)
    }

    putCookie(cookie, cb) {
        if (!this.idx[cookie.domain]) {
            this.idx[cookie.domain] = {}
        }
        if (!this.idx[cookie.domain][cookie.path]) {
            this.idx[cookie.domain][cookie.path] = {}
        }
        this.idx[cookie.domain][cookie.path][cookie.key] = cookie
        this._saveToSession(this.db, this.idx, function () {
            cb(null)
        })
    }

    updateCookie(oldCookie, newCookie, cb) {
        this.putCookie(newCookie, cb)
    }

    removeCookie(domain, path, key, cb) {
        /* istanbul ignore else  */
        if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
            delete this.idx[domain][path][key]
        }
        this._saveToSession(this.db, this.idx, function () {
            cb(null)
        })
    }

    removeCookies(domain, path, cb) {
        /* istanbul ignore else  */
        if (this.idx[domain]) {
            if (path) {
                delete this.idx[domain][path]
            } else {
                delete this.idx[domain]
            }
        }
        this._saveToSession(this.db, this.idx, function () {
            cb(null)
        })
    }

    removeAllCookies(cb) {
        this.idx = {}
        this._saveToSession(this.db, this.idx, function () {
            cb(null)
        })
    }

    getAllCookies(cb) {
        const cookies = []
        const idx = this.idx

        const domains = Object.keys(idx)
        domains.forEach(domain => {
            const paths = Object.keys(idx[domain])
            paths.forEach(path => {
                const keys = Object.keys(idx[domain][path])
                keys.forEach(key => {
                    /* istanbul ignore else  */
                    if (key !== null) {
                        cookies.push(idx[domain][path][key])
                    }
                })
            })
        })

        cookies.sort((a, b) => {
            return (a.creationIndex || 0) - (b.creationIndex || 0)
        })

        cb(null, cookies)
    }

    _inspect() {
        return `{ idx: ${util.inspect(this.idx, false, 2)} }`
    }

    async _loadFromSession(db, cb) {
        let data = null
        let dataJson = null
        try {
            var { session } = await db.collection('sessions').findOne({ _id: this.sessionId });
        } catch(e) {
            throw new Error('Can not load data from this session id ', this.sessionId);
        }
        if (session.cookieJar) {
            data = session.cookieJar;
        }

        if (data) {
            try {
                dataJson = data
            } catch (e) {
                throw new Error(`Could not parse cookie. Please ensure it is not corrupted.`)
            }
        }
        
        // console.log("data", data)
        // for (var domainName in dataJson) {
        //     console.log(domainName);
        // }
        
        for (var domainName in dataJson) {
            for (var pathName in dataJson[domainName]) {
                for (var cookieName in dataJson[domainName][pathName]) {
                    dataJson[domainName][pathName][cookieName] = Cookie.fromJSON(
                        dataJson[domainName][pathName][cookieName]
                    )
                }
            }
        }

        cb(dataJson)
    }

    /**
     * 
     * @param {Db} db 
     * @param {*} data 
     * @param {*} cb 
     */
    async _saveToSession(db, data, cb) {
        try {
            await db.collection('sessions').updateOne({ _id: this.sessionId }, { $set: { "session.cookieJar": data } });
        } catch(e) {
            throw new Error('Can not save cookieJar to session');
        }
        cb()
    }
}

exports.MongoSessionCookieStore = MongoSessionCookieStore