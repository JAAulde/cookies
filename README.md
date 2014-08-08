# cookies

>Javascript library for accessing and manipulating HTTP cookies in the web browser. Get one or a list of cookies, set cookies, delete cookies, test if the browser accepts cookies. When JSON support is available, any JS value can be set to a cookie--it will be automatically serialized before being written, and un-serialzied on read.

[![GitHub version](https://badge.fury.io/gh/JAAulde%2Fcookies.png)](http://badge.fury.io/gh/JAAulde%2Fcookies)
[![Bower version](https://badge.fury.io/bo/jaaulde-cookies.png)](http://badge.fury.io/bo/jaaulde-cookies)
[![NPM version](https://badge.fury.io/js/jaaulde-cookies.png)](http://badge.fury.io/js/jaaulde-cookies)

## installation
### html
````html
<script src="/path/to/jaaulde-cookies.js"></script>
````

### bower
````bash
bower install jaaulde-cookies
````

### npm
````bash
npm install jaaulde-cookies
````

## usage
This library is intended for use in the browser to access and manipulate cookies. It provides a singleton API, `cookies`, in the global namespace (`window`).

### Test for browser cookie acceptance
````javascript
var accepting_cookies = cookies.test(); // returns boolean
````

### Set cookies
````javascript
// sets cookie by the name of 'myCookie' to value of 'myValue' with default options
cookies.set('myCookie', 'myValue');

// sets cookie by the name of 'myCookie' to value of 'myValue' with path of '/somedir'
cookies.set('myCookie', 'myValue', {path: '/somedir'});
````
### Get cookies
````javascript
// returns value of myCookie if it is present, null if not
cookies.get('myCookie');

// returns array containing value of each requested cookie if it is present, null if not
cookies.get(['myCookie', 'myOtherCookie']);

// returns array of all cookies from your site
cookies.get();
````

### Get filtered list of Cookies
````javascript
// returns list of cookies whose names start with "site"
cookies.filter( /^site/ );
````

### Delete Cookies
*(A cookie can only be deleted using the same options with which it was set)*
````javascript
// deletes a cookie, 'myCookie', with default options
cookies.del('myCookie');

// deletes a cookie by the name of 'myCookie' which had been set with a path of '/somedir'
cookies.del('myCookie', {path: '/somedir'});

// deletes all cookies
cookies.del(true);
````
### Cookie options
|Option|Description|Default|Note|
|------|-----------|-------|----|
|domain|Domain for which the cookie be available|`null` (current domain)||
|path|Path for which the cookie be available|`'/'`||
|expires|Date object representing expiration date/time of cookie| `null` (expires when browser closes)|Setting a past date/time will delete the cookie|
|secure|Should cookie be sent to server via HTTPS only?|false||
