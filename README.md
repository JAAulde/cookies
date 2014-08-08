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
