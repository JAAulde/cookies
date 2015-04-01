# cookies
Javascript library for accessing and manipulating HTTP cookies in the web browser.

Get one or a list of cookies, set cookies, delete cookies, test if the browser accepts cookies. When JSON support is available, any JS value can be set to a cookie--it will be automatically serialized before being written, and un-serialzied on read.

[![GitHub version](https://badge.fury.io/gh/JAAulde%2Fcookies.png)](http://badge.fury.io/gh/JAAulde%2Fcookies)
[![Bower version](https://badge.fury.io/bo/jaaulde-cookies.png)](http://badge.fury.io/bo/jaaulde-cookies)
[![NPM version](https://badge.fury.io/js/jaaulde-cookies.png)](http://badge.fury.io/js/jaaulde-cookies)

## installation
### [bower](http://bower.io)
````bash
bower install jaaulde-cookies
````

### [npm](https://www.npmjs.com)
````bash
npm install jaaulde-cookies
````

### html
Download the code, link it in your HTML file.
````html
<script src="/path/to/jaaulde-cookies.js"></script>
````

## usage
This library is intended for use in the browser to access and manipulate cookies. It provides a singleton API, `cookies`.

### Cookie options
As you'll see in the docs below, many of the methods can take an `options` parameter. The options that can  be set are:

|Option|Description|Default|Note|
|:-----|:----------|:------|:---|
|domain|Domain for which the cookie be available|`null` (current domain)||
|path|Path for which the cookie be available|`'/'`||
|expires|Date object representing expiration date/time of cookie| `null` (expires when browser closes)|Setting a past date/time will delete the cookie|
|secure|Should cookie be sent to server via HTTPS only?|`false`||

### Test for browser cookie acceptance
#### `cookies.test()`
##### signature
````javascript
/**
 * test - test whether the browser is accepting cookies
 *
 * @access public
 * @static
 * @return {boolean}
 */
test: function ()
````
##### example
````javascript
var accepting_cookies = cookies.test(); // returns boolean
````

### Set cookies
#### `cookies.set()`
##### signature
````javascript
/**
 * set - set or delete a cookie with desired options
 *
 * @access public
 * @static
 * @param {string} n - name of cookie to set
 * @param {mixed} v - Any JS value. If not a string and JSON support present will be JSON encoded
 *                  {null} to delete
 * @param {object} o - optional list of cookie options to specify
 * @return {void}
 */
set: function (n, v, o)
````
##### examples
````javascript
// sets cookie by the name of 'myCookie' to value of 'myValue' with default options
cookies.set('myCookie', 'myValue');

// sets cookie by the name of 'myCookie' to value of 'myValue' with path of '/somedir'
cookies.set('myCookie', 'myValue', {path: '/somedir'});
````
### Get cookies
#### `cookies.get()`
##### signature
````javascript
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
get: function (n)
````
##### examples
````javascript
// returns value of myCookie if it is present, null if not
cookies.get('myCookie');

// returns array containing value of each requested cookie if it is present, null if not
cookies.get(['myCookie', 'myOtherCookie']);

// returns array of all cookies from your site
cookies.get();
````

### Get filtered list of Cookies
#### `cookies.filter()`
##### signature
````javascript
/**
 * filter - get array of cookies whose names match the provided RegExp
 *
 * @access public
 * @static
 * @param {RegExp} p The regular expression to match against cookie names
 * @return {object} hash of cookies whose names match the RegExp
 */
filter: function (p)
````
##### examples
````javascript
// returns list of cookies whose names start with "site"
cookies.filter( /^site/ );
````

### Delete Cookies
**note:** *A cookie can only be deleted using the same options with which it was set*
#### `cookies.del()`
##### signature
````javascript
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
del: function (n, o)
````
##### examples
````javascript
// deletes a cookie, 'myCookie', with default options
cookies.del('myCookie');

// deletes a cookie by the name of 'myCookie' which had been set with a path of '/somedir'
cookies.del('myCookie', {path: '/somedir'});

// deletes all cookies
cookies.del(true);
````
