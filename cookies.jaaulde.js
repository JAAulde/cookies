/*jslint */

/**
 * cookies.jaaulde.js
 *
 * Copyright (c) 2005, Jim Auldridge MIT License
 *
 */

/**
 *
 * @param {object} reference to global scope
 * @returns {void}
 */
(function (global) {
    'use strict';

        /* localize natives */
    var document = global.document,
        Object = global.Object,
        String = global.String,
        Date = global.Date,
        RegExp = global.RegExp,
        Error = global.Error,
        JSON = global.JSON;

    /* ensure jaaulde namespace exists */
    global.jaaulde = (global.jaaulde || {});

    /* what we came here to build: */
    global.jaaulde.cookies = (function () {
        var warn,
            default_options,
            resolveOptions,
            cookieOptions,
            isNaN,
            trim,
            parseCookies;

        warn = function (msg) {
            if (typeof global.console === 'object' && global.console !== null && typeof global.console.warn === 'function') {
                warn = function (msg) {
                    global.console.warn('jaaulde.cookies says: ' + msg);
                };
                warn(msg);
            }
        };

        default_options = {
            expires_at: null,
            path: '/',
            domain: null,
            secure: false
        };

        /**
         *
         * @param {object} o
         * @returns {object}
         */
        resolveOptions = function (o) {
            var r,
                e;

            if (typeof o !== 'object' || o === null) {
                r = default_options;
            } else {
                r = {
                    expires_at: default_options.expires_at,
                    path: default_options.path,
                    domain: default_options.domain,
                    secure: default_options.secure
                };

                /*
                 * I've been very finicky about the name and format of the expiration option over time,
                 * so I'm accounting for older styles to maintain backwards compatibility. Preferably it
                 * will be called expires_at and will be an instance of Date
                 */
                if (typeof o.expires_at === 'object' && o.expires_at instanceof Date) {
                    r.expires_at = o.expires_at;
                } else if (typeof o.expiresAt === 'object' && o.expiresAt instanceof Date) {
                    r.expires_at = o.expiresAt;
                    warn('Cookie option "expiresAt" has been deprecated. Rename to "expires_at". Support for "expiresAt" will be removed in the next version.');
                } else if (typeof o.hoursToLive === 'number' && o.hoursToLive !== 0) {
                    e = new Date();
                    e.setTime(e.getTime() + (o.hoursToLive * 60 * 60 * 1000));
                    r.expires_at = e;
                    warn('Cookie option "hoursToLive" has been deprecated in favor of "expires_at" (see documentation). Support for "hoursToLive" will be removed in the next version.');
                }

                if (typeof o.path === 'string' && o.path !== '') {
                    r.path = o.path;
                }

                if (typeof o.domain === 'string' && o.domain !== '') {
                    r.domain = o.domain;
                }

                if (o.secure === true) {
                    r.secure = o.secure;
                }
            }

            return r;
        };

        /**
         *
         * @param {object} o
         * @returns {string}
         */
        cookieOptions = function (o) {
            o = resolveOptions(o);

            return ([
                (typeof o.expires_at === 'object' && o.expires_at instanceof Date ? '; expires=' + o.expires_at.toGMTString() : ''),
                ('; path=' + o.path),
                (typeof o.domain === 'string' ? '; domain=' + o.domain : ''),
                (o.secure === true ? '; secure' : '')
            ].join(''));
        };

        /* Some logic for `trim` and `isNaN` borrowed from http://jquery.com/ */
        if (String.prototype.trim) {
            /**
             *
             * @param {string} s
             * @returns {string}
             */
            trim = function (s) {
                return String.prototype.trim.call(s);
            };
        } else {
            trim = (function () {
                var l,
                    r;

                l = /^\s+/;
                r = /\s+$/;

                /**
                 *
                 * @param {string} s
                 * @returns {string}
                 */
                return function (s) {
                    return s.replace(l, '').replace(r, '');
                };
            }());
        }

        isNaN = (function () {
            var p = /\d/,
                native_isNaN = global.isNaN;

            /**
             *
             * @param {mixed} v
             * @returns {boolean}
             */
            return function (v) {
                return (v === null || !p.test(v) || native_isNaN(v));
            };
        }());

        parseCookies = (function () {
            var parseJSON,
                p;

            if (JSON && typeof JSON.parse === 'function') {
                parseJSON = function (s) {
                    var r = null;

                    if (typeof s === 'string' && s !== '') {
                        s = trim(s);

                        if (s !== '') {
                            try {
                                r = JSON.parse(s);
                            } catch (e1) {
                                r = null;
                            }
                        }
                    }

                    return r;
                };
            } else {
                parseJSON = function () {
                    return null;
                };
            }

            p = new RegExp('^(?:\\{.*\\}|\\[.*\\])$');

            return function () {
                var c = {},
                    s1 = document.cookie.split(';'),
                    q = s1.length,
                    i,
                    s2,
                    n,
                    v,
                    vv;

                for (i = 0; i < q; i += 1) {
                    s2 = s1[i].split('=');

                    n = trim(s2.shift());
                    if (s2.length >= 1) {
                        v = s2.join('=');
                    } else {
                        v = '';
                    }

                    try {
                        vv = decodeURIComponent(v);
                    } catch (e2) {
                        vv = v;
                    }

                    /* Logic borrowed from http://jquery.com/ dataAttr method */
                    try {
                        vv = (vv === 'true')
                            ? true : (vv === 'false')
                                ? false : !isNaN(vv)
                                    ? parseFloat(vv) : p.test(vv)
                                        ? parseJSON(vv) : vv;
                    } catch (ignore) {}

                    c[n] = vv;
                }

                return c;
            };
        }());

        return {
            /**
             * get - get one, several, or all cookies
             *
             * @access public
             * @static
             * @param {mixed} n {string} name of single cookie
             *                  {array} list of multiple cookie names
             *                  {void} if you want all cookies
             * @return {mixed} type/value of cookie as set
             *                 {null} if only one cookie is requested and is not found
             *                 {object} hash of multiple or all cookies (if multiple or all requested)
             */
            get: function (n) {
                var r,
                    i,
                    c = parseCookies();

                if (typeof n === 'string') {
                    r = (c[n] !== undefined) ? c[n] : null;
                } else if (typeof n === 'object' && n !== null) {
                    r = {};

                    for (i in n) {
                        if (Object.prototype.hasOwnProperty.call(n, i)) {
                            if (c[n[i]] !== undefined) {
                                r[n[i]] = c[n[i]];
                            } else {
                                r[n[i]] = null;
                            }
                        }
                    }
                } else {
                    r = c;
                }

                return r;
            },
            /**
             * filter - get array of cookies whose names match the provided RegExp
             *
             * @access public
             * @static
             * @param {RegExp} p The regular expression to match against cookie names
             * @return {object} hash of cookies whose names match the RegExp
             */
            filter: function (p) {
                var n,
                    r = {},
                    c = parseCookies();

                if (typeof p === 'string') {
                    p = new RegExp(p);
                }

                for (n in c) {
                    if (Object.prototype.hasOwnProperty.call(c, n) && n.match(p)) {
                        r[n] = c[n];
                    }
                }

                return r;
            },
            /**
             * set - set or delete a cookie with desired options
             *
             * @access public
             * @static
             * @param {string} n name of cookie to set
             * @param {mixed} v Any JS value. If not a string, will be JSON encoded (http://code.google.com/p/cookies/wiki/JSON)
             *                  {null} to delete
             * @param {object} o optional list of cookie options to specify
             * @return {void}
             */
            set: function (n, v, o) {
                if (typeof o !== 'object' || o === null) {
                    o = {};
                }

                if (v === undefined || v === null) {
                    v = '';
                    o.expires_at = new Date();
                    o.expires_at.setFullYear(1978);
                } else {
                    /* Logic borrowed from http://jquery.com/ dataAttr method and reversed */
                    v = (v === true)
                        ? 'true' : (v === false)
                            ? 'false' : !isNaN(v)
                                ? String(v) : v;

                    if (typeof v !== 'string') {
                        if (typeof JSON === 'object' && JSON !== null && typeof JSON.stringify === 'function') {
                            v = JSON.stringify(v);
                        } else {
                            throw new Error('cookies.set() could not be serialize the value');
                        }
                    }
                }

                document.cookie = n + '=' + encodeURIComponent(v) + cookieOptions(o);
            },
            /**
             * del - delete a cookie (domain and path options must match those with which the cookie was set; this is really an alias for set() with parameters simplified for this use)
             *
             * @access public
             * @static
             * @param {mixed} n {string} name of cookie to delete
             *                  {boolean} true to delete all
             * @param {object} o optional list of cookie options to specify (path, domain)
             * @return {void}
             */
            del: function (n, o) {
                var d = {},
                    i;

                if (typeof o !== 'object' || o === null) {
                    o = {};
                }

                if (typeof n === 'boolean' && n === true) {
                    d = this.get();
                } else if (typeof n === 'string') {
                    d[n] = true;
                }

                for (i in d) {
                    if (Object.prototype.hasOwnProperty.call(d, i) && typeof i === 'string' && i !== '') {
                        this.set(i, null, o);
                    }
                }
            },
            /**
             * test - test whether the browser is accepting cookies
             *
             * @access public
             * @static
             * @return {boolean}
             */
            test: function () {
                var r = false,
                    n = 'test_cookies_utils_jaaulde_js',
                    v = 'data';

                this.set(n, v);

                if (this.get(n) === v) {
                    this.del(n);
                    r = true;
                }

                return r;
            },
            /**
             * setOptions - set default options for calls to cookie methods
             *
             * @access public
             * @static
             * @param {object} o list of cookie options to specify
             * @return {void}
             */
            setOptions: function (o) {
                if (typeof o !== 'object') {
                    o = null;
                }

                default_options = resolveOptions(o);
            }
        };
    }());
}(this));